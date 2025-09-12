import axios from "axios";

// const WHATSAPP_API = "https://graph.facebook.com/v18.0";
const WHATSAPP_API = "https://graph.facebook.com/v22.0";

export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    const url = `${WHATSAPP_API}/${process.env.META_PHONE_NUMBER_ID}/messages`;

    const res = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("Error sending WhatsApp:", err.response?.data || err.message);
    throw err;
  }
};
