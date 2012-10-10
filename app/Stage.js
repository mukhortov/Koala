/* Stage.js
 * written by Colin Kuebler 2011-2012
 * Part of The Koala Project, licensed under GPLv3
 * Runs koala applications as a panel
 */

function Stage(){
	var api = this;
	
	var panel = $('panel_stage');
	panel.icon.set('exec');
	
	var fs = koala.services.fs;
	
	var shadow = $('canvas'),
		container = shadow.parentElement,
		iframe = null,
		head = null;
	
	var footer = panel.footer,
		closebtn = footer.makeButton( 'close', function(){ api.close(); } );
		closebtn.style.display = 'none';
	
	var load = function(){
		// create an <iframe>
		iframe = document.createElement("iframe");
		container.replaceChild( iframe, shadow );
		api.context = iframe.contentWindow;
		iframe.contentWindow.document.write(
			"<head><\/head><body style='border:0'><\/body>"
		);
		head = iframe.contentWindow.document.firstChild;
		panel.setStatus('');
		closebtn.style.display = '';
		// attempt to conceal back references as a basic security measure
		// TODO: find a safer way to sandbox code
		try {
			iframe.contentWindow.frameElement = null;
			iframe.contentWindow.parent = null;
			iframe.contentWindow.top = null;
		} catch (e) { };
		// reroute sandboxed commands
		iframe.contentWindow.close = function(){ api.close(); };
		iframe.contentWindow.alert = function(s){ alert(s); };
	};
	
	var unload = function(){
		if( iframe ){
			api.context = null;
			container.replaceChild( shadow, iframe );
			iframe = null;
			head = null;
			closebtn.style.display = 'none';
			panel.setStatus('done');
			panel.setTitle('stage');
		}
	};
	
	
	/* PUBLIC */
	api.reset = function(){
		unload();
		load();
	};
	
	api.js = function(x){
		if( iframe ){
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.text = x;
			head.appendChild(script);
		}
	};
	
	api.close = function(){
		unload();
	};
	
	api.open = function( id ){
		// read the file
		var file = fs.get(id);
		// load the sandbox
		api.reset();
		panel.setTitle( file._name );
		api.js( file._data );
	};
	
	return api;
};

