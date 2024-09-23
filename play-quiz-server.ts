
import config  from "./utitlity/config";
import app  from "./routes/app";
import http from 'http';

const server = http.createServer(app);
console.log('port',config.port)
server.listen(config.port);
console.log('Sample app is listening on port ' + config.port);
console.log(`ready on http://localhost:${config.port}`);