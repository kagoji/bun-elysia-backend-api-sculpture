import dateFormat from 'dateformat';
import LogLater from '../utility/loggar'; 
import responseModules from '../utility/ResponseModules';
import { Elysia,Context } from 'elysia';
import { verifyToken } from './jwt';


/**
 * jwtGuard
 *
 * @param  { request }: Context
 * @return void
 */
export async function jwtGuard({ request }: Context): Promise<any> {
   

    try {
        console.log('jwtGuard logged successfully');
        const token = request.headers.get('authorization')?.split(' ')[1]; // Get token from Authorization header

        if (!token) {
            return responseModules.errors("Token is required");
        }
        const decoded = verifyToken(token);
        console.log(decoded);


    } catch (err: unknown) {
        // Initialize log file for error logs in case of an exception
        const asiaTime = new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' });
        const logDate: string = dateFormat(asiaTime, "yyyy-mm-dd");
        const logfileError = new LogLater(`src/logs/error-log-${logDate}.log`);
        const error = err as Error;
        console.log('Error during jwtGuard:', error);
        logfileError.dateline(`Error during jwtGuard: ${error}`);

        return responseModules.errors(error.message);
    }
}

/**
 * authUser
 *
 * @param  { request }: Context
 * @return void
 */
// Define the JWT guard function
export async function authUser({ request }: { request: any }): Promise<any> {
    try {
        console.log('authUser logged successfully');
        const token = request.headers.get('authorization')?.split(' ')[1]; // Get token from Authorization header

        if (!token) {
            return responseModules.errors("Token is required");
        }

        const decoded = verifyToken(token);
        request.user = decoded; //authorize user data binding

    } catch (err: unknown) {
     
        const error = err as Error;
        console.log('Error during authUser:', error);
        return responseModules.errors(error.message);
    }
}


