var express = require("express");
var app = express();
const bodyParser = require('body-parser');
var path = require('path');
var http = require("http");
require("./config");
// var sendObj = require("./util/sendMail")
// const financeRoutes = require("./controllers/finance");
 const usersRoutes = require("./controllers/users");
// const categoryRoutes = require("./controllers/category");
// const productRoutes = require("./controllers/product");
// const orderRoutes = require("./controllers/orders");
// const paymentRoutes = require("./controllers/payment")
 const memberGroupRoutes = require("./controllers/memberGroup")

// var PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Token,token');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

//app.use("/api/finance",financeRoutes);
app.use("/api/user",usersRoutes);
//app.use("/api/",categoryRoutes);
//app.use("/api/",productRoutes);
//app.use("/api/orders",orderRoutes);
//app.use("/api/payment",paymentRoutes);
app.use("/api/memberGroups",memberGroupRoutes);
  // app.use("/", (req, res, next) => {
//   // sendObj.sendMail().then(res=>{
//   //   console.log(res);
//   // }).catch(err=>{
//   //   console.log(err);

//   // })
//   // var newCat = new CategoryModel({ name: "cat1"});
//   // newCat.save(function(err){
//   //   console.log(err);
//   // })
//     return res.status(200).json("Welcome to auction website");
// })
// Send all other requests to the Angular app
// app.get('/api/download', (req, res) => {
//   //console.log(req.query);
//       //return res.status(200).json(req.query);

//   res.sendFile(path.join(__dirname, `Form16_pdfs/${req.query.fileName}`));
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
module.exports = app;
