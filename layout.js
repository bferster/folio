////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LAYOUT
//
// Assumes access to global var sf
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function layout()											// CONSTRUCTOR
{
	this.plo=null;														// Ptr to 				
	this.ckMark=null;													// CKEditor instance
	this.paneNames=["Top","Left","Mid","Right","Bot"];					// Name of all the panes
	this.stockImages=[	"art/sky.jpg",									// Holds stock images
						"art/rothko.jpg",
						"art/moon.jpg",
						"art/slate.jpg",
						"art/cork.jpg",
						"art/sea.jpg",
						"art/brickwall.jpg",
						"art/moon2.jpg",
						"art/sand.jpg",
						"art/dune.jpg",
						"art/mountain.jpg",
						"art/desert.jpg",
						"art/marble.jpg",
						"art/woodfloor.jpg",
						"art/granite.jpg"
						];
}	

layout.prototype.Init=function(container, template)					// INIT LAYOUT 
{
	container.layout={};												// Make one
	container.layout.topPct=template.topPct;							// Set default sizes
	container.layout.leftPct=template.leftPct;
	container.layout.rightPct=template.rightPct;
	container.layout.botPct=template.botPct;
	container.layout.aspect="";									
	container.layout.title="";									
	container.layout.panes=[];											// Holds pane info
	if (container.cite == undefined) {									// If called as a page override
		for (i=0;i<this.paneNames.length;++i) 							// For each pane
			container.layout.panes.push({});							// Alloc pane obj
		var o=sf.projects[curProject].layout;							// Point at current project's layout
		container.layout.topPct=o.topPct;								// Set default sizes from project
		container.layout.leftPct=o.leftPct;
		container.layout.rightPct=o.rightPct;
		container.layout.botPct=o.botPct;
		}
	else{																// Set default
		var o=JSON.stringify(template);									// Deep copy default layout as JSON
		container.layout=$.parseJSON(o);								// Use template as inits
		}
}

