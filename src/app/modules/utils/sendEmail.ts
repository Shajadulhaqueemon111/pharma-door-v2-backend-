import nodemailer from 'nodemailer';
import config from '../../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});

export const sendEmailOtp = async ({
  to,
  otp,
  subject = 'Your PharmaDoor Verification Code',
  title = 'Security Verification Code',
  message = 'Use the code below to complete your authentication.',
}: {
  to: string;
  otp: string;
  subject?: string;
  title?: string;
  message?: string;
}) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #134e4a 100%); padding: 24px; text-align: center; color: #ffffff;">
        <div style="display: inline-block; width: 44px; height: 44px; background: #0d9488; border-radius: 12px; font-size: 22px; font-weight: 800; line-height: 44px; margin-bottom: 8px;">Rx</div>
        <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">PharmaDoor Healthcare</h2>
        <p style="margin: 4px 0 0; font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Security & Verification Protocol</p>
      </div>

      <div style="padding: 32px 24px; text-align: center;">
        <h3 style="margin: 0 0 12px; font-size: 18px; color: #0f172a; font-weight: 700;">${title}</h3>
        <p style="margin: 0 0 24px; font-size: 13px; color: #64748b; line-height: 1.5;">${message}</p>

        <div style="background: #f0fdfa; border: 2px dashed #0d9488; border-radius: 12px; padding: 18px; margin-bottom: 24px; display: inline-block; min-width: 200px;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f766e;">${otp}</span>
        </div>

        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          This code is confidential and will expire in <strong>10 minutes</strong>.<br />
          If you did not request this verification, please secure your account immediately.
        </p>
      </div>

      <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} PharmaDoor Digital Health. All rights reserved.
      </div>
    </div>
  `;

  console.log(`\n=========================================`);
  console.log(`🔑 [SECURITY OTP CODE] Destination: ${to}`);
  console.log(`🔑 [CODE]: [ ${otp} ] (${title})`);
  console.log(`=========================================\n`);

  try {
    const info = await transporter.sendMail({
      from: `"PharmaDoor Security" <${config.email_user || 'mdshajdulhaqueemon@gmail.com'}>`,
      to,
      subject,
      html,
    });
    console.log('OTP email dispatched via SMTP successfully:', info.messageId);
    return info;
  } catch (error) {
    console.warn('Notice: SMTP dispatch failed (check Gmail app password). OTP was printed above for convenience:', error);
    return null;
  }
};

