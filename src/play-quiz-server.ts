
import config  from "./utility/config";
import app from './routes/app';

// Create server
// Log port and server readiness
console.log('port', config.port);
app.listen(config.port);
console.log(`Sample app is listening on port ${config.port}`);
console.log(`ready on http://localhost:${config.port}`);