layout.prototype.Set=function(container, template, callback)		// SET LAYOUT 
{
	var i,o;
	var _this=this;														// Get context
	var title="Set layout for all pages";								// Default title
	this.curPane=0;														// Start with top
	if (!container.layout) 												// If no layout object yet
		this.Init(container,template);									// Init object
	this.plo=container.layout;											// Point at layout object							
	var str="<br>"+this.MakeParams(container);							// Make page params UI
	str+=this.MakeSizer();												// Make page sizer UI
	if (container.cite == undefined)									// If called as a page override
		title="Set this page's layout";									// Change title	
	ShowLightBox(700,title,str,callback);								// Put up dialog
	this.Update();														// Update resizer/params
	if (this.ckMark)	this.ckMark.destroy();							// Kill old instance						
	this.ckMark=CKEDITOR.inline($("#lmark")[0]);						// Enable rich text editor

	$('[id^="sizer"]').on("click", function(e) {						// CLICK ON ANY DIV STARTING WITH 'SIZER'
		$('[class^="sf-sizer"]').css("border", "1px none");				// Clear all
		$(this).css("border", "1px solid #009900")						// Add border 
		var s=e.target.id.substr(5).replace(/Div/,"");					// Extract pane name
		for (var i=0;i<_this.paneNames.length;++i)						// Search through pane names
			if (s == _this.paneNames[i]) {								// A match
				_this.curPane=i;										// Set curPane
				break;													// Quit looking
				}
		Sound("click");													// Click
		_this.Update();													// Show new name
		});

	$("#sizerTopDiv").trigger("click");									// Turn on top at start
	
	$("#lbcol").on("click", function(e) {								// BORDER COLOR CLICK HANDLER
			ColorPicker("lbcol",-1);									// Get border color
			}); 
	$("#lbcol").on("blur", function(e) {								// BORDER GET COLOR HANDLER
			_this.plo.panes[_this.curPane].borderCol=$(this).val();		// Set border color
			}); 
	$("#lbgcol").on("click", function(e) {								// BACKGROUND COLOR CLICK HANDLER
			ColorPicker("lbgcol",-1);									// Get back color
			}); 
	$("#lbgcol").on("blur", function(e) {								// BORDER GET COLOR HANDLER
			_this.plo.panes[_this.curPane].backCol=$(this).val();		// Set back color
			}); 
	$("#lbw").on("change", function(e) {								// BORDER WIDTH HANDLER
			_this.plo.panes[_this.curPane].borderWid=$(this).val();		// Set border width
			}); 
	$("#lbs").on("change", function(e) {								// BORDER STYLE HANDLER
			_this.plo.panes[_this.curPane].borderSty=$(this).val();		// Set border style
			}); 
	$("#lbgimg").on("blur", function(e) {								// BACK IMG HANDLER
			_this.plo.panes[_this.curPane].backImg=$(this).val();		// Set back img
			}); 
	$("#lmar").on("change", function(e) {								// MARGIN HANDLER
			_this.plo.panes[_this.curPane].margin=$(this).val();		// Set margin
			}); 
	$("#tgut").on("change", function(e) {								// TOP GUTTER HANDLER
			_this.plo.topGut=$(this).val();								// Set back img
			}); 
	$("#bgut").on("change", function(e) {								// BOT GUTTER HANDLER
			_this.plo.botGut=$(this).val();								// Set val
			}); 
	$("#lgut").on("change", function(e) {								// LEFT GUTTER HANDLER
			_this.plo.leftGut=$(this).val();							// Set val
			}); 
	$("#rgut").on("change", function(e) {								// RIGHT GUTTER HANDLER
			_this.plo.rightGut=$(this).val();							// Set val
			}); 
	$("#lmark").on("blur", function(e) {								// MARKUP HANDLER
			_this.plo.panes[_this.curPane].markUp=$(this).html();		// Set val
			}); 
	$("#lasp").on("change", function(e) {								// ASPECT RATIO HANDLER
			_this.plo.aspect=$(this).val();								// Set aspect
			_this.Update();												// Update resiser
			}); 
	$("#lnav").on("change", function(e) {								// NAVIGATION HANDLER
			_this.plo.navigation=$(this).val();							// Set navigation
			}); 
	$("#ltitle").on("change", function(e) {								// PAGE NAME HANDLER
			_this.plo.title=$(this).val();								// Set aspect
			}); 
	$("#lscroll").on("change", function(e) {							// SCROLL HANDLER
			_this.plo.panes[_this.curPane].scroll=$(this).val();		// Set val
			}); 
	$("#ltfont").on("click", function(e) {								// SET TITLE FONT
			if (_this.plo.panes[_this.curPane].titleStyle)				// If a style set
				TextStyleBox("Title font",_this.plo.panes[_this.curPane].titleStyle, function(s) {	// Style it
					_this.plo.panes[_this.curPane].titleStyle=s;		// Set val
					});
			}); 
	$("#lbfont").on("click", function(e) {								// SET BODY FONT
			if (_this.plo.panes[_this.curPane].bodyStyle)				// If a style set
				TextStyleBox("Body font",_this.plo.panes[_this.curPane].bodyStyle, function(s) {	// Style it
					_this.plo.panes[_this.curPane].bodyStyle=s;			// Set val
					});
			}); 
	$("#lnfont").on("click", function(e) {								// SET NAVIGATION FONT
			TextStyleBox("Navigation",_this.plo.navStyle, function(s) {	// Style it
				_this.plo.navStyle=s;									// Set val
				});
			}); 

	
	$('[id$="SizBar"]').hover(											// HOVER ON PANE SIZER
		function(){ $(this).css("background-color","#acc3db")},			// Highlight
		function(){ $(this).css("background-color","transparent")		// Hide
		});
	
	$("#topSizBar").draggable({											// DRAG TOP HEIGHT HANDLER
		cursor: "row-resize", axis:"y",									// Y-only
		stop: function(event, ui) {										// When done
			_this.Update();												// Update resizer
			},
		drag: function(event, ui) {										// On drag
			var y=event.clientY-$("#sizerTopDiv").offset().top;			// Position within layout block
			var h=$("#sizerTopDiv").height()+$("#sizerMidDiv").height()+$("#sizerBotDiv").height();	// Height of travel
			var r=y/h;													// Ratio
			r=Math.min(100-_this.plo.botPct,Math.max(0,r*100));			// Cap 0-100% - bot
			_this.plo.topPct=r;											// Set val
			_this.Update();												// Update resizer
			}
		});

	$("#botSizBar").draggable({											// DRAG TOP HEIGHT HANDLER
		cursor: "row-resize", axis:"y",									// Y-only
		stop: function(event, ui) {										// When done
			_this.Update();												// Update resizer
			},
		drag: function(event, ui) {										// On drag
			var y=event.clientY-$("#sizerTopDiv").offset().top;		// Position within layout block
			var h=$("#sizerTopDiv").height()+$("#sizerMidDiv").height()+$("#sizerBotDiv").height();	// Height of travel
			var r=y/h;													// Ratio
			r=Math.max(_this.plo.topPct,Math.min(100,r*100));			// Cap 0-100% - top
			_this.plo.botPct=100-r;										// Set val
			_this.Update();												// Update resizer
			}
		});

	$("#leftSizBar").draggable({										// DRAG LEFT WIDTH HANDLER
		cursor: "col-resize", axis:"x",									// X-only
		stop: function(event, ui) {										// When done
			_this.Update();												// Update resizer
			},
		drag: function(event, ui) {										// On drag
			var x=event.clientX-$("#layoutSizerDiv").offset().left;		// Position within width
			var r=x/$("#layoutSizerDiv").width()						// Ratio
			r=Math.min(100-_this.plo.rightPct,Math.max(0,r*100));		// Cap 0-100% - right
			_this.plo.leftPct=r;										// Set val
			_this.Update();												// Update resizer
			}
		});

	$("#rightSizBar").draggable({										// DRAG RIGHT WIDTH HANDLER
		cursor: "col-resize", axis:"x",									// X-only
		stop: function(event, ui) {										// When done
			_this.Update();												// Update resizer
			},
		drag: function(event, ui) {										// On drag
			var x=event.clientX-$("#layoutSizerDiv").offset().left;		// Position within width
			var r=x/$("#layoutSizerDiv").width()						// Ratio
			r=100-Math.max(_this.plo.leftPct,Math.min(100,r*100));		// Cap 0-100% - left
			_this.plo.rightPct=r;										// Set val
			_this.Update();												// Update resizer
			}
		});

	$("#lbgpick").on("click", function(e) {								// CHOOSE ART HANDLER
			_this.PickArt(function(s) {									// Choose
			_this.plo.panes[_this.curPane].backImg=s;					// Set back img
			$("#lbgimg").val(s);										// Show it	
			});											
		}); 

}

