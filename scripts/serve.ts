import * as http from 'http';
import {Server} from 'node-static';
// Generate legacy V2 definitions
require('./build');

const fileServer = new Server('./dist');
const port = 5000;
http
  .createServer((req, res) => {
    fileServer.serve(req, res);
  })
  .listen(port);
console.log(`Successfully started up server on localhost:${port}`);
