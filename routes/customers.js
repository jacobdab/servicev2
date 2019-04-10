const express = require('express'),
    router = express.Router(),
    Devices = require('../schema/Devices'),
    Client = require('../schema/Client');

const progressBar = require('../modules/progressBar'),
models = require('../modules/modelsArray');

/* GET users listing. */
router.get('/:client_id', (req, res, next)=> {
    console.log(req.params.id);
    Client.findById(req.params.client_id).populate('devices').exec((err,client)=>{
        if(err){
            console.log(err);
        }else {
            console.log(client);
            progressBar(client.devices);
            Client.find().limit(10).exec((err, limited) => {
                res.render('clients/show', {client, limited,models,progress});
            })
        }
    })
});
router.get('/:client_id/edit',(req,res)=>{
    Client.findById(req.params.client_id,(err,client)=>{
        if(err){
            console.log(err);
        }else{
            Client.find().limit(10).exec((err,limited)=> {
                res.render('clients/edit',{client,limited});
            })
        }
    })
});

router.put('/:client_id/edit',(req,res)=>{
   let parsed = {clientName:req.body.clientName,nip:req.body.nip,contact:req.body.contact}
   Client.findByIdAndUpdate(req.params.client_id, parsed,(err,client)=>{
      if(err){
          console.log(err);
          req.flash('error',err.message)
      }else{
          console.log(client);
          req.flash('success','Informację o kliencie zaktualizowane');
          res.redirect('/service/devices');
      }
   });
});



module.exports = router;