layout.prototype.Update=function()									// UPDATE PAGE SIZER/PARAMS 
{
	var o=this.plo;														// Point at layout object
	if (o.aspect == "Landscape")	$("#layoutSizerDiv").height(200);	// Set size to match aspect
	else if (o.aspect == "Square")	$("#layoutSizerDiv").height(300);
	else 							$("#layoutSizerDiv").height(400);
	
	var midHgt=Math.max(Math.min(100-o.topPct-o.botPct,100),0);			// Get mid% height 0-100
	var midWid=Math.max(Math.min(100-o.rightPct-o.leftPct,100),0);		// Get mid% width 0-100
	$('[id^="sizer"]').show();											// Make sure they are all showing
	$("#sizerTopDiv").css({ height:o.topPct+"%" });						// Set top		
	$("#sizerLeftDiv").css({   height:midHgt+"%",width:o.leftPct+"%" });// Set left
	$("#sizerMidDiv").css({   height:midHgt+"%",width:midWid+"%" });	// Set mid
	$("#sizerRightDiv").css({  height:midHgt+"%",width:o.rightPct+"%" });// Set right
	$("#sizerBotDiv").css({ height:o.botPct+"%" })						// Set bot		
	$("#sizerMidDiv").width($("#sizerMidDiv").width()-7);				// Remove extra margins
	if (!midWid && $("#sizerleftDiv").width())							// No mid, but left visible
		$("#sizerLeftDiv").width($("#sizerLeftDiv").width()-8);			// Remove extra margins
	else if (!midWid && $("#sizerRightDiv").width())					// No mid, but right visible
		$("#sizerRightDiv").width($("#sizerRightDiv").width()-6);		// Remove extra margins
	if (!midHgt) { 														// No mid
		$("#sizerLeftDiv").hide();										// Hide middle ones
		$("#sizerMidDiv").hide()
		$("#sizerRightDiv").hide()
		}

	var t=$("#sizerTopDiv").position().top;								// Top of pane
	$("#topSizBar").css("top",$("#sizerTopDiv").height()+t-3+"px");		// Y pos top
	$("#topSizBar").width($("#sizerTopDiv").width());					// Wid top
	$("#botSizBar").css("top",$("#sizerBotDiv").position().top+3+"px");	// Y pos bot
	$("#botSizBar").width($("#sizerTopDiv").width());					// Wid bot
	
	$("#leftSizBar").css("top",$("#sizerTopDiv").height()+t+5+"px");	// Y pos top
	$("#leftSizBar").css("left",$("#sizerLeftDiv").width()+$("#sizerLeftDiv").position().left+"px"); // X pos left
	$("#leftSizBar").height($("#sizerLeftDiv").height());				// Hgt left
	$("#rightSizBar").css("top",$("#sizerTopDiv").height()+t+5+"px");	// Y pos top
	$("#rightSizBar").css("left",$("#sizerRightDiv").position().left+"px"); // X pos left
	$("#rightSizBar").height($("#sizerRightDiv").height());				// Hgt left

	$("#topPct").text(Math.floor(o.topPct)+"%");						// Show %
	$("#leftPct").text(Math.floor(o.leftPct)+"%");					
	$("#midPct").text(Math.floor(100-o.leftPct-o.rightPct)+"%");		// Mid is 100-left-right			
	$("#rightPct").text(Math.floor(o.rightPct)+"%");					
	$("#botPct").text(Math.floor(o.botPct)+"%");				
	$("#paneTitle").text(this.paneNames[this.curPane]);					// Pane name			
	$("#lbcol").val(o.panes[this.curPane].borderCol);					// Set border color
	ColorPicker("lbcol",-1,true);
	$("#lbgcol").val(o.panes[this.curPane].backCol);					// Set back color
	ColorPicker("lbgcol",-1,true);
	$("#lbfont").val(o.bodyStyle);										// Set body font style
	$("#ltfont").val(o.titleStyle);										// Set title font style
	$("#lnfont").val(o.navStyle);										// Set navigation font style
	$("#lbgimg").val(o.panes[this.curPane].backImg);					// Set back image
	$("#lmar").val(o.panes[this.curPane].margin);						// Set margin
	$("#lbs").val(o.panes[this.curPane].borderSty);						// Set border style
	$("#lbw").val(o.panes[this.curPane].borderWid);						// Set border width
	$("#lmark").html(o.panes[this.curPane].markUp);						// Set markup
	$("#lscroll").val(o.panes[this.curPane].scroll);					// Set scroll status
	$("#tgut").val(o.topGut);											// Set gutters
	$("#lgut").val(o.leftGut);											
	$("#rgut").val(o.rightGut);											
	$("#bgut").val(o.botGut);											
	$("#lasp").val(o.aspect);											// Set aspect
	$("#lnav").val(o.navigation);										// Set navigation
	$("#ltitle").val(o.title);											// Set page name
}

