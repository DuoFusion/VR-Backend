import { apiResponse, WORKSHOP_REGISTER_PAYMENT_STATUS } from "../../common";
import { webSettingModel } from "../../database/models/webSetting";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, deleteData, findAllWithPopulate, getFirstMatch, updateData } from "../../helper/database_service";

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { sendWhatsAppMessage } from "../../services/watiService";
import { paymentMessageFailedModel } from "../../database/models/paymentFailed";
import striptags from "striptags";
import { paymentMessageSuccessModel } from "../../database/models/paymentSuccess";
import { courseRegisterModel } from "../../database/models/courseRegister";

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

// export const verifyRazorpayPayment = async (req, res) => {
//     reqInfo(req)
//     let { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;
//     try {
//         const isExist = await workshopRegisterModel.findOne({ razorpayOrderId: razorpay_order_id });
//         if (!isExist){ 
            
//             return res.status(400).json(new apiResponse(400, responseMessage.paymentFailed, {}, {}))
//         }
//         const sign = razorpay_order_id + "|" + razorpay_payment_id;

//         let user = await webSettingModel.findOne({ isDeleted: false }).select('razorpayKeyId razorpayKeySecret').lean()

//         const exceptedSignature = crypto.createHmac("sha256", user.razorpayKeySecret).update(sign).digest("hex");
//         let fees = isExist.fees 
//         if (exceptedSignature === razorpay_signature) {
//             let newUpdated = await workshopRegisterModel.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { paymentStatus: "Success", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, fees }, { new: true });
//             console.log('newUpdated => ', newUpdated)
//             try {
//                 const courseMsg = `🎉 Hi ${newUpdated.name},\n\n✅ Your course registration is successful!\n\n📘 Course: ${newUpdated.courseName}\n💰 Fees: ₹${newUpdated.fees}\n🆔 Order ID: ${razorpay_order_id}\n\nThank you for joining with us. 🚀`;

//                 const resp = await sendWhatsAppMessage(newUpdated.whatsAppNumber, courseMsg);

//                 console.log("WhatsApp Response =>", resp);
//             } catch (msgErr) {
//                 console.error("WhatsApp Message Error:", msgErr.message);
//             }
//             return res.status(200).json(new apiResponse(200, responseMessage.paymentSuccess, { razorpay_order_id, razorpay_payment_id, razorpay_signature }, {}));
//         }
//         return res.status(400).json(new apiResponse(400, responseMessage.paymentFailed, {
//             razorpay_order_id, razorpay_payment_id, razorpay_signature
//         }, {}));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
//     }
// }

export const verifyRazorpayPayment = async (req, res) => {
    reqInfo(req);
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        // 1️⃣ Check order exist kare che ke nai
        const isExist = await courseRegisterModel.findOne({ razorpayOrderId: razorpay_order_id });
        if (!isExist) {
            // ❌ Payment fail => DB ma fail message fetch kari ne send karo
            const failMsgDoc = await paymentMessageFailedModel.findOne({ isDeleted: false }).lean();
            let failMsg = failMsgDoc?.message || `❌ Hi ${isExist?.name || "User"}, your payment has failed. Please try again.`;

            try {
                if (isExist?.whatsAppNumber) {
                    await sendWhatsAppMessage(isExist.whatsAppNumber, failMsg);
                }
            } catch (msgErr) {
                console.error("WhatsApp Fail Message Error:", msgErr.message);
            }

            return res.status(400).json(new apiResponse(400, responseMessage.paymentFailed, {}, {}));
        }

        // 2️⃣ Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        let user = await webSettingModel.findOne({ isDeleted: false }).select("razorpayKeyId razorpayKeySecret").lean();
        const expectedSignature = crypto.createHmac("sha256", user.razorpayKeySecret).update(sign).digest("hex");

        let fees = isExist.fees;

        if (expectedSignature === razorpay_signature) {
            // ✅ Payment Success
            let newUpdated = await courseRegisterModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { paymentStatus: "Success", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, fees },
                { new: true }
            ).populate("courseId");
            console.log("new", newUpdated);
            // Get success message from DB
            const successMsgDoc: any = await paymentMessageSuccessModel.findOne({ isDeleted: false }).lean();

            const formatMessage = (template, data) => {
                return template.replace(/{(\w+)}/g, (_, key) => data[key] || "");
            };


            let defaultTemplate = `🎉 Hi {name},\n\n✅ Your course registration is successful!\n\n📘 Course: {course}\n💰 Fees: {fees}\n👤 Registered User: {name}`;
            const quillHtmlToWhatsapp = (html: string) => {
                if (!html) return "";
                let text = html;

                // ✅ Bold, Italic, Strike
                text = text.replace(/<\s*(b|strong)[^>]*>(.*?)<\/\s*\1>/gi, "*$2*");
                text = text.replace(/<\s*(i|em)[^>]*>(.*?)<\/\s*\1>/gi, "_$2_");
                text = text.replace(/<\s*(s|strike|del)[^>]*>(.*?)<\/\s*\1>/gi, "~$2~");

                // ✅ Blockquote → >
                text = text.replace(
                    /<blockquote[^>]*>(.*?)<\/blockquote>/gis,
                    (m, c) => c.split("\n").map(l => `> ${l}`).join("\n")
                );

                // ✅ Handle UL & OL Lists
                const parseList = (html: string, ordered = false, start = 1): string => {
                    // UL → pass down with ordered=false
                    html = html.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, inner) =>
                        parseList(inner, false)
                    );

                    // OL → pass down with ordered=true
                    html = html.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, inner) =>
                        parseList(inner, true, 1)
                    );

                    // LI handling
                    let counter = start;
                    html = html.replace(/<li[^>]*>(.*?)<\/li>/gi, (_, li) => {
                        const itemText = parseList(li, ordered).trim();
                        if (!itemText) return "";
                        if (ordered) {
                            return `${counter++}. ${itemText}\n`;
                        } else {
                            return `• ${itemText}\n`; // bullet style
                        }
                    });

                    return html;
                };

                text = parseList(text);

                // ✅ Links
                text = text.replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)");

                // ✅ Headings → keep only inside text
                text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "$1\n");

                // ✅ Images
                text = text.replace(/<img [^>]*src="([^"]+)"[^>]*>/gi, "📷 Image: $1");

                // ✅ Videos / Iframes
                text = text.replace(
                    /<iframe[^>]*src="([^"]+)"[^>]*><\/iframe>/gi,
                    "🎬 Video: $1"
                );

                // ✅ Code → inline/backticks
                text = text.replace(/<code[^>]*>(.*?)<\/code>/gis, "`$1`");
                text = text.replace(/<pre[^>]*>(.*?)<\/pre>/gis, "```$1```");

                // ✅ Remove span/div/font wrappers
                text = text.replace(/<(span|font|div)[^>]*>(.*?)<\/\1>/gis, "$2");

                // ✅ Strip remaining tags but keep line breaks
                text = striptags(text, [], "\n");

                // ✅ Normalize spacing
                text = text.replace(/\n{3,}/g, "\n\n");
                text = text.replace(/[ \t]+\n/g, "\n");

                return text.trim();
            };

            let customMsg = quillHtmlToWhatsapp(successMsgDoc?.message);


            let courseMsg = formatMessage(
                `${defaultTemplate}\n\n${customMsg}`,
                {
                    name: newUpdated.name,
                    course: newUpdated?.courseId?.title,
                    fees: `₹${newUpdated.fees}`
                }
            );

            try {
                if (newUpdated.whatsAppNumber) {
                    const resp = await sendWhatsAppMessage(newUpdated.whatsAppNumber, courseMsg);
                    console.log("WhatsApp Success Response =>", resp);
                }
            } catch (msgErr) {
                console.error("WhatsApp Success Message Error:", msgErr.message);
            }

            return res.status(200).json(new apiResponse(200, responseMessage.paymentSuccess, { razorpay_order_id, razorpay_payment_id, razorpay_signature }, {}));
        } else {
            // ❌ Payment failed (signature mismatch)
            const failMsgDoc = await paymentMessageFailedModel.findOne({ isDeleted: false }).lean();
            let failMsg = failMsgDoc?.message || `❌ Hi ${isExist.name}, your payment verification failed.`;

            try {
                if (isExist.whatsAppNumber) {
                    await sendWhatsAppMessage(isExist.whatsAppNumber, failMsg);
                }
            } catch (msgErr) {
                console.error("WhatsApp Fail Message Error:", msgErr.message);
            }

            return res.status(400).json(new apiResponse(400, responseMessage.paymentFailed, { razorpay_order_id, razorpay_payment_id, razorpay_signature }, {}));
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new apiResponse(500, responseMessage.internalServerError, {}, error)
        );
    }
};


