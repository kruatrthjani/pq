const express= require('express')
const nodemailer =require('nodemailer')
const otp=123456
function mail(otp){
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "pubgsgreat083@gmail.com",
    pass: "tfae oltc kvbp dqqd",
  },
});
const mailOptions = {
  from: "pubgsgreat083@gmail.com",
  to: "janikrutarth73@gmail.com",
  subject: `this is otp`,
  text: `this is ${otp}`,
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email: ", error);
  } else {
    console.log("Email sent: ", info.response);
  }
});
const otptime = new Date();        
}
module.exports={mail,otpime}
/*var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pubgsgreta083@gmail.com',
    pass: 'tfae oltc kvbp dqqd'
  }
});

var mailOptions = {
  from: 'pubgsgreat083@gmail.com',
  to: 'cricketplayers4335@gmail.com',
  subject: 'Sending Email using Node.js',
  text: '<p>That was easy!</p>',
}; 

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
	res.status(200).send('email send successfully')
  }
});*/