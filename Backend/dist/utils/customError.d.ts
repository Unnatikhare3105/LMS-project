declare class CustomError extends Error {
    statusCode: number;
    success: boolean;
    constructor(message: string, statusCode: number);
}
export default CustomError;
//# sourceMappingURL=customError.d.ts.map