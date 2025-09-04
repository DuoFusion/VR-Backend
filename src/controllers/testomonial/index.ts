import { apiResponse } from "../../common";
import { testimonialModel } from "../../database/models/testomonial";
import { reqInfo, responseMessage } from "../../helper"
import { countData, createData, getData, getFirstMatch, updateData } from "../../helper/database_service";


const ObjectId = require('mongoose').Types.ObjectId


export const addTestomonial = async (req, res) => {
    reqInfo(req)
    try{
      const body = req.body;
        let isExist = await getFirstMatch(testimonialModel, { priority: body.priority }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage.dataAlreadyExist('prority'), {}, {}));

        let response = await createData(testimonialModel, body);
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('testomonial'), response, {}));

    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
        
    }
}

export const editTestomonial = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;

        let isExist = await getFirstMatch(testimonialModel, { _id: new ObjectId(body.testimonialId) }, {}, { lean: true });
        if (!isExist) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('testomonial'), {}, {}));

        isExist = await getFirstMatch(testimonialModel, { priority: body.priority, _id: { $ne: new ObjectId(body.testimonialId) } }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage.dataAlreadyExist('prority'), {}, {}));

        const response = await updateData(testimonialModel, { _id: new ObjectId(body.testimonialId) }, body, {});
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('testomonial'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const getTestomonial = async (req, res) => {
    reqInfo(req)
    try {

        let { search, page, limit } = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
        if (search) {
            criteria.name = { $regex: search, $options: 'si' };
        }
        
        options.sort = { priority: 1, createdAt: -1 };


        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(testimonialModel, criteria, {}, options);
        const totalCount = await countData(testimonialModel, criteria);

        const stateObj = {
            page: page,
            limit: limit,
            page_limit: Math.ceil(totalCount / limit) || 1,
        }

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('testomonial'), { testomonial_data: response, totalData: totalCount, state: stateObj }, {}));


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))

    }
}

export const deleteTestomonial = async (req, res) => {
    reqInfo(req)
    try {
        const { id } = req.params;

        const response = await updateData(testimonialModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('testomonial'), response, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}
