const express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Devices = require('../schema/Devices'),
    Client = require('../schema/Client'),
    User = require('../schema/Users'),
    DeviceParams = require('../schema/DeviceParams'),
    MonthFinances = require('../schema/MonthFinances'),
    schedule = require('node-schedule'),
    middlewareObject = require('../middleware/index');
    escape = require('escape-regexp');
let searchClient = [];

const progressBar = require('../modules/progressBar'),
    calculateProfit = require('../modules/calculateProfit'),
    models = require('../modules/modelsArray');

router.get('/', (req, res, next) => {
    Devices.find({}, (err, device) => {
        if (err) {
            console.log(err);
        } else {
            let modelsJSON = [];
            let modelsCount = [];
            let counter = 0;
            let start = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss");
            let startYear = moment().startOf('year').format("YYYY-MM-DD HH:mm:ss");
            Devices.find().and([{"status": 'Recieved'}, {lastChange: {$gt: start}}]).exec((err, deviceToday) => {
                if (err) {
                    console.log(err)
                } else {
                    Devices.find().and([{"status": 'Recieved'}, {lastChange: {$gt: startYear}}]).exec(async (err, deviceYear) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let profit = calculateProfit(deviceToday);
                            let profitYear = calculateProfit(deviceYear);
                            DeviceParams.find({}).exec((err, models) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    models.forEach(async (modelsE) => {
                                        Devices.countDocuments({model: modelsE.model}).exec().then(count => {
                                            modelsJSON.push({[modelsE.model]: count});
                                            modelsCount.push(count);
                                            counter++;
                                            if (counter == models.length) {
                                                Client.find().limit(10).exec((err, limited) => {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        let index = modelsCount.indexOf(Math.max(...modelsCount));
                                                        let show = Object.keys(modelsJSON[index]);
                                                        res.render('index', {
                                                            device,
                                                            deviceToday,
                                                            limited,
                                                            profit,
                                                            profitYear,
                                                            deviceYear,
                                                            modelsJSON,
                                                            show
                                                        });
                                                    }
                                                })
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
router.get('/data', (req, res) => {
    MonthFinances.find().exec((err, devices) => {
        if (err) {
            console.log(err)
        } else {
            res.send(devices);
        }
    })
});

let j = schedule.scheduleJob('27 22 * * *', function () {
    let start = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss");
    Devices.find().and([{"status": 'Recieved'}, {lastChange: {$gt: start}}]).exec((err, devices) => {
        if (err) {
            console.log(err);
        } else {
            if (devices.length > 0) {
                devices.forEach(deviceE => {
                    MonthFinances.create({
                        price: deviceE.price,
                        created: Date.now(),
                        profit: deviceE.price - deviceE.costOfRepair,
                        costOfRepair: deviceE.costOfRepair
                    }, (err, month) => {
                        if (err) {
                            console.log(err)
                        } else {
                            month.save();
                        }
                    })
                });
            }
        }
    })
});

let month = schedule.scheduleJob('1 * *', () => {
    MonthFinances.remove({}, (err) => {
        if (err) {
            console.log(err)
        }
    })
});

router.get('/devices',middlewareObject.checkPermission,(req, res) => {
    let perPage = 10;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    if (req.user) {
        User.findById(req.user._id).exec((err, user) => {
            if (err) {
                console.log(err);
            } else {
                typeof user.perPage != undefined ? perPage = user.perPage : perPage = 10;
                if (user && user.perPage != undefined) {
                    let sort = {id: -1};
                    switch (user.sort) {
                        case 1:
                            sort = {id: -1};
                            break;
                        case 2:
                            sort = {created: -1};
                            break;
                        case 3:
                            sort = {dayOfEnd: -1};
                            break;
                        case 4:
                            sort = {status: -1};
                            break;
                    }
                    Devices.find({}).populate('client').skip((perPage * pageNumber) - perPage).limit(perPage).sort(sort).exec((err, devices) => {
                        Devices.countDocuments().exec((err, count) => {
                            if (err) {
                                console.log(err);
                            } else {
                                progressBar(devices);
                                Client.find().limit(10).exec((err, limited) => {
                                    res.render('devices/index', {
                                        devices, progress, models, limited, current: pageNumber,
                                        pages: Math.ceil(count / perPage)
                                    });
                                })
                            }
                        })
                    })
                } else {
                    Devices.find({}).populate('client').skip((perPage * pageNumber) - perPage).limit(perPage).sort({id: -1}).exec((err, devices) => {
                        Devices.countDocuments().exec((err, count) => {
                            if (err) {
                                console.log(err);
                            } else {
                                progressBar(devices);
                                Client.find().limit(10).exec((err, limited) => {
                                    res.render('devices/index', {
                                        devices, progress, models, limited, current: pageNumber,
                                        pages: Math.ceil(count / perPage)
                                    });
                                })
                            }
                        })
                    })
                }
            }
        })
    } else {
        Devices.find({}).populate('client').skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, devices) => {
            Devices.countDocuments().exec((err, count) => {
                if (err) {
                    console.log(err);
                } else {
                    progressBar(devices);
                    Client.find().limit(10).exec((err, limited) => {
                        res.render('devices/index', {
                            devices, progress, models, limited, current: pageNumber,
                            pages: Math.ceil(count / perPage)
                        });
                    })
                }
            })
        })
    }
});

router.get('/devices/add',middlewareObject.checkPermission, (req, res, next) => {
    res.render('devices/addClient');
});
router.get('/devices/:client_id/addDevice',middlewareObject.checkPermission, (req, res) => {
    Client.findById(req.params.client_id, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            DeviceParams.find({}, ((err, model) => {
                if (err) {
                    console.log(err);
                } else {
                    Client.find().limit(10).exec((err, limited) => {
                        res.render('devices/addDevice', {client, model, limited});
                    })
                }
            }));
        }
        ;
    });
});

router.post('/devices/addClient',middlewareObject.checkPermission, (req, res) => {
    let clientDB = {
        clientName: req.body.clientName,
        contact: req.body.contact,
        address: req.body.address,
        email: req.body.email,
        nip: req.body.nip
    };
    Client.create(clientDB, (err, client) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Klient dodany');
            res.redirect('/service/devices/' + client._id + '/addDevice');
        }
    })
});
router.post('/devices/:client_id/addDevice',middlewareObject.checkPermission, (req, res) => {
    Client.findById(req.params.client_id, (err, client) => {
        if (err) {
            console.log(err);
        } else {
            let manufacturer = req.body.manufacturer,
                model = req.body.model,
                imei = req.body.imei,
                warranty = req.body.warranty,
                express = req.body.express,
                repair = req.body.repair,
                findMyiPhone = req.body.findMyiPhone,
                condition = req.body.condition,
                data = req.body.data,
                lockCode = req.body.lockCode,
                dayOfEnd = moment(Date.now()).add(14, 'days');
            console.log(req.body.warranty + 'warranty')
            let parsed = {manufacturer, model, imei, warranty, express, repair, dayOfEnd,findMyiPhone,condition,data,lockCode};
            console.log(parsed);
            Devices.create(parsed, (err, device) => {
                if (err) {
                    console.log(err);
                } else {
                    device.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log(device);
                    client.devices.push(device);
                    device.client.push(client);
                    client.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    req.flash('success', 'Urządzenie przypisane');
                    res.redirect('/service/devices');
                }
            })
        }
    })
});

router.get('/devices/:device_id',middlewareObject.checkPermission, (req, res) => {
    Devices.findById(req.params.device_id).populate('client').exec((err, device) => {
        if (err) {
            console.log(err);
        } else {
            progressBar(device);
            let profit = calculateProfit(device);
            Client.find().limit(10).exec((err, limited) => {
                res.render('devices/desc', {device, progress, limited, profit});
            });
        }
    })
});

router.get('/devices/:device_id/addDiagnose',middlewareObject.checkPermission, (req, res) => {
    Devices.findById(req.params.device_id).exec((err, device) => {
        if (err) {
            console.log(err);
        } else {
            console.log(device);
            Client.find().limit(10).exec((err, limited) => {
                res.render('devices/adds/addDiag', {device, limited});
            });
        }
    })
});
router.get('/devices/:device_id/addResult',middlewareObject.checkPermission, (req, res) => {
    Devices.findById(req.params.device_id).exec((err, device) => {
        if (err) {
            console.log(err);
        } else {
            console.log(device);
            Client.find().limit(10).exec((err, limited) => {
                res.render('devices/adds/addResult', {device, limited});
            });
        }
    })
});

router.put('/devices/:device_id/changeStatus',middlewareObject.checkPermission, (req, res) => {
    console.log(req.params.device_id);
    Devices.update({_id: req.params.device_id}, {
        status: req.body.status,
        lastChange: req.body.lastChange
    }, (err, device) => {
        if (err) {
            console.log(err);
        } else {
            console.log(device);
            req.flash('success', 'Status changed');
            res.redirect('/service/devices');
        }
    });
});

router.put('/devices/',middlewareObject.checkPermission, (req, res) => {
    if (req.user) {
        User.findByIdAndUpdate(req.user._id, {sort: req.body.sort}).exec((err, user) => {
            if (err) {
                console.log(err);
            } else {
                console.log(user);
                res.send({result: "success"})
            }
        })
    }
});

router.put('/devices/:device_id/addDiagnose',middlewareObject.checkPermission, (req, res) => {
    Devices.update({_id: req.params.device_id}, {diagnose: req.body.diagnose, price: req.body.price}, (err, device) => {
        if (err) {
            console.log(err);
        } else {
            console.log(device);
            req.flash('success', 'Diagnose for device added');
            res.redirect('/service/devices/' + req.params.device_id);
        }
    });
});
router.put('/devices/:device_id/addResult',middlewareObject.checkPermission, (req, res) => {
    Devices.update({_id: req.params.device_id}, {
        result: req.body.result,
        price: req.body.price,
        costOfRepair: req.body.costOfRepair
    }, (err, device) => {
        if (err) {
            console.log(err);
        } else {
            console.log(device);
            req.flash('success', 'Result for device added');
            res.redirect('/service/devices/' + req.params.device_id);
        }
    });
});

router.get('/search',middlewareObject.checkPermission, (req, res) => {
    let search = req.query.q;
    console.log(req.query.q);
    Client.find().or([{
        clientName: {
            $regex: new RegExp(escape(search)),
            '$options': 'i'
        }
    }, {contact: {$regex: new RegExp(escape(search))}}
        , {address: {$regex: new RegExp(escape(search)), '$options': 'i'}}, {
            email: {
                $regex: new RegExp(escape(search)),
                '$options': 'i'
            }
        }
        , {nip: {$regex: new RegExp(escape(search))}}]).populate('devices').limit(10).exec((err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (isNumeric(search)) {
                Devices.find().or([{
                    model: {
                        $regex: new RegExp(escape(search)),
                        '$options': 'i'
                    }
                }, {
                    imei: {
                        $regex: new RegExp(escape(search)),
                        '$options': 'i'
                    }
                }, {id: search}]).populate('client').limit(10).exec((err, result2) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result.length);
                        console.log(result2);
                        if (result.length == 0) {
                            res.json(result2)
                        } else {
                            res.json(result)
                        }
                    }
                });
            } else {
                Devices.find().or([{
                    model: {
                        $regex: new RegExp(escape(search)),
                        '$options': 'i'
                    }
                }, {
                    imei: {
                        $regex: new RegExp(escape(search)),
                        '$options': 'i'
                    }
                }]).populate('client').limit(10).exec((err, result2) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result.length);
                        console.log(result2);
                        if (result.length == 0) {
                            res.json(result2)
                        } else {
                            res.json(result)
                        }
                    }
                });
            }
        }
    });
});

router.delete('/devices/:device_id/remove',middlewareObject.checkPermission,(req,res)=>{
    Devices.findByIdAndRemove(req.params.device_id,(err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('back');
        }
    })
});

