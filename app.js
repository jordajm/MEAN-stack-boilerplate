/*jshint node:true*/
'use strict';
var fs = require('fs-extra'),
    config = require('./config'),
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicons'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    http = require('http'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    passport = require('passport'),
    passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose');


var app = express();

function onDatabaseConnected() {

    if(process.env['NODE_ENV'] !== 'dev'){
        process.env['NODE_ENV'] = 'production';
    }

    // Create the /uploads directory if it doesn't already exist
    fs.mkdirs('./uploads', function (err) {
      if (err) { return console.error(err); }
      console.log('success!');
    });

    global.appRoot = path.resolve(__dirname);

    app.config = config;

    app.server = http.createServer(app);

    require('./models')(app, mongoose);


    /**
    *   Configure Session / Auth
    **/

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret,
        store: new mongoStore({ mongooseConnection: app.db })
    }));

    app.use(methodOverride());
    app.use(cookieParser(config.cookieSecret));
    app.use(passport.initialize());
    app.use(passport.session());

    // passport config
    // app.db.models.Account = require('./schema/account');
    // app.db.models.Account.plugin(passportLocalMongoose);
    passport.use(new LocalStrategy(app.db.models.Account.authenticate()));
    passport.serializeUser(app.db.models.Account.serializeUser());
    passport.deserializeUser(app.db.models.Account.deserializeUser());



    app.set('port', config.port);
    app.set('views', path.join(__dirname, 'views'));


    // server.on('error', onError);
    // app.server.on('listening', onListening);

    // uncomment after placing your favicon in /public
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    // app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    app.use(cors());

    var staticOptions = {
        maxage: 31536000000
    };

    switch(process.env.NODE_ENV){
        case 'production': {
            app.use(express.static(path.join(__dirname, '/adminBuild'), staticOptions));
            app.use(express.static(path.join(__dirname, '/displayBuild'), staticOptions));
            app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticOptions));
            break;
        }
        default: {
            app.use('/src/client', express.static(path.join(__dirname, 'src/client')));
            app.use('/.adminTmp', express.static(path.join(__dirname, '.adminTmp')));
            app.use('/.displayTmp', express.static(path.join(__dirname, '.displayTmp')));
            app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
            app.use('/material-icons', express.static(path.join(__dirname, 'material-icons')));
            app.use('/img', express.static(path.join(__dirname, 'img')));
            break;
        }
    }

    require('./routes')(app, passport);

    /**
    *  Create WebSocket
    **/

    // var io = require('socket.io')(app.server);
    // io.on('connection', function(socket) {

    //     app.socket = socket;

    //     console.log('websocket connection open');

    //     socket.on('disconnect', function() {
    //         console.log('websocket connection close');
    //         // clearInterval(id);
    //     });
    // });

    //setup utilities
      app.utility = {};
      app.utility.workflow = require('./util/workflow');


    // catch 404 and forward to error handler
    // app.use(function (req, res, next) {
    //     var err = new Error('Not Found');
    //     err.status = 404;
    //     next(err);
    // });

    // error handlers

    // development error handler
    // will print stacktrace
    // if (app.get('env') === 'development') {
    //     app.use(function (err, req, res, next) {
    //         res.status(err.status || 500)
    //             .json({
    //                 message: err.message,
    //                 error: err
    //             });
    //     });
    // }

    // production error handler
    // no stacktraces leaked to user
    // app.use(function (err, req, res, next) {
    //     res.status(err.status || 500)
    //         .json({
    //             message: err.message,
    //             error: {}
    //         });
    // });

    // function onListening() {
    //     var addr = app.server.address();
    //     var bind = typeof addr === 'string'
    //         ? 'pipe ' + addr
    //         : 'port ' + addr.port;
    //     debug('Listening on ' + bind);
    // }

    app.server.listen(config.port);

}

app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  onDatabaseConnected();
});





