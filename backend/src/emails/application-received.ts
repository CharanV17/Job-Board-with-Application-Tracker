export const applicationReceivedTemplate = (
  candidateName: string,
  jobTitle: string
): string => {
  return `
    <p>You received a new application.</p>
    <p><strong>Candidate:</strong> ${candidateName}</p>
    <p><strong>Job:</strong> ${jobTitle}</p>
  `;
};
