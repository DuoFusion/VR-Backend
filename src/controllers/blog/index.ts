import { apiResponse } from "../../common";
import { blogModel } from "../../database/models/blog";
import { reqInfo, responseMessage } from "../../helper"
import { countData, createData, getData, getFirstMatch, updateData } from "../../helper/database_service";

const ObjectId = require("mongoose").Types.ObjectId

export const addBlog = async (req, res) => {
    reqInfo(req)
    try {
        const body = req.body;

        // let isExist = await getFirstMatch(blogModel, { type: body.type, priority: body.priority, isDeleted: false }, {}, { lean: true });
        // if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));

        const response = await createData(blogModel, body);
        return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('blog'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

export const editBlog = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body;

        // let isExist = await getFirstMatch(blogModel, { type: body.type,  isDeleted: false, _id: { $ne: new ObjectId(body.blogId) } }, {}, { lean: true });
        // if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("blog"), {}, {}));

        const response = await updateData(blogModel, { _id: new ObjectId(body.blogId) }, body, {});
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('blog'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }

}

export const getBlog = async (req, res) => {

    reqInfo(req)
    try {
        let { search, page, limit, blockFilter,featuresFilter } = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
        if (search) {
            criteria.title = { $regex: search, $options: 'si' };
        }
        if (blockFilter) criteria.isBlocked = blockFilter;

        if(featuresFilter) criteria.features = featuresFilter


        options.sort = { priority: 1, createdAt: -1 };

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 0;

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }



        const response = await getData(blogModel, criteria, {}, options);
        const totalCount = await countData(blogModel, criteria);

        const stateObj = {
            page: pageNum,
            limit: limitNum,
            page_limit: Math.ceil(totalCount / limitNum) || 1,
        }

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('blog'), { blog_data: response, totalData: totalCount, state: stateObj }, {}));


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const deleteBlog = async (req, res) => {
    reqInfo(req)
    try {
        const { id } = req.params;

        const response = await updateData(blogModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('blog'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

// export const getBlogById = async (req, res) => {

//     reqInfo(req)
//     try {
//         const { id } = req.params;
        
//         const response = await getData(blogModel, { _id: id, isDeleted: false }, {},{});
//         console.log(response);
//         return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('blog'), response, {}));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

//     }
// }
export const getBlogById = async (req, res) => {
    reqInfo(req);
    try {
        const { id } = req.params;

        const response = await blogModel.findOne({ _id: id, isDeleted: false });

        if (!response) {
            return res.status(404).json(new apiResponse(404, "Blog not found", {}, {}));
        }

        return res.status(200).json(
            new apiResponse(200, responseMessage.getDataSuccess("blog"), response, {})
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};