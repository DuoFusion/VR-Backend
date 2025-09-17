import { apiResponse } from "../../common";
import { reqInfo, responseMessage } from "../../helper";
import { send_dynamic_mail, DynamicMailPayload } from "../../helper/mail";

export const sendDynamicMail = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body as DynamicMailPayload & { subject?: string };

        if (!body || !Array.isArray(body.to) || body.to.length === 0 || !body.subject || (!body.message && !body.text)) {
            return res.status(400).json(new apiResponse(400, "to[] (non-empty array), subject and html or text are required", {}, {}));
        }

        const result: any = await send_dynamic_mail({ ...body, useTest: body.useTest === true });
        return res.status(200).json(new apiResponse(200, responseMessage?.sendMessage("Mail"), { ok: true, previewUrl: result?.previewUrl, transportMode: result?.transportMode, from: result?.from }, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}


