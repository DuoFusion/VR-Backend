import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import FormData from "form-data";

const WATI_API_KEY = process.env.WATI_API_KEY!;
const BASE_URL = process.env.WATI_BASE_URL || "https://app-server.wati.io";

export const sendWhatsAppMessage = async (
  whatsAppNumber: string,
  message: string,
  imageUrlOrPath?: string // URL or local file
) => {
  try {
    if (!imageUrlOrPath) {
      // text message
      const params = new URLSearchParams();
      params.append("messageText", message || "");

      const res = await axios.post(
        `${BASE_URL}/api/v1/sendSessionMessage/${whatsAppNumber}`,
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
    const url = `${BASE_URL}/api/v1/sendSessionFile/${whatsAppNumber}?caption=${encodeURIComponent(message || "")}`;
    console.log("url => ", url)
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
