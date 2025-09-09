import { config } from "../../../config";
import { apiResponse } from "../../common";
import { userModel, userSessionModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getData } from "../../helper/database_service";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const jwt_token_secret = config.JWT_TOKEN_SECRET

export const signup = async (req, res) => {
    reqInfo(req)
    try {
        let body = req.body
        let isAlready: any = await userModel.findOne({ email: body?.email, isDeleted: false })
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


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));

    }
}

export const login = async (req, res) => {
    let body = req.body,
        response: any
    reqInfo(req)
    try {
        response = await userModel.findOne({ email: body?.email, isDeleted: false }).lean()

        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.invalidUserPasswordEmail, {}, {}))
        if (response?.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))


        const passwordMatch = await bcryptjs.compare(body.password, response.password)
        if (!passwordMatch) return res.status(404).json(new apiResponse(404, responseMessage?.invalidUserPasswordEmail, {}, {}));

        const token = jwt.sign({ _id: response._id, type: response.userType, status: "Login", generatedOn: (new Date().getTime()) }, jwt_token_secret)

        await new userSessionModel({ createdBy: response._id, }).save()

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


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));

    }
}

export const change_password = async (req, res) => {
    reqInfo(req)
    let body = req.body
    try {

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


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));

    }
}

export const get_user_by_id = async(req,res)=>{
    reqInfo(req)
    try{
        console.log("req.query",req.params);
        
        let {id} = req.params
        console.log("id",id);
        
        let response = await userModel.findOne({_id:new ObjectId(id),isDeleted:false}).lean()
        console.log("response",response);
        
        if(!response) return res.status(404).json(new apiResponse(404,responseMessage?.getDataNotFound("user"),{},{}))
        return res.status(200).json(new apiResponse(200,responseMessage?.getDataSuccess("user"),response,{}))
    }catch(err){
        console.log(err);
        return res.status(500).json(new apiResponse(500,responseMessage?.internalServerError,{},err));
    }

}
// export const get_user = async (req, res) => {
//     reqInfo(req);
//     try {
//         console.log("req.user", req.user); // Middleware ma set thayu che

//         let response = await getData(
//             userModel,
//             { _id: new ObjectId(req.user._id), isDeleted: false },
//             {},
//             { lean: true }
//         );

//         if (!response) {
//             return res
//                 .status(404)
//                 .json(new apiResponse(404, responseMessage?.getDataNotFound("user"), {}, {}));
//         }

//         return res
//             .status(200)
//             .json(new apiResponse(200, responseMessage?.getDataSuccess("user"), response, {}));
//     } catch (error) {
//         console.log(error);
//         return res
//             .status(500)
//             .json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
//     }
// };

export const get_all_users = async (req, res) => {
    reqInfo(req);
    let { page, limit, search } = req.query;
    let criteria: any = { isDeleted: false };
    let options: any = { lean: true, sort: { createdAt: -1 } };
    let loggedInUser: any = req.headers?.user;
    try {

        if (search) {
            criteria.$or = [
                { firstName: { $regex: search, $options: 'si' } },
                { lastName: { $regex: search, $options: 'si' } },
                { email: { $regex: search, $options: 'si' } },
                { phoneNumber: { $regex: search, $options: 'si' } },
            ];
        }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }
        const User = await getData( userModel,criteria, {},options); 
        const totalCount = await userModel.countDocuments(criteria);
        
        const usersWithUnread = await Promise.all(User.map(async user => {
            const unreadCount = await userModel.countDocuments({
                senderId: user._id,
                receiverId: loggedInUser?._id,
                seen: false,
                isDeleted: false
            });
            return { ...user, unreadCount };
        }));
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        };
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('User'), {
            user_data: usersWithUnread,
            totalData: totalCount,
            state: stateObj
        }, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, {}));
    }
};

export const edit_user_by_id = async (req, res) => {
    reqInfo(req);
    console.log("Editing user with body:", req.body);
    try {
        const { profileId, email, phoneNumber, password } = req.body;
        const user = await userModel.findOne({ _id: new ObjectId(profileId), isDeleted: false });
        if (!user)
            return res.status(404).json(new apiResponse(404, "User not found", {}, {}));
        // const roleId = new ObjectId(role?._id);
        const emailExist = await userModel.findOne({
            email,
            isDeleted: false,
            _id: { $ne: user._id }
        });
        if (emailExist) return res.status(409).json(new apiResponse(409, responseMessage.dataAlreadyExist("email"), {}, {}));
        const phoneExist = await userModel.findOne({
            phoneNumber,
            isDeleted: false,
            _id: { $ne: user._id }
        });
        if (phoneExist)
            return res.status(409).json(new apiResponse(409, responseMessage.dataAlreadyExist("phoneNumber"), {}, {}));
        // req.body.roleId = roleId;
        if (password) {
            const saltRounds = 10;
            req.body.confirmPassword = password;
            req.body.password = await bcryptjs.hash(password, saltRounds);
        }
        req.body.confirmPassword = req.body.confirmPassword;
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: new ObjectId(profileId) },
            req.body,
            { new: true }
        );
        if (!updatedUser)
            return res.status(404).json(new apiResponse(404, responseMessage.addDataError, {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("user"), updatedUser, {}));
    } catch (error) {
        console.error("Edit User Error:", error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};









