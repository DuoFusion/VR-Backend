import { apiResponse } from "../../common";
import { categoryModel } from "../../database/models/category";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, getData, getFirstMatch, updateData } from "../../helper/database_service";


const ObjectId = require('mongoose').Types.ObjectId;

export  const createCategory = async(req,res)=>{
reqInfo(req)
try{

     const body = req.body;
       
        let isExist = await  getFirstMatch(categoryModel,{type:body.type,priority:body.priority,isDeleted:false},{},{lean:true});
        if(isExist) return res.status(404).json(new apiResponse(404,responseMessage?.dataAlreadyExist("priority"),{},{}))
         
        const response = await createData(categoryModel,body);
        return res.status(200).json(new apiResponse(200,responseMessage.addDataSuccess('Category'),response,{}));

}catch(error){
    console.log(error);
    return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
    
}
}

export const editCategory = async(req,res)=>{
    reqInfo(req)
    let { categoryId } = req.body,
    body = req.body;
    try{
        
        let isExist = await getFirstMatch(categoryModel,{type:body.type,priority:body.priority,isDeleted:false,_id: { $ne: (categoryId)}},{},{lean:true});
        if(isExist) return res.status(404).json(new apiResponse(404,responseMessage?.dataAlreadyExist("priority"),{},{}))

        const response = await updateData(categoryModel,{_id:new ObjectId(categoryId), isDeleted:false},body,{new:true});
        if(!response)return res.status(404).json(new apiResponse(404,responseMessage.getDataNotFound('Category'),{},{}));
        return res.status(200).json(new apiResponse(500,responseMessage.updateDataSuccess('Category'),response,{}));

    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500,responseMessage.internalServerError,{},error));
    }
}

export const getCategories = async (req, res) => {
    reqInfo(req);
    
    try {
        let { page, limit, search } = req.query, criteria : any= { isDeleted: false }, options:any = { lean: true, sort: { createdAt: -1 } }; // default sort
       
        if (search) {
            criteria.name = { $regex: search, $options: 'i' };
        }

        options.sort = {priority:1,createdAt:-1};

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(categoryModel, criteria, {}, options);
        const totalCount = await countData(categoryModel, criteria);

        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        };

        return res.status(200).json(new apiResponse(200,responseMessage.getDataSuccess('Categories'), { category_data: response, totalData: totalCount, state: stateObj },{}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};


export const deleteCategory = async (req, res) => {
    reqInfo(req)
    
    try {
        let  {id } = req.params;

        const response = await updateData(categoryModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('Category'), response, {}));
     
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}