"use strict";
//Backend/src/repositories/syllabus.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSyllabusBySyllabusId = exports.updateSyllabusContent = exports.createVideoSyllabus = exports.createTextSyllabus = exports.getObjectIdBySyllabusId = exports.searchSyllabusByTopic = exports.findSyllabusByUserAndTopic = exports.findSyllabusByUserId = exports.findSyllabusByObjectId = exports.findSyllabusBySyllabusId = void 0;
const syllabus_model_1 = __importDefault(require("../models/syllabus.model"));
// ─── Reads ────────────────────────────────────────────────────────────────────
const findSyllabusBySyllabusId = async (syllabusId) => {
    return syllabus_model_1.default.findOne({ syllabusId }).exec();
};
exports.findSyllabusBySyllabusId = findSyllabusBySyllabusId;
const findSyllabusByObjectId = async (id) => {
    return syllabus_model_1.default.findById(id).exec();
};
exports.findSyllabusByObjectId = findSyllabusByObjectId;
const findSyllabusByUserId = async (userId) => {
    return syllabus_model_1.default.find({ userId })
        .select('syllabusId topic contentType createdAt')
        .sort({ createdAt: -1 })
        .exec();
};
exports.findSyllabusByUserId = findSyllabusByUserId;
const findSyllabusByUserAndTopic = async (userId, topic) => {
    return syllabus_model_1.default.findOne({ userId, topic }).exec();
};
exports.findSyllabusByUserAndTopic = findSyllabusByUserAndTopic;
const searchSyllabusByTopic = async (userId, searchTerm) => {
    return syllabus_model_1.default.find({
        userId,
        $text: { $search: searchTerm },
    })
        .select('syllabusId topic contentType createdAt')
        .sort({ createdAt: -1 })
        .exec();
};
exports.searchSyllabusByTopic = searchSyllabusByTopic;
// Resolves syllabusId → internal ObjectId (used internally by services)
const getObjectIdBySyllabusId = async (syllabusId) => {
    const doc = await syllabus_model_1.default.findOne({ syllabusId }).select('_id').lean().exec();
    return doc ? doc._id : null;
};
exports.getObjectIdBySyllabusId = getObjectIdBySyllabusId;
// ─── Writes ───────────────────────────────────────────────────────────────────
const createTextSyllabus = async (data) => {
    return syllabus_model_1.default.create({ ...data, contentType: 'text' });
};
exports.createTextSyllabus = createTextSyllabus;
const createVideoSyllabus = async (data) => {
    return syllabus_model_1.default.create({
        userId: data.userId,
        topic: data.topic,
        content: '',
        videoLinks: data.videoLinks,
        referenceLinks: data.referenceLinks,
        contentType: 'video',
    });
};
exports.createVideoSyllabus = createVideoSyllabus;
// export const createVideoSyllabus = async (data: {
//   userId: string;
//   topic: string;
//   videoLinks: IVideoLink[];
// }): Promise<ISyllabus> => {
//   return SyllabusModel.create({
//     userId: data.userId,
//     topic: data.topic,
//     content: '',
//     videoLinks: data.videoLinks,
//     contentType: 'video',
//   });
// };
const updateSyllabusContent = async (syllabusId, content) => {
    return syllabus_model_1.default.findOneAndUpdate({ syllabusId }, { $set: { content } }, { new: true }).exec();
};
exports.updateSyllabusContent = updateSyllabusContent;
const deleteSyllabusBySyllabusId = async (syllabusId) => {
    const result = await syllabus_model_1.default.findOneAndDelete({ syllabusId }).exec();
    return !!result;
};
exports.deleteSyllabusBySyllabusId = deleteSyllabusBySyllabusId;
//# sourceMappingURL=syllabus.repository.js.map