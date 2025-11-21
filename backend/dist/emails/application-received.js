"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationReceivedTemplate = applicationReceivedTemplate;
function applicationReceivedTemplate(candidateName, jobTitle) {
    return `
    <h2>New Application Received</h2>
    <p><strong>${candidateName}</strong> has applied for your job posting:</p>
    <p><em>${jobTitle}</em></p>
  `;
}
