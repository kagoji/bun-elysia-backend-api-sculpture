import dateFormat from 'dateformat';
import LogLater from '../utility/loggar'; 
import responseModules from '../utility/ResponseModules';
import { Context } from 'elysia';

const getProtocol = (request: Request): string => {
    return request?.headers?.get('x-forwarded-proto') || 'http';
};


export async function accessLogger({ request }: Context): Promise<any> {
    // Fetch current date and time in Asia/Dhaka timezone
    const asiaTime = new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' });
    // Format the date for log file naming
    const logDate: string = dateFormat(asiaTime, "yyyy-mm-dd");
    // Initialize the log file for access logs
    const logfileAccess = new LogLater(`src/logs/access-log-${logDate}.log`);

    try {
       
        const protocol = getProtocol(request);
        const host = request?.headers?.get('host') || 'localhost';
        const fullUrl: string = `${request?.url}`;
        const requestBody: any = request.body ? JSON.stringify(request.body) : null;
        logfileAccess.dateline(`${host} | ${fullUrl} | ${request?.headers?.get('user-agent')} | ${requestBody}`);
        console.log('Access logged successfully');

    } catch (err: unknown) {
        // Initialize log file for error logs in case of an exception
        const logfileError = new LogLater(`src/logs/error-log-${logDate}.log`);
        const error = err as Error;
        console.log('Error during logging:', error);
        logfileError.dateline(`Error during logging: ${error}`);

        return responseModules.errors(error.message);
    }
}


