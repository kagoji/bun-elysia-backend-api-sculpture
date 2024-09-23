import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dateFormat from 'dateformat';
import LogLater from '../../../../utitlity/loggar'; // Ensure the path to LogLater is correct
import db from '../../../../database/dbConfig';
import QuizRepo from '../../../../database/repositories/web/v1/QuziRepo';
import responseModules from '../../../../utitlity/ResponseModules';

const router = express.Router();

/**
 * Quiz Registration OTP Send
 *
 * @param  mixed msisdn, participate_name, operator, participate_email
 * @return void
 */
router.get("/login", (req: Request, res: Response): void => {

    try {
        // Log initialization
        const asiaTime = new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' });
        const log_date: string = dateFormat(asiaTime, "yyyy-mm-dd");
        const logfile_access = new LogLater(`logs/access-log-${log_date}.log`);
        const logfile_error = new LogLater(`logs/error-log-${log_date}.log`);

        const fullUrl: string = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        logfile_access.dateline(`${req.hostname} | ${fullUrl} | ${req.get('user-agent')}`);

        const formatted_msisdn: string = "8801841288299"; // Example MSISDN

        db.query(QuizRepo.quizParticipateCheck(formatted_msisdn), (err: Error | null, data: any) => {
            if (!err) {
                // SMS SEND
                console.log('Query executed successfully');

                // Add your SMS sending logic here

                res.status(200).json(responseModules.success("Query check successfully"));
            } else {
                console.log('Error in Query');
                res.status(500).json(responseModules.errors(err.message));
            }
        });

    } catch (err: unknown) {
        // Handle unexpected errors
        const error = err as Error; // Type assertion for error
        logfile_error.dateline(`${req.hostname} | ${fullUrl} | ${error.message} | ${error.stack} | ${req.get('user-agent')}`);
        res.status(500).json(responseModules.errors(error.message)); // Use 500 for unexpected errors
    }
});

export default router;
