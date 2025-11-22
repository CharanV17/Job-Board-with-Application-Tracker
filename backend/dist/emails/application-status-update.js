"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationStatusUpdateTemplate = void 0;
const applicationStatusUpdateTemplate = (candidateName, status, jobTitle) => {
    return `
    <h2>Your application status has changed</h2>
    <p>Hi ${candidateName},</p>
    <p>Your application for <strong>${jobTitle}</strong> has been updated to:</p>
    <h3>${status}</h3>
  `;
};
exports.applicationStatusUpdateTemplate = applicationStatusUpdateTemplate;
