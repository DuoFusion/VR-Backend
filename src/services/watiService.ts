import axios from "axios";
import { config } from "../../config";

const WATI_API_KEY = config.WATI_API_KEY as string;
const BASE_URL = config.WATI_BASE_URL || "https://app.wati.io/api/v1";
// export const sendWhatsAppMessage = async (phone: string, message: string) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/sendSessionMessage/${phone}`,   // 👈 endpoint ma phone pass karvo
//       {
//         messageText: message,                      // 👈 field "messageText" hoy
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${WATI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("WATI Error:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || error.message);
//   }
// };


export const sendWhatsAppMessage = async (whatsAppNumber: string, message: string) => {
  console.log("https://live-mt-server.wati.io/1020792 => ", BASE_URL);
  console.log("response========", whatsAppNumber, message);

  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/sendSessionMessage/${whatsAppNumber}?messageText=${message}`,
      {messageText: message},
      {
        headers: {
          Authorization: `Bearer ${WATI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response-----------", response);

    return response.data;
  }
  catch (error: any) {
    console.error("WATI Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
