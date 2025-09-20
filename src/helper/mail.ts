// // "use strict"

// // import AWS from 'aws-sdk'
// // import nodemailer from 'nodemailer';
// // import { config } from '../../config';


// // const ses = new AWS.SES()

// // const mail: any = config.MAIL;
// // // const option: any = {
// // //     service: "gmail",
// // //     host: "smtp.gmail.com",
// // //     port: 587,
// // //     requireTLS: true,
// // //     secure: false,
// // //     auth: {
// // //         user: mail.MAIL,
// // //         pass: mail.PASSWORD,
// // //     },
// // // }
// // const option: any = {
// //     service: "gmail",
// //     host: 'smtp.gmail.com',
// //     port: 465,
// //     tls: {
// //         //     enable: true,
// //         rejectUnauthorized: false
// //     },
// //     // requireTLS: true,
// //     // secure: false,
// //     auth: {
// //         user: mail.MAIL,
// //         pass: mail.PASSWORD,
// //     },
// // }
// // const transPorter = nodemailer.createTransport(option)
// // // const params = {

// // // export const forgot_password_mail = async (user: any, otp: any) => {
// // //     return new Promise(async (resolve, reject) => {
// // //         var params = {
// // //             Destination: {
// // //                 ToAddresses: [user.email]
// // //             },
// // //             Message: {
// // //                 Body: {
// // //                     Html: {
// // //                         Charset: "UTF-8",
// // //                         Data: `<html lang="en-US">

// // //                         <head>
// // //                             <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
// // //                             <title>Forgot password</title>
// // //                             <meta name="description" content="Forgot password.">
// // //                             <style type="text/css">
// // //                                 a:hover {
// // //                                     text-decoration: underline !important;
// // //                                 }
// // //                             </style>
// // //                         </head>
                        
// // //                         <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
// // //                             <!--100% body table-->
// // //                             <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
// // //                                 style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
// // //                                 <tr>
// // //                                     <td>
// // //                                         <table style="background-color: #f2f3f8; max-width:700px;  margin:0 auto;" width="100%" border="0"
// // //                                             align="center" cellpadding="0" cellspacing="0">
// // //                                             <tr>
// // //                                                 <td style="height:80px;">&nbsp;</td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="text-align:center;">
// // //                                                     <h1
// // //                                                         style="color:#F43939; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
// // //                                                         SquadCard</h1>
// // //                                                 </td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="height:20px;">&nbsp;</td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td>
// // //                                                     <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
// // //                                                         style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
// // //                                                         <tr>
// // //                                                             <td style="height:40px;">&nbsp;</td>
// // //                                                         </tr>
// // //                                                         <tr>
// // //                                                             <td style="padding:0 35px;">
// // //                                                                 <h1
// // //                                                                     style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
// // //                                                                     Forgot password</h1>
// // //                                                                 <span
// // //                                                                     style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
// // //                                                                 <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
// // //                                                                     Hi ${user.firstName}
// // //                                                                     <br>
// // //                                                                     Someone, hopefully you, has requested to reset the password for your
// // //                                                                     SquadCard account.
// // //                                                                     <br>
// // //                                                                     OTP will expire in 10 minutes.
// // //                                                                     <br>
// // //                                                                     Verification code: ${otp}
// // //                                                                     <br>
// // //                                                                     <br>
// // //                                                                     The SquadCard Team
// // //                                                                 </p>
                        
// // //                                                             </td>
// // //                                                         </tr>
// // //                                                         <tr>
// // //                                                             <td style="height:40px;">&nbsp;</td>
// // //                                                         </tr>
// // //                                                     </table>
// // //                                                 </td>
// // //                                             <tr>
// // //                                                 <td style="height:20px;">&nbsp;</td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="text-align:center;">
// // //                                                     <strong></strong></p>
// // //                                                 </td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="height:80px;">&nbsp;</td>
// // //                                             </tr>
// // //                                         </table>
// // //                                     </td>
// // //                                 </tr>
// // //                             </table>
// // //                             <!--/100% body table-->
// // //                         </body>
                        
