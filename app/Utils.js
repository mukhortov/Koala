/* Utils.js
 * written by Colin Kuebler 2011-2012
 * Part of The Koala Project, licensed under GPLv3
 * Various utility functions
 */

var MOD_DIR = '../apps/';

var require = function( module ){
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = MOD_DIR + module;
	document.body.appendChild(s);
};

// shortcut to grab an element by its ID
var $ = function(e){ return document.getElementById(e); };

// lightweight JSON polyfill
JSON || (JSON = {
	stringify: function stringify( obj ){
		var t = typeof( obj );
		// literals
		if( t !== "object" || obj === null ){
			// quote strings
			if( t === "string" ) obj = obj.quote();
			return String(obj);
		// arrays
		} else if( obj && obj.constructor === Array ){
			var elem = [];
			for( var n in obj )
				elem.push(stringify(obj[n]));
			return "["+elem+"]";
		// objects
		} else {
			var elem = [];
			for( var n in obj )
				elem.push(stringify(n)+':'+stringify(obj[n]));
			return "{"+elem+"}";
		}
	},
	parse: function( str ){
		// strict mode for safer eval (can't make globals)
		"use strict";
		var obj;
		try {
			eval( "obj = (" + str + ");" );
		} catch(e) {}
		return obj;
	}
});

// localStorage detection
var storage = (function() {
	var uid = new Date,
		result;
	try {
		localStorage.setItem(uid, uid);
		result = localStorage.getItem(uid) == uid;
		localStorage.removeItem(uid);
		return result && localStorage;
	} catch(e) {}
}());

// native object enhancements
RegExp.escape = function(x){
	return x.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
};

String.prototype.contains = function(x){
	return this.indexOf(x) !== -1;
};

String.prototype.suffix = function(delim){
	return this.substring( this.lastIndexOf(delim) + 1 || this.length );
};

String.prototype.quote || (String.prototype.quote = function(){
	return '"'+this.replace(/"/g,'\\"')+'"';
});

function toHex(s){
	var output = "";
	for( var i = 0; i < s.length; i++ )
		output += ('0' + s.charCodeAt(i).toString(16)).slice(-2);
	return output;
};

/*window.onerror = function( msg, url, line ){
	// construct an error report
	var report = {
		Location: url.suffix('/') + ':' + line,
		Message: msg,
		UserAgent: navigator.userAgent };
	// create a text representation of the report
	var reportStr = ''
	for( var i in report ) reportStr += i + ': ' + report[i] + '\n';
	// display the error report, ala BSOD easter egg
	document.body.style.background = "blue";
	document.body.innerHTML =
		"<div id='bsod'><h1>the koala project</h1><p>A fatal error has occurred. An error report is being filed. Report details:</p><pre>" +
		reportStr + "</pre><p>Press any key to continue</p></div>";
	document.onkeypress = function(){ location.reload(); };
	return true;
};*/

