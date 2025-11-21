"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const upload_validators_1 = require("../validators/upload.validators");
const router = (0, express_1.Router)();
// Generate presigned URL for PDF only
router.get("/presign", auth_1.auth, (0, auth_1.requireRole)("candidate"), (0, validate_1.validate)(upload_validators_1.presignSchema), upload_controller_1.generatePresignedUrl);
exports.default = router;
