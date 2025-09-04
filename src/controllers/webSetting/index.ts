import { apiResponse } from "../../common";
import { webSettingModel } from "../../database/models/webSetting";
import { reqInfo, responseMessage } from "../../helper"
import { addEditwebSettingSchema } from "../../validation/web-Setting";

const ObjectId = require('mongoose').Types.ObjectId

export const add_edit_web_Setting = async(req,res)=>{
    reqInfo(req)
    try{
              const { error, value } = addEditwebSettingSchema.validate(req.body)
            if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
    
            const response = await webSettingModel.findOneAndUpdate({ isDeleted: false }, value, { new: true, upsert: true })
            return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("web Setting"), response, {}))
       

    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
        
    }
}

export const get_web_Setting = async(req,res)=>{
    reqInfo(req)
    let { user } = req.headers
    try{
        const response = await webSettingModel.findOne({ isDeleted: false })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("web setting"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("web setting"), response, {}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
        
    }
}
