////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	function MakeSelect(id, multi, items, sel, extra, values)				// CREATE HTML SELECT
	{
		var	str="<select class='sf-is' id='"+id+"'";							// Header
		str+="style='width:auto'";
		if (multi)																// Multi select
			str+="multiple='multiple' size='"+multi+"'";						// Add flag
		if (extra)																// If extra param
			str+=extra;															// Add them
		str+=">";																// End header
		for (i=0;i<items.length;++i) {											// For each option
			str+="<option";														// Add tag
			if (sel == items[i])												// If selected
				str+=" selected='selected'"										// Add tag
			if (values && values[i])											// If has a value
				str+=" value='"+values[i]+"'";									// Add it
			str+=">"+items[i]+"</option>";										// End option
			}	
		return str+"</select>";													// End select				
	}

	function Sound(sound, mode)												// PLAY SOUND
	{	
		var snd=new Audio();
		if (!snd.canPlayType("audio/mpeg"))
			snd=new Audio(sound+".ogg");
		else	
			snd=new Audio(sound+".mp3");
		if (mode != "init")
			snd.play();
		}

	function SetCookie(cname, cvalue, exdays)								// SET COOKIE
	{
		var d=new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	
	function GetCookie(cname) 												// GET COOKIE
	{
		var name=cname+"=",c;
		var ca=document.cookie.split(';');
		for (var i=0;i<ca.length;i++)  {
		  c=ca[i].trim();
		  if (c.indexOf(name) == 0) 
		  	return c.substring(name.length,c.length);
		  }
		return "";
	}

	
	function ColorPicker(name, transCol, init) 								//	DRAW COLORPICKER
	{
			transCol="";														// Use null
		$("#colorPickerDiv").remove();											// Remove old one
		if (init) {																// If initting
			col=$("#"+name).val();												// Get current color
			if (col == transCol)												// No color 
				$("#"+name).css({ "border":"1px dashed #999","background-color":"#fff" }); 	// Set dot
			else				
				$("#"+name).css({ "border":"1px solid #999","background-color":col }); 		// Set dot
			return;																// Quit
		}
		
		var x=$("#"+name).offset().left+10;										// Get left
		var y=$("#"+name).offset().top+10;										// Top
		var	str="<div id='colorPickerDiv' style='position:absolute;left:"+x+"px;top:"+y+"px;width:160px;height:225px;z-index:100;border-radius:12px;background-color:#eee'>";
		$("body").append("</div>"+str);											// Add palette to dialog
		$("#colorPickerDiv").draggable();										// Make it draggable
		str="<p style='text-shadow:1px 1px white' align='center'><b>Choose a new color</b></p>";
		str+="<img src='img/colorpicker.gif' style='position:absolute;left:5px;top:28px' />";
		str+="<input id='shivaDrawColorInput' type='text' style='position:absolute;left:22px;top:29px;width:96px;background:transparent;border:none;'>";
		$("#colorPickerDiv").html(str);											// Fill div
		$("#colorPickerDiv").on("click",onColorPicker);							// Mouseup listener
	
		function onColorPicker(e) {
			
			var col;
			var cols=["000000","444444","666666","999999","cccccc","eeeeee","e7e7e7","ffffff",
					  "ff0000","ff9900","ffff00","00ff00","00ffff","0000ff","9900ff","ff00ff",	
					  "f4cccc","fce5cd","fff2cc","d9ead3","d0e0e3","cfe2f3","d9d2e9","edd1dc",
					  "ea9999","f9cb9c","ffe599","bed7a8","a2c4c9","9fc5e8","b4a7d6","d5a6bd",
					  "e06666","f6b26b","ffd966","9c347d","76a5af","6fa8dc","8e7cc3","c27ba0",
					  "cc0000","e69138","f1c232","6aa84f","45818e","3d85c6","674ea7","a64d79",
					  "990000","b45f06","bf9000","38761d","134f5c","0b5394","351c75","741b47",
					  "660000","783f04","7f6000","274e13","0c343d","073763","20124d","4c1130"
					 ];
	
			var x=e.pageX-this.offsetLeft;										// Offset X from page
			var y=e.pageY-this.offsetTop;										// Y
			if ((x < 102) && (y < 45))											// In text area
				return;															// Quit
			$("#colorPickerDiv").off("click",this.onColorPicker);				// Remove mouseup listener
			if ((x > 102) && (x < 133) && (y < 48))	{							// In OK area
				if ($("#shivaDrawColorInput").val())							// If something there
					col="#"+$("#shivaDrawColorInput").val();					// Get value
				else															// Blank
					x=135;														// Force a quit
				}
			$("#colorPickerDiv").remove();										// Remove
			if ((x > 133) && (y < 48)) 											// In quit area
				return;															// Return
			if (y > 193) 														// In trans area
				col=transCol;													// Set trans
			else if (y > 48) {													// In color grid
				x=Math.floor((x-14)/17);										// Column
				y=Math.floor((y-51)/17);										// Row
				col="#"+cols[x+(y*8)];											// Get color
				}
			if (col == transCol)												// No color 
				$("#"+name).css({ "border":"1px dashed #999","background-color":"#fff" }); 	// Set dot
			else				
				$("#"+name).css({ "border":"1px solid #999","background-color":col }); 		// Set dot
			$("#"+name).val(col);												// Set color value
		}
	
	}
	
	
	
	function ShowLightBox(width, title, content)
	{
		var str="<div id='lightBoxDiv' style='position:fixed;width:100%;height:100%;";	
		str+="background:url(img/overlay.png) repeat;top:0px;left:0px';</div>";
		$("body").append(str);														
		var x=$("#lightBoxDiv").width()/2-width/2;
		str="<div id='lightBoxIntDiv' class='unselectable sf-lightBox' ";
		str+="style='width:"+width+"px;left:"+x+"px;top:100px;'>";
		str+="<img src='img/shantilogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span id='lightBoxTitle' class='sf-lightBoxTitle'>"+title+"</span>";
		str+="<img src='img/x.gif' style='cursor:pointer;position:absolute;top:22px;left:"+width+"px' "; 
		str+="onclick='$(\"#lightBoxDiv\").remove(),Sound(\"click\")'>";
		str+="<div id='lightContentDiv'>"+content+"</div>";					
		$("#lightBoxDiv").append(str);	
	}

	function AlertBox(title, content, callback)								// ALERT BOX
	{
		$("#alertBoxDiv").remove();												
		Sound("delete");														
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='img/shantilogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>"+title+"</b></span></p>";
		str+="<div style='font-size:14px;margin:16px'>"+content+"</div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons:{"OK": function() { $(this).remove(); if (callback) callback(); }}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
  		$(".ui-button").css({"border-radius":"30px","outline":"none"});
	}

	function ConfirmBox(content, callback)									// COMFIRM BOX
	{
		Sound("click");														
		$("#alertBoxDiv").remove();												
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='img/shantilogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>Are you sure?</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>"+content+"</div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons: {
					            	"Yes": function() { $(this).remove(); callback() },
					            	"No":  function() { $(this).remove(); }
									}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function GetTextBox(title, content, def, callback)					// GET TEXT LINE BOX
	{
		Sound("click");														
		$("#alertBoxDiv").remove();											
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='img/shantilogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span id='gtBoxTi'style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>"+title+"</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>"+content;
		str+="<p><input class='sf-is' type='text' id='gtBoxTt' value='"+def+"'></p></div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons: {
					            	"OK": 		function() { callback($("#gtBoxTt").val()); $(this).remove(); },
					            	"Cancel":  	function() { $(this).remove(); }
									}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function ShortenString(str, len)									// SHORTEN A STRING TO LENGTH
	{
		if (str.length > len)												// Too long
			str=str.substr(0,(len-3)/2)+"..."+str.slice((len-3)/-2);			// Shorten	
		return str;															// Return string
	}

	function trace(msg, p1, p2, p3, p4)										// CONSOLE 
	{
		if (p4 != undefined)
			console.log(msg,p1,p2,p3,p4);
		else if (p3 != undefined)
			console.log(msg,p1,p2,p3);
		else if (p2 != undefined)
			console.log(msg,p1,p2);
		else if (p1 != undefined)
			console.log(msg,p1);
		else
			console.log(msg);
		}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var items=[ {
	type:"media",
	src:"//www.kaltura.com/p/2003471/sp/0/playManifest/entryId/1_c7z7zuiv/format/url/flavorParamId/2003471/video.mp4",
	thumb:"https://cfvod.kaltura.com/p/343772/sp/34377200/thumbnail/entry_id/1_c7z7zuiv/version/100011/acv/121",
	title:"HipVoter.com intro video",
	desc:"A video to encourage millenial voting",
	citation:"© 2015 University of Virginia. http://www.hipvoter.com",
	startDate:"12/12/2015",
	placeName:"Charlottesville, VA",
	permissions:"r",
	autoStart:"false",
	start:"0",
	end:"1:45",
	volume:"50"
	},{
	type:"web",
	src:"//www.barackobama.com",
	title:"Barack Obama website",
	citation:"© 2016 Organizing for Action. All Rights Reserved.",
	thumb:"//www.logodesignlove.com/images/monograms/obama-08-logo-15.jpg"
	},{
	type:"visualeyes",
	src:"//viseyes.org/visualeyes?712",
	title:"A tale of two tours",
	citation:"© 2015 Imani Nichols, Ashlyn Royer and Liz Carter",
	},{
	type:"pdf",
	src:"//anthropos-lab.net/wp/wp-content/uploads/2011/12/Weber-Politics-as-a-Vocation.pdf",
	title:"Politics as a Vocation by Max Weber",
	citation:"Weber, M. (1965). Politics as a Vocation. Philadelphia, PA: Fortress Press.",
	desc:"\"Politics as a Vocation\" is an essay by German economist and sociologist Max Weber. It originated in the second lecture of a series he gave in Munich to the \"Free Students Union\" of Bavaria on 28 January 1919.",
	},{
	type:"qmedia",
	src:"//qmediaplayer.com?1",
	title:"Clinton's TED talk",
	citation:"© 2013 Bill Ferster",
	},{
	type:"map",
	src:"https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11746813.386643479!2d-94.15516106249316!3d44.04465067207314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1453647957378",
	title:"Map of the US",
	citation:"© 2016 Google INEGI",
	},{
	type:"media",
	src:"//player.vimeo.com/video/80413179",
	title:"NBC Politics Nation promo",
	citation:"© 2013 Arturo Echeverria / NBC",
	},{
	type:"image",
	src:"//www.viseyes.org/shiva/qmedia/clinton01.jpg",
	title:"Bill Clinton at TED",
	citation:"© 2007 TED conference",
	thumb:"//www.viseyes.org/shiva/qmedia/clinton01.jpg"
	},{
	type:"shiva",
	src:"//www.viseyes.org/shiva/go.htm?e=1121",
	title:"Clinton network visualization",
	citation:"© 2013 Bill Ferster",
	},{
	type:"mandala",
	src:"//http://texts.drupal-dev.shanti.virginia.edu/book_pubreader/9623",
	title:"An introduction to Lhasa",
	citation:"© 2009 David Germano",
	},{
	type:"wordpress",
	src:"//wordpress.com/themes/",
	title:"Available themes",
	citation:"© 2016 Matt Mullenweg / Automattic LLC"
	},{
	type:"media",
	src:"//www.youtube.com/embed/lrk4oY7UxpQ",
	title:"Crash course in US politics video",
	citation:"© 2015 Craig Benzin/PBS http://youtube.com/pbsdigitalstudios"
	}];


var projects=[ 
	{
	title:"Hip voting ",
	desc:"To educate and empower Millennials on the American political system in preparation for the 2016 Presidential Election. The goal is educate about the political structure of the US, the voting process, and prevalent issues in the US today in order to drive young individuals to vote.",
	cite:"(c) 2016 University of Virginia www.hipvoter.com",
	tags:"Politics, MDST 3703",
	collab:"Mike, James, Hanna, Michelle",
	items:[0,1],
	pages:[0,1,2]
	},
	{
	title:"A tale of two tours",
	desc:"Welcome to our Tale of Two Tours where we will lead you through a digital experience of Paul McCartney's 1989 World Tour and his 2009 Summer Tour. Here you will find setlist information, tour member biographies, and individual concert facts.",
	cite:"(c) 2016 University of Virginia",
	tags:"Entertainment, MDST 3703",
	collab:"Imani, Ashlyn, Liz",
	items:[2],
	pages:[0,1]
	}
];
	