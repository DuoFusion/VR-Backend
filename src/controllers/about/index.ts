import { apiResponse } from "../../common";
import { aboutModel } from "../../database/models/about";
import { reqInfo, responseMessage } from "../../helper"
import { countData, createData, getData, getFirstMatch, updateData } from "../../helper/database_service";
import { addEditAboutUsSchema } from "../../validation/about-us";

const ObjectId = require('mongoose').Types.ObjectId

export const add_edit_about_us = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers
    try {
        const { error, value } = addEditAboutUsSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await aboutModel.findOneAndUpdate({ isDeleted: false }, value, { new: true, upsert: true })
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("about us"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_about_us = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers
    console.log("user", user);
    try {
        const response = await aboutModel.findOne({ isDeleted: false })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("about us"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("about us"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

