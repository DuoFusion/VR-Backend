// import axios from "axios";
// import * as fs from "fs";
// import * as path from "path";
// import FormData from "form-data";



// const WATI_API_KEY = process.env.WATI_API_KEY!;
// const BASE_URL = process.env.WATI_BASE_URL || "https://app-server.wati.io";

// export const sendWhatsAppMessage = async (
//   whatsAppNumber: string,
//   message: string,
//   imageUrlOrPath?: string // URL or local file
// ) => {
//   try {
//     // Normalize number: keep digits only; add default country code if provided and needed
//     let number = (whatsAppNumber || "").replace(/\D+/g, "");
//     if (number.startsWith("0")) number = number.replace(/^0+/, "");

    

//     const defaultCc = process.env.DEFAULT_COUNTRY_CODE || ""; // e.g., 91
//     if (defaultCc && number.length === 10) {
//       number = `${defaultCc}${number}`;
//     }

//     if (!imageUrlOrPath) {
//       // text message
//       const params = new URLSearchParams();
//       params.append("messageText", message || "");

//       const res = await axios.post(
//         `${BASE_URL}/api/v1/sendSessionMessage/${number}`,
//         params.toString(),
//         {
//           headers: {
//             Authorization: `Bearer ${WATI_API_KEY}`,
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       );
//       return res.data;
//     }

//     // image message
//     const form = new FormData();
//     let filename = "image.jpg";
//     let fileBuffer: Buffer;

//     if (imageUrlOrPath.startsWith("http")) {
//       // download image
//       const dl = await axios.get(imageUrlOrPath, { responseType: "arraybuffer" });
//       fileBuffer = Buffer.from(dl.data);
//       filename = path.basename(new URL(imageUrlOrPath).pathname);
//     } else {
//       // local file
//       if (!fs.existsSync(imageUrlOrPath)) throw new Error("File not found: " + imageUrlOrPath);
//       fileBuffer = fs.readFileSync(imageUrlOrPath);
//       filename = path.basename(imageUrlOrPath);
//     }

//     form.append("file", fileBuffer, { filename, contentType: "image/jpeg" });
//     const url = `${BASE_URL}/api/v1/sendSessionFile/${number}?caption=${encodeURIComponent(message || "")}`;
//     console.log("url => ", url)
//     const headers = {
//       Authorization: `Bearer ${WATI_API_KEY}`,
//       ...form.getHeaders(),
//     };

//     const res = await axios.post(url, form, {
//       headers,
//       maxBodyLength: Infinity,
//       maxContentLength: Infinity,
//     });

//     return res.data;

//   } catch (err: any) {
//     console.error("WATI Error:", err.response?.data || err.message || err);
//     throw err;
//   }
// };

import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import FormData from "form-data";
import { adminSettingModel } from "../database/models/adminSetting"; // adjust path

export const sendWhatsAppMessage = async (
  whatsAppNumber: string,
  message: string,
  imageUrlOrPath?: string // URL or local file
) => {
  try {
    // ✅ Get WhatsApp settings from DB
    const setting = await adminSettingModel.findOne().sort({ createdAt: -1 }).lean();
console.log("Admin Settings =>", setting); // 👈 Debug line
if (!setting || !setting.whatsappKey || !setting.whatsappUrl) {
  throw new Error("WhatsApp API key or URL not found in admin settings");
}
    const WATI_API_KEY = setting.whatsappKey;
    const BASE_URL = setting.whatsappUrl;

    // Normalize number: keep digits only; add default country code if provided and needed
    let number = (whatsAppNumber || "").replace(/\D+/g, "");
    if (number.startsWith("0")) number = number.replace(/^0+/, "");

    const defaultCc = process.env.DEFAULT_COUNTRY_CODE || ""; // e.g., 91
    if (defaultCc && number.length === 10) {
      number = `${defaultCc}${number}`;
    }

    if (!imageUrlOrPath) {
      // text message
      const params = new URLSearchParams();
      params.append("messageText", message || "");

      const res = await axios.post(
        `${BASE_URL}/api/v1/sendSessionMessage/${number}`,
        params.toString(),
        {
          headers: {
            Authorization: `Bearer ${WATI_API_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return res.data;
    }

    // image message
    const form = new FormData();
    let filename = "image.jpg";
    let fileBuffer: Buffer;

    if (imageUrlOrPath.startsWith("http")) {
      // download image
      const dl = await axios.get(imageUrlOrPath, { responseType: "arraybuffer" });
      fileBuffer = Buffer.from(dl.data);
      filename = path.basename(new URL(imageUrlOrPath).pathname);
    } else {
      // local file
      if (!fs.existsSync(imageUrlOrPath)) throw new Error("File not found: " + imageUrlOrPath);
      fileBuffer = fs.readFileSync(imageUrlOrPath);
      filename = path.basename(imageUrlOrPath);
    }

    form.append("file", fileBuffer, { filename, contentType: "image/jpeg" });
    const url = `${BASE_URL}/api/v1/sendSessionFile/${number}?caption=${encodeURIComponent(message || "")}`;
    console.log("url => ", url);

    const headers = {
      Authorization: `Bearer ${WATI_API_KEY}`,
      ...form.getHeaders(),
    };

    const res = await axios.post(url, form, {
      headers,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return res.data;
  } catch (err: any) {
    console.error("WATI Error:", err.response?.data || err.message || err);
    throw err;
  }
};