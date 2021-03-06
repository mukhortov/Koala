/* KoalaServer.js
 * written by Colin Kuebler 2012
 * Part of The Koala Project, licensed under GPLv3
 * Main entry point for the koala project server
 */

var KoalaServer = exports,
	log = require('./Logger.js').log('KoalaServer'),
	server = require('./WebServer.js'),
	users = require('./UserManager.js');

/***************************/

var HOST = '127.0.0.1',
	PORT = 8124;

var STATIC_FILES = [
	'elements.css',
	'favicon.ico',
	'index.html',
	'layout.css',
	'themes/basic.css',
	'themes/bg.png',
	'themes/black.css',
	'themes/gr.png',
	'themes/koalabird.css',
	'themes/koalabook.css',
	'themes/koalaplex.css',
	'themes/koalarch.css',
	'themes/silver.css',
	'icons/faenza.css',
	'icons/faenza.png',
	'images/home.png' ];

var STATIC_PATH = 'static/';

var JS_FILES = [
	'app/Animator.js',
	'app/Compiler.js',
	'app/Editor.js',
	'app/FileBrowser.js',
	'app/FS.js',
	'app/Koala.js',
	'app/PanelManager.js',
	'app/Parser.js',
	'app/Server.js',
	'app/TextareaDecorator.js',
	'app/User.js',
	'app/Utils.js' ];

var CSS_FILES = [
	'app/styles/TextareaDecorator.css' ];

/***************************/

for( var i = 0; i < STATIC_FILES.length; ++i )
	server.serve( STATIC_PATH, STATIC_FILES[i] );

for( var i = 0; i < JS_FILES.length; ++i )
	server.serve( '', JS_FILES[i] );

for( var i = 0; i < CSS_FILES.length; ++i )
	server.serve( '', CSS_FILES[i] );

server.post( '', function( request, respond ){
	var status, body;
	try {
		var obj = JSON.parse( request.data );
		var res = { 'status': 'Not implemented' };
		status = 200;
		body = JSON.stringify( res );
	} catch (e) {
		log.error(e);
		status = 404;
		body = '{"status":"Bad Query"}';
	}
	respond( status, 'text/json', body );
} );

server.post( 'login', function( request, respond ){
	var status, body;
	try {
		var obj = JSON.parse( request.data );
		if( obj.user && obj.key ){
			var res = users.login( obj.user, obj.key );
			status = res ? 200 : 201;
			body = JSON.stringify( res );
			log.debug( 'login ' + (res ? 'successful' : 'denied') );
		} else {
			log.debug('request missing user/key');
			status = 201;
			body = '';
		}
	} catch (e) {
		log.error(e);
		status = 404;
		body = '';
	}
	respond( status, 'text/json', body );
} );

server.post( 'logout', function( request, respond ){
	var status, body;
	try {
		var obj = JSON.parse( request.data );
		if( obj.user && obj.key ){
			var res = users.logout( obj.user, obj.key );
			status = res ? 200 : 201;
			body = JSON.stringify( res );
		} else {
			status = 201;
			body = '';
		}
	} catch (e) {
		log.error(e);
		status = 404;
		body = '';
	}
	respond( status, 'text/json', body );
} );

server.init( HOST, PORT );

