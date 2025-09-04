import { apiResponse } from "../../common";
import { faqModel } from "../../database/models/faq";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, getData, getFirstMatch, updateData } from "../../helper/database_service";


const ObjectId = require('mongoose').Types.ObjectId

export const addFAQ = async(req,res)=>{
     reqInfo(req)
    try {
        const body = req.body;
        let isExist = await getFirstMatch(faqModel, { priority: body.priority }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage.dataAlreadyExist('prority'), {}, {}));

        let response = await createData(faqModel, body);
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('faq'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const editFAQ = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;

        let isExist = await getFirstMatch(faqModel, { _id: new ObjectId(body.faqId) }, {}, { lean: true });
        if (!isExist) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('FAQ'), {}, {}));

        isExist = await getFirstMatch(faqModel, { priority: body.priority, _id: { $ne: new ObjectId(body.faqId) } }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage.dataAlreadyExist('prority'), {}, {}));

        const response = await updateData(faqModel, { _id: new ObjectId(body.faqId) }, body, {});
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('FAQ'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}


export const getFAQ = async (req, res) => {
    reqInfo(req)
    try {

        let { search, page, limit } = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
        if (search) {
            criteria.question = { $regex: search, $options: 'si' };
        }

        options.sort = { priority: 1, createdAt: -1 };

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(faqModel, criteria, {}, options);
        const totalCount = await countData(faqModel, criteria);

        const stateObj = {
            page: page,
            limit: limit,
            page_limit: Math.ceil(totalCount / limit) || 1,
        }

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('faq'), { faq_data: response, totalData: totalCount, state: stateObj }, {}));


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))

    }
}

export const deleteFAQ = async (req, res) => {
    reqInfo(req)
    try {

        const { id } = req.params;

        const response = await updateData(faqModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('faq'), response, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}
