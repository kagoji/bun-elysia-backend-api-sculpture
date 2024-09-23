import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dateFormat from 'dateformat';
import LogLater from '../utitlity/loggar'; 




// Initialize Express app
const app = express();

// Serve favicon
// Handle favicon request if you don't want to use a favicon
app.get('/favicon.ico', (req: Request, res: Response) => res.status(204).end());

// Set up middleware and configurations
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set max event listeners to avoid warnings
require('events').EventEmitter.defaultMaxListeners = 0;


/**
 * Controller Path
 */


/***************For version 1 WEB API *******************/
import AuthController from '../api/web/v1/auth/AuthController';


/**
 * Route
 */

/***************For version 1 WEB API *******************/
app.use("/api/web/v1/auth", AuthController);


// Middleware to handle undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
    // Create an error object with a message
    const err = new Error("Not Found") as Error & { status?: number };
    
    // Set the status to 404
    err.status = 404;
    
    // Pass the error to the next middleware (usually an error handler)
    next(err);
});

app.get('/favicon.ico', (req: Request, res: Response) => res.status(204).end());
// Global error-handling middleware
app.use((err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    // Get the current date in Dhaka timezone
    const asiaTime = new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' });
    const logDate = dateFormat(asiaTime, "yyyy-mm-dd");

    // Create a new log file for errors with the current date
    const logfileError = new LogLater(`logs/error-log-${logDate}.log`);

    // Construct the full URL of the request
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    // Log the error details including hostname, URL, error message, stack trace, and user-agent
    logfileError.dateline(`${req.hostname} | ${fullUrl} | ${err.message} | ${err.stack} | ${req.get('user-agent')}`);

    // Send an error response back to the client
    res.status(err.status || 508).json({
        error: {
            code: err.status || 508,
            message: err.message
        }
    });
});

export default app;
