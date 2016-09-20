module.exports =  function(app){

	require('./module/auth/auth')(app);
	require('./module/upload/upload')(app);
	require('./module/test/test')(app);
	require('./module/chat/chat')(app);
    require('./module/notification/chat')(app);
    require('./module/notification/notification')(app);
    require('./module/useronline/useronline')(app); 
    require('./module/tools/tools')(app); 
    require('./module/notification/friend')(app);
    require('./module/widget/widget')(app);
    require('./module/cat/cat')(app);
	app.use('/', require('./routes/index'));
	app.use('/users', require('./routes/users'));
	//app.use('/auth', require('./module/auth/auth'));

	app.use('/forums/cat', require('./module/forums/cat'));


}