layout.prototype.MakeParams=function(container)						// PAGE PARAMS
{
	var str="<div id='layoutParamsDiv' class='sf-layoutParams'>";			// Overall div
	str+="<table style='width:100%;text-align:left'>";						// Table
	str+="<tr height='28'><td>Background image &nbsp; </td>";				// Back Pic
	str+="<td><input class='sf-is' style='width:100px' id='lbgimg' type='text'>";
	str+="&nbsp;&nbsp;<button class='sf-bs' id='lbgpick'>Choose</button></td></tr>";
	str+="<tr height='28'><td>Background color &nbsp;</td>";				// Back col
	str+="<td><input class='sf-is' style='width:50px' id='lbgcol' type='text'></td></tr>";
	str+="<tr height='28'><td>Border style</td><td>";						// Border style
	str+=MakeSelect("lbs",false,["None","Solid","Dashed","Double","Groove","Ridge","Inset","Outset"])+"</td></tr>";
	str+="<tr height='28'><td>Border width</td><td>";						// Border width
	str+=MakeSelect("lbw",false,[1,2,3,4,5])+"</td></tr>";
	str+="<tr height='28'><td>Border color &nbsp;</td>";					// Border col
	str+="<td><input class='sf-is' id='lbcol' style='width:50px' type='text'></td></tr>";
	str+="<tr height='28'><td>Show scroll</td>";							// Scrollbars
	str+="<td>"+MakeSelect("lscroll",false,["auto","hidden"])+"</td></tr>";
	str+="<tr height='28'><td>Margins</td>";								// Margin
	str+="<td>"+MakeSelect("lmar",false,["0","2","4","8","16","32"])+"</td></tr>";
	str+="<tr height='28'><td>Font styles</td>";							// Font styles
	str+="<td><button class='sf-is' id='lbfont' style='width:46%'>Body</button>&nbsp;&nbsp;&nbsp;";
	str+="<button class='sf-is' id='ltfont' style='width:46%'>Title</button></td></tr>";
	str+="<tr><td>Default text</td><td><div class='sf-is' id='lmark' ";		// Markup
	str+="style='height:50px;overflow:hidden' contenteditable='true'></div></td></tr>";
	str+="<tr height='28'><td style='color:#009900'><b>Page</b></td><td>";	// Page settings
	if (container.cite == undefined)										// If called as a page override
		str+="<input class='sf-is' style='width:100px' id='ltitle' type='text'>"
	str+="</td></tr><tr height='28'><td>Top / bot gutter</td>";				// Gutter
	str+="<td>"+MakeSelect("tgut",false,["None","Thin","Medium","Wide"])+" &nbsp;:&nbsp; ";
	str+=MakeSelect("bgut",false,["None","Thin","Medium","Wide"])+"</td></tr>";
	str+="<tr height='28'><td>Left / right gutter</td>";					// Gutter
	str+="<td>"+MakeSelect("lgut",false,["None","Thin","Medium","Wide"])+" &nbsp;:&nbsp; ";
	str+=MakeSelect("rgut",false,["None","Thin","Medium","Wide"])+"</td></tr>";
	str+="<tr height='28'><td>Aspect format</td><td>";						// Aspect
	str+=MakeSelect("lasp",false,["Portrait","Landscape","Square"])+"</td></tr>";
	str+="<tr height='28'><td>Menubar</td><td>";							// Navigation
	str+=MakeSelect("lnav",false,["None","Top","Middle","Bottom","Left","Right"]);
	str+="&nbsp;&nbsp;&nbsp;<button class='sf-is' id='lnfont' style='width:46%'>Font</button></td></tr>";
	str+="</table><br>";	
	return str+"</div>";													// Return sizer
}

