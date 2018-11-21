const route=require('express').Router();
const model = require("../models/db");
const {customer}=require("../models/customer");
const randomstring=require('randomstring');
var QRCode = require("qrcode");



route.get('/:id',(req,res)=>{

    model.user.findOne({
        eventname:req.params.id,
    }) .then((users)=>{
        res.render('registration',{users:users})
    })

});

route.post('/registration',(req,res)=>{
    const secretToken= randomstring.generate();
    customer.create({
        username: req.body.username,
        gender: req.body.gender,
        adharno: req.body.adharno,
        age:req.body.age,
        email:req.body.email,
        confirmed:false,
        secrettoken:secretToken

    }).then((createuser)=>{
        let a =secretToken;

       QRCode.toFile(
            "D://Projects",
            a,
            {
                color: {
                    dark: "#000000", // Blue dots
                    light: "#FFFFFF" // Transparent background
                }
            },
            function(err) {
                if (err) throw err;
                console.log("done");
            }
        );



        const html=`hi there ,<br/> Thank you for registering!<br/>
                    <br/>>please verify your email by adding the following token:<br/>
                    Token:<b>qr code{{secretToken}}</b>
                      <br/>On the following page:<a href="http://localhost:3000/verify">http://localhost:3000/verify</a><br/>Have a pleasant day`

        //send email
        console.log(createuser);
        res.render('alt',{createuser:createuser});
        // mailer.sendEmail('mycoupon@company.com',createuser.email,'please verify your email',html)



    }).catch((err)=>{
        console.log(err);
    })
});

exports=module.exports=route;