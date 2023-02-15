const express = require('express')
const app = express()
// var indexRouter = require('index.js');

// app.use('/', indexRouter);

app.use(function(req,res,next){
  res.status(404).send('Sorry cant find that');
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// var fs = require('fs');
// var bodyParser = require('body-parser');
// var compression = require('compression');
// var session = require('express-session');
// var flash = require('connect-flash');

// const express = require('express')
// const app = express()
const port = 3000
// var topicRouter = require('./routes/topic.js');

// var authRouter = require('./routes/auth.js');

// app.use(express.static('public'));

// app.use(compression());
// app.use(session({
//   secret: 'mouse',
//   resave: false,
//   saveUninitialized: true,
//   // store: new FileStore()
// }))
// app.use(flash());
// var passport = require('./lib/passport.js')(app)

// app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/auth/login_process', 
//   passport.authenticate('local', 
//   {
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
//     failureFlash : true,
//     successFlash : true
//   }
// ));

// app.get('*',function(request, response, next){
//   fs.readdir('./data', function(error, filelist){
//     request.list = filelist;
//     next();
//   });
// });

// app.use('/topic', topicRouter);
// app.use('/auth', authRouter);


// app.use(function(req,res,next){
//   res.status(404).send('Sorry cant find that');
// })

// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});
