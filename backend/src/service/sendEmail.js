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

export const sendOfficerLockedEmail = async ({
  toEmail,
  toName,
  reason
}) => {
  await tranEmailApi.sendTransacEmail({
    sender: {
      name: "eSeva Portal",
      email: process.env.FROM_EMAIL
    },
    to: [{ email: toEmail, name: toName }],
    subject: "eSeva Portal | Account Locked",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:30px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
          
          <h2 style="color:#dc2626;">Account Locked</h2>

          <p>Dear <strong>${toName}</strong>,</p>

          <p>Your account has been locked by the administrator.</p>

          ${
            reason
              ? `
                <div style="background:#fef2f2; border:1px solid #fca5a5; padding:15px; margin:20px 0;">
                  <strong>Reason:</strong> ${reason}
                </div>
              `
              : ""
          }

          <p>You will not be able to log in until your account is unlocked.</p>

          <hr style="margin:25px 0;" />

          <p style="font-size:12px; color:#777;">
            Please contact the administrator for assistance.
          </p>

          <p><strong>eSeva Portal Administration Team</strong></p>

        </div>
      </div>
    `
  });
};

export const sendOfficerUnlockedEmail = async ({
  toEmail,
  toName
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
      subject: "eSeva Portal | Account Unlocked",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">
          
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <h2 style="color:#16a34a; margin-bottom:10px;">
              eSeva Portal
            </h2>

            <p style="font-size:15px; color:#333;">
              Dear <strong>${toName}</strong>,
            </p>

            <p style="font-size:15px; color:#333;">
              We are pleased to inform you that your account has been 
              <strong style="color:#16a34a;">successfully unlocked</strong> 
              by the Administrator.
            </p>

            <div style="
              background:#ecfdf5;
              border:1px solid #86efac;
              padding:15px;
              text-align:center;
              margin:20px 0;
              border-radius:6px;
            ">
              <span style="
                font-size:16px;
                font-weight:bold;
                color:#16a34a;
              ">
                Your access to the system has been restored.
              </span>
            </div>

            <p style="font-size:14px; color:#555;">
              You may now log in and continue using the eSeva Portal.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:12px; color:#777;">
              If you face any issues, please contact the system administrator.
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

export const sendOfficerDeactivatedEmail = async ({
  toEmail,
  toName,
  role,
  officeName
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
      subject: "eSeva Portal | Account Deactivation Notice",
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
              Your <strong>${role}</strong> account has been 
              <strong style="color:#dc2626;">deactivated by the Administrator</strong>.
            </p>

            ${
              officeName
                ? `
                  <div style="
                    background:#fef2f2;
                    border:1px solid #fca5a5;
                    padding:15px;
                    text-align:center;
                    margin:20px 0;
                    border-radius:6px;
                  ">
                    <span style="
                      font-size:16px;
                      font-weight:bold;
                      color:#dc2626;
                    ">
                      Assigned Office: ${officeName}
                    </span>
                  </div>
                `
                : ""
            }

            <p style="font-size:14px; color:#555;">
              🚫 You will not be able to log in to the system until your account is reactivated.
            </p>

            <p style="font-size:14px; color:#555;">
              If you believe this action was taken in error, please contact the system administrator.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

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
    console.error("Officer Deactivation Email Error:", error);
    throw new Error("Email sending failed");
  }
};

export const sendOfficerActivatedEmail = async ({
  toEmail,
  toName,
  role,
  officeName
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
      subject: "eSeva Portal | Account Activated",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <h2 style="color:#16a34a; margin-bottom:10px;">eSeva Portal</h2>

            <p style="font-size:15px; color:#333;">
              Dear <strong>${toName}</strong>,
            </p>

            <p style="font-size:15px; color:#333;">
              Your <strong>${role}</strong> account has been 
              <strong style="color:#16a34a;">activated successfully</strong> by the Administrator.
            </p>

            ${
              officeName
                ? `
                  <div style="
                    background:#d1fae5;
                    border:1px solid #34d399;
                    padding:15px;
                    text-align:center;
                    margin:20px 0;
                    border-radius:6px;
                  ">
                    <span style="font-size:16px; font-weight:bold; color:#065f46;">
                      Assigned Office: ${officeName}
                    </span>
                  </div>
                `
                : ""
            }

            <p style="font-size:14px; color:#555;">
              ✅ You can now log in to the system and access your assigned responsibilities.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

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
    console.error("Officer Activation Email Error:", error);
    throw new Error("Email sending failed");
  }
};

export const sendTemporaryPasswordResetEmail = async ({
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
      subject: "eSeva Portal | Reset Your Temporary Password",
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
              Your previous temporary password has expired. An administrator has generated a new temporary password for your account.
            </p>

            <p style="font-size:15px; color:#333;">
              Please use the new temporary password below to log in and update your actual password immediately:
            </p>

            <div style="
              background:#fff4e6;
              border:1px dashed #f59e0b;
              padding:15px;
              text-align:center;
              margin:20px 0;
              border-radius:6px;
            ">
              <span style="
                font-size:20px;
                font-weight:bold;
                color:#b45309;
                letter-spacing:1px;
              ">
                ${tempPassword}
              </span>
            </div>

            <p style="font-size:14px; color:#555;">
              ⏳ <strong>This temporary password is valid for 24 hours only.</strong>
            </p>

            <p style="font-size:14px; color:#555;">
              For security reasons, please change your password immediately after logging in.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:12px; color:#777;">
              If you did not request this password reset, please contact your system administrator immediately.
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

export const sendCitizenLockedEmail = async ({ toEmail, toName, reason }) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender: {
        name: "eSeva Portal",
        email: process.env.FROM_EMAIL,
      },
      to: [{ email: toEmail, name: toName }],
      subject: "eSeva Portal | Your Account Has Been Locked",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <h2 style="color:#b91c1c; margin-bottom:10px;">eSeva Portal</h2>

            <p style="font-size:15px; color:#333;">Dear <strong>${toName}</strong>,</p>

            <p style="font-size:15px; color:#333;">
              Your account has been temporarily <strong>locked</strong> by the system administrator.
            </p>

            <p style="font-size:15px; color:#333;">
              <strong>Reason:</strong> ${reason || "No reason provided"}.
            </p>

            <p style="font-size:14px; color:#555;">
              If you believe this is a mistake, please contact the system administrator.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:13px; color:#333; margin-top:20px;">
              Regards,<br/>
              <strong>eSeva Portal Administration Team</strong>
            </p>
          </div>

          <p style="text-align:center; font-size:11px; color:#999; margin-top:15px;">
            © ${new Date().getFullYear()} eSeva Portal. All rights reserved.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Citizen Lock Email Error:", error);
    throw new Error("Failed to send lock email");
  }
};

export const sendCitizenUnlockedEmail = async ({ toEmail, toName }) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender: {
        name: "eSeva Portal",
        email: process.env.FROM_EMAIL,
      },
      to: [{ email: toEmail, name: toName }],
      subject: "eSeva Portal | Your Account Has Been Unlocked",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:30px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <h2 style="color:#059669; margin-bottom:10px;">eSeva Portal</h2>

            <p style="font-size:15px; color:#333;">Dear <strong>${toName}</strong>,</p>

            <p style="font-size:15px; color:#333;">
              Your account has been <strong>unlocked</strong> by the system administrator. You can now log in normally.
            </p>

            <p style="font-size:14px; color:#555;">
              If you have any questions, please contact the system administrator.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:13px; color:#333; margin-top:20px;">
              Regards,<br/>
              <strong>eSeva Portal Administration Team</strong>
            </p>
          </div>

          <p style="text-align:center; font-size:11px; color:#999; margin-top:15px;">
            © ${new Date().getFullYear()} eSeva Portal. All rights reserved.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Citizen Unlock Email Error:", error);
    throw new Error("Failed to send unlock email");
  }
};


