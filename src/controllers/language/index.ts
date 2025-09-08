import { apiResponse } from "../../common";
import { languageModel } from "../../database/models/language";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, getData, getFirstMatch, updateData } from "../../helper/database_service";


const ObjectId = require('mongoose').Types.ObjectId

export const addLanguage = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;
        let isExist = await getFirstMatch(languageModel, { priority: body.priority }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage.dataAlreadyExist('prority'), {}, {}));

        const response = await createData(languageModel, body);

        return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('Language'), response, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const editLanguage = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;
        console.log("body", body);

        let isExist = await getFirstMatch(languageModel, { priority: body.priority, isDeleted: false, _id: { $ne: new ObjectId(body.languageId) } }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));

        const response = await updateData(languageModel, { _id: new ObjectId(body.languageId) }, body, {});

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Language'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const getLanguage = async (req, res) => {
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

        const responce = await getData(languageModel, criteria, {}, options);
        const totalCount = await countData(languageModel, criteria);

        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,

        };
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('Language'), { language_data: responce, totalData: totalCount, state: stateObj }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

export const deleteLanguage = async (req, res) => {
    reqInfo(req)
    try {
        let response = await updateData(languageModel, { _id: new ObjectId(req.params.id), isDeleted: false }, { isDeleted: true }, { new: true });
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Language'), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('Language'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}