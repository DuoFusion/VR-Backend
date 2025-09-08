import { apiResponse } from "../../common";
import { courseModel } from "../../database/models/courses";
import { reqInfo, responseMessage } from "../../helper"
import { countData, createData, findAllWithPopulate, getData, getFirstMatch, updateData } from "../../helper/database_service";


const ObjectId = require("mongoose").Types.ObjectId

export const addCourse = async(req,res)=>{
    reqInfo(req)
    try{
          const body = req.body;

        let isExist = await getFirstMatch(courseModel, { type: body.type, priority: body.priority, isDeleted: false }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));
       
        const response = await createData(courseModel, body);

        return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('Course'), response, {}));

    }catch(error){
           console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const editCourse = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body;

        let isExist = await getFirstMatch(courseModel, { type: body.type, priority: body.priority, isDeleted: false, _id: { $ne: new ObjectId(body.courseId) } }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));

        const response = await updateData(courseModel, { _id: new ObjectId(body.courseId) }, body, {});
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Course'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }

}


export const deleteCourse = async (req, res) => {
    reqInfo(req)
    try {
        const { id } = req.params;

        
         const response = await updateData(courseModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('course'), response, {}));
        

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const getCourse = async (req, res) => {
    reqInfo(req)
    try {

        let { search, page, limit, blockFilter,FeaturesFilter } = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
        if (search) {
            criteria.title = { $regex: search, $options: 'si' };

        }

        if (blockFilter) criteria.isBlocked = blockFilter;
        if(FeaturesFilter) criteria.isFeatures = FeaturesFilter
        options.sort = { priority: 1, createdAt: -1 };

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 0;

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }
      
        
        let populate = [{
            path: 'languageId', select: 'name priority',}]

        const response = await findAllWithPopulate(courseModel, criteria, {}, options,populate);
        const totalCount = await countData(courseModel, criteria);

        const stateObj = {
            page: pageNum,
            limit: limitNum,
            page_limit: Math.ceil(totalCount / limitNum) || 1,
        }

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('Course'), { course_data: response, totalData: totalCount, state: stateObj }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))

    }
}