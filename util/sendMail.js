const nodemailer = require('nodemailer');
var config = require('../env.json')[process.env.NODE_ENV || 'development'];
 
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASSWORD
    }
  });
  module.exports.sendMail=function(data, mailType = "foodOrder"){
	return new Promise(function(resolve,reject){
    var body = "";
    var subject = "";
    if(mailType == "foodOrder"){
      subject = "New order recevied";
       body = `<div style="border: 1px solid; padding-left:10px;padding-bottom:10px;">
      <div><h4>Shipping Details</h4><br />
      <div><strong>Name:</strong> ${data.shipping.name}</div>
      <div><strong>Address:</strong> ${data.shipping.address}</div>
      <div><strong>Phone:</strong> ${data.shipping.phone}</div>
      <div><strong>City:</strong> ${data.shipping.city}</div>
      </div>
      </div>
      <br>
      <div style="border: 1px solid; padding-left:10px;padding-bottom:10px;">
      <div><h4>Item Details</h4><br />
      ${data.items.map(itm=>{
        return `<div style="border: 1px solid; padding-left:10px; padding-bottom:10px; margin-bottom:10px"><div><strong>Title:</strong> ${itm.item.title}</div>
        <div><strong>Description:</strong> ${itm.item.description}</div>
        <div><strong>Quantity:</strong> ${itm.quantity}</div>
        <div><strong>Total price:</strong> ${parseInt(itm.quantity)*itm.item.price}</div>
        </div>`
      })}
      </div>`
    }else if(mailType == "form16"){
      subject = "New Form16 recevied";
      body = `<div style="border: 1px solid; padding-left:10px;padding-bottom:10px;">
                <div><h4>Contact Details</h4><br />
                <div><strong>Phone:</strong> ${data.phone}</div>
                </div>
                </div>
                <br>
            </div>`;
    }else if(mailType == "ITR"){
      subject = "New ITR request recevied";
      body = `<div style="border: 1px solid; padding-left:10px;padding-bottom:10px;">
      <div><h4>Contact Details</h4><br />
        <div><strong>FirstName:</strong> ${data.firstName}</div>
        <div><strong>LastName:</strong> ${data.lastName}</div>
        <div><strong>Address:</strong> ${data.address}</div>
        <div><strong>Phone:</strong> ${data.phone}</div>
      </div>
      </div>`
    }else if(mailType == "inquery"){
      subject = "New inquery recevied";
      body = `<div style="border: 1px solid; padding-left:10px;padding-bottom:10px;">
      <div><h4>Contact Details</h4><br />
        <div><strong>FullName:</strong> ${data.fullName}</div>
        <div><strong>Business:</strong> ${data.business}</div>
        <div><strong>Email:</strong> ${data.email}</div>
        <div><strong>Phone:</strong> ${data.phone}</div>
        <div><strong>Gender:</strong> ${data.gender}</div>
        <div><strong>Service:</strong> ${data.service}</div>
      </div>
      </div>`

    }

        var mailOptions = {
            from: config.SMTP_USER,
            to: config.ORDER_ADMIN_MAIL,
            subject: subject,
            html: body
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              reject(error);
            } else {
              console.log('Email sent: ' + info.response);
              resolve(info.response);
            }
         });        
      })    
    }
