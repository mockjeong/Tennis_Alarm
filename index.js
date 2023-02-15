const express = require('express')
const router = express.Router()
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');

router.get('/', function(request, response){
  // console.log('/', request.user);
  var fmsg = request.flash();
  //  console.log(fmsg);
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `
    <div style="color:red;">${feedback}</div>
    <h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block;">
    `,
    `<a href="/topic/create">create</a>`,
    auth.StatusUI(request,response)
  );
  response.send(html);
});

module.exports = router;