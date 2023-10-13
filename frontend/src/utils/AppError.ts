// Define a custom error class named "AppError"
export class AppError {
    // Property to store the error message
    message: string;

    // Constructor to initialize the error message
    constructor(message: string) {
        this.message = message;
    }
}
