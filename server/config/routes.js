/**
 * Created by mithundas on 12/31/15.
 */

var routes = require('../routes/indexRouter');
var userRoute = require('../routes/userRouter');


module.exports = function(app) {

    app.all("*",function(req,res,next){
        console.log('***** setting header ');
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        next();
    });
    app.use('/', routes);
    app.use('/api/user', userRoute);


// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.json(err);
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json(err);
    });
}