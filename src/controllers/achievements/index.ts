import { apiResponse } from "../../common";
import { achievementModel } from "../../database/models/achievements";
import { reqInfo, responseMessage } from "../../helper"
import { countData, createData, findAllWithPopulate, getData, getFirstMatch, updateData } from "../../helper/database_service";


const ObjectId = require('mongoose').Types.ObjectId

export const addAchievements = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;

        let isExist = await getFirstMatch(achievementModel, { type: body.type, priority: body.priority, isDeleted: false }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));

        const response = await createData(achievementModel, body);

        return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('achievements'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const editAchievements = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body;

        let isExist = await getFirstMatch(achievementModel, { type: body.type, priority: body.priority, isDeleted: false, _id: { $ne: new ObjectId(body.achievementId) } }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));

        const response = await updateData(achievementModel, { _id: new ObjectId(body.achievementId) }, body, {});
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('achievements'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }

}


export const getAchievements = async (req, res) => {
    reqInfo(req)
    try {
        let { search, page, limit, blockFilter } = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
        if (search) {
            criteria.title = { $regex: search, $options: 'si' };
        }
        if (blockFilter) criteria.isBlocked = blockFilter;

        options.sort = { priority: 1, createdAt: -1 };

        // const pageNum = parseInt(page) || 1;
        // const limitNum = parseInt(limit) || 0;

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(achievementModel, criteria, {}, options);
        const totalCount = await countData(achievementModel, criteria);

        const stateObj = {
            page: page,
            limit: limit,
            page_limit: Math.ceil(totalCount / limit) || 1,
        }

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('achievements'), { achievements_data: response, totalData: totalCount, state: stateObj }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const deleteAchievements = async (req, res) => {
    reqInfo(req)
    try {
        const { id } = req.params;

        const response = await updateData(achievementModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('achievements'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}