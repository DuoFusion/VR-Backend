import { apiResponse } from "../../common";
import { paymentMessageModel } from "../../database/models/paymentMessage";
import { reqInfo, responseMessage } from "../../helper";
import { countData, createData, deleteData, findAllWithPopulate, getFirstMatch, updateData } from "../../helper/database_service";

let ObjectId = require('mongoose').Types.ObjectId;

// Get all payment messages
export const getPaymentMessages = async (req, res) => {
    reqInfo(req);
    let { page, limit, search, type, isActive } = req.query, criteria: any = { isDeleted: false };
    let options: any = { lean: true };
    
    try {
        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { message: { $regex: search, $options: 'si' } }
            ];
        }

        if (type) {
            criteria.type = type;
        }

        if (isActive !== undefined) {
            criteria.isActive = isActive === 'true';
        }

        options.sort = { createdAt: -1 };
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await findAllWithPopulate(paymentMessageModel, criteria, {}, options, []);
        const totalCount = await countData(paymentMessageModel, criteria);

        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        };

        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('Payment Messages'), { 
            paymentMessage_data: response, 
            totalData: totalCount, 
            state: stateObj 
        }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// Get payment messages by type (success/failed)
export const getPaymentMessagesByType = async (req, res) => {
    reqInfo(req);
    let { type } = req.params;
    
    try {
        if (!type || !['success', 'failed'].includes(type)) {
            return res.status(400).json(new apiResponse(400, "Invalid type. Must be 'success' or 'failed'", {}, {}));
        }

        const criteria = { 
            type: type, 
            isActive: true, 
            isDeleted: false 
        };
        
        const response = await findAllWithPopulate(paymentMessageModel, criteria, {}, { lean: true }, []);
        
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess(`Payment ${type} Messages`), { 
            paymentMessage_data: response 
        }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// Add/Edit payment message
export const addEditPaymentMessage = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body;
        const { paymentMessageId } = body;

        // Validate required fields
        if (!body.type || !['success', 'failed'].includes(body.type)) {
            return res.status(400).json(new apiResponse(400, "Type is required and must be 'success' or 'failed'", {}, {}));
        }

        if (!body.title || !body.message) {
            return res.status(400).json(new apiResponse(400, "Title and message are required", {}, {}));
        }

        if (paymentMessageId) {
            // Edit existing message
            const isExist = await getFirstMatch(paymentMessageModel, { _id: new ObjectId(paymentMessageId), isDeleted: false }, {}, { lean: true });
            if (!isExist) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Payment Message'), {}, {}));

            const response = await updateData(paymentMessageModel, { _id: new ObjectId(paymentMessageId) }, body, {});
            return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess('Payment Message'), response, {}));
        } else {
            // Add new message
            const response = await createData(paymentMessageModel, body);
            return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess('Payment Message'), response, {}));
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// Delete payment message
export const deletePaymentMessage = async (req, res) => {
    reqInfo(req);
    let { id } = req.params;
    
    try {
        const response = await deleteData(paymentMessageModel, { _id: id });
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Payment Message'), {}, {}));
        
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess('Payment Message'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// Get single payment message by ID
export const getPaymentMessageById = async (req, res) => {
    reqInfo(req);
    let { id } = req.params;
    
    try {
        const response = await getFirstMatch(paymentMessageModel, { _id: new ObjectId(id), isDeleted: false }, {}, { lean: true });
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage.getDataNotFound('Payment Message'), {}, {}));
        
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('Payment Message'), response, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}
