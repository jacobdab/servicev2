const express = require('express'),
router = express.Router(),
User = require('../schema/Users'),
    Client = require('../schema/Client'),
    passport = require('passport'),
    passportLocalMongoose = require('passport-local-mongoose'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');

/* GET home page. */
router.get('/login', (req, res, next)=> {
    let urlHost = req.url;
    Client.find().limit(10).exec((err,limited)=> {
        res.render('auth/login',{urlHost,limited});
    })

});

router.post('/login', passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome!'
    }), function(req, res){
});


router.get('/register', (req,res)=>{
    Client.find().limit(10).exec((err,limited)=> {
        res.render('auth/register',{limited})
    })

});

router.post('/register',(req,res)=>{
    let newUser = new User({username: req.body.username, email : req.body.email,firstName : req.body.firstName
        ,lastName : req.body.lastName,dateOfBirth : req.body.dateOfBirth});
    /*if(req.body.adminCode === process.env.ADMIN_CODE) {
        newUser.isAdmin = true;
    }*/
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("auth/register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Hello " + req.body.username);
            res.redirect("/");
        });
    });
});
router.get('/logout', function(req, res){
        req.logout();
        req.flash("success", "See you soon!");
        res.redirect("/");
});
/*router.get('/forgot',(req,res)=>{
    res.render('auth/forgot');
});*/

router.get('/user/:id/',(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err)
        }else{
            res.render('auth/profile',{user});
        }
    })

});

router.get('/service/user/:id/',(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err)
        }else{
            Client.find().limit(10).exec((err,limited)=> {
                res.render('auth/profile',{user,limited});
            })
        }
    })

});

router.get('/user/:id/settings',(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err)
        }else{
            res.render('auth/settings',{user});
        }
    })
});

router.put('/users/:user_id/',(req,res)=>{
   User.findByIdAndUpdate({_id:req.params.user_id},{firstName:req.body.firstName,lastName:req.body.lastName,email:req.body.email,
       perPage:req.body.perPage}).exec((err,user)=>{
      if(err){
          console.log(err);
      }else{
          console.log('------------');
          console.log(user);
          res.redirect('back');
      }
   });
});


/*router.post('/forgot',(req,res,next)=>{
    async.waterfall([
        function (done) {
            crypto.randomBytes(20,(err,buf)=>{
                let token = buf.toString('hex');
                done(err,token);
            });
        },
        function (token,done) {
            User.findOne({email: req.body.email},(err,user)=>{
                if(!user){
                    req.flash('error', "Błędny email");
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save((err)=>{
                    done(err,token,user);
                });
            });
        },
        function (token,user,done) {
            let smtpTransport = nodemailer.createTransport({
                host: 'pocztaplus.pl',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth:{
                    user: 'info@iplanet.com.pl',
                    pass: process.env.IPLANETMAIL
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'info@iplanet.com.pl',
                subject: 'Reset hasła serwisant iPlanetCare',
                text: "Otrzymałeś tą wiadomość ,ponieważ wysłałeś zapytanie o zmianę hasła."+
                    "Kliknij poniższy link ,zatwierdź przyciskiem by przejść dalej.Potem podaj swoje nowe hasło."+
                    "http://" + req.headers.host +"/reset/" + token + "\n\n" +
                    "Jeśli nie wysyłałeś zapytania o reset hasła zignoruj tą wiadomość"
            };
            smtpTransport.sendMail(mailOptions,(err)=>{
                console.log('mail wysłany');
                req.flash('success', "Mail został wysłany do " + user.email + " z instrukcjami.")
                done(err,'done');
            });
        }
    ],function (err) {
        if(err) return next(err);
        res.redirect('/forgot')
    });
});

router.get('/reset/:token',(req,res)=>{
    User.findOne({resetPasswordToken: req.params.token,resetPasswordExpires:{$gt: Date.now()}},(err,user)=>{
        if(!user){
            req.flash('error', 'Błędny token lub jego czas przeminął');
            return res.redirect('/forgot');
        }
        res.render('auth/reset',{token: req.params.token});
    });
});

router.post('/reset/:token',(req,res)=>{
    async.waterfall([
        function (done) {
            User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now()}},(err,user)=>{
                if(!user){
                    req.flash('error','Błędny token lub jego czas przeminął');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm){
                    user.setPassword(req.body.password,(err)=>{
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save((err)=>{
                            req.logIn(user,(err)=>{
                                done(err,user);
                            });
                        });
                    })
                }else{
                    req.flash('error','Hasła nie są identyczne.');
                    return res.redirect('back');
                }
            });
        },
        function (user,done) {
            let smtpTrasnport = nodemailer.createTransport({
                host: 'pocztaplus.pl',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth:{
                    user: 'info@iplanet.com.pl',
                    pass: process.env.IPLANETMAIL
                }
            });
            let mailOptions ={
                to: user.email,
                from: 'info@iplanet.com.pl',
                subject: 'IplanetCare - Hasło zostało zmienione',
                text: 'Witaj, \n\n' +
                    'Twoje hasło do konta zostało zmienione dla użytkownika ' + user.email
            };
            smtpTrasnport.sendMail(mailOptions,(err)=>{
                req.flash('success', 'Hasło zostało zmienione');
                done(err);
            });
        }
    ],function (err){
        res.redirect('/');
    });
});*/





module.exports = router;
