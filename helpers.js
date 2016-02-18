////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	function Escape(str, entity)											// ESCAPE STRING
	{
		if (!str)	return str;													// Quit on null
		if (entity) {															// HTML entities
			str=str.replace(/\"/g,"&quot;");									// Replace						
			str=str.replace(/\'/g,"&apos;");								
			}
		else{																	// slashes
			str=str.replace(/\"/g,"\"");										// Replace						
			str=str.replace(/\'/g,"\';");								
			}
		return str;
	}

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
		var	str="<div id='colorPickerDiv' style='position:absolute;left:"+x+"px;top:"+y+"px;width:160px;height:225px;z-index:3000;border-radius:12px;background-color:#eee'>";
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
	
	function ShowLightBox(width, title, content, callback)					// LIGHTBOX
	{
		var h=window.innerHeight-200;											// Get max height
		var str="<div id='lightBoxDiv' style='position:fixed;width:100%;height:100%;";	
		str+="background:url(img/overlay.png) repeat;top:0px;left:0px';</div>";
		$("body").append(str);														
		var x=$("#lightBoxDiv").width()/2-width/2;
		str="<div id='lightBoxIntDiv' class='unselectable sf-lightBox' ";
		str+="style='width:"+width+"px;left:"+x+"px;top:100px;max-height:"+h+"px'>";
		str+="<img src='img/shantilogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span id='lightBoxTitle' class='sf-lightBoxTitle'>"+title+"</span>";
		str+="<img src='img/ok.gif' id='lbxBoxExit' style='cursor:pointer;position:absolute;top:22px;left:"+(width-14)+"px' "; 
		str+="<div id='lightContentDiv'>"+content+"</div>";					
		$("#lightBoxDiv").append(str);
			
		$("#lbxBoxExit").on("click",function() {
			Sound("click");
			$("#lightBoxDiv").remove();
			if (callback) callback();
			});
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
		$(".ui-button").css({"border-radius":"30px","outline":"none","background":"none","background-color":"#e8e8e8"});
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
		$(".ui-button").css({"border-radius":"30px","outline":"none","background":"none","background-color":"#e8e8e8"});
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
		$(".ui-button").css({"border-radius":"30px","outline":"none","background":"none","background-color":"#e8e8e8"});
 	}

	function ShortenString(str, len)									// SHORTEN A STRING TO LENGTH
	{
		if (str && str.length > len)										// Too long
			str=str.substr(0,(len-3)/2)+"..."+str.slice((len-3)/-2);		// Shorten	
		return str;															// Return string
	}

	function StyleText(orig, style)										// STYLE TEXT
	{
		if (!style)															// No style
			return orig;													// Return string
		var s=style.split(",");												// Get as array (font,size,color,weight,align,height)
		var str="<div style='text-align:"+s[4]+"'>";						// Alignment div
		str+="<span style='font-family:"+s[0]+"'>";							// Family
		str+="<span style='font-size:"+s[1]+"'>";							// Size
		str+="<span style='color:"+s[2]+"'>";								// Color
		str+="<span style='line-height:"+s[5]+"'>";							// Line height
		if (s[3] == "bold")	str+="<strong>";								// Start strong
		str+=orig;															// Add title
		if (s[3] == "bold")	str+="</strong>";								// Stop strong
		str+="</span></span></span></span></div>";							// End spans and div
		return str;															// Return string
		}

	function TextStyleBox(title, style, callback)						// TEXT STYLE BOX
	{
		if (!style)															// If not style set
			return null;													// Quit
		var s=style.split(",");												// Get as array (font,size,color,weight,align,height)
		Sound("click");														// Click													
		$("#alertBoxDiv").remove();											// Remove any current one												
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='img/shantilogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;color:#000'><b>"+title+"</b></span><p>";
		str+="<table style='width:100%;text-align:left;font-size:12px'>";	// Table
		str+="<tr height='28'><td>Face</td>";
		str+="<td>"+MakeSelect("fFace",false,["sans-serif","serif","monospace"])+"</td></tr>";
		str+="<tr height='28'><td>Size</td>";
		str+="<td>"+MakeSelect("fSize",false,["8px","9px","10px","11px","12px","13px","14px","16px","18px","20px","24px","32px","48px"])+"</td></tr>";
		str+="<tr height='28'><td>Color</td>";
		str+="<td><input class='sf-is' id='fCol' style='width:50px' type='text'></td></tr>";
		str+="<tr height='28'><td>Style</td>";
		str+="<td>"+MakeSelect("fWgt",false,["normal","bold","1talic"])+"</td></tr>";
		str+="<tr height='28'><td>Align</td>";
		str+="<td>"+MakeSelect("fAlign",false,["left","right","center"])+"</td></tr>";
		str+="<tr height='28'><td>Height</td>";
		str+="<td>"+MakeSelect("fHgt",false,["75%","100%","125%","150%","175%","200%","300%","400%"])+"</td></tr>";
		str+="</table>";	
		$("#alertBoxDiv").append(str+"</div>");	
		$("#alertBoxDiv").dialog({ width:200, buttons: {
					            	"OK": function() { $(this).remove(); callback(s.toString()) },
					            	"Cancel":  function() { $(this).remove();  }
									}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"8px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none","background":"none","background-color":"#e8e8e8"});
		Update();
 		
 		$("#fFace").on("change",function() { s[0]=$(this).val(); });
 		$("#fSize").on("change",function() { s[1]=$(this).val(); });
 		$("#fCol").on("click",function()    { ColorPicker("fCol",-1) });
 		$("#fCol").on("blur",function()    { s[2]=$(this).val(); });
 		$("#fWgt").on("change",function()  { s[3]=$(this).val(); });
 		$("#fAlign").on("change",function(){ s[4]=$(this).val(); });
 		$("#fHgt").on("change",function()  { s[5]=$(this).val(); });
 		
 		function Update() {
 			$("#fFace").val(s[0]);
			$("#fSize").val(s[1]);
			$("#fCol").val(s[2]);
			$("#fWgt").val(s[3]);
			$("#fAlign").val(s[4]);
 			$("#fHgt").val(s[5]);	
 			ColorPicker("fCol",-1,true);
 			}
 	}

	function MakeUniqueId()													// MAKE UNIQUE ID
	{
		var i,index;
		var ts=+new Date;														// Get date
		var id=ts.toString();													// Strt with timstamp				
		var parts=id.split("").reverse();										// Mix them up
		var n=parts.length-1;													// Max
		var s=id.length;														// Start digit
		for(i=s;i<s+8;++i) {													// Add 8 random digits
			index=Math.floor(Math.random()*n);									// Get index
			id+=parts[index];													// Add to id 
			}
		return id;																// Return unique id														
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

	function GetMediaIcon(type, src)
	{
		var pic="img/";															// Add folder
		if (src && src.match(/\.png|.gif|\.jpg|.jpeg/i)) 						// An image
			return src;															// Return image as icon
		if (!type)																// No type set
			return pic+"nullitem.png";											// Return null icon
			switch (type.toLowerCase()) {										// Route on type
			case 	"media": 		pic+="mediaitem"; 			break;			// Set
			case 	"qmedia": 		pic+="qmediaitem"; 			break;			
			case 	"image": 		pic+="imageitem"; 			break;			
			case 	"pdf": 			pic+="pdfitem"; 			break;			
			case 	"map": 			pic+="mapitem"; 			break;			
			case 	"shiva": 		pic+="shivaitem"; 			break;			
			case 	"visualeyes": 	pic+="veitem"; 				break;			
			case 	"mandala": 		pic+="mandalaitem"; 		break;			
			case 	"wordpress": 	pic+="wordpressitem"; 		break;			
			default: 				pic+="webitem"; 			break;			// All others use web pic
			}
		pic+=".png";															// Add ext
		return pic;																// Return icon url
	}

	function LoadingIcon(mode, size, container)							// SHOW/HIDE LOADING ICON		
	{
		container=container ? "#"+containern: "body";							// If no container spec'd, use body
		if (!mode) {															// If hiding
			$("#sf-loadingIcon").remove();										// Remove it
			return;																// Quit
			}
		var str="<img src='img/loading.gif' width='"+size+"' ";					// Img
		str+="id='sf-loadingIcon' style='position:absolute;top:calc(50% - "+size/2+"px);left:calc(50% - "+size/2+"px);z-index:5000'>";	
		$(container).append(str);												// Add icon to container
	}


	function SendMessage(cmd, msg) 										// SEND HTML5 MESSAGE 
	{
		var str=cmd+"|Folio";												// Add src and window						
		if (msg)															// If more to it
			str+="|"+msg;													// Add it
		window.parent.postMessage(str,"*");									// Send message to parent wind		
	}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var items=[ {
	type:"media",
	src:"//www.kaltura.com/p/2003471/sp/0/playManifest/entryId/1_c7z7zuiv/format/url/flavorParamId/2003471/video.mp4",
	id:145545606991354595506,
	thumb:"https://cfvod.kaltura.com/p/343772/sp/34377200/thumbnail/entry_id/1_c7z7zuiv/version/100011/acv/121",
	title:"HipVoter intro video",
	desc:"A video to encourage millenial voting. To educate and empower Millennials on the American political system in preparation for the 2016 Presidential Election.<br><br>The goal is educate about the political structure of the US, the voting process, and prevalent issues in the US today in order to drive young individuals to vote.",
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
	id:145545606991354531536,
	title:"Barack Obama website",
	citation:"© 2016 Organizing for Action. All Rights Reserved.",
	desc:"With more than 250 local chapters around the country, OFA volunteers are building this organization from the ground up, community by community, one conversation at a time—whether that\’s on a front porch or on Facebook.<br><br>We’re committed to finding and training the next generation of great progressive organizers, because at the end of the day, we aren\’t the first to fight for progressive change, and we won\’t be the last.",
	thumb:"//www.logodesignlove.com/images/monograms/obama-08-logo-15.jpg"
	},{
	type:"visualeyes",
	src:"//viseyes.org/visualeyes?712",
	id:145545606991365039904,
	title:"A tale of two tours",
	desc:"Welcome to our Tale of Two Tours where we will lead you through a digital experience of Paul McCartney\'s 1989 World Tour and his 2009 Summer Tour. Here you will find setlist information, tour member biographies, and individual concert facts. Hope you enjoy!",
	citation:"© 2015 Imani Nichols, Ashlyn Royer and Liz Carter",
	},{
	type:"pdf",
	src:"//anthropos-lab.net/wp/wp-content/uploads/2011/12/Weber-Politics-as-a-Vocation.pdf",
	id:145545606991316194501,
	title:"Politics as a Vocation by Max Weber",
	citation:"Weber, M. (1965). Politics as a Vocation. Philadelphia, PA: Fortress Press.",
	desc:"\"Politics as a Vocation\" is an essay by German economist and sociologist Max Weber. It originated in the second lecture of a series he gave in Munich to the \"Free Students Union\" of Bavaria on 28 January 1919.",
	},{
	type:"qmedia",
	src:"//qmediaplayer.com?1",
	id:145545606991396659954,
	title:"Clinton's TED talk",
	desc:"Accepting the 2007 TED Prize, Bill Clinton asks for help in bringing health care to Rwanda — and the rest of the world.<br<br>Through his William J. Clinton Foundation, former US President Bill Clinton has become a vital and innovative force for world change. He works in four critical areas: health, economic empowerment, citizen service, and reconciliation.",
	citation:"© 2013 Bill Ferster",
	},{
	type:"map",
	src:"https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11746813.386643479!2d-94.15516106249316!3d44.04465067207314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1453647957378",
	id:145545606991414446411,
	title:"Map of the US",
	citation:"© 2016 Google INEGI",
	},{
	type:"media",
	src:"//player.vimeo.com/video/80413179",
	id:145545606991495441415,
	title:"NBC Politics Nation promo",
	citation:"© 2013 Arturo Echeverria / NBC",
	},{
	type:"image",
	src:"//www.viseyes.org/shiva/qmedia/clinton01.jpg",
	id:145545606991465441444,
	title:"Bill Clinton at TED",
	citation:"© 2007 TED conference",
	desc:"Accepting the 2007 TED Prize, Bill Clinton asks for help in bringing health care to Rwanda — and the rest of the world.<br<br>Through his William J. Clinton Foundation, former US President Bill Clinton has become a vital and innovative force for world change. He works in four critical areas: health, economic empowerment, citizen service, and reconciliation.",
	},{
	type:"shiva",
	src:"//www.viseyes.org/shiva/go.htm?e=1121",
	id:145545606991494614459,
	title:"Clinton network visualization",
	citation:"© 2013 Bill Ferster",
	},{
	type:"mandala",
	src:"//http://texts.drupal-dev.shanti.virginia.edu/book_pubreader/9623",
	id:145545606991449464991,
	title:"An introduction to Lhasa",
	citation:"© 2009 David Germano",
	},{
	type:"wordpress",
	src:"//wordpress.com/themes/",
	id:145545606991490464565,
	title:"Available themes",
	citation:"© 2016 Matt Mullenweg / Automattic LLC"
	},{
	type:"media",
	src:"//www.youtube.com/embed/lrk4oY7UxpQ",
	id:145545606991494101669,
	title:"Crash course in US politics video",
	citation:"© 2015 Craig Benzin/PBS http://youtube.com/pbsdigitalstudios"
	}];



var projects=[ 
	{
	title:"Hip voting ",
	desc:"To educate and empower Millennials on the American political system in preparation for the 2016 Presidential Election. The goal is educate about the political structure of the US, the voting process, and prevalent issues in the US today in order to drive young individuals to vote.",
	cite:"(c) 2016 University of Virginia www.hipvoter.com",
	id:145545606991496544515,
	tags:"Politics, MDST 3703",
	collab:"Mike, James, Hanna, Michelle",
	template:0,
	items:[0,1],
	pages:[{title:"Page one"}, {title:"Page two"}]
	},
	{
	title:"A tale of two tours",
	desc:"Welcome to our Tale of Two Tours where we will lead you through a digital experience of Paul McCartney's 1989 World Tour and his 2009 Summer Tour. Here you will find setlist information, tour member biographies, and individual concert facts.",
	cite:"(c) 2016 University of Virginia",
	id:145545606991409404599,
	tags:"Entertainment, MDST 3703",
	collab:"Imani, Ashlyn, Liz",
	template:0,
	items:[0],
	pages:[{title:"Page one"}]
	}
];

var defTemplates=[
	{
	name:"Default",
	id:"0",
	topGut:"None",												
	leftGut:"None",
	rightGut:"None",
	botGut:"None",
	topPct:"20",													
	leftPct:"15",
	rightPct:"15",
	botPct:"10",
	aspect:"Portrait",									
	itemWid:"100%",									
	itemHgt:"30vh",										
	itemAlign:"center",									
	itemBorder:"2px solid #999999",					
	panes:[{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,18px,#cc6600,bold,center,100%"
		},{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,18px,#cc6600,bold,center,100%"
		},{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,18px,#cc6600,bold,center,100%"
		},{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,18px,#cc6600,bold,center,100%"
		},{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,18px,#cc6600,bold,center,100%"
		}]
	},{
	name:"Full + side",
	id:"225545606991490464654",
	topGut:"None",												
	leftGut:"None",
	rightGut:"None",
	botGut:"None",
	topPct:"20",													
	leftPct:"30",
	rightPct:"0",
	botPct:"0",
	aspect:"Portrait",									
	itemWid:"100%",									
	itemHgt:"30vh",										
	itemAlign:"center",									
	itemBorder:"2px solid #999999",					
	panes:[{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"art/sky.jpg", markUp:"<br>My work...&nbsp;",margin:8,
		bodyStyle:"sans-serif,60px,#ffffff,bold,right,100%",		
		titleStyle:"sans-serif,16px,#000099,bold,center,100%"
		},{
		borderCol:"#999999", borderSty:"n", borderWid:"1",							
		backCol:"#ffffff", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,16px,#000099,bold,center,100%"
			},{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#ffffff", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,16px,#000099,bold,center,100%"
		},{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,16px,#000099,bold,center,100%"
		},{
		borderCol:"#999999", borderSty:"None", borderWid:"1",							
		backCol:"#eeeeee", backImg:"", markUp:"",margin:8,
		bodyStyle:"sans-serif,13px,#66666,normal,left,100%",		
		titleStyle:"sans-serif,16px,#000099,bold,center,100%"
		}]
	}]
	