layout.prototype.MakeSizer=function()									// PAGE SIZER 
{
	var str="<div id='layoutSizerDiv' class='sf-layoutSizer'><br>";			// Overall div
	str+="<div id='sizerTopDiv' 	class='sf-sizerTop'><br>Top <span id='topPct'></span></div>";	
	str+="<div id='sizerLeftDiv' 	class='sf-sizerLeft'><br>Left<br><span id='leftPct'></div>";					
	str+="<div id='sizerMidDiv' 	class='sf-sizerMid'><br>Mid<br><span id='midPct'></div>";					
	str+="<div id='sizerRightDiv' 	class='sf-sizerRight'><br>Right<br><span id='rightPct'></span></div>";			
	str+="<div id='sizerBotDiv' 	class='sf-sizerBot'><br>Bot <span id='botPct'></span></div>";						
	str+="<div id='topSizBar' 	style='position:absolute;height:8px;cursor:row-resize' class='sf-unselectable' title='Resize top'></div>";
	str+="<div id='leftSizBar' 	style='position:absolute;width:8px;cursor:col-resize'  class='sf-unselectable' title='Resize left'></div>";
	str+="<div id='rightSizBar' style='position:absolute;width:8px;cursor:col-resize'  class='sf-unselectable' title='Resize right'></div>";
	str+="<div id='botSizBar' 	style='position:absolute;height:8px;cursor:row-resize' class='sf-unselectable' title='Resize bot'></div>";
	str+="<p><div style='position:absolute'>Click on a pane to show its current settings.</div>";		// Help
	str+="<br>Drag space between panes to change size.</p></div>";
	return str+"</div>";													// Return sizer
}

