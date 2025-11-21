export const applicationStatusUpdateTemplate = (
  candidateName: string,
  status: string,
  jobTitle: string
) => {
  return `
    <h2>Your application status has changed</h2>
    <p>Hi ${candidateName},</p>
    <p>Your application for <strong>${jobTitle}</strong> has been updated to:</p>
    <h3>${status}</h3>
  `;
};
