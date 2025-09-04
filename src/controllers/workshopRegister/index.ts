import { apiResponse } from "../../common";
import { webSettingModel } from "../../database/models/webSetting";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, deleteData, findAllWithPopulate, getFirstMatch, updateData } from "../../helper/database_service";

import Razorpay from 'razorpay'
import crypto from 'crypto'

let ObjectId = require('mongoose').Types.ObjectId;

export const addWorkShopRegister = async(req,res)=>{
    reqInfo(req)
    try{
        const body = req.body;

        // let isExist = await getFirstMatch(workshopRegisterModel, { email: body.email, isDeleted: false }, {}, { lean: true });
        // if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("email"), {}, {}));

        let parchas = new workshopRegisterModel(body);
        await parchas.save();

        const razorpayOrder = await createRazorpayOrder({
            fees: parchas.fees,
            currency: "INR",
            receipt: parchas._id.toString(),
        })

        if(!razorpayOrder) return res.status(500).json(new apiResponse(500," Razorpay order failed", {}, {}));

        parchas = await workshopRegisterModel.findOneAndUpdate({ _id: new ObjectId(parchas._id) }, { razorpayOrderId: razorpayOrder.id }, { new: true });
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("Order"), { parchas, razorpayOrder }, {}));

        // const response = await createData(workshopRegisterModel, body);

        // return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('workshop Register'), response, {}));   

    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
        
    }
}

export const createRazorpayOrder = async(payload) => {
    const { fees, currency = 'INR', receipt } = payload;
    try{
        const options = {
            amount: fees,
            currency,
            receipt,
        };
        let user = await webSettingModel.findOne({  isDeleted: false }).select('razorpayKeyId razorpayKeySecret').lean()
        const razorpay = new Razorpay({
            key_id: user.razorpayKeyId,
            key_secret: user.razorpayKeySecret,
        })
        const order = await razorpay.orders.create(options);
        return order;
    }catch(error){
        console.log(error);
        return null;
    }
}

export const verifyRazorpayPayment = async(req,res)=>{
    reqInfo(req)
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;
     try {
           const sign = razorpay_order_id + "|" + razorpay_payment_id;
      
             let user = await webSettingModel.findOne({  isDeleted: false }).select('razorpayKeyId razorpayKeySecret').lean()
   
           const exceptedSignature = crypto.createHmac("sha256", user.razorpayKeySecret).update(sign).digest("hex");
           // console.log("exceptedSignature", exceptedSignature);
           
   
           if (exceptedSignature === razorpay_signature) {
   
               await workshopRegisterModel.findOneAndUpdate(
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