// // //                         </html>
// // //                          `
// // //                     }
// // //                 },
// // //                 Subject: {
// // //                     Charset: "UTF-8",
// // //                     Data: "Forgot password"
// // //                 }
// // //             },
// // //             ReplyToAddresses: [config.AWS_REPLY_ADDRESS],
// // //             Source: config.AWS_MAIL,
// // //         };
// // //         await ses.sendEmail(params, function (err, data) {
// // //             if (err) {
// // //                 reject(err); // an error occurred
// // //             }
// // //             else {
// // //                 resolve(`Email has been sent to ${user.email}, kindly follow the instructions`);
// // //             }      // successful response
// // //         });
// // //     })
// // // }

// // export const email_verification_mail = async (user: any, otp: any) => {
// //     return new Promise(async (resolve, reject) => {
// //         try {
// //             const mailOptions = {
// //                 from: mail.MAIL, // sender address
// //                 to: user.email, // list of receivers
// //                 subject: "Email verification",
// //                 html: `<html lang="en-US">
    
// //                 <head>
// //                     <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
// //                     <title>Email Verification</title>
// //                     <meta name="description" content="Email Verification.">
// //                     <style type="text/css">
// //                         a:hover {
// //                             text-decoration: underline !important;
// //                         }
// //                     </style>
// //                 </head>
    
// //                 <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
// //                     <!--100% body table-->
// //                     <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
// //                         style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
// //                         <tr>
// //                             <td>
// //                                 <table style="background-color: #f2f3f8; max-width:700px;  margin:0 auto;" width="100%" border="0"
// //                                     align="center" cellpadding="0" cellspacing="0">
// //                                     <tr>
// //                                         <td style="height:80px;">&nbsp;</td>
// //                                     </tr>
// //                                     <tr>
// //                                         <td style="text-align:center;">
// //                                             <h1
// //                                                 style="color:#F43939; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
// //                                                 Zazzi App</h1>
// //                                         </td>
// //                                     </tr>
// //                                     <tr>
// //                                         <td style="height:20px;">&nbsp;</td>
// //                                     </tr>
// //                                     <tr>
// //                                         <td>
// //                                             <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
// //                                                 style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
// //                                                 <tr>
// //                                                     <td style="height:40px;">&nbsp;</td>
// //                                                 </tr>
// //                                                 <tr>
// //                                                     <td style="padding:0 35px;">
// //                                                         <h1
// //                                                             style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
// //                                                             Email Verification</h1>
// //                                                         <span
// //                                                             style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
// //                                                         <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
// //                                                             Hi ${(user.firstName != null ? user.firstName : 'dear')} ${(user.lastName != null ? user.lastName : '')}, 
// //                                                             <br>
// //                                                             Someone, hopefully you, has requested to new account in Zazzi app
// //                                                             <br>
// //                                                             OTP will expire in 10 minutes.
// //                                                             <br>
// //                                                             Verification code: ${otp}
// //                                                             <br>
// //                                                             <br>
// //                                                             The Zazzi App Team
// //                                                         </p>
    
// //                                                     </td>
// //                                                 </tr>
// //                                                 <tr>
// //                                                     <td style="height:40px;">&nbsp;</td>
// //                                                 </tr>
// //                                             </table>
// //                                         </td>
// //                                     <tr>
// //                                         <td style="height:20px;">&nbsp;</td>
// //                                     </tr>
// //                                     <tr>
// //                                         <td style="text-align:center;">
// //                                             <strong></strong></p>
// //                                         </td>
// //                                     </tr>
// //                                     <tr>
// //                                         <td style="height:80px;">&nbsp;</td>
// //                                     </tr>
// //                                 </table>
// //                             </td>
// //                         </tr>
// //                     </table>
// //                     <!--/100% body table-->
// //                 </body>
    
// //                 </html>`, // html body
// //             };
// //             await transPorter.sendMail(mailOptions, function (err, data) {
// //                 if (err) {
// //                     console.log(err)
// //                     reject(err)
// //                 } else {
// //                     resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
// //                 }
// //             })
// //         } catch (error) {
// //             console.log(error)
// //             reject(error)
// //         }
// //     });
// // }
// // // export const send_squadCard_mail = async (user: any) => {
// // //     return new Promise(async (resolve, reject) => {
// // //         var params = {
// // //             Destination: {
// // //                 ToAddresses: [user.recipientEmail]
// // //             },
// // //             Message: {
// // //                 Body: {
// // //                     Html: {
// // //                         Charset: "UTF-8",
// // //                         Data: `<html lang="en-US">

