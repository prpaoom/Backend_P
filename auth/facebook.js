var FacebookStrategy = require('passport-facebook').Strategy;
module.exports = function(app,passport){
	
	var option = {
		clientID:'962962330444189',
		clientSecret: 'd2be1acf0d61ceabb76e09797f3bb128',
		callbackURL: "http://services.ashita.io/auth/facebook/callback"	
	}
	passport.use(new FacebookStrategy(option,function(accessToken, refreshToken, profile, done) {
		profile.access_token = accessToken;
		profile.refresh_token = refreshToken;
		
		done(null, profile);
/*
	    User.findOrCreate(..., function(err, user) {
	      if (err) { return done(err); }
	      done(null, user);
	    });
*/
	  }
	));
	app.get('/auth/xxx', function(req, res){
		res.send('hello world');
	});
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback',passport.authenticate('facebook', { successRedirect: '/',failureRedirect: '/xxx' }));
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
		User.findById(id, function(err, user) {
			done(err, user);
  		});
	});
	
}