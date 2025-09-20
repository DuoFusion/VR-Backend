import express from 'express'
import { getUserRegistrations } from '../controllers/userRegistration'
import { findAllWithPopulate } from '../helper/database_service';
import { courseRegisterModel } from '../database/models/courseRegister';
import { workshopRegisterModel } from '../database/models/workshopRegister';
import { apiResponse, COURSE_REGISTER_PAYMENT_STATUS, WORKSHOP_REGISTER_PAYMENT_STATUS } from '../common';
import { reqInfo, responseMessage } from '../helper';
import { sendWhatsAppMessage } from '../services/watiService';
import { userModel } from '../database';

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let { search , page, limit, blockFilter } = req.query;
        const criteria: any = { isDeleted: false };
        
        if(search) criteria.name = { $regex: search, $options: 'si' };
        if (blockFilter) criteria.isBlocked = blockFilter;

        // pagination
        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;

        // --- GET COURSE REGISTRATIONS ---
        const courseRegs = await findAllWithPopulate(
            courseRegisterModel,
            criteria,
            {},
            {},
            [
                {
                    path: "courseId",
                    select: "title subtitle shortDescription duration price"
                }
            ]
        );

        // --- GET WORKSHOP REGISTRATIONS ---
        const workshopRegs = await findAllWithPopulate(
            workshopRegisterModel,
            criteria,
            {},
            {},
            [
                {
                    path: "workshopId",
                    select: "title shortDescription date time duration instructorName price"
                }
            ]
        );

        // --- MERGE USER WISE USING EMAIL/PHONE ---
        let userMap: any = {};

        const getKey = (reg: any) => {
            return reg.email || reg.phoneNumber; // unique key for user
        };

        // --- COURSES ---
        courseRegs.forEach((reg: any) => {
            const key = getKey(reg);
            if (!key) return;

            if (!userMap[key]) {
                userMap[key] = {
                    id: reg._id,
                    name: reg.name,
                    email: reg.email,
                    whatsAppNumber: reg.whatsAppNumber,
                    courses: [],
                    workshops: []
                };
            }

            userMap[key].courses.push({
                registrationId: reg._id,
                registeredAt: reg.createdAt,
                ...(reg.courseId?._doc || reg.courseId)
            });
        });

        // --- WORKSHOPS ---
        workshopRegs.forEach((reg: any) => {
            const key = getKey(reg);
            if (!key) return;

            if (!userMap[key]) {
                userMap[key] = {
                    id: reg._id,
                    name: reg.name,
                    email: reg.email,
                    whatsAppNumber: reg.whatsAppNumber,
                    courses: [],
                    workshops: []
                };
            }

            userMap[key].workshops.push({
                registrationId: reg._id,
                registeredAt: reg.createdAt,
                ...(reg.workshopId?._doc || reg.workshopId)
            });
        });

        const finalData = Object.values(userMap);

        return res.status(200).json(
            new apiResponse(
                200,
                responseMessage.getDataSuccess("User Registrations"),
                {
                    users: finalData,
                    totalData: finalData.length,
                    page: pageNum,
                    limit: limitNum
                },
                {}
            )
        );
    } catch (error: any) {
        console.log("❌ getUserRegistrations error:", error);
        return res.status(500).json(
            new apiResponse(500, responseMessage.internalServerError, {}, error)
        );
    }
})

router.post('/send-message', async (req, res) => {
    reqInfo(req);
    try {
        const { studentIds, message, imageUrl } = req.body;
        console.log("studentIds", studentIds, "message", message, "imageUrl", imageUrl);


        if (studentIds.length === 0) {
            const courseRegs = await courseRegisterModel.find({  paymentStatus: COURSE_REGISTER_PAYMENT_STATUS.SUCCESS, isDeleted: false }, "name whatsAppNumber");
            const workshopRegs = await workshopRegisterModel.find({ paymentStatus: WORKSHOP_REGISTER_PAYMENT_STATUS.SUCCESS, isDeleted: false }, "name whatsAppNumber");
            const students = [...courseRegs, ...workshopRegs];
            for(let student of students) {
                const results: any[] = [];
                try {
                    const resp = await sendWhatsAppMessage(
                        student.whatsAppNumber,
                        `Hi ${student.name},\n ${message}`,
                        imageUrl
                    );
                    if(resp.result === false || resp.ok === true) continue
                    results.push({ student: student.name, response: resp });
                    return res.status(200).json(new apiResponse(200, responseMessage.sendMessage('User'), results, {}));
                } catch (err: any) {
                    console.log("err", err);
                }
            }
        }

        // find users from course + workshop register
        const courseRegs = await courseRegisterModel.find({ _id: { $in: studentIds }, isDeleted: false }, "name whatsAppNumber");
        const workshopRegs = await workshopRegisterModel.find({ _id: { $in: studentIds }, isDeleted: false }, "name whatsAppNumber");

        const students = [...courseRegs, ...workshopRegs];

        // if (!students.length) {
        //     return res.status(404).json({ error: "No students found" });
        // }

        const results: any[] = [];
        for (const student of students) {
            // try {
                const resp = await sendWhatsAppMessage(
                    student.whatsAppNumber,
                    `Hi ${student.name}, ${message}`,
                    imageUrl
                );
                 if(resp.result === false) continue
                results.push({ student: student.name, response: resp });
            // } catch (err: any) {
            //     results.push({ student: student.name, error: err.message });
            // }
        }

        return res.status(200).json(
            new apiResponse(200, responseMessage.sendMessage('User'), results, {})
        );
    } catch (error) {
        console.log("❌ send-message error:", error);
        return res
            .status(500)
            .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
})

// router.post('/sendMessageToAllStudents', async (req, res) => {
//     try {
//         const { message, imageUrl } = req.body;
//         if (!message && !imageUrl) {
//             return res.status(400).json({ error: "message or imageUrl required" });
//         }

//         const courseStudents = await courseRegisterModel.find({ isDeleted: false }, "name whatsAppNumber");
//         const workshopStudents = await workshopRegisterModel.find({ isDeleted: false }, "name whatsAppNumber");
//         const students = [...courseStudents, ...workshopStudents];

//         if (!students.length) {
//             return res.status(404).json({ error: "No registered students found" });
//         }

//         const results: any[] = [];
//         for (const student of students) {
//             if (!student.whatsAppNumber) continue;
//             try {
//                 const content = message ? `Hi ${student.name}, ${message}` : `Hi ${student.name}`;
//                 const resp = await sendWhatsAppMessage(
//                     student.whatsAppNumber,
//                     content,
//                     imageUrl
//                 );
//                 results.push({ name: student.name, number: student.whatsAppNumber, response: resp });
//             } catch (err: any) {
//                 results.push({ name: student.name, number: student.whatsAppNumber, error: err?.message || String(err) });
//             }
//         }

//         return res.json({ success: true, count: results.length, results });
//     } catch (err: any) {
//         console.error("Error sending messages to all students:", err);
//         return res.status(500).json({ success: false, error: err.message });
//     }
// });

export const userRegistrationRoutes = router