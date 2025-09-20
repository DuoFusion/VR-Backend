
import { courseRegisterModel } from "../../database/models/courseRegister";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { sendWhatsAppMessage } from "../../services/watiService";

// 🔥 આ function course/workshop purchase કરનારાને જ message મોકલશે
export const sendMessageToPurchasers = async (req, res) => {
    try {
        const { type, id, message, imageUrl } = req.body;
        // type = "course" or "workshop"
        // id   = courseId / workshopId
        // message = text to send

        if (!type || !id || (!message && !imageUrl)) {
            return res.status(400).json({ error: "type, id and (message or imageUrl) required" });
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

            const content = message ? `Hi ${student.name}, ${message}` : `Hi ${student.name}`;
            const resp = await sendWhatsAppMessage(
                student.whatsAppNumber,
                content,
                imageUrl
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

// Send WhatsApp message to ALL workshop-registered students
export const sendMessageToAllWorkshopStudents = async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        if (!message && !imageUrl) {
            return res.status(400).json({ error: "message or imageUrl required" });
        }

        const students = await workshopRegisterModel.find({ isDeleted: false }, "name whatsAppNumber");
        if (!students.length) {
            return res.status(404).json({ error: "No workshop-registered students found" });
        }

        const results = [] as any[];
        for (const student of students) {
            if (!student.whatsAppNumber) continue;
            try {
                const content = message ? `Hi ${student.name}, ${message}` : `Hi ${student.name}`;
                const resp = await sendWhatsAppMessage(
                    student.whatsAppNumber,
                    content,
                    imageUrl
                );
                results.push({ name: student.name, number: student.whatsAppNumber, response: resp });
            } catch (err: any) {
                results.push({ name: student.name, number: student.whatsAppNumber, error: err?.message || String(err) });
            }
        }

        return res.json({ success: true, count: results.length, results });
    } catch (err: any) {
        console.error("Error sending messages to all workshop students:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Send WhatsApp message to ALL course AND workshop registered students
export const sendMessageToAllStudents = async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        if (!message) {
            return res.status(400).json({ error: "message required" });
        }

        const courseStudents = await courseRegisterModel.find({ isDeleted: false }, "name whatsAppNumber");
        const workshopStudents = await workshopRegisterModel.find({ isDeleted: false }, "name whatsAppNumber");
        const students = [...courseStudents, ...workshopStudents];

        if (!students.length) {
            return res.status(404).json({ error: "No registered students found" });
        }

        const results: any[] = [];
        for (const student of students) {
            if (!student.whatsAppNumber) continue;
            try {
                const content = message ? `Hi ${student.name}, ${message}` : `Hi ${student.name}`;
                const resp = await sendWhatsAppMessage(
                    student.whatsAppNumber,
                    content,
                    imageUrl
                );
                results.push({ name: student.name, number: student.whatsAppNumber, response: resp });
            } catch (err: any) {
                results.push({ name: student.name, number: student.whatsAppNumber, error: err?.message || String(err) });
            }
        }

        return res.json({ success: true, count: results.length, results });
    } catch (err: any) {
        console.error("Error sending messages to all students:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};