"use strict"
import { Router } from 'express'
import { reqInfo, responseMessage } from '../helper';
import { config } from '../../config';
import { apiResponse } from '../common';

const router = Router()

router.post("", (req: any, res: any) => {
    reqInfo(req)
    try {
        let file = req.file
        let imageUrl = config.BACKEND_URL + `/images/${file.filename}`;
        return res.status(200).json(new apiResponse(200, responseMessage.addDataSuccess("Image"), imageUrl, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
})


export const uploadRoutes = router