import { sendWhatsAppMessage } from "./watiService";

export const sendMessageCommon = async (model, studentIds, message) => {
    if (!studentIds || !message) {
        throw new Error("studentIds & message required");
    }

    const students = await model.find({ _id: { $in: studentIds }, isDeleted: false });
    if (!students.length) {
        throw new Error("No students found");
    }

    const results: any[] = [];
    for (const student of students) {
        try {
            const resp = await sendWhatsAppMessage(
                student.whatsAppNumber,
                `Hi ${student.name}, ${message}`
            );
            results.push({ student: student.name, response: resp });
        } catch (err: any) {
            results.push({ student: student.name, error: err.message });
        }
    }
    return results;
};
