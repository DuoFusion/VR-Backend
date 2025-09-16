
import { courseRegisterModel } from "../../database/models/courseRegister";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { sendWhatsAppMessage } from "../../services/watiService";

// 🔥 આ function course/workshop purchase કરનારાને જ message મોકલશે
export const sendMessageToPurchasers = async (req, res) => {
    try {
        const { type, id, message } = req.body;
        // type = "course" or "workshop"
        // id   = courseId / workshopId
        // message = text to send

        if (!type || !id || !message) {
            return res.status(400).json({ error: "type, id & message required" });
        }

        let purchasers: any[] = [];

        if (type === "course") {
            purchasers = await courseRegisterModel.find({ courseId: id, isDeleted: false });
        } else if (type === "workshop") {
             purchasers = await workshopRegisterModel.find({ workshopId: id, isDeleted: false });
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }

        if (!purchasers.length) {
            return res.status(404).json({ error: `No students purchased this ${type}` });
        }

        const results: any[] = [];

        for (const student of purchasers) {
            if (!student.whatsAppNumber) continue; // skip if no number

            const resp = await sendWhatsAppMessage(
                student.whatsAppNumber,
                `Hi ${student.name}, ${message}`
            );

            results.push({
                name: student.name,
                number: student.whatsAppNumber,
                response: resp
            });
        }

        return res.json({ success: true, results });

    } catch (err: any) {
        console.error("Error sending messages:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
