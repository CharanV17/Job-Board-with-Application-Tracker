"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
exports.emailService = {
    send: async (to, subject, html) => {
        await transporter.sendMail({
            from: `"JobBoard" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
    },
    applicationReceived: async (employerEmail, candidateName, jobTitle) => {
        await exports.emailService.send(employerEmail, `New Application for ${jobTitle}`, `
      <h2>You received a new application</h2>
      <p><b>${candidateName}</b> applied for your job:</p>
      <p>${jobTitle}</p>
      `);
    },
    statusUpdated: async (candidateEmail, status, jobTitle) => {
        await exports.emailService.send(candidateEmail, `Your application status was updated`, `
      <h2>Status Update</h2>
      <p>Your application for <b>${jobTitle}</b> is now:</p>
      <h3>${status}</h3>
      `);
    }
};
