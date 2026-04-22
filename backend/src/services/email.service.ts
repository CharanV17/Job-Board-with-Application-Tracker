import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // ===========================
  // GENERIC SEND EMAIL
  // ===========================
  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: `"Job Board" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log("Email sent →", to, subject);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  }

  // ===========================
  // TEMPLATE: Candidate Applied (Employer Notification)
  // ===========================
  async applicationReceived(
    employerEmail: string,
    candidateName: string,
    jobTitle: string
  ) {
    const html = `
      <h2>New Application Received</h2>
      <p><strong>${candidateName}</strong> has applied for your job posting:</p>
      <p><strong>${jobTitle}</strong></p>
      <p>Please check your dashboard for more details.</p>
    `;

    return this.sendEmail({
      to: employerEmail,
      subject: `New Application – ${jobTitle}`,
      html,
    });
  }

  // ===========================
  // TEMPLATE: Status Updated (Candidate Notification)
  // ===========================
  async statusUpdated(to: string, status: string, jobTitle: string) {
    const html = `
      <h2>Application Status Update</h2>
      <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
      <p><strong>New Status:</strong> ${status}</p>
      <p>We will keep you updated on the next steps.</p>

      <br/>
      <p>Best Regards,<br/>Job Board Team</p>
    `;

    return this.sendEmail({
      to,
      subject: `Application Update – ${jobTitle}`,
      html,
    });
  }
}

export const emailService = new EmailService();
