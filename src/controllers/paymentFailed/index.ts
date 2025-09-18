import { apiResponse } from "../../common";
import { aboutModel } from "../../database/models/about";
import { paymentMessageFailedModel } from "../../database/models/paymentFailed";
import { reqInfo, responseMessage } from "../../helper"
import { countData, createData, getData, getFirstMatch, updateData } from "../../helper/database_service";
import { addEditAboutUsSchema } from "../../validation/about-us";
import { addEditPaymentFailedSchema } from "../../validation/paymentFailed";

const ObjectId = require('mongoose').Types.ObjectId

export const addEditPaymentMessage = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers
    try {
        const { error, value } = addEditPaymentFailedSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await paymentMessageFailedModel.findOneAndUpdate({ isDeleted: false }, value, { new: true, upsert: true })
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("payment failed"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const  getPaymentMessages = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers
    console.log("user", user);
    try {
        const response = await paymentMessageFailedModel.findOne({ isDeleted: false })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("payment failed"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("payment failed"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