layout.prototype.PickArt=function(callback)								// CHOOSE ARTWORK
{
		var i;
		var _this=this;														// Get context
		var trsty=" onMouseOver='this.style.border=\"3px solid #009900\"' ";// Hover style

		$("#alertBoxDiv").remove();											// Remove any old dialogs
  		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");		// Content													
		var str="<p><img src='img/shantilogo32.png' style='vertical-align:-10px'/>"; 	// Logo
		str+="&nbsp;&nbsp;<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#666'><b>Choose stock image</b></span><p>";
		str+="<div class='sf-artPicker'>";									// Scrolling div
		for (i=0;i<this.stockImages.length;++i) 							// For each image
			str+="<img id='artPic"+i+"' class='sf-artPic' src='"+this.stockImages[i]+"'"+trsty+">"	// add pic
		$("#alertBoxDiv").append(str+"</div>");								// Add to dialog
	
		$("#alertBoxDiv").dialog({ width:600, buttons: {
               	"Cancel":  	function() {									// DONE
		          			$(this).remove(); 								// Close dialog			
							}
   					}});	
			
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc", "z-index":3000});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});

		$('[id^="artPic"]').on("click", function(e) {						// CLICK ON PIC
			Sound("click");													// Click
			var id=e.target.id.substr(6);									// Get id
			callback(_this.stockImages[id]);								// Send url
   			$("#alertBoxDiv").remove(); 									// Close dialog			
			});
}


layout.prototype.SetItemSize=function(id)								// SET ITEM SIZE
{
		$("#alertBoxDiv").remove();											// Remove any old dialogs
		var it=($("#"+id).children()[0]);									// Point at content element
		var cw=$("#"+id).parent().width();									// Width of container pane	
		var ac=cw-$("#"+id).parent().css("padding").replace(/px/,"")*2;		// Less margins (shows as padding)
		var w=Math.min(Math.max(1,Math.round(($(it).width()/ac)*100)),100); // Get as %, 1-100
		var h=$(it).attr("height");											// Get current height
 		if (h) 																// If defined
 			h=""+h.replace(/vh/i,"");										// Remove suffix
 		else																// Undefined
 			h="auto";														// Set as 'auto'
 		if (!isNaN(h))														// If a number
  			h=Math.round(h/(cw-0+4)*100);									// Convert to %  
  		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");		// Content													
		str="<p><img src='img/shantilogo32.png' style='vertical-align:-10px'/>"; 	// Logo
		str+="&nbsp;&nbsp;<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#666'><b>Item size</b></span><p>";
		str+="Set the width and height of the item as a percentage of the pane width from 1 - 100%<br>";
		str+="<table style='width:100%;font-weight:bold;text-align:left'>";
		str+="<tr height='32'><td>Width</td>";
		str+="<td><input class='sf-is' style='width:40px;text-align:center' id='liWid' type='text' value='"+w+"'>&nbsp;&nbsp;%</td></tr>";
		str+="<tr height='32'><td>Height</td>";
		str+="<td><input class='sf-is' style='width:40px;text-align:center' id='liHgt' type='text' value='"+h+"'>&nbsp;&nbsp;%</td></tr>";
		str+="</table></div>";
		$("#alertBoxDiv").append(str);										// Add to dialog
		
  		$("#alertBoxDiv").dialog({ width:230, buttons: {
            	"Set":  function() { 										// SET
               				SetSize();										// Set size
               				},
            	"Done":  function() {										// DONE
		               		id=$("#"+id).parent().attr("id");						// Get active pane
		               		var id2=(id == "playerPaneTop") ? "playerPaneMid" : "playerPaneTop";		// Not the currently active pane
		               		CKEDITOR.instances[id2].focus();						// Blur KLUGE!!!
		              		CKEDITOR.instances[id].focus();							// Focus
		              		CKEDITOR.instances[id2].focus();						// Blur
		             		CKEDITOR.instances[id2].focusManager.blur();			// Blur
		          			$(this).remove(); 				
							}
				}});	
		
		$("#liWid").on("change",SetSize);									// Set size on change
		$("#liHgt").on("change",SetSize);									// Set size on change
		
		function SetSize() {												// SET SIZE
			var v=$("#liWid").val();										// Get %
            var off=Math.round((cw-ac)/cw*v);								// Calc offset of margin
            $(it).attr("width",(v-off)+"%");								// Scale it
  	        v=$("#liHgt").val()*cw;											// Get height in pixels * 100
	        v/=window.innerHeight;											// Percent of hgt
           	if ($("#liHgt").val() == "auto") 								// If setting iframe div
	            $(it).attr("height","auto");								// Auto scale
 			else															// Scale height explicitly
 	            $(it).attr("height",v*10+"vh");								// Scale it in terms of vh
			}
		
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
}

