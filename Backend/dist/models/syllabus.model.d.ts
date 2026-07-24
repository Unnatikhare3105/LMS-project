import { Document, Model } from 'mongoose';
import { ContentType } from '../types';
export interface IVideoLink {
    title: string;
    videoId: string;
    url: string;
    thumbnail: string;
}
export interface IReferenceLink {
    title: string;
    url: string;
    source: string;
}
export interface ISyllabus extends Document {
    syllabusId: string;
    userId: string;
    topic: string;
    content: string;
    videoLinks: IVideoLink[];
    referenceLinks: IReferenceLink[];
    contentType: ContentType;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISyllabusModel extends Model<ISyllabus> {
}
declare const SyllabusModel: ISyllabusModel;
export default SyllabusModel;
//# sourceMappingURL=syllabus.model.d.ts.map