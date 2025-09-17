// import { apiResponse } from "../../common";
// import { reqInfo, responseMessage } from "../../helper";
// import { send_dynamic_mail, DynamicMailPayload } from "../../helper/mail";

import { apiResponse } from "../common";
import { reqInfo, responseMessage } from "../helper";
import { DynamicMailPayload, send_dynamic_mail } from "../helper/mail";

export const sendDynamicMail = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body as DynamicMailPayload & { subject?: string };

        if (!body || !body.to || !body.subject || (!body.html && !body.text)) {
            return res.status(400).json(new apiResponse(400, "to, subject and html or text are required", {}, {}));
        }

        await send_dynamic_mail(body);
        return res.status(200).json(new apiResponse(200, responseMessage?.sendMessage("Mail"), { ok: true }, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// export * as userController from './user/index'
export * as authController from "./auth"