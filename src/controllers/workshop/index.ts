import { apiResponse } from "../../common";
import { workshopModel } from "../../database/models/workshop";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, findAllWithPopulate, findOneAndPopulate, getData, getFirstMatch, updateData } from "../../helper/database_service";
import { sendWhatsAppMessage } from "../../services/watiService";


const ObjectId = require('mongoose').Types.ObjectId

export const addWorkshop = async(req,res)=>{
      reqInfo(req)
    try {
        const body = req.body;

        let isExist = await getFirstMatch(workshopModel, { type: body.type, priority: body.priority, isDeleted: false }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));

        const response = await createData(workshopModel, body);
        console.log("response", response);

        return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('Workshop'), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// export const sendMessageToStudents = async (req, res) => {
//     reqInfo(req);
//     try {
//         const {studentIds,message} = req.body;
       
//                if(!studentIds || !message) return res.status(400).json({error:"studentIds & message required"});
       
//                const students = await workshopRegisterModel.find({ _id: { $in: studentIds }, isDeleted: false });
//                if (!students.length) return res.status(404).json({ error: "No students found" });
       
//                const results: any[] = [];
//                for (const student of students) {
//                    try {
//                        const resp = await sendWhatsAppMessage(
//                            student.whatsAppNumber,   // phone field model ma hovu joiye
//                            `Hi ${student.name}, ${message}`
//                        );
//                        results.push({ student: student.name, response: resp });
//                    } catch (err: any) {
//                        results.push({ student: student.name, error: err.message });
//                    }
//                }
//                return res.json({ success: true, results });
       
//      } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
//     }
// }
export const sendMessageToStudents = async (req, res) => {
    reqInfo(req);
    try {
        const { studentIds, message } = req.body;

        console.log("workshopId", studentIds, "message", message);
        
        if (!studentIds || !message) {
            return res.status(400).json({ error: "workshopId & message required" });
        }

        // Find all students registered under that workshop
        const students = await workshopRegisterModel.find({ 
            workshopId: studentIds, 
            isDeleted: false 
        }, "name whatsAppNumber"); // only name & number fetch karva

        console.log("students", students);
        
        if (!students.length) {
            return res.status(404).json({ error: "No students found for this workshop" });
        }

        const results: any[] = [];

        for (const student of students) {
            try {
                const resp = await sendWhatsAppMessage(
                    student.whatsAppNumber,  // number directly model mathi
                    `Hi ${student.name}, ${message}`
                );
                results.push({ student: student.name, response: resp });
            } catch (err: any) {
                results.push({ student: student.name, error: err.message });
            }
        }
  return res.status(200).json(new apiResponse(200,responseMessage.sendMessage('Course Register'),results,{}));
      
        // return res.json({ success: true, results });

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};

export const updateWorkshop = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body;

        let isExist = await getFirstMatch(workshopModel, { type: body.type, priority: body.priority, isDeleted: false, _id: { $ne: new ObjectId(body.workshopId) } }, {}, { lean: true });
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("priority"), {}, {}));

        const response = await updateData(workshopModel, { _id: new ObjectId(body.workshopId) }, body, {});

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Workshop'), response, {}));


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const getWorkshop = async (req, res) => {

    reqInfo(req)
    try {
        let { search, page, limit, blockFilter ,featuresFilter} = req.query, options: any = { lean: true }, criteria: any = { isDeleted: false };
        if (search) {
            criteria.title = { $regex: search, $options: 'si' };
        }
        if (blockFilter) criteria.isBlocked = blockFilter;
        if (featuresFilter) criteria.features = featuresFilter;

        options.sort = { priority: 1, createdAt: -1 };

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 0;

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        let populate = [ 
            { path: 'languageId', select: 'name priority' }
        ]
  
        const response = await findAllWithPopulate(workshopModel, criteria, {}, options,populate);
        const totalCount = await countData(workshopModel, criteria);

        const stateObj = {
            page: pageNum,
            limit: limitNum,
            page_limit: Math.ceil(totalCount / limitNum) || 1,
        }

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('Workshop'), { workshop_data: response, totalData: totalCount, state: stateObj }, {}));


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const deleteWorkshop = async (req, res) => {
    reqInfo(req)
    try {
        const { id } = req.params;

        const response = await updateData(workshopModel, { _id: id }, { isDeleted: true }, {});
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('Workshop'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}

export const getWorkshopById = async (req, res) => {

    reqInfo(req)
    try {
        const { id } = req.params;
        let populate = [ 
            { path: 'languageId', select: 'name priority' }
        ]
        const response = await findOneAndPopulate(workshopModel, { _id: id, isDeleted: false }, {}, { lean: true },populate);
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('Workshop'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));

    }
}