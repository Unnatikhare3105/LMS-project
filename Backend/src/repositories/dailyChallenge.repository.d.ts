import { IDailyChallenge } from '../models/dailyChallenge.model';
import { IQuestion } from '../models/quiz.model';
export declare const findChallengeByDate: (date: string) => Promise<IDailyChallenge | null>;
export declare const findTodayChallenge: () => Promise<IDailyChallenge | null>;
export declare const getRecentChallenges: (limit?: number) => Promise<IDailyChallenge[]>;
export declare const createDailyChallenge: (data: {
    date: string;
    topic: string;
    questions: IQuestion[];
}) => Promise<IDailyChallenge>;
//# sourceMappingURL=dailyChallenge.repository.d.ts.map