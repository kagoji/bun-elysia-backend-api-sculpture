import { Elysia, Context } from 'elysia';
import dateFormat from 'dateformat';
import LogLater from '../../../../utility/loggar'; // Ensure the path to LogLater is correct
import db from '../../../../database/dbConfig';
import QuizRepo from '../../../../database/repositories/web/v1/QuziRepo';
import responseModules from '../../../../utility/ResponseModules';
import { accessLogger } from '../../../../middleware/accessLogger';
import { jwtGuard,authUser } from '../../../../middleware/jwtGuard';
import { generateToken, verifyToken } from '../../../../middleware/jwt';


/**
 * AuthController
 *
 * @param  mixed msisdn,paritcipate_name,operator,paritcipate_email
 * @return void
 */

const AuthController = new Elysia();

// Define the /auth route group
AuthController.group('/auth', (group) => {

    //Acceslog Write
    group.onBeforeHandle(accessLogger)

    //Define the /login route under /auth
    group.get('/login', async ({ request, response }: Context) => {
       
        console.log('AuthController2');
        try {
            

            console.log('AuthController');
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
            return responseModules.success("Query check successfully",[{ accessToken: generateToken({ msisdn:formattedMsisdn }) }]);

        } catch (err: unknown) {
            // Handle unexpected errors
            const error = err as Error;
            //logfileError.dateline(`${request.headers.get('host')} | ${request.url} | ${error.message} | ${error.stack} | ${request.headers.get('user-agent')}`);
            // Return error response
            return responseModules.errors(error.message);
        }
    });

    //jwt token guard
    group.onBeforeHandle(jwtGuard)
    //authorize user data bind
    group.derive(authUser)
    group.get('/profile', async ({ request, response }: Context) => {
        console.log('profile executed successfully 2');
        const user = request?.user; //get authorize user data

        if (user) {
            return responseModules.success("authorized",[{user:user.msisdn}]); // Respond with user-specific information
        }

        return responseModules.errors("Unauthorized");
    });  
    
    

    return group;
});




export default AuthController;
