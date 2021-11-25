var unirest = require("unirest");
const API_key = "QEfl59gTwVNLM2Z8zdnp4o1rC06hcWROxPSvBJkmUuiFeqKb7HVBQOl3ZFX9YMPyG5qbow0vUnmAex1N";
const sender_id = "AAMHFF"
const sendAccountDeposit = (payload)=>{
    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
    req.query({
      "authorization": API_key,
      "sender_id": sender_id,
      "message": "133277",
      "variables_values": payload.messageVar,
      "route": "dlt",
      "numbers": payload.phone,
    });
    req.headers({
      "cache-control": "no-cache"
    });       
    req.end(function (res) {
      if (res.error) throw new Error(res.error);
    
      console.log(res.body);
      return;
    });
    
}
const accountCloseRequest = (payload)=>{
  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
  req.query({
    "authorization": API_key,
    "sender_id": sender_id,
    "message": "133278",
    "variables_values": payload.messageVar,
    "route": "dlt",
    "numbers": payload.phone,
  });
  req.headers({
    "cache-control": "no-cache"
  });       
  req.end(function (res) {
    if (res.error) throw new Error(res.error);
  
    console.log(res.body);
    return;
  });
  
}
const accountClosed = (payload)=>{
  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
  req.query({
    "authorization": API_key,
    "sender_id": sender_id,
    "message": "133279",
    "variables_values": payload.messageVar,
    "route": "dlt",
    "numbers": payload.phone,
  });
  req.headers({
    "cache-control": "no-cache"
  });       
  req.end(function (res) {
    if (res.error) throw new Error(res.error);
  
    console.log(res.body);
    return;
  });
  
}

module.exports = {
    sendAccountDeposit,
    accountCloseRequest,
    accountClosed
  };