router.post('/devices/:device_id/addRepair',middlewareObject.checkPermission, (req, res) => {
    Devices.findByIdAndUpdate({_id: req.params.device_id}, {repair: req.body.repair}, (err, device) => {
        if (err) {
            console.log(err)
        } else {
            console.log(device);
            res.send({result: "success"})
        }
    });
});

router.post('/addModel/',middlewareObject.checkPermission, (req, res) => {
    console.log(req.body.addModel);
    DeviceParams.create({model: req.body.addModel}, (err, model) => {
        if (err) {
            console.log(err);
        } else {
            console.log(model);
            model.save();
            res.send({result: "success"})
        }
    });
});

router.get('/searchClient',middlewareObject.checkPermission, (req, res) => {
    let search = req.query.q;
    Client.find().or([{
        clientName: {
            $regex: new RegExp(escape(search)),
            '$options': 'i'
        }
    }, {contact: {$regex: new RegExp(escape(search))}}
        , {address: {$regex: new RegExp(escape(search)), '$options': 'i'}}, {
            email: {
                $regex: new RegExp(escape(search)),
                '$options': 'i'
            }
        }
        , {nip: {$regex: new RegExp(escape(search))}}]).limit(10).exec((err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.render('devices/addClient', {result})
        }
        ;
    });
});

function isNumeric(n) {
    if (!isNaN(n)) {
        return true
    } else {
        return false
    }
}


router.post('/search',middlewareObject.checkPermission, (req, res) => {
    console.log(req.body.search + " search");
    Devices.find({_id: req.body.search}).populate('client').exec((err, search) => {
        if (err) {
            console.log(err);
        } else {
            console.log(search);
            res.render('search', {search});
        }
    });
});




module.exports = router;