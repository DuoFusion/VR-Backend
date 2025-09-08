import { apiResponse } from "../../common";
import { courseRegisterModel } from "../../database/models/courseRegister";
import { webSettingModel } from "../../database/models/webSetting";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, findAllWithPopulate, getFirstMatch, updateData } from "../../helper/database_service";

import Razorpay from 'razorpay'
import crypto from 'crypto'

const ObjectId = require('mongoose').Types.ObjectId


export const addCourseRegister = async (req, res) => {

    reqInfo(req)
    const body = req.body;
    try {
        // let isExist = await getFirstMatch(courseRegisterModel, { email: body.email }, {}, { lean: true });
        // if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("email"), {}, {}));

       
        let parchas = new courseRegisterModel(body);
        await parchas.save();

        
        const razorpayOrder = await createRazorpayOrder({
            fees: parchas.fees,
            currency: "INR",
            receipt: parchas._id.toString(),
        })
    
        if(!razorpayOrder) return res.status(500).json(new apiResponse(500, "Razorpay order failed", {}, {}));
        parchas = await courseRegisterModel.findOneAndUpdate({ _id: new ObjectId(parchas._id) }, { razorpayOrderId: razorpayOrder.id }, { new: true });
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("Order"), { parchas, razorpayOrder }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
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

        let user = await webSettingModel.findOne({  isDeleted: false }).select('razorpayKeyId razorpayKeySecret').lean()
        // console.log("user", user);
        
        const razorpay = new Razorpay({
            key_id: user.razorpayKeyId,
            key_secret: user.razorpayKeySecret,
        })
        // console.log("razorpay", razorpay);
        
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    reqInfo(req)
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;
    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
   
          let user = await webSettingModel.findOne({  isDeleted: false }).select('razorpayKeyId razorpayKeySecret').lean()

        const exceptedSignature = crypto.createHmac("sha256", user.razorpayKeySecret).update(sign).digest("hex");
        // console.log("exceptedSignature", exceptedSignature);
        

        if (exceptedSignature === razorpay_signature) {

            await courseRegisterModel.findOneAndUpdate(
                { email: email, razorpayOrderId: razorpay_order_id },
                { paymentStatus: "Success", razorpayPaymentId: razorpay_payment_id }
            )
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

export const editcourseRegister = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;

        let isExist = await getFirstMatch(courseRegisterModel, { email: body.email, _id: { $ne: new ObjectId(body.courseRegisterId) } }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage.dataAlreadyExist('email'), {}, {}));

        const response = await updateData(courseRegisterModel, { _id: new ObjectId(body.courseRegisterId) }, body, {});
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Course Register'), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const getCourseRegister = async (req, res) => {
    reqInfo(req)
    try {

        let { search, page, limit, blockFilter } = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
        if (search) {
            criteria.title = { $regex: search, $options: 'si' };
        }

        if (blockFilter) criteria.isBlocked = blockFilter;

        options.sort = { priority: 1, createdAt: -1 };

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 0;

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }


        let populate = [
            {
                path: 'courseId',
                select: 'title subtitle background shortDescription duration skillLevelId price totalLectures totalHours '
            }
        ]


        const response = await findAllWithPopulate(courseRegisterModel, criteria, {}, options, populate);
       
        const totalCount = await countData(courseRegisterModel, criteria);

        const stateObj = {
            page: pageNum,
            limit: limitNum,
            page_limit: Math.ceil(totalCount / limitNum) || 1,
        }

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('Course Register'), { courseRegister_data: response, totalData: totalCount, state: stateObj }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const deleteCourseRegister = async (req, res) => {
    reqInfo(req)
    try {
        const { id } = req.params;

        const response = await updateData(courseRegisterModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('Course Register'), response, {}));


    } catch (error) {
        console.log(error);

        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}