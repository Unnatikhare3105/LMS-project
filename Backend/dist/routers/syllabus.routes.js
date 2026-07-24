"use strict";
//Backend/src/routers/syllabus.routes.ts
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
const syllabusController = __importStar(require("../controllers/syllabus.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authUser);
// POST /api/syllabus/generate/text        body: { topic }
// POST /api/syllabus/generate/video       body: { topic }
// GET  /api/syllabus                      all topics for user
// GET  /api/syllabus/:syllabusId          get one (syllabusId = UUID)
// PUT  /api/syllabus/:syllabusId          update content
// DELETE /api/syllabus/:syllabusId        delete
router.post('/generate/text', syllabusController.generateTextController);
router.post('/generate/video', syllabusController.generateVideoController);
router.get('/', syllabusController.getAllTopicsController);
router.get('/:syllabusId', syllabusController.getSyllabusByIdController);
router.put('/:syllabusId', syllabusController.updateSyllabusController);
router.delete('/:syllabusId', syllabusController.deleteSyllabusController);
exports.default = router;
//# sourceMappingURL=syllabus.routes.js.map