import { apiResponse } from "../../common";
import { adminSettingModel } from "../../database/models/adminSetting";
import { reqInfo, responseMessage } from "../../helper"
import { add_edit_admin_setting_Schema } from "../../validation/admin-Setting";


const ObjectId = require('mongoose').Types.ObjectId

export const add_edit_admin_setting = async(req,res)=>{
    reqInfo(req)
    try{

        const {error,value} = add_edit_admin_setting_Schema.validate(req.body)
        if(error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await adminSettingModel.findOneAndUpdate({ isDeleted: false }, value, { new: true, upsert: true })
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("admin setting"), response, {}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
        
    }
}

export const get_admin_setting = async(req,res)=>{
    reqInfo(req)
    let { user } = req.headers
    try{

        const response = await adminSettingModel.findOne({ isDeleted: false })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("admin setting"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("admin setting"), response, {}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
        
    }
}