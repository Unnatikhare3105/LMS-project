import { Request, Response, NextFunction } from 'express';
export declare const registerController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const loginByPasswordController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const sendOTPController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyOTPController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logoutController: (req: Request, res: Response) => Promise<Response>;
export declare const getProfileController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getActivityChartController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const forgotPasswordController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyForgotPasswordOTPController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resetPasswordController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map