export const sendMessageToStudents = async (req, res) => {
    try {
        const { studentIds, message, imageUrl  } = req.body;

        console.log("studentIds", studentIds);
        
        if (!message) return res.status(400).json(new apiResponse(400, " message required", {}, {}));

        if (studentIds.length === 0) {
            const workshopRegs = await workshopRegisterModel.find({  paymentStatus: WORKSHOP_REGISTER_PAYMENT_STATUS.SUCCESS ,isDeleted: false }, "name whatsAppNumber");
            for(let student of workshopRegs) {
                const results: any[] = [];
                try {
                    const resp = await sendWhatsAppMessage( student.whatsAppNumber, `Hi ${student.name}, ${message}`, imageUrl);
                    if(resp.result === false || resp.ok === true) continue
                    results.push({ student: student.name, response: resp });
                    return res.status(200).json(new apiResponse(200, responseMessage.sendMessage('User'), results, {}));
                } catch (err: any) {
                    console.log("err", err);
                }
            }
        }
        const students = await workshopRegisterModel.find({ _id: { $in: studentIds } });
        
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
            if(resp.result === false) continue
            results.push({ student: student.name, response: resp });
        }
        console.log("results", results);

        return res.status(200).json(new apiResponse(200,responseMessage.sendMessage('Workshop Register'),results,{}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const updateworkshopRegister = async (req, res) => {
    reqInfo(req)
    try {
            const body = req.body;
    
            let isExist = await getFirstMatch(workshopRegisterModel, { email: body.email, _id: { $ne: new ObjectId(body.workshopRegisterId) } }, {}, { lean: true });
            if (isExist) return res.status(404).json(new apiResponse(404, responseMessage.dataAlreadyExist('email'), {}, {}));
    
            const response = await updateData(workshopRegisterModel, { _id: new ObjectId(body.workshopRegisterId) }, body, {});
            return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Workshop Register'), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
        }
    // try {

    //     const body = req.body;
    //     const response = await updateData(workshopRegisterModel, { _id: new ObjectId(body.workshopRegisterId) }, body, {});
    //     if (!response) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Workshop Register'), {}, {}));
    //     console.log("response", response);

    //     return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Workshop Register'), response, {}))

    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))

    // }
}

export const getworkshopRegister = async (req, res) => {
    reqInfo(req)
    let { page, limit, search, blockFilter,workshopFilter } = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
    // options: any = { lean: true };
    try {
        if (search) {
            criteria.name = { $regex: search, $options: 'si' };
        }

        
        if(workshopFilter) criteria.workshopId =  new ObjectId(workshopFilter)

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
        const response = await updateData(workshopRegisterModel, { _id: id },{isDeleted: true}, {});
        // if (!response) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Workshop Register'), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('Workshop Register'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}