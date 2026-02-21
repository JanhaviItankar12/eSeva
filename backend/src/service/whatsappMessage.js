import axios from "axios";

const formatNumber = (mobile) => {
  mobile = mobile.replace(/\D/g, ""); // remove non-digits

  if (mobile.length === 10) {
    return "91" + mobile; // add India code
  }

  if (mobile.startsWith("91") && mobile.length === 12) {
    return mobile;
  }

  return mobile;
};



export const sendWhatsApp = async (to, message) => {
  try {

    const response=await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to:formatNumber(to),
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    

   
  } catch (error) {
    console.error("WhatsApp Error:", error.response?.data);
  }
};