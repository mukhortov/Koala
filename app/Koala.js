/* Koala.js
 * written by Colin Kuebler 2011-2012
 * Part of The Koala Project, licensed under GPLv3
 * The main entry point for in browser koala web application
 */

var koala = {
	version: 0.03,
	lang: {
		commands: {
			"say": null,
			"ask": null,
			"put": null,
			"in": null,
			"dojs": null
		},
		rules: {
			wsp: /^([^\S\t]+)/,
			arr: /^(\t)/,
			cmt: /^(--[^\r\n]*)/,
			str: /^("(\\.|[^"])*"?|'(\\.|[^'])*'?)/,
			box: /^(\[[^\]]*\]?)/,
			num: /^(-?(\d+\.?\d*|\.\d+))/,
			cmd: null,
			err: /^([^\s-"'\[\d]|-(?!-))+/
		},
		parser: null,
		genparser: function(){
			var rulesrc = [];
			for( var cmd in koala.lang.commands ){
				rulesrc.push( cmd );
			}
			koala.lang.rules.cmd = new RegExp( "^("+rulesrc.join('|')+")", "i" );
			rulesrc = [];
			for( var rule in koala.lang.rules ){
				rulesrc.push( koala.lang.rules[rule].source.substr(1) );
			}
			koala.lang.parser = new RegExp( rulesrc.join('|'), "gi" );
		},
		tokenize: function(input){
			if( !koala.lang.parser ) koala.lang.genparser();
			return input.match(koala.lang.parser);
		},
		assoc: function(token){
			for( var rule in koala.lang.rules ){
				if( koala.lang.rules[rule].test(token) ){
					return rule;
				}
			}
		}
	}
};

// creates a right click menu
function ContextMenu( options ){
	// generate the menu
	var menu = document.createElement("ul");
		menu.className = 'contextmenu';
	var keymap = {};
	for( var i in options ){
		var item = document.createElement("li");
			item.innerHTML = i.replace( /_(.)/, function(_,x){
				keymap[x.toUpperCase()] = options[i];
				return '<u>'+x+'</u>';
			} );
			item.onmousedown = options[i];
		menu.appendChild(item);
	}
	function openMenu(e){
		// position the menu at the mouse position
		e = e || window.event;
		menu.style.left = ( e.pageX || e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft )+'px';
		menu.style.top = ( e.pageY || e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop )+'px';
		document.body.appendChild(menu);
		// hide the menu on the next click
		document.onmousedown = closeMenu;
		// cancel the default action
		return false;
	};
	function closeMenu(){
		document.body.removeChild(menu);
		document.onmousedown = null;
	};
	return openMenu;
};

var parser, editor, compiler, server, user, anim, pm, fs, fbrowser;
window.onload = function(){
	// TODO
	// testing...
	parser = { tokenize: koala.lang.tokenize, identify: koala.lang.assoc };
	
	editor = new Editor( parser );
	
	compiler = new Compiler( parser );
	
	server = new Server();
	
	user = new User( server );
	
	anim = new Animator();
	
	function ToggleMenu( elem ){
		var lock = false;
		function set(){ lock = true; };
		function reset(){ lock = false; };
		var form = elem.children[0];
		/* var fields = form.elements;
		for( var i = 0; i < fields.length; i++ ){
			fields[i].onfocus = set;
			fields[i].onblur = reset;
		} */
		elem.onmousedown = set;
		elem.onmouseup = reset;
		elem.onmouseover = function(){
			form.style.display = 'block';
		};
		elem.onmouseout = function(){
			lock || (form.style.display = '');
		};
	};
	
	toolbar = {
		settings: $("toolbar_settings"),
		login: $("toolbar_login") };
	
	for( var menu in toolbar ) new ToggleMenu(toolbar[menu]);
	
	pm = new PanelManager( $("content"), $("float"), $("footer"), 1000 );
	
	fs = new FS();
	fbrowser = new FileBrowser( fs, {
		'text': editor.open
	} );
	
	$("btn_new").onclick = fbrowser.addFolder;
	
	// context menu test
	$("files").oncontextmenu = ContextMenu({
		'_New': fbrowser.addFolder,
		'Cu_t': function(){ console.log('context cut'); },
		'_Copy': function(){ console.log('context copy'); },
		'_Paste': function(){ console.log('context paste'); },
		'_About': function(){ console.log('context about'); }
	});
};
/*
window.onerror = function( msg, url, line ){
	function toHex(s){
		var output = "";
		var b16 = "0123456789ABCDEF";
		for( var i = 0; i < s.length; i++ ){
			var c = s.charCodeAt(i);
			output += b16.charAt(c>>4) + b16.charAt(c&15) + " ";
		}
		return output;
	}
	document.body.style.background="blue";
	var error = url.substring(url.lastIndexOf('/')+1)+":"+line+": "+msg+"\n"+navigator.userAgent;
	document.body.innerHTML=
		"<div id='bsod'><h1>the koala project</h1><p>A fatal error has occurred. An error report is being filed. Report details:</p><pre>"+error+"</pre><p>Press any key to continue</p></div>";
	document.body.onkeyup = function(){ location.reload(); };
	return true;
};
*/
