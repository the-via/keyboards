import * as http from 'http';
import {Server} from 'node-static';
require('./build-all');

const fileServer = new Server('./dist');
const port = 5000;
http
  .createServer((req, res) => {
    fileServer.serve(req, res);
  })
  .listen(port);
console.log(`Successfully started up server on localhost:${port}`);
