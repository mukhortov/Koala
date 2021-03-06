/* Koala.js
 * written by Colin Kuebler 2011-2012
 * Part of The Koala Project, licensed under GPLv3
 * The main entry point for in browser koala web application
 */

var koala = {
	version: 0.05,
	services: {},
	apps: {}
};

window.onload = function(){
	$("version").innerHTML = koala.version.toFixed(2) + ' ' +
		( koala.version < 1 ? koala.version < 0.1 ? 'alpha' : 'beta' : '' );
	
	koala.services = {
		layout: new GridLayout( $("content"), $("float"), $("header"), 1000 ),
		lexer: new Lexer(),
		server: new Server(),
		animator: new Animator(),
		fs: new FS() };
	
	koala.services.compiler = new Compiler( koala.services.lexer );
	koala.services.user = new User( koala.services.server );
	
	koala.apps = {
		stage: new Stage(),
		dictionary: new Dictionary(),
		files: new FileBrowser( koala.services.fs ) };
	
	koala.apps.editor = new Editor( koala.services.lexer, koala.apps.stage );
	
	koala.apps.files.defaultApps = {
		'text': koala.apps.editor.open,
		'application': koala.apps.stage.open
	};
	
};

