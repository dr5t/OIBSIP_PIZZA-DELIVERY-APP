const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Pizza Delivery 🍕" <noreply@pizzadelivery.com>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const emailTemplates = {
  verification: (name, verifyUrl) => ({
    subject: '🍕 Verify Your Email - Pizza Delivery',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #e94560, #ff6b6b); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🍕 Pizza Delivery</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Welcome aboard!</p>
        </div>
        <div style="padding: 30px; color: #e0e0e0;">
          <h2 style="color: #ff6b6b;">Hey ${name}! 👋</h2>
          <p>Thanks for signing up. Please verify your email to start ordering delicious pizzas.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #e94560, #ff6b6b); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify My Email</a>
          </div>
          <p style="color: #888; font-size: 13px;">If the button doesn't work, copy this link:<br>${verifyUrl}</p>
        </div>
      </div>
    `
  }),

  resetPassword: (name, resetUrl) => ({
    subject: '🔑 Reset Your Password - Pizza Delivery',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f3460, #533483); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔑 Password Reset</h1>
        </div>
        <div style="padding: 30px; color: #e0e0e0;">
          <h2 style="color: #a78bfa;">Hi ${name},</h2>
          <p>You requested a password reset. Click below to set a new password. This link expires in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #0f3460, #533483); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `
  }),

  lowStockAlert: (items) => ({
    subject: '⚠️ Low Stock Alert - Pizza Delivery',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #e94560, #ff8a00); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Low Stock Alert</h1>
        </div>
        <div style="padding: 30px; color: #e0e0e0;">
          <p>The following items have fallen below their threshold:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #16213e;">
              <th style="padding: 12px; text-align: left; color: #ff6b6b;">Item</th>
              <th style="padding: 12px; text-align: left; color: #ff6b6b;">Category</th>
              <th style="padding: 12px; text-align: center; color: #ff6b6b;">Stock</th>
              <th style="padding: 12px; text-align: center; color: #ff6b6b;">Threshold</th>
            </tr>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #2a2a4a;">
                <td style="padding: 12px;">${item.name}</td>
                <td style="padding: 12px; text-transform: capitalize;">${item.category}</td>
                <td style="padding: 12px; text-align: center; color: #e94560; font-weight: bold;">${item.quantity}</td>
                <td style="padding: 12px; text-align: center;">${item.threshold}</td>
              </tr>
            `).join('')}
          </table>
          <p style="color: #ff6b6b;">Please restock these items as soon as possible!</p>
        </div>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };
