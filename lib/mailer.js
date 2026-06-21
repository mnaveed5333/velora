import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use a Gmail App Password, not your real password
  },
});

export async function sendResetEmail(to, resetLink) {
  await transporter.sendMail({
    from: `"Velora" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your Velora password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #DC2626;">Reset your password</h2>
        <p>We received a request to reset your Velora account password. Click the button below to choose a new one.</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #DC2626; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p>This link will expire in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

// Sends a contact form submission to the admin inbox (EMAIL_USER).
// replyTo is set to the customer's email so hitting "Reply" in Gmail
// goes straight back to them instead of to your own address.
export async function sendContactEmail({ name, email, comment }) {
  await transporter.sendMail({
    from: `"Velora Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New contact form message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #A02334;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p style="margin-top: 16px;"><strong>Message:</strong></p>
        <p style="background: #FBEEEE; padding: 12px 16px; border-radius: 8px; white-space: pre-wrap;">${comment}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          Reply directly to this email to respond to ${name}.
        </p>
      </div>
    `,
  });
}