export function applicationStatusUpdateTemplate({
  candidateName,
  status,
  jobTitle,
}: {
  candidateName: string;
  status: string;
  jobTitle: string;
}) {
  return `
    <h2>Your Application Status Has Changed</h2>
    <p>Hello ${candidateName},</p>
    <p>Your application for <strong>${jobTitle}</strong> is now:</p>
    <h3>${status}</h3>
  `;
}
