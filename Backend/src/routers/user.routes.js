"use strict";
//backend/src/routers/user.routes.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// ─── Public ───────────────────────────────────────────────────────────────────
router.post('/register', userController.registerController);
router.post('/login', userController.loginByPasswordController);
router.post('/login/send-otp', userController.sendOTPController);
router.post('/login/verify-otp', userController.verifyOTPController);
router.post('/forgot-password', userController.forgotPasswordController);
router.post('/forgot-password/verify-otp', userController.verifyForgotPasswordOTPController);
router.post('/reset-password', userController.resetPasswordController);
// ─── Protected ────────────────────────────────────────────────────────────────
router.post('/logout', auth_middleware_1.authUser, userController.logoutController);
router.get('/profile', auth_middleware_1.authUser, userController.getProfileController);
router.get('/activity', auth_middleware_1.authUser, userController.getActivityChartController);
exports.default = router;
//# sourceMappingURL=user.routes.js.map