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
}	

layout.prototype.Init=function(container, template)					// INIT LAYOUT 
{
	container.layout={};												// Make one
	container.layout.topPct=template.topPct;							// Set default sizes
	container.layout.leftPct=template.leftPct;
	container.layout.rightPct=template.rightPct;
	container.layout.botPct=template.botPct;
	container.layout.aspect="";									
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
	this.curPane=0;														// Start with top
	if (!container.layout) 												// If no layout object yet
		this.Init(container,template);									// Init object
	this.plo=container.layout;											// Point at layout object							
	var str="<br>"+this.MakeParams();									// Make page params UI
	str+=this.MakeSizer();												// Make page sizer UI
	ShowLightBox(700,"Set page layout",str,callback);					// Put up dialog
	this.Update();														// Update resizer/params
	if (this.ckMark)	this.ckMark.destroy();							// Kill old instance						
	this.ckMark=CKEDITOR.inline($("#lmark")[0]);						// Enable rich text editor

	$('[id^="sizer"]').on("click", function(e) {						// CLICK ON ANY DIV STARRING WITH 'SIZER'
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
			_this.Update();												// Update resizer
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
	$("#lbgimg").val(o.panes[this.curPane].backImg);					// Set back image
	$("#lbs").val(o.panes[this.curPane].borderSty);						// Set border style
	$("#lbw").val(o.panes[this.curPane].borderWid);						// Set border width
	$("#lmark").html(o.panes[this.curPane].markUp);						// Set markup
	$("#tgut").val(o.topGut);											// Set gutters
	$("#lgut").val(o.leftGut);											
	$("#rgut").val(o.rightGut);											
	$("#bgut").val(o.botGut);											
	$("#lasp").val(o.aspect);											// Set aspect
}

layout.prototype.MakeParams=function()									// PAGE SIZER 
{
	var str="<div id='layoutParamsDiv' class='sf-layoutParams'>";			// Overall div
	str+="<table style='width:100%;text-align:left'>";	// Table
	str+="<tr height='28'><td>Pane<td style='color:#009900;font-weight:bold' id='paneTitle'></td></tr>";	// Pane name
	str+="<tr height='28'><td>Background image &nbsp; </td>";				// Back Pic
	str+="<td><input class='sf-is' id='lbgimg' type='text'></td></tr>";
	str+="<tr height='28'><td>Background color &nbsp;</td>";				// Back col
	str+="<td><input class='sf-is' style='width:50px' id='lbgcol' type='text'></td></tr>";
	str+="<tr height='28'><td>Border style</td><td>";						// Border style
	str+=MakeSelect("lbs",false,["None","Solid","Dashed","Double","Groove","Ridge","Inset","Outset"])+"</td></tr>";
	str+="<tr height='28'><td>Border width</td><td>";						// Border width
	str+=MakeSelect("lbw",false,[1,2,3,4,5])+"</td></tr>";
	str+="<tr height='28'><td>Border color &nbsp;</td>";					// Back col
	str+="<td><input class='sf-is' id='lbcol' style='width:50px' type='text'></td></tr>";
	str+="<tr height='28'><td>Top / bot gutter</td>";						// Gutter
	str+="<td>"+MakeSelect("tgut",false,["None","Thin","Medium","Wide"])+" &nbsp;:&nbsp; ";
	str+=MakeSelect("bgut",false,["None","Thin","Medium","Wide"])+"</td></tr>";
	str+="<tr height='28'><td>Left / right gutter</td>";					// Gutter
	str+="<td>"+MakeSelect("lgut",false,["None","Thin","Medium","Wide"])+" &nbsp;:&nbsp; ";
	str+=MakeSelect("rgut",false,["None","Thin","Medium","Wide"])+"</td></tr>";
	str+="<tr height='28'><td>Aspect format</td><td>";						// Aspect
	str+=MakeSelect("lasp",false,["Portrait","Landscape","Square"])+"</td></tr>";
	str+="<tr height='28'><td>Font styles</td>";							$// Font styles
	str+="<td><button class='sf-is' id='lbfont' style='width:46%'>Body</button> &nbsp; ";
	str+="<button class='sf-is' id='ltfont' style='width:46%'>Title </button></td></tr>";
	str+="<tr><td>Default text</td><td><div class='sf-is' id='lmark' ";		// Markup
	str+="style='height:50px;overflow:hidden' contenteditable='true'></div></td></tr>";
	str+="</table><br>";	
	str+="Click on a pane to show its current settings.<br>";				// Help
	str+="Drag in the space between panes to set a pane's height or width.<br><br><br>";
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
	return str+"</div>";													// Return sizer
}
