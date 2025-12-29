class CustomError extends Error {
  success: boolean;
  statusCode: number;

  constructor(message: string, statusCode: number, success: boolean = false) {
    super(message);
    this.success = success;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export default CustomError;