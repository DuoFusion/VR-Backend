import { Request, Response } from "express";
import { workshopModel } from "../../database/models/workshop";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { courseModel } from "../../database/models/courses";
import { courseRegisterModel } from "../../database/models/courseRegister";
import { testimonialModel } from "../../database/models/testomonial";
import { faqModel } from "../../database/models/faq";
import { userModel } from "../../database";
import { languageModel } from "../../database/models/language";
import { aboutModel } from "../../database/models/about";
import { newsLetterModel } from "../../database/models/newsletter";
import { contactUsModel } from "../../database/models/contactUs";
import { blogModel } from "../../database/models/blog";
// import { achievementModel } from "../../database/models/achievement"; // ✅ New Import
import { apiResponse } from "../../common";
import { responseMessage } from "../../helper";
import { achievementModel } from "../../database/models/achievements";

export const getDashboard = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [
      workshops,
      workshopRegisters,
      courses,
      courseRegisters,
      testimonials,
      faqs,
      users,
      languages,
      blogs,
      newsletters,
      contacts,
      achievements,
      coursePayments,
      workshopPayments,
    ] = await Promise.all([
      workshopModel.countDocuments({ isDeleted: false }),
      workshopRegisterModel.countDocuments({ isDeleted: false }),
      courseModel.countDocuments({ isDeleted: false }),
      courseRegisterModel.countDocuments({ isDeleted: false }),
      testimonialModel.countDocuments({ isDeleted: false }),
      faqModel.countDocuments({ isDeleted: false }),
      userModel.countDocuments({ isDeleted: false }),
      languageModel.countDocuments({ isDeleted: false }),
      blogModel.countDocuments({ isDeleted: false }),
      newsLetterModel.countDocuments({ isDeleted: false }),
      contactUsModel.countDocuments({ isDeleted: false }),
      achievementModel.countDocuments({ isDeleted: false }), // ✅ Achievements
      courseRegisterModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$fees" } } },
      ]),
      workshopRegisterModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$fees" } } },
      ]),
    ]);

    // Payments
    const totalCoursePayments: number = coursePayments[0]?.total || 0;
    const totalWorkshopPayments: number = workshopPayments[0]?.total || 0;
    const grandTotalPayment: number = totalCoursePayments + totalWorkshopPayments;

    return res.status(200).json(
      new apiResponse(
        200,
        responseMessage?.getDataSuccess("dashboard"),
        {
          counts: {
            workshops,
            workshopRegisters,
            courses,
            courseRegisters,
            testimonials,
            faqs,
            users,
            languages,
            blogs,
            newsletters,
            contacts,
            achievements, // ✅ Added
          },
          payments: {
            totalCoursePayments,
            totalWorkshopPayments,
            grandTotalPayment,
          },
        },
        {}
      )
    );
  } catch (error: any) {
    console.error("Dashboard Error:", error);
    return res.status(500).json(
      new apiResponse(
        500,
        responseMessage?.internalServerError,
        {},
        error.message || error
      )
    );
  }
};
