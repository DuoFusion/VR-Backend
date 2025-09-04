import { config } from "../../../config";
import { apiResponse } from "../../common";
import { userModel, userSessionModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


const jwt_token_secret = config.JWT_TOKEN_SECRET

export const signup = async(req,res)=>{
    reqInfo(req)
    try{
        let body = req.body
        let isAlready :any = await userModel.findOne({email:body?.email,isDeleted:false})
       if (isAlready) return res.status(404).json(new apiResponse(404, responseMessage?.alreadyEmail, {}, {}))
        isAlready = await userModel.findOne({ phoneNumber: body?.phoneNumber, isDeleted: false })
        if (isAlready) return res.status(404).json(new apiResponse(404, "phone number exist already", {}, {}))

        if (isAlready?.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))


        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword
        let response = await new userModel(body).save()

        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.errorMail, {}, {}))
        return res.status(200).json(new apiResponse(200, response, {}, {}))


    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage?.internalServerError,{},error));
        
    }
}

export const login = async(req,res)=>{
    let body = req.body,
    response:any
    reqInfo(req)
    try{
        response = await userModel.findOne({ email: body?.email, isDeleted: false }).lean()

        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.invalidUserPasswordEmail, {}, {}))
        if (response?.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))


        const passwordMatch = await bcryptjs.compare(body.password, response.password)
        if (!passwordMatch) return res.status(404).json(new apiResponse(404, responseMessage?.invalidUserPasswordEmail, {}, {}));

        const token = jwt.sign({ _id: response._id,type: response.userType,status: "Login", generatedOn: (new Date().getTime()) }, jwt_token_secret)

        await new userSessionModel({ createdBy: response._id,}).save()

        response = {
            user: {
                userType: response?.userType,
                firstName: response?.firstName,
                lastName: response?.lastName,
                _id: response?._id,
                email: response?.email,
                phoneNumber: response?.phoneNumber,
                profilePhoto: response?.profilePhoto,

            },
            token,
        }

        return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, response, {}));


    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage?.internalServerError,{},error));
        
    }
}

export const change_password = async(req,res)=>{
    reqInfo(req)
    let body = req.body
    try{
        
        let isEmailExist = await userModel.findOne({ email: body?.email, isDeleted: false })

        if (!isEmailExist) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("user"), {}, {}))

        if (body?.password !== body?.confirmPassword) {
            return res.status(404).json(new apiResponse(404, "Password and confirm password not match", {}, {}))

        }

        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        delete body.id
        body.password = hashPassword

        let response = await userModel.findOneAndUpdate({ email: body?.email, isDeleted: false }, body, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.resetPasswordError, {}, {}))

        return res.status(200).json(new apiResponse(200, responseMessage?.resetPasswordSuccess, response, {}))


    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage?.internalServerError,{},error));
        
    }
}