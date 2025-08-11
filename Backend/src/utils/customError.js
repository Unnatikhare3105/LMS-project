class CustomError extends Error {
    constructor(success, message, statusCode) {
     
      super(message);
       this.success = success;
      this.statusCode = statusCode;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
    }
  }
  
 export default CustomError;