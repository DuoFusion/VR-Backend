import { apiResponse } from "../../common";
import { reqInfo, responseMessage } from "../../helper";
import { send_dynamic_mail, DynamicMailPayload } from "../../helper/mail";
import { newsLetterModel } from "../../database/models/newsletter";
import { userModel } from "../../database/models/user";

export const sendDynamicMail = async (req, res) => {
    reqInfo(req);
    try {
        const body = req.body as DynamicMailPayload & { subject?: string, audience?: 'newsletter'|'users'|'course'|'workshop' };

        if (!body || !body.subject || (!body.html && !body.message && !body.text)) {
            return res.status(400).json(new apiResponse(400, "subject and html/message or text are required", {}, {}));
        }

        let recipients: string[] = Array.isArray(body.to) ? body.to.filter(Boolean) : [];

        if (recipients.length === 0) {
            const audience = body.audience || 'newsletter';
            if (audience === 'newsletter') {
                const subs = await newsLetterModel.find({ isDeleted: false, archive: false }).select('email').lean();
                recipients = subs.map((s: any) => s.email).filter(Boolean);
            } else if (audience === 'users') {
                const users = await userModel.find({ isDeleted: false }).select('email').lean();
                recipients = users.map((u: any) => u.email).filter(Boolean);
            } else {
                return res.status(400).json(new apiResponse(400, "Audience not supported. Use newsletter|users or provide to[]", {}, {}));
            }
        }

        if (!recipients.length) {
            return res.status(404).json(new apiResponse(404, "No recipients found", {}, {}));
        }

        const result: any = await send_dynamic_mail({ ...body, to: recipients, useTest: body.useTest === true });
        return res.status(200).json(new apiResponse(200, responseMessage?.sendMessage("Mail"), { ok: true, count: recipients.length, previewUrl: result?.previewUrl, transportMode: result?.transportMode, from: result?.from }, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}


