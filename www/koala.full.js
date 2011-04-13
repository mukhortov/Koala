// koala.full.js
// the koala project

var koala = {};

function $(e){ return document.getElementById(e); };

window.onload = function(){
	// TODO
	// testing...
	koala.editor = $("code");
	// trigger designmode
	koala.editor.designMode = 'on';
	koala.editor.contentEditable = true;
	
	koala.theme = $("theme");
	for( var i = 1; i < document.styleSheets.length; i++ ){
		document.styleSheets[i].disabled = true;
	}
	
	koala.theme.current = document.styleSheets[2];
	koala.theme.current.disabled = false;
	koala.theme.options[1].selected = "selected";
	
	koala.theme.onchange = function(){
		koala.theme.current.disabled = true;
		koala.theme.current = document.styleSheets[ this.selectedIndex+1 ]
		koala.theme.current.disabled = false;
		// TODO
		// the following method doesn't seem to work in webkit
		// for now, all the stylesheets are loaded and then disabled
		// find a better way to load stylesheets dynamically
		/*koala.theme.current.disabled = true;
		for( var i = 1; i < document.styleSheets.length; i++ ){
			if( document.styleSheets[i].title == this.value ){
				document.styleSheets[i].disabled = false;
				koala.theme.current = document.styleSheets[i];
				return;
			}
		}
		var e = document.createElement("link");
		e.setAttribute("type","text/css");
		e.setAttribute("rel","stylesheet");
		e.setAttribute("href","themes/" + this.value + ".css");
		e.setAttribute("title",this.value);
		document.getElementsByTagName("head")[0].appendChild(e);
		//.innerHTML+="<link type='text/css' rel='stylesheet' href='themes/"+this.value+".css' title='"+this.value+"'>";
		koala.theme.current = e.sheet;
		//koala.theme.current = document.styleSheets[ document.styleSheets.length-1 ];
		koala.theme.current.disabled = false;*/
	}
};