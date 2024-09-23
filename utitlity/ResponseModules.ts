class ResponseModules {

    // Escape special characters in a string
    static addslashes(str: string): string {
        str = str.replace(/\\/g, '\\\\');
        str = str.replace(/'/g, "\\'");
        str = str.replace(/"/g, '\\"');
        str = str.replace(/\0/g, '\\0');
        return str;
    }

    // Create an error response object
    static errors(errorMessage: string, errorType: string | null = null): object {
        const error = {
            status: false,
            errorType: errorType,
            message: errorMessage,
            serverReferenceCode: new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' }).toString(),
        };

        return error;
    }

    // Create a success response object
    static success(successMessage: string, data: any[] = []): object {
        const success = {
            status: true,
            message: successMessage,
            serverReferenceCode: new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' }).toString(),
            data: data,
        };

        return success;
    }
}

export default ResponseModules;