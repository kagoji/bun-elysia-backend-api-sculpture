import { Elysia, Context } from 'elysia';
import dateFormat from 'dateformat';
import LogLater from '../../../../utitlity/loggar'; // Ensure the path to LogLater is correct
import db from '../../../../database/dbConfig';
import QuizRepo from '../../../../database/repositories/web/v1/QuziRepo';
import responseModules from '../../../../utitlity/ResponseModules';

const AuthController = new Elysia();

// Helper function to determine the protocol (http/https)
const getProtocol = (request: Request): string => {
    // Safely retrieve the 'x-forwarded-proto' header if it exists, otherwise assume 'http'
    return request.headers.get('x-forwarded-proto') || 'http';
};

// Define the /auth route group
AuthController.group('/auth', (group) => {

    // Define the /login route under /auth
    group.get('/login', async ({ request, response }: Context) => {

        // Log initialization
        const asiaTime = new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' });
        const logDate: string = dateFormat(asiaTime, "yyyy-mm-dd");
        const logfileAccess = new LogLater(`src/logs/access-log-${logDate}.log`);
        const logfileError = new LogLater(`src/logs/error-log-${logDate}.log`);

        try {
            
            // Determine protocol and construct full URL
            const protocol = getProtocol(request);
            const host = request.headers.get('host') || 'localhost';
            const fullUrl: string = `${request.url}`;

            // Log access details
            logfileAccess.dateline(`${host} | ${fullUrl} | ${request.headers.get('user-agent')}`);

            // Example MSISDN
            const formattedMsisdn: string = "8801841288299";

            // Perform database query
            const data = await new Promise((resolve, reject) => {
                db.query(QuizRepo.quizParticipateCheck(formattedMsisdn), (err: Error | null, data: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Query executed successfully 1');
                        resolve(data);
                    }
                });
            });

            // Log successful query
            console.log('Query executed successfully 2');
            // Return success response
            return responseModules.success("Query check successfully");

        } catch (err: unknown) {
            // Handle unexpected errors
            const error = err as Error;
            logfileError.dateline(`${request.headers.get('host')} | ${request.url} | ${error.message} | ${error.stack} | ${request.headers.get('user-agent')}`);
            // Return error response
            return responseModules.errors(error.message);
        }
    });

    return group;
});


export default AuthController;
