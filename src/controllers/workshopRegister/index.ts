import { apiResponse } from "../../common";
import { webSettingModel } from "../../database/models/webSetting";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, deleteData, findAllWithPopulate, getFirstMatch, updateData } from "../../helper/database_service";

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { sendWhatsAppMessage } from "../../services/watiService";

let ObjectId = require('mongoose').Types.ObjectId;

export const addWorkShopRegister = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;

        // let isExist = await getFirstMatch(workshopRegisterModel, { email: body.email, isDeleted: false }, {}, { lean: true });
        // if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("email"), {}, {}));

        let purchase = new workshopRegisterModel(body);
        await purchase.save();

        // Check if fees is zero - if so, skip Razorpay and mark as successful
        if (purchase.fees === 0 || purchase.fees === null || purchase.fees === undefined) {
            // For zero payment, mark as successful without Razorpay
            purchase = await workshopRegisterModel.findOneAndUpdate(
                { _id: new ObjectId(purchase._id) }, 
                { paymentStatus: "Success" }, 
                { new: true }
            );
            
            return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("workshop Register"), { purchase }, {}));
        }

        // For non-zero payment, proceed with Razorpay
        const razorpayOrder = await createRazorpayOrder({
            fees: purchase.fees * 100, // Convert rupees to paise
            currency: "INR",
            receipt: purchase._id.toString(),
        })

        if (!razorpayOrder) return res.status(500).json(new apiResponse(500, " Razorpay order failed", {}, {}));

        purchase = await workshopRegisterModel.findOneAndUpdate({ _id: new ObjectId(purchase._id) }, { razorpayOrderId: razorpayOrder.id }, { new: true });
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("Order"), { purchase, razorpayOrder }, {}));

        // const response = await createData(workshopRegisterModel, body);

        // return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('workshop Register'), response, {}));   

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const createRazorpayOrder = async (payload) => {
    const { fees, currency = 'INR', receipt } = payload;
    try {
        const options = {
            amount: fees,
            currency,
            receipt,
        };
        let user = await webSettingModel.findOne({ isDeleted: false }).select('razorpayKeyId razorpayKeySecret').lean()
        const razorpay = new Razorpay({
            key_id: user.razorpayKeyId,
            key_secret: user.razorpayKeySecret,
        })
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const verifyRazorpayPayment = async (req, res) => {
    reqInfo(req)
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;
    try {
        const isExist = await workshopRegisterModel.findOne({ razorpayOrderId: razorpay_order_id });
        if (!isExist) return res.status(400).json(new apiResponse(400, responseMessage.paymentFailed, {}, {}))
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        let user = await webSettingModel.findOne({ isDeleted: false }).select('razorpayKeyId razorpayKeySecret').lean()

        const exceptedSignature = crypto.createHmac("sha256", user.razorpayKeySecret).update(sign).digest("hex");
        let fees = isExist.fees / 100
        if (exceptedSignature === razorpay_signature) {
            let newUpdated = await workshopRegisterModel.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { paymentStatus: "Success", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, fees }, { new: true });
            console.log('newUpdated => ', newUpdated)
            try {
                const courseMsg = `🎉 Hi ${newUpdated.name},\n\n✅ Your course registration is successful!\n\n📘 Course: ${newUpdated.courseName}\n💰 Fees: ₹${newUpdated.fees}\n🆔 Order ID: ${razorpay_order_id}\n\nThank you for joining with us. 🚀`;

                const resp = await sendWhatsAppMessage(newUpdated.whatsAppNumber, courseMsg);

                console.log("WhatsApp Response =>", resp);
            } catch (msgErr) {
                console.error("WhatsApp Message Error:", msgErr.message);
            }
            return res.status(200).json(new apiResponse(200, responseMessage.paymentSuccess, { razorpay_order_id, razorpay_payment_id, razorpay_signature }, {}));
        }
        return res.status(400).json(new apiResponse(400, responseMessage.paymentFailed, {
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        }, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const sendMessageToStudents = async (req, res) => {
    try {
        const { studentIds, message, imageUrl  } = req.body;

        if (!studentIds || !message) return res.status(400).json(new apiResponse(400, "studentIds & message required", {}, {}));

        const students = await workshopRegisterModel.find({ _id: { $in: studentIds } });
        if (!students.length) return res.status(404).json(new apiResponse(404, "No students found", {}, {}));

        console.log("students", imageUrl);
        
        const results: any[] = [];
        for (const student of students) {
            const resp = await sendWhatsAppMessage(
                student.whatsAppNumber,   // phone field model ma hovu joiye
                `Hi ${student.name}, ${message}`,
                imageUrl  
            );
            console.log("resp", resp);
            console.log("student", student.whatsAppNumber);
            console.log("message", message);

            results.push({ student: student.name, response: resp });
        }
        console.log("results", results);

        return res.json(new apiResponse(200, "success", { results }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const updateworkshopRegister = async (req, res) => {
    reqInfo(req)
    try {

        const body = req.body;
        const response = await updateData(workshopRegisterModel, { _id: new ObjectId(body.workshopRegisterId) }, body, {});
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Workshop Register'), {}, {}));
        console.log("response", response);

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Workshop Register'), response, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))

    }
}

export const getworkshopRegister = async (req, res) => {
    reqInfo(req)
    let { page, limit, search, blockFilter } = req.query, criteria: any = { isDeleted: false };
    let options: any = { lean: true };
    try {
        if (search) {
            criteria.name = { $regex: search, $options: 'si' };
        }

        if (blockFilter) criteria.isBlocked = blockFilter;


        options.sort = { priority: 1, createdAt: -1 };
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);

        }

        let populate = [{
            path: 'workshopId', select: 'title shortDescription date time duration instructorImage instructorName thumbnailImage workshopImage price mrp  fullDescription priority  isBlocked isDeleted',
        }]

        const response = await findAllWithPopulate(workshopRegisterModel, criteria, {}, options, populate);
        const totalCount = await countData(workshopRegisterModel, criteria)

        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,

        };

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('Workshop Register'), { workshopRegister_data: response, totalData: totalCount, state: stateObj }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const deleteworkshopRegister = async (req, res) => {
    reqInfo(req)
    let { id } = req.params;
    try {
        const response = await deleteData(workshopRegisterModel, { _id: id });
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Workshop Register'), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('Workshop Register'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}