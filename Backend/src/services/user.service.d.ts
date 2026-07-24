import { IUser } from '../models/user.model';
import { ICreateUserInput, ILoginInput } from '../types';
export declare const createUser: (input: ICreateUserInput) => Promise<{
    user: IUser;
    token: string;
}>;
export declare const loginUser: (input: ILoginInput) => Promise<{
    user: IUser;
    token: string;
}>;
export declare const getUserProfile: (userId: string) => Promise<IUser>;
export declare const getActivityChart: (userId: string) => Promise<{
    activityLog: import("../types").IDailyActivityEntry[];
    streak: import("../types").IStreakData;
    totalQuizzesTaken: number;
    totalTopicsSearched: number;
}>;
//# sourceMappingURL=user.service.d.ts.map