const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');



const User = require('../models/user');
const Token = require('../models/token');
const config = require('../config');

const tokenExpireTime = '30 days';

module.exports = {
    addUser: addUser,
    login: login,
    getUsers: getUsers,
    isLogin: isLogin,
    changePassword: changePassword,
    updateProfile: updateProfile,
    forgotPassword: forgotPassword,
    reset: reset,
    resetPassword: resetPassword
}

function addUser(req, res) {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;
        if (user) {
            res.status(400);
            return res.json({
                success: false,
                data: null,
                message: 'User already exist'
            });
        } else {
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                accountType: req.body.accountType
            });

            var salt = bcrypt.genSaltSync(10);
            newUser.password = bcrypt.hashSync(newUser.password, salt);

            newUser.save(function (err, user) {
                if (err) throw err;
                console.log('User saved successfully');

                var token = jwt.sign({ data: user }, config.secret, { expiresIn: tokenExpireTime });

                user.password = '';
                res.status(200);
                return res.json({
                    success: true,
                    message: 'Signup completed',
                    token: token,
                    data: user
                });

            });
        }
    });
}

function login(req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(400);
            return res.json({ success: false, message: 'User not found' });
        } else if (user) {
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(400);
                return res.json({ success: false, message: 'Wrong password' });
            } else {
                console.log(user);
                var token = jwt.sign({ data: user }, config.secret, { expiresIn: tokenExpireTime });
                user.password = '';
                res.status(200);
                return res.json({
                    success: true,
                    message: 'Login successful',
                    token: token,
                    data: user
                });
            }
        }
    });
}

function getUsers(req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
}

function isLogin(req, res, next) {
    User.findById(req.decoded.data._id).select('-password').exec((err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(400);
            return res.json({
                success: false,
                data: null,
                message: 'User not exist'
            });
        } else {
            res.status(200);
            return res.json({
                success: true,
                data: user,
                message: 'Continue...'
            });
        }
    })
}

function changePassword(req, res, next) {
    User.findById(req.body.id, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(400);
            return res.json({
                success: false,
                message: 'User not exist'
            });
        } else {
            var salt = bcrypt.genSaltSync(10);
            var newPassword = bcrypt.hashSync(req.body.newPassword, salt);
            console.log('New Password', newPassword);
            User.findByIdAndUpdate(req.body.id, { password: newPassword }, (err, success) => {
                if (err) throw err;

                res.status(200);
                return res.json({
                    success: true,
                    message: 'Your password has been changed',
                    data: null
                });
            })

        }
    })
}

function updateProfile(req, res, next) {
    User.findById(req.body.id, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(400);
            return res.json({
                success: false,
                message: 'User not found'
            });
        } else {
            let data = {
                name: req.body.name,
                phone: req.body.phone
            };

            User.findByIdAndUpdate(req.body.id, data, { new: true }, (err, success) => {
                if (err) throw err;

                res.status(200);
                res.json({
                    success: true,
                    message: 'Your profile has been updated',
                    data: success
                });
            })
        }
    })
}

function googleLogin(req, res, next) {
    User.findOne({ googleId: req.body.googleId }, (err, user) => {
        if (err) throw err;

        if (user) {
            console.log(user);
            var token = jwt.sign({ data: user }, config.secret, { expiresIn: tokenExpireTime });
            res.status(200);
            return res.json({
                success: true,
                message: 'Login successful',
                token: token,
                data: user
            });
        } else {
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                image: req.body.image,
                googleId: req.body.googleId
            });


            newUser.save(function (err, user) {
                if (err) throw err;
                console.log('User saved successfully');

                var token = jwt.sign({ data: user }, config.secret, { expiresIn: tokenExpireTime });

                user.password = '';
                res.status(200);
                return res.json({
                    success: true,
                    message: 'Signup completed',
                    token: token,
                    data: user
                });
            });
        }
    })
}

function facebookLogin(req, res, next) {
    User.findOne({ facebookId: req.body.facebookId }, (err, user) => {
        if (err) throw err;

        if (user) {
            console.log(user);
            var token = jwt.sign({ data: user }, config.secret, { expiresIn: tokenExpireTime });
            res.status(200);
            return res.json({
                success: true,
                message: 'Login successful',
                token: token,
                data: user
            });
        } else {
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                image: req.body.image,
                facebookId: req.body.facebookId
            });


            newUser.save(function (err, user) {
                if (err) throw err;
                console.log('User saved successfully');

                var token = jwt.sign({ data: user }, config.secret, { expiresIn: tokenExpireTime });

                user.password = '';
                res.status(200);
                return res.json({
                    success: true,
                    message: 'Signup completed',
                    token: token,
                    data: user
                });
            });
        }
    })
}

