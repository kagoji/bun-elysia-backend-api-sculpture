import { Elysia, t, Context } from 'elysia';
import dateFormat from 'dateformat';
import LogLater from '../utitlity/loggar'; 
import AuthControllerV1 from '../api/web/v1/auth/AuthController'; // Ensure this controller is adapted for Elysia

const app = new Elysia();

/**
 * Controller & Route group Path
 */

/*************** For version 1 WEB API *******************/

// Set routes for API version 1
app.group("/api/web/v1", (group) => 
    group.use(AuthControllerV1) // Use the AuthController
);




// Middleware to handle undefined routes
app.get('*', ({ set }) => {
    const error = new Error("Not Found") as Error & { status?: number };
    error.status = 404;
   
    return {
        error: {
            status: 404,
            message: "Not Found",
        },
     };
});

// Helper function to determine the protocol (http/https)
const getProtocol = (request: Request): string => {
    // Safely retrieve the 'x-forwarded-proto' header if it exists, otherwise assume 'http'
    return request.headers.get('x-forwarded-proto') || 'http';
};

// Centralized error handling
// Centralized error handling
app.onError((error, context: Context) => {
    const { request, set } = context;

    console.log('Centralized error handling');

    // Log initialization
    const asiaTime = new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' });
    const logDate = dateFormat(asiaTime, "yyyy-mm-dd");
    const logfileError = new LogLater(`src/logs/error-log-${logDate}.log`);

    // Determine protocol and construct full URL
    const protocol = getProtocol(request);
    const host = request.headers.get('host') || 'localhost';
    const fullUrl: string = `${request.url}`;

    

    // Log the error details
    logfileError.dateline(`${host} | ${fullUrl} | ${error.message} | ${error.stack || 'No stack trace'} | ${request.headers.get('user-agent')}`);

    // Set the error response status and content
    const statusCode = (error as Error & { status?: number }).status || 508; // Default to 508 if no status is set

    set.status = statusCode;

    return {
        error: {
            code: statusCode,
            message: error.message || 'Internal Server Error',
        },
    };
});

export default app;
