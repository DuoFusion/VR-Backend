import { Request, Response } from "express";
import { workshopModel } from "../../database/models/workshop";
import { workshopRegisterModel } from "../../database/models/workshopRegister";
import { courseModel } from "../../database/models/courses";
import { courseRegisterModel } from "../../database/models/courseRegister";
import { testimonialModel } from "../../database/models/testomonial.js";
import { faqModel } from "../../database/models/faq";
import { userModel } from "../../database";
import { languageModel } from "../../database/models/language";
import { aboutModel } from "../../database/models/about";
import { newsLetterModel } from "../../database/models/newsletter";
import { contactUsModel } from "../../database/models/contactUs";
import { apiResponse } from "../../common";
import { responseMessage } from "../../helper";
// import { workshopModel } from "../../database/models/workshop.js";
// import { courseModel } from "../../database/models/courses.js";
// import { courseRegisterModel } from "../../database/models/courseRegister.js";
// import { workshopRegisterModel } from "../../database/models/workshopRegister.js";
// Optional models – uncomment if you have them
// import { testimonialModel } from "../../database/models/testimonial.js";
// import { faqModel } from "../../database/models/faq.js";
// import { userModel } from "../../database/models/user.js";
// import { languageModel } from "../../database/models/language.js";
// import { aboutModel } from "../../database/models/about.js";
// import { newsletterModel } from "../../database/models/newsletter.js";
// import { contactModel } from "../../database/models/contact.js";

// import { apiResponse } from "../../common/index.js";
// import { responseMessage } from "../../helper/response.js";

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
      abouts,
      newsletters,
      contacts,
      coursePayments,
      workshopPayments,
    ] = await Promise.all([
      workshopModel.countDocuments({}),
      workshopRegisterModel.countDocuments({}),
      courseModel.countDocuments({}),
      courseRegisterModel.countDocuments({}),
      testimonialModel.countDocuments({}),
      faqModel.countDocuments({}),
      userModel.countDocuments({}),
      languageModel.countDocuments({}),
      aboutModel.countDocuments({}),
      newsLetterModel.countDocuments({}),
      contactUsModel.countDocuments({}),
      courseRegisterModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      workshopRegisterModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    // Ratios
    const totalRegisters = courseRegisters + workshopRegisters || 1;
    // const ratios = {
    //   courseRegisterRatio: (courseRegisters / totalRegisters) * 100,
    //   workshopRegisterRatio: (workshopRegisters / totalRegisters) * 100,
    // };

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
            abouts,
            newsletters,
            contacts,
          },
        //   ratios,
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
