const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    passport = require('passport'),
    mongooseAI = require('mongoose-auto-increment'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override'),
    expressSanitazer = require('express-sanitizer'),
    moment = require('moment'),
    flash = require('connect-flash'),
    User = require('./schema/Users'),
    schedule = require('node-schedule'),
    middlewareObject = require('./middleware/index');
Devices = require('./schema/Devices');
const blocked = require('blocked');
setInterval(function () {
    Array(10000000).join('a')
}, 500);


setInterval(function () {
    Array(100000000).join('a')
}, 3000);

blocked(function (ms) {
    console.log('BLOCKED FOR %sms', ms | 0);
});


const indexRoutes = require('./routes/index'),
    customersRoutes = require('./routes/customers'),
    authRoutes = require('./routes/auth');

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI || 'mongodb+srv://jacob:Bossboss123!@cluster0-l1aiw.mongodb.net/iplanet_care?retryWrites=true';
mongoose.connect(databaseUri, {useNewUrlParser: true})
    .then(() => console.log(`Database connected`))
    .catch(err => console.log(`Database connection error: ${err.message}`));

// view engine setup
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitazer());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'To jest sekretne haslo',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(err, user);
    })
}));
moment.tz.setDefault('Europe/Warsaw');

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.search = '';
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
app.locals.moment = require('moment');
var notAuthenticated = {
    flashType: 'error',
    message: 'The entered credentials are incorrect',
    redirect: '/login'
};
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/customers', middlewareObject.checkPermission, customersRoutes);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(process.env.PORT || 4000, process.env.ip, () => {
    console.log('Server has started');
});
