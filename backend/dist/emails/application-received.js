"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationReceivedTemplate = void 0;
const applicationReceivedTemplate = (candidateName, jobTitle) => {
    return `
    <p>You received a new application.</p>
    <p><strong>Candidate:</strong> ${candidateName}</p>
    <p><strong>Job:</strong> ${jobTitle}</p>
  `;
};
exports.applicationReceivedTemplate = applicationReceivedTemplate;