// // //                         <head>
// // //                             <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
// // //                             <title>SquadCard</title>
// // //                             <meta name="description" content="SquadCard.">
// // //                             <style type="text/css">
// // //                                 a:hover {
// // //                                     text-decoration: underline !important;
// // //                                 }
// // //                             </style>
// // //                         </head>
                        
// // //                         <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
// // //                             <!--100% body table-->
// // //                             <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
// // //                                 style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
// // //                                 <tr>
// // //                                     <td>
// // //                                         <table style="background-color: #f2f3f8; max-width:700px;  margin:0 auto;" width="100%" border="0"
// // //                                             align="center" cellpadding="0" cellspacing="0">
// // //                                             <tr>
// // //                                                 <td style="height:80px;">&nbsp;</td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="text-align:center;">
// // //                                                     <h1
// // //                                                         style="color:#F43939; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
// // //                                                         SquadCard</h1>
// // //                                                 </td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="height:20px;">&nbsp;</td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td>
// // //                                                     <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
// // //                                                         style="max-width:670px;background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
// // //                                                         <tr>
// // //                                                             <td style="height:40px;">&nbsp;</td>
// // //                                                         </tr>
// // //                                                         <tr>
// // //                                                             <td style="padding:0 35px;">
// // //                                                                 <h1
// // //                                                                     style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
// // //                                                                     SquadCard</h1>
// // //                                                                 <span
// // //                                                                     style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
// // //                                                                 <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
// // //                                                                     Hey ${user.recipientName},
// // //                                                                     <br>
// // //                                                                     <br>
// // //                                                                     Use this link to open SquadCard
// // //                                                                     <br>
// // //                                                                     This SquadCard has been sent by ${user.senderOrTeamName} - here it is!
// // //                                                                     <br>
// // //                                                                     <br>
// // //                                                                     <p style="text-align: center; width:100%;">
// // //                                                                     <a style="padding: 8px 15px; background-color: #09D1AA; list-style: none; color: #fff; text-decoration: none; border-radius: 5px;"
// // //                                                                         href=${user.url} title="logo" target="_blank">
// // //                                                                         Open SquadCard
// // // 															        </a>
// // //                                                                     </p>
// // //                                                                     <br>
// // //                                                                     If the above link doesn't work for you, here it is again - simply copy and paste it into your browser.
// // //                                                                     <br>
// // //                                                                     <strong>${user.url}</strong>
// // //                                                                     <br>
// // //                                                                     <br>
// // //                                                                     Enjoy!
// // //                                                                     <br>
// // //                                                                     <br>
// // //                                                                     Your friends at SquadCard
// // //                                                                 </p>
                        
// // //                                                             </td>
// // //                                                         </tr>
// // //                                                         <tr>
// // //                                                             <td style="height:40px;">&nbsp;</td>
// // //                                                         </tr>
// // //                                                     </table>
// // //                                                 </td>
// // //                                             <tr>
// // //                                                 <td style="height:20px;">&nbsp;</td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="text-align:center;">
// // //                                                     <strong></strong></p>
// // //                                                 </td>
// // //                                             </tr>
// // //                                             <tr>
// // //                                                 <td style="height:80px;">&nbsp;</td>
// // //                                             </tr>
// // //                                         </table>
// // //                                     </td>
// // //                                 </tr>
// // //                             </table>
// // //                             <!--/100% body table-->
// // //                         </body>
                        
// // //                         </html>
// // //                          `
// // //                     }
// // //                 },
// // //                 Subject: {
// // //                     Charset: "UTF-8",
// // //                     Data: "SquadCard"
// // //                 }
// // //             },
// // //             ReplyToAddresses: [config.AWS_REPLY_ADDRESS],
// // //             Source: config.AWS_MAIL,
// // //         };
// // //         await ses.sendEmail(params, function (err, data) {
// // //             if (err) {
// // //                 reject(err) // an error occurred
// // //             }
// // //             else {
// // //                 resolve(`Email has been sent to ${user.recipientEmail}, kindly follow the instructions`)
// // //             }      // successful response
// // //         });
// // //     })
// // // }

