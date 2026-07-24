import { ISyllabus } from '../models/syllabus.model';
export declare const generateContentAsText: ({ topic, userId }: {
    topic: string;
    userId: string;
}) => Promise<ISyllabus>;
export declare const generateContentAsVideo: ({ topic, userId }: {
    topic: string;
    userId: string;
}) => Promise<ISyllabus>;
export declare const generateFullContent: ({ topic, userId }: {
    topic: string;
    userId: string;
}) => Promise<ISyllabus>;
export declare const getAllTopics: (userId: string) => Promise<ISyllabus[]>;
export declare const getSyllabusByPublicId: (publicId: string, userId: string) => Promise<ISyllabus>;
export declare const updateSyllabusContent: (publicId: string, content: string, userId: string) => Promise<ISyllabus>;
export declare const deleteSyllabus: (publicId: string, userId: string) => Promise<void>;
//# sourceMappingURL=syllabus.service.d.ts.map