import mongoose from 'mongoose';
import { ISyllabus, IVideoLink, IReferenceLink } from '../models/syllabus.model';
export declare const findSyllabusBySyllabusId: (syllabusId: string) => Promise<ISyllabus | null>;
export declare const findSyllabusByObjectId: (id: string | mongoose.Types.ObjectId) => Promise<ISyllabus | null>;
export declare const findSyllabusByUserId: (userId: string) => Promise<ISyllabus[]>;
export declare const findSyllabusByUserAndTopic: (userId: string, topic: string) => Promise<ISyllabus | null>;
export declare const searchSyllabusByTopic: (userId: string, searchTerm: string) => Promise<ISyllabus[]>;
export declare const getObjectIdBySyllabusId: (syllabusId: string) => Promise<mongoose.Types.ObjectId | null>;
export declare const createTextSyllabus: (data: {
    userId: string;
    topic: string;
    content: string;
}) => Promise<ISyllabus>;
export declare const createVideoSyllabus: (data: {
    userId: string;
    topic: string;
    videoLinks: IVideoLink[];
    referenceLinks: IReferenceLink[];
}) => Promise<ISyllabus>;
export declare const updateSyllabusContent: (syllabusId: string, content: string) => Promise<ISyllabus | null>;
export declare const deleteSyllabusBySyllabusId: (syllabusId: string) => Promise<boolean>;
export declare const updateSyllabusContentAndType: (syllabusId: string, content: string, contentType: "text" | "both") => Promise<ISyllabus | null>;
export declare const updateSyllabusVideos: (syllabusId: string, videoLinks: IVideoLink[], referenceLinks: IReferenceLink[], contentType: "video" | "both") => Promise<ISyllabus | null>;
export declare const upsertFullSyllabus: (data: {
    userId: string;
    topic: string;
    content: string;
    videoLinks: IVideoLink[];
    referenceLinks: IReferenceLink[];
}) => Promise<ISyllabus>;
//# sourceMappingURL=syllabus.repository.d.ts.map