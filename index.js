const express = require('express')
const router = express.Router()

router.get('/', function(request, response){
  // console.log('/', request.user);
  // var fmsg = request.flash();
  // //  console.log(fmsg);
  // var feedback = '';
  // if(fmsg.success){
  //   feedback = fmsg.success[0];
  // }
  // var title = 'Welcome';
  // var description = 'Hello, Node.js';
  // // var list = template.list(request.list);
  // // var html = template.HTML(title, list,
  // //   `
  // //   <div style="color:red;">${feedback}</div>
  //   <h2>${title}</h2>${description}
  var html = 
  ` <!doctype html>
    <html>
    <head>
      <title>WEB1</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
    </body>
    </html>
  `
  //   <img src="/images/hello.jpg" style="width:300px; display:block;">
  //   `,
  //   `<a href="/topic/create">create</a>`,
  //   auth.StatusUI(request,response)
  // );
  response.send(html);
});

module.exports = router;