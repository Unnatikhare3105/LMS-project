import { Document, Model } from 'mongoose';
import { IQuestion } from './quiz.model';
export interface IDailyChallenge extends Document {
    dailyChallengeId: string;
    date: string;
    topic: string;
    questions: IQuestion[];
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IDailyChallengeModel extends Model<IDailyChallenge> {
}
declare const DailyChallengeModel: IDailyChallengeModel;
export default DailyChallengeModel;
//# sourceMappingURL=dailyChallenge.model.d.ts.map