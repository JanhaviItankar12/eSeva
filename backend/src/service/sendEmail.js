import { tranEmailApi } from "../config/brevo.js";


export const sendTemporaryPasswordEmail = async ({
  toEmail,
  toName,
  tempPassword
}) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender: {
        name: "eSeva Portal",
        email: process.env.FROM_EMAIL
      },
      to: [
        {
          email: toEmail,
          name: toName
        }
      ],
      subject: "eSeva Portal | Temporary Login Credentials",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">
          
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <h2 style="color:#1e3a8a; margin-bottom:10px;">
              eSeva Portal
            </h2>

            <p style="font-size:15px; color:#333;">
              Dear <strong>${toName}</strong>,
            </p>

            <p style="font-size:15px; color:#333;">
              Your officer account has been successfully created in the eSeva Portal.
            </p>

            <p style="font-size:15px; color:#333;">
              Please use the temporary password below to log in:
            </p>

            <div style="
              background:#eff6ff;
              border:1px dashed #2563eb;
              padding:15px;
              text-align:center;
              margin:20px 0;
              border-radius:6px;
            ">
              <span style="
                font-size:20px;
                font-weight:bold;
                color:#2563eb;
                letter-spacing:1px;
              ">
                ${tempPassword}
              </span>
            </div>

            <p style="font-size:14px; color:#555;">
              ⏳ <strong>This password is valid for 24 hours only.</strong>
            </p>

            <p style="font-size:14px; color:#555;">
              For security reasons, you must change your password immediately after your first login.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:12px; color:#777;">
              If you did not expect this email, please ignore it or contact the system administrator.
            </p>

            <p style="font-size:13px; color:#333; margin-top:20px;">
              Regards,<br/>
              <strong>eSeva Portal Administration Team</strong>
            </p>

          </div>

          <p style="text-align:center; font-size:11px; color:#999; margin-top:15px;">
            © ${new Date().getFullYear()} eSeva Portal. All rights reserved.
          </p>

        </div>
      `
    });

    return true;

  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw new Error("Email sending failed");
  }
};

export const sendOfficeDeactivatedEmail = async ({
  toEmail,
  toName,
  officeName,
  officeLevel
}) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender: {
        name: "eSeva Portal",
        email: process.env.FROM_EMAIL
      },
      to: [
        {
          email: toEmail,
          name: toName
        }
      ],
      subject: "eSeva Portal | Office Deactivation Notice",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">
          
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <h2 style="color:#dc2626; margin-bottom:10px;">
              eSeva Portal
            </h2>

            <p style="font-size:15px; color:#333;">
              Dear <strong>${toName}</strong>,
            </p>

            <p style="font-size:15px; color:#333;">
              We would like to inform you that your assigned 
              <strong>${officeLevel}</strong> office:
            </p>

            <div style="
              background:#fef2f2;
              border:1px solid #fca5a5;
              padding:15px;
              text-align:center;
              margin:20px 0;
              border-radius:6px;
            ">
              <span style="
                font-size:18px;
                font-weight:bold;
                color:#dc2626;
              ">
                ${officeName}
              </span>
            </div>

            <p style="font-size:15px; color:#333;">
              has been <strong>deactivated by the Administrator</strong>.
            </p>

            <p style="font-size:14px; color:#555;">
              ⚠ You may experience restricted access to the system.
            </p>

            <p style="font-size:14px; color:#555;">
              The administration team will soon assign you to a different office.
              You will be notified once reassignment is completed.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:12px; color:#777;">
              If you have any questions, please contact the system administrator.
            </p>

            <p style="font-size:13px; color:#333; margin-top:20px;">
              Regards,<br/>
              <strong>eSeva Portal Administration Team</strong>
            </p>

          </div>

          <p style="text-align:center; font-size:11px; color:#999; margin-top:15px;">
            © ${new Date().getFullYear()} eSeva Portal. All rights reserved.
          </p>

        </div>
      `
    });

    return true;

  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw new Error("Email sending failed");
  }
};


