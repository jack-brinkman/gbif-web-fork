const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

const app = express();
app.use(cors());
app.use(compression());
app.use(express.static('public'));
app.use(bodyParser.json());

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);

process.on('unhandledRejection', function(reason, p) {
    log.error('Unhandled Rejection at root: Promise ', p, ' reason: ', reason);
    // There is not much else to do here. Keep track of the logs and make sure this never happens. There should be no unhandled rejections.
});
process.on('uncaughtException', function(err) {
    // eslint-disable-next-line no-console
    console.error('FATAL: Uncaught exception.');
    console.error(err.stack || err);
    setTimeout(function() {
        process.exit(1);
    }, 200);
});