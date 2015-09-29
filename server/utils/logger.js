var logger = require("bunyan");

module.exports.console = logger.createLogger({
    name: "whoSmarterConsole",
    streams: [{
        stream: process.stderr
        // `type: 'stream'` is implied
    }]
});

module.exports.server = logger.createLogger({
    name: "whoSmarterServer",
    streams: [{
        type: 'rotating-file',
        path: './logs/server.log',
        period: '1d',   // daily rotation
        count: 30        // keep back copies
    }],
    serializers: {
        req: reqSerializer
    }
});

module.exports.paypalIPN = logger.createLogger({
    name: "whoSmarterPayPalIPN",
    streams: [{
        type: 'rotating-file',
        path: './logs/paypal/paypalIPN.log',
        period: '1d',   // daily rotation
        count: 180        // keep back copies
    }],
    serializers: {
        req: reqSerializer
    }
});

module.exports.facebookIPN = logger.createLogger({
    name: "whoSmarterFacebookIPN",
    streams: [{
        type: 'rotating-file',
        path: './logs/facebook/facebookIPN.log',
        period: '1d',   // daily rotation
        count: 180        // keep back copies
    }],
    serializers: {
        req: reqSerializer
    }
});

//-------------------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------------------
function reqSerializer(req) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    }
}