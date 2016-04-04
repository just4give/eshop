/**
 * Created by mithundas on 12/31/15.
 */

var routes = require('../routes/indexRouter');
var userRoute = require('../routes/userRouter');
var photoRouter = require('../routes/photoRouter');
var productRouter = require('../routes/productRouter');
var paymentRouter = require('../routes/paymentRouter');
var orderRouter = require('../routes/orderRouter');
var dashboardRouter = require('../routes/dashboardRouter');


module.exports = function(app) {

    app.all("*",function(req,res,next){

        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        next();
    });

    app.use('/api/users', userRoute);
    app.use('/api/photo',photoRouter);
    app.use('/api/products', productRouter);
    app.use('/api/payments', paymentRouter);
    app.use('/api/orders', orderRouter);
    app.use('/api/dashboard',dashboardRouter);
    app.use('/', routes);

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
            console.log("######## sending error ", err);
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