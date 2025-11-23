import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailService = {
  send: async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
      from: `"JobBoard" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  },

  applicationReceived: async (employerEmail: string, candidateName: string, jobTitle: string) => {
    await emailService.send(
      employerEmail,
      `New Application for ${jobTitle}`,
      `
      <h2>You received a new application</h2>
      <p><b>${candidateName}</b> applied for your job:</p>
      <p>${jobTitle}</p>
      `
    );
  },

  statusUpdated: async (candidateEmail: string, status: string, jobTitle: string) => {
    await emailService.send(
      candidateEmail,
      `Your application status was updated`,
      `
      <h2>Status Update</h2>
      <p>Your application for <b>${jobTitle}</b> is now:</p>
      <h3>${status}</h3>
      `
    );
  }
};