// // // export const admin_action_bulk_email = async (templateName: any, userArray: any, reason?: any, message?: any) => {
// // //     return new Promise(async (resolve, reject) => {
// // //         let destinationArray: any = []
// // //         await userArray.map(user => {
// // //             destinationArray.push({
// // //                 Destination: { ToAddresses: [user?.email] },
// // //                 ReplacementTemplateData: `{ \"fullName\":\"${user?.fullName}\", \"reason\":\"${reason}\", \"message\":\"${message}\"}`
// // //             })
// // //         })
// // //         var params = {
// // //             Destinations: destinationArray,
// // //             Source: config.AWS_MAIL,
// // //             Template: templateName,
// // //             DefaultTemplateData: '{ \"Mukund\":\"Mukund Khunt G.\" }',
// // //             ReplyToAddresses: [config.AWS_REPLY_ADDRESS]
// // //         };
// // //         await ses.sendBulkTemplatedEmail(params, function (err, data) {
// // //             if (err) {
// // //                 reject(err); // an error occurred
// // //             }
// // //             else {
// // //                 resolve(`Bulk email successfully sent`)
// // //             }      // successful response
// // //         });
// // //     })
// // // }

// // // export const admin_sent_all_user_mail = async (templateName: any, userArray: any, subject?: any, message?: any) => {
// // //     return new Promise(async (resolve, reject) => {
// // //         let destinationArray: any = []
// // //         await userArray.map(user => {
// // //             destinationArray.push({
// // //                 Destination: { ToAddresses: [user?.email] },
// // //                 ReplacementTemplateData: `{ \"subject\":\"${subject}\", \"message\":\"${message}\" }`
// // //             })
// // //         })
// // //         var params = {
// // //             Destinations: destinationArray,
// // //             Source: config.AWS_MAIL,
// // //             Template: templateName,
// // //             DefaultTemplateData: '{ \"Mukund\":\"Mukund Khunt G.\" }',
// // //             ReplyToAddresses: [config.AWS_REPLY_ADDRESS]
// // //         };
// // //         await ses.sendBulkTemplatedEmail(params, function (err, data) {
// // //             if (err) {
// // //                 reject(err); // an error occurred
// // //             }
// // //             else {
// // //                 resolve(`Bulk all user email successfully sent`)
// // //             }      // successful response
// // //         });
// // //     })
// // // }


// "use strict";

// import nodemailer from "nodemailer";
// import { config } from "../../config";
// import { transporter as sharedTransporter } from "../../config/mailer";
// import { adminSettingModel } from "../database/models/adminSetting";

// const mail: any = config.MAIL;

// // ✅ Transporter configuration (for Gmail / SMTP)
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for port 465
//     auth: {
//         user: mail.MAIL,     // your email from config
//         pass: mail.PASSWORD, // your email password or app password
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// // ================================
// // 📩 Email Templates
// // ================================

// // 1️⃣ Forgot Password Mail
// export const forgot_password_mail = async (user: any, otp: any) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const mailOptions = {
//                 from: mail.MAIL,
//                 to: user.email,
//                 subject: "Forgot password",
//                 html: `
//                 <h2>Forgot password</h2>
//                 <p>Hi ${user.firstName || "User"},</p>
//                 <p>Someone requested to reset your password.</p>
//                 <p><b>OTP:</b> ${otp}</p>
//                 <p>This OTP will expire in 10 minutes.</p>
//                 <p>The Team</p>
//                 `
//             };
//             await transporter.sendMail(mailOptions, (err, info) => {
//                 if (err) reject(err);
//                 else resolve(`Email has been sent to ${user.email}`);
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

// // 2️⃣ Email Verification Mail
// export const email_verification_mail = async (user: any, otp: any) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const mailOptions = {
//                 from: mail.MAIL,
//                 to: user.email,
//                 subject: "Email verification",
//                 html: `
//                 <h2>Email Verification</h2>
//                 <p>Hi ${user.firstName || "dear"} ${user.lastName || ""},</p>
//                 <p>Welcome! Please verify your email.</p>
//                 <p><b>Verification Code:</b> ${otp}</p>
//                 <p>This code will expire in 10 minutes.</p>
//                 <p>The Zazzi App Team</p>
//                 `
//             };
//             await transporter.sendMail(mailOptions, (err, info) => {
//                 if (err) reject(err);
//                 else resolve(`Email has been sent to ${user.email}`);
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

// // 3️⃣ Generic Newsletter / Bulk Mail
// export const send_bulk_mail = async (emails: string[], subject: string, message: string) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const mailOptions = {
//                 from: mail.MAIL,
//                 bcc: emails, // ✅ use bcc for multiple users
//                 subject: subject,
//                 text:"HK",
//                 html: message
//             };
//             await transporter.sendMail(mailOptions, (err, info) => {
//                 if (err) reject(err);
//                 else resolve(`Newsletter sent to ${emails.length} users`);
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

