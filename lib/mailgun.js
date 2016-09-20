var Mailgun = require('mailgun-js');
module.exports = new function(){
  var apiKey = 'key-878e35f184113b9e514598e5628dd59a';
  var domain = 'go.bazarn.com'
  var mailgun = new Mailgun({apiKey: apiKey, domain: domain});
  this.mailGun = mailgun.messages();

}
