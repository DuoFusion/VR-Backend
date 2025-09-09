// import { apiResponse } from "../../common";
// import { courseRegisterModel } from "../../database/models/courseRegister";
// import { workshopRegisterModel } from "../../database/models/workshopRegister";
// import { reqInfo, responseMessage } from "../../helper";
// import { findAllWithPopulate } from "../../helper/database_service";

// export const getUserRegistrations = async (req, res) => {
//     try {
//         let { page, limit, blockFilter } = req.query;
//         const criteria: any = { isDeleted: false };

//         if (blockFilter) criteria.isBlocked = blockFilter;

//         // pagination
//         const pageNum = parseInt(page as string) || 1;
//         const limitNum = parseInt(limit as string) || 10;

       
//         // --- GET COURSE REGISTRATIONS ---
//         const courseRegs = await findAllWithPopulate(
//             courseRegisterModel,
//             criteria,
//             {},
//             {},
//             [{ path: "courseId", select: "title subtitle shortDescription duration price" },
//        ]
//       );

//         // --- GET WORKSHOP REGISTRATIONS ---
//         const workshopRegs = await findAllWithPopulate(
//             workshopRegisterModel,
//             criteria,
//             {},
//             {},
//             [ { path: "workshopId", select: "title shortDescription date time duration instructorName price" }
//         ]);

//         // --- MERGE USER WISE USING EMAIL/PHONE ---
//         let userMap: any = {};

//         const getKey = (reg: any) => {
//             return reg.email || reg.phoneNumber; // unique key for user
//         };

//         courseRegs.forEach((reg: any) => {
//             const key = getKey(reg);
//             if (!key) return;

//             if (!userMap[key]) {
//                 userMap[key] = {
//                     user: {
//                         name: reg.name,
//                         email: reg.email,
//                         phoneNumber: reg.phoneNumber
//                     },
//                     courses: [],
//                     workshops: []
//                 };
//             }
//             userMap[key].courses.push(reg.courseId);
//         });

//         workshopRegs.forEach((reg: any) => {
//             const key = getKey(reg);
//             if (!key) return;

//             if (!userMap[key]) {
//                 userMap[key] = {
//                     user: {
//                         name: reg.name,
//                         email: reg.email,
//                         phoneNumber: reg.phoneNumber
//                     },
//                     courses: [],
//                     workshops: []
//                 };
//             }
//             userMap[key].workshops.push(reg.workshopId);
//         });

//         const finalData = Object.values(userMap);

//         return res.status(200).json(
//             new apiResponse(
//                 200,
//                 responseMessage.getDataSuccess("User Registrations"),
//                 {
//                     users: finalData,
//                     totalData: finalData.length,
//                     page: pageNum,
//                     limit: limitNum
//                 },
//                 {}
//             )
//         );
//     } catch (error: any) {
//         console.log("❌ getUserRegistrations error:", error);
//         return res.status(500).json(
//             new apiResponse(500, responseMessage.internalServerError, {}, error)
//         );
//     }
// };


import { apiResponse } from "../../common";
import { courseRegisterModel } from "../../database/models/courseRegister";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { reqInfo, responseMessage } from "../../helper";
import { findAllWithPopulate } from "../../helper/database_service";

export const getUserRegistrations = async (req, res) => {
    try {
        let { page, limit, blockFilter } = req.query;
        const criteria: any = { isDeleted: false };

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
                    name: reg.name,
                    email: reg.email,
                    phoneNumber: reg.phoneNumber,
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
                    name: reg.name,
                    email: reg.email,
                    phoneNumber: reg.phoneNumber,
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
};