// // 4️⃣ Single email helper (uses shared transporter from config/mailer)
// // export const send_single_mail = async (
// //     to: string,
// //     subject: string,
// //     html: string
// // ) => {
// //     return new Promise(async (resolve, reject) => {
// //         try {
// //             const mailOptions = {
// //                 from: process.env.MAIL_FROM || process.env.MAIL_USER || config?.MAIL || "palakduofusion@gmail.com",
// //                 to,
// //                 subject,
// //                 html,
// //             } as nodemailer.SendMailOptions;

// //             await sharedTransporter.sendMail(mailOptions, (err, info) => {
// //                 if (err) return reject(err);
// //                 return resolve(`Email sent to ${to}`);
// //             });
// //         } catch (error) {
// //             reject(error);
// //         }
// //     });
// // };

// export const send_single_mail = async (
//   to: string,
//   subject: string,
//   html: string
// ) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // ✅ get settings from DB
//       const setting = await adminSettingModel.findOne().sort({ createdAt: -1 }).lean();
//       if (!setting || !setting.senderEmail || !setting.emailPassword) {
//         return reject(new Error("Email credentials not found in admin settings"));
//       }

//       // ✅ create transporter dynamically using DB creds
//       const transporter = nodemailer.createTransport({
//         service: "gmail", // 👈 or SMTP host if you use other provider
//         auth: {
//           user: setting.senderEmail,
//           pass: setting.emailPassword,
//         },
//       });

//       const mailOptions: nodemailer.SendMailOptions = {
//         from: setting.senderEmail,
//         to,
//         subject,
//         html,
//       };

//       await transporter.sendMail(mailOptions, (err, info) => {
//         if (err) return reject(err);
//         return resolve(`Email sent to ${to}`);
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// // 5️⃣ Fully dynamic mail (to, subject, html/text, cc, bcc, attachments)
// export type DynamicMailPayload = {
//     to: string[];
//     subject: string;
//     html?: string;
//     message?: string; // backward-compat: allow 'message' to carry HTML
//     text?: string;
//     cc?: string | string[];
//     bcc?: string | string[];
//     replyTo?: string;
//     attachments?: Array<{ filename: string; path?: string; content?: any; contentType?: string }>;
//     useTest?: boolean; // set true to send via Ethereal preview
// };

// export const send_dynamic_mail = async (payload: DynamicMailPayload) => {
//     // Choose transport: real SMTP (default) or Ethereal (only if explicitly requested)
//     async function getTransporter(): Promise<{ transporter: nodemailer.Transporter; mode: 'smtp'|'ethereal'; fromHint?: string }> {
//         const haveSmtp = !!(process.env.MAIL_USER || process.env.MAIL) && !!(process.env.MAIL_PASS || process.env.MAIL_PASSWORD);
//         if (payload.useTest !== true) {
//             if (!haveSmtp) {
//                 throw new Error('SMTP credentials missing. Set MAIL_USER/MAIL_PASS or MAIL/MAIL_PASSWORD.');
//             }
//             return { transporter: sharedTransporter, mode: 'smtp', fromHint: process.env.MAIL_FROM || process.env.MAIL_USER || process.env.MAIL };
//         }
//         if (!(global as any).__ETH_TRANSPORT__) {
//             const testAccount = await nodemailer.createTestAccount();
//             (global as any).__ETH_TRANSPORT__ = nodemailer.createTransport({
//                 host: 'smtp.ethereal.email',
//                 port: 587,
//                 secure: false,
//                 auth: { user: testAccount.user, pass: testAccount.pass },
//             });
//             (global as any).__ETH_FROM__ = `Test Sender <${testAccount.user}>`;
//         }
//         return { transporter: (global as any).__ETH_TRANSPORT__ as nodemailer.Transporter, mode: 'ethereal', fromHint: (global as any).__ETH_FROM__ };
//     }