function fullSignup(req, res, next) {
    if (!req.body.id) {
        res.status(400);
        return res.json({
            success: false,
            data: null,
            message: 'Id not send'
        });
    } else {
        let data = {
            password: req.body.password
        };
        var salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);

        if (req.body.email) { data.email = req.body.email }

        if (req.body.phone) { data.phone = req.body.phone }

        User.findByIdAndUpdate(req.body.id, data, { new: true }, (err, user) => {
            if (err) throw err;

            res.status(200);
            return res.json({
                success: true,
                data: user,
                message: 'Signup has been completed'
            });
        });

    }
}

function forgotPassword(req, res, next) {
    if (!req.body.email) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Invalid credencials'
        });
    } else {
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.status(400);
                return res.json({
                    success: false,
                    message: 'User not found'
                });
            } else {
                const email = req.body.email;
                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: "jairanamailer@gmail.com", // generated ethereal user
                            pass: "8385803337"  // generated ethereal password
                        }
                    });

                    // setup email data with unicode symbols
                    const token = uuidv4();
                    console.log(token);
                    let mailOptions = {
                        from: '"Boiler Plate " <contact@boilerplate.com>', // sender address
                        to: email, // list of receivers
                        subject: 'Hello ✔', // Subject line
                        text: 'Hello world?', // plain text body
                        html: user.name + '<br><b>Hello world?</b><br>' +
                            '<a href="' + config.SERVER_URL + 'users/reset/' + token + '">Click here to reset password</a>'
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            throw error;
                        }
                        var newToken = new Token({
                            token: token,
                            userId: user._id
                        });
                        newToken.save();
                        return res.json({
                            success: true,
                            message: 'A password reset link has been sent to your email.'
                        });

                    });
                });
            }
        })
    }

}

function reset(req, res, next) {
    console.log(req.params.token);
    if (!req.params.token) {
        res.status(400);
        return res.json({
            error: true,
            message: 'Reset token not found'
        });
    } else {
        Token.findOne({ token: req.params.token }, function (err, tokenInfo) {
            if (err) throw err;

            if (!tokenInfo) {
                res.status(400);
                return res.json({
                    error: true,
                    message: 'Token not found'
                });
            } else {
                var currentTime = new Date();
                var tokenExpireTime = new Date(tokenInfo.createdAt);
                tokenExpireTime.setDate(tokenExpireTime.getDate() + 1);
                if (currentTime.getTime() > tokenExpireTime.getTime()) {
                    res.status(400);
                    Token.remove({ token: tokenInfo.token });
                    return res.json({
                        error: true,
                        message: 'Password reset link has been expired'
                    });
                } else {
                    User.findById(tokenInfo.userId, function (err, user) {
                        if (err) throw err;
                        res.render('password-reset', {
                            token: tokenInfo.token,
                            error: '',
                            redirectUrl: config.SERVER_URL + 'users/reset/' + tokenInfo.token
                        });
                    })
                }
            }

        });
    }

}


function resetPassword(req, res, next) {
    console.log(req.params.token);
    console.log(req.body.password);

    var password = req.body.password;
    // var confirm = req.body.confirm;



    if (!req.body.password) {
        res.render('password-reset', {
            token: req.params.token,
            error: 'Please enter password',
            redirectUrl: config.SERVER_URL + 'users/reset/' + req.params.token
        });
    } else if (req.body.password.length < 6) {
        res.render('password-reset', {
            token: req.params.token,
            error: 'Password at least 6 characters long',
            redirectUrl: config.SERVER_URL + 'users/reset/' + req.params.token
        });
    } else {
        Token.findOne({ token: req.params.token }, function (err, tokenInfo) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    User.findByIdAndUpdate(tokenInfo.userId, { password: hash }, function (err, success) {
                        if (err) throw err;

                        Token.remove({ userId: tokenInfo.userId }, function (err, success) {
                            if (err) throw err;
                        });
                        res.render('response');
                    })
                })
            })
        })

    }

}
