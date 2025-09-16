import { apiResponse } from "../../common";
import { contactUsModel } from "../../database/models/contactUs";
import { reqInfo, responseMessage } from "../../helper";
import { countData, getData } from "../../helper/database_service";

let ObjectId = require('mongoose').Types.ObjectId;

export const addContactUs = async(req,res)=>{
    reqInfo(req)
    let body = req.body;
    try{
        const contactUs = await new contactUsModel(body).save();
        if(!contactUs) return res.status(404).json(new apiResponse(404,responseMessage.addDataError,{},{}));
        return res.status(200).json(new apiResponse(200,responseMessage.addDataSuccess('ContactUs'),contactUs,{}));

    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error))
        
    }
}

export const editContactUs = async (req, res) => {
    reqInfo(req)
    let body = req.body;
    try {
        const contactUs = await contactUsModel.findOneAndUpdate({ _id: new ObjectId(body.contactUsId) }, body, { new: true });
        if (!contactUs) return res.status(404).json(new apiResponse(404, responseMessage.updateDataError("ContactUs"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("ContactUs"), contactUs, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};

export const deleteContactUs = async (req, res) => {
    reqInfo(req)
    let { id } = req.params;
    try {
        const contactUs = await contactUsModel.findOneAndUpdate({ _id: new ObjectId(id), isDeleted: false }, { isDeleted: true }, { new: true });
        if (!contactUs) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound("ContactUs"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("ContactUs"), contactUs, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};

export const getContactUs = async (req, res) => {
    reqInfo(req)
    let { page, limit, search, archiveFilter } = req.query, criteria: any = { isDeleted: false };
    try {

        if (search) {
            criteria.$or = [
                { email: { $regex: search, $options: 'si' } }
            ];
        }

        if(archiveFilter){
            criteria.isArchived = archiveFilter
        }

        const options: any = { lean: true, sort: { createdAt: -1 } };

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(contactUsModel, criteria, {}, options);
        const totalCount = await countData(contactUsModel, criteria);

        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        };

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('ContactUs'), { contactUs_data: response, totalData: totalCount, state: stateObj }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}