//     return new Promise(async (resolve, reject) => {
//         try {
//             const { transporter, mode, fromHint } = await getTransporter();
//             // Force sender: prefer MAIL_FROM else MAIL_USER/MAIL
//             const envSender = process.env.MAIL_FROM || process.env.MAIL_USER || (config as any)?.MAIL || process.env.MAIL || "palakduofusion@gmail.com";
//             const fromAddress = envSender;
//             const mailOptions: nodemailer.SendMailOptions = {
//                 from: fromAddress,
//                 to: payload.to,
//                 subject: payload.subject,
//                 html: payload.html || payload.message,
//                 text: payload.text,
//                 cc: payload.cc,
//                 bcc: payload.bcc,
//                 replyTo: payload.replyTo,
//                 attachments: payload.attachments,
//             };

//             await transporter.sendMail(mailOptions, (err, info) => {
//                 if (err) return reject(err);
//                 const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : undefined;
//                 return resolve({ message: "Mail sent", info, previewUrl, transportMode: mode, from: fromAddress });
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// };


"use strict";

import nodemailer from "nodemailer";
// import { adminSettingModel } from "../database/models/adminSetting";
import { userModel } from "../database";

// ================================
// 🔑 Helper: Get Transporter From Admin Settings
// ================================
async function getDbTransporter() {
    const setting = await userModel.findOne().sort({ createdAt: -1 }).lean();
    if (!setting || !setting.senderEmail || !setting.emailPassword) {
        throw new Error("Email credentials not found in admin settings");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465
        auth: {
            user: setting.senderEmail,
            pass: setting.emailPassword,
        },
        tls: { rejectUnauthorized: false }
    });

    return { transporter, from: setting.senderEmail };
}

// ================================
// 📩 Email Templates
// ================================

// 1️⃣ Forgot Password Mail
export const forgot_password_mail = async (user: any, otp: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { transporter, from } = await getDbTransporter();
            const mailOptions = {
                from,
                to: user.email,
                subject: "Forgot password",
                html: `
                    <h2>Forgot password</h2>
                    <p>Hi ${user.firstName || "User"},</p>
                    <p>Someone requested to reset your password.</p>
                    <p><b>OTP:</b> ${otp}</p>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>The Team</p>
                `
            };
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) reject(err);
                else resolve(`Email has been sent to ${user.email}`);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// 2️⃣ Email Verification Mail
export const email_verification_mail = async (user: any, otp: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { transporter, from } = await getDbTransporter();
            const mailOptions = {
                from,
                to: user.email,
                subject: "Email verification",
                html: `
                    <h2>Email Verification</h2>
                    <p>Hi ${user.firstName || "dear"} ${user.lastName || ""},</p>
                    <p>Welcome! Please verify your email.</p>
                    <p><b>Verification Code:</b> ${otp}</p>
                    <p>This code will expire in 10 minutes.</p>
                    <p>The Zazzi App Team</p>
                `
            };
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) reject(err);
                else resolve(`Email has been sent to ${user.email}`);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// 3️⃣ Bulk / Newsletter Mail
export const send_bulk_mail = async (emails: string[], subject: string, message: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { transporter, from } = await getDbTransporter();
            const mailOptions = {
                from,
                bcc: emails, // ✅ hidden recipients
                subject,
                html: message
            };
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) reject(err);
                else resolve(`Newsletter sent to ${emails.length} users`);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// 4️⃣ Single Mail
export const send_single_mail = async (to: string, subject: string, html: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { transporter, from } = await getDbTransporter();
            const mailOptions: nodemailer.SendMailOptions = {
                from,
                to,
                subject,
                html,
            };
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) return reject(err);
                return resolve(`Email sent to ${to}`);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// 5️⃣ Dynamic Mail (cc, bcc, attachments)
export type DynamicMailPayload = {
    to: string[] | string;
    subject: string;
    html?: string;
    message?: string;
    text?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    attachments?: Array<{ filename: string; path?: string; content?: any; contentType?: string }>;
    useTest?: boolean;
};

export const send_dynamic_mail = async (payload: DynamicMailPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { transporter, from } = await getDbTransporter();

            const mailOptions: nodemailer.SendMailOptions = {
                from,
                to: payload.to,
                subject: payload.subject,
                html: payload.html || payload.message,
                text: payload.text,
                cc: payload.cc,
                bcc: payload.bcc,
                replyTo: payload.replyTo,
                attachments: payload.attachments,
                useTest:payload.useTest, // boolean
            };

            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) return reject(err);
                return resolve({ message: "Mail sent", info, from });
            });
        } catch (error) {
            reject(error);
        }
    });
};
