////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LAYOUT
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function layout()													// CONSTRUCTOR
{
	this.project=null;													// No project yet
	this.plo=null;														// Ptr to 				
	this.paneNames=["Header","Left","Body","Right","Footer"];			// Name of all the panes
	this.curPane=0;														// Start with header
}	

layout.prototype.Set=function(project)								// SET LAYOUT 
{
	var i,o;
	var _this=this;														// Get context
	if (!project.layout) {												// If no layout object yet
		project.layout={};												// Make one
		project.layout.headerPct=10;									// Set default sizes
		project.layout.leftPct=20;
		project.layout.rightPct=20;
		project.layout.footerPct=10;
		project.layout.topGut=0;										// Set default gutters
		project.layout.leftGut=0;
		project.layout.rightGut=0;
		project.layout.botGut=0;
		project.layout.panes=[];										// Holds pane info
		for (i=0;i<this.paneNames.length;++i) {							// For each pane
			o={};														// Pane obj
			o.borderCol="#999999";										// Set default pane params
			o.borderSty="None";							
			o.borderWid="None";							
			o.backCol="#eeeeee";
			o.backImg="";
			o.markUp-"";
			project.layout.panes.push(o);								// Add to array
			}
		}
	this.plo=project.layout;											// Point at layout object							
	var str="<br>"+this.MakeParams();									// Make page params UI
	str+=this.MakeSizer();												// Make page sizer UI
	ShowLightBox(700,"Set page layout",str);
	this.Update();														// Update resizer/params

	$('[id^="sizer"]').on("click", function(e) {						// CLICK ON ANY DIV STARRING WITH 'SIZER'
		$('[class^="sf-sizer"]').css("border", "1px none");				// Clear all
		$(this).css("border", "1px solid #009900")						// Add border 
		var s=e.target.id.substr(5).replace(/Div/,"");					// Extract pane name
		for (var i=0;i<_this.paneNames.length;++i)						// Search through pane names
			if (s == _this.paneNames[i]) {								// A match
				_this.curPane=i;										// Set curPane
				break;													// Quit looking
				}
		_this.Update();													// Show new name
		});

	$("#sizerHeaderDiv").trigger("click");								// Turn on header at start
	
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
	$("#tgut").on("blur", function(e) {									// TOP GUTTER HANDLER
			_this.plo.topGut=$(this).val();								// Set back img
			}); 
	$("#bgut").on("blur", function(e) {									// BOT GUTTER HANDLER
			_this.plo.botGut=$(this).val();								// Set back img
			}); 
	$("#lgut").on("blur", function(e) {									// LEFT GUTTER HANDLER
			_this.plo.leftGut=$(this).val();							// Set back img
			}); 
	$("#rgut").on("blur", function(e) {									// RIGHT GUTTER HANDLER
			_this.plo.rightGut=$(this).val();							// Set back img
			}); 
	$("#lmark").on("blur", function(e) {								// BACK IMG HANDLER
			_this.plo.panes[_this.curPane].markUp=$(this).val();		// Set back img
			}); 
	
	$('[id*="SizBar"]').hover(											// HOVER ON HEADER
		function(){ $(this).css("background-color","#acc3db")},			// Highlight
		function(){ $(this).css("background-color","transparent")		// Hide
		});
	
	$("#headerSizBar").draggable({										// DRAG HEADER HEIGHT HANDLER
		cursor: "row-resize", axis:"y",									// Y-only
		stop: function(event, ui) {										// When done
			$(this).css({ top:"100%" });								// Reset resizer bar
			},
		drag: function(event, ui) {										// On drag
			var y=event.clientY-$("#sizerHeaderDiv").offset().top;		// Position within layout block
			var h=$("#sizerHeaderDiv").height()+$("#sizerBodyDiv").height()+$("#sizerFooterDiv").height();	// Height of travel
			var r=y/h;													// Ratio
			r=Math.min(100-_this.plo.footerPct,Math.max(0,r*100));		// Cap 0-100% - footer
			_this.plo.headerPct=r;										// Set val
			_this.Update();												// Update resizer
			$(this).css({ top:"100%" });								// Reset resizer bar
			}
		});

	$("#footerSizBar").draggable({										// DRAG HEADER HEIGHT HANDLER
		cursor: "row-resize", axis:"y",									// Y-only
		stop: function(event, ui) {										// When done
			$(this).css({ top:"0%" });									// Reset resizer bar
			},
		drag: function(event, ui) {										// On drag
			var y=event.clientY-$("#sizerHeaderDiv").offset().top;		// Position within layout block
			var h=$("#sizerHeaderDiv").height()+$("#sizerBodyDiv").height()+$("#sizerFooterDiv").height();	// Height of travel
			var r=y/h;													// Ratio
			r=Math.max(_this.plo.headerPct,Math.min(100,r*100));		// Cap 0-100% - header
			_this.plo.footerPct=100-r;									// Set val
			_this.Update();												// Update resizer
			}
		});

	$("#leftSizBar").draggable({										// DRAG LEFT WIDTH HANDLER
		cursor: "col-resize", axis:"x",									// X-only
		stop: function(event, ui) {										// When done
			$(this).css({ left:"100%" });								// Reset resizer bar
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
			$(this).css({ left:"100%" });								// Reset resizer bar
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
	var midHgt=Math.max(Math.min(100-o.headerPct-o.footerPct,100),0);	// Get body% height 0-100
	var midWid=Math.max(Math.min(100-o.rightPct-o.leftPct,100),0);		// Get body% width 0-100
	$('[id^="sizer"]').show();											// Make sure they are all showing
	$("#sizerHeaderDiv").css({ height:o.headerPct+"%" });				// Set header		
	$("#sizerLeftDiv").css({   height:midHgt+"%",width:o.leftPct+"%" });// Set left
	$("#sizerBodyDiv").css({   height:midHgt+"%",width:midWid+"%" });	// Set body
	$("#sizerRightDiv").css({  height:midHgt+"%",width:o.rightPct+"%" });// Set right
	$("#sizerFooterDiv").css({ height:o.footerPct+"%" })				// Set footer		
	$("#sizerBodyDiv").width($("#sizerBodyDiv").width()-6);				// Remove extra margins
	if (!midWid && $("#sizerleftDiv").width())							// No body, but left visible
		$("#sizerLeftDiv").width($("#sizerLeftDiv").width()-6);			// Remove extra margins
	else if (!midWid && $("#sizerRightDiv").width())					// No body, but right visible
		$("#sizerRightDiv").width($("#sizerRightDiv").width()-6);		// Remove extra margins
	if (!midHgt) { 														// No body
		$("#sizerLeftDiv").hide();										// Hide middle ones
		$("#sizerBodyDiv").hide()
		$("#sizerRightDiv").hide()
		}
	$("#headPtc").text(Math.floor(o.headerPct)+"%");					// Show %
	$("#leftPtc").text(Math.floor(o.leftPct)+"%");					
	$("#bodyPtc").text(Math.floor(100-o.leftPct-o.rightPct)+"%");		// Mid is 100-left-right			
	$("#rightPtc").text(Math.floor(o.rightPct)+"%");					
	$("#footerPtc").text(Math.floor(o.footerPct)+"%");				
	$("#paneTitle").text(this.paneNames[this.curPane]);					// Pane name			
	$("#lbcol").val(o.panes[this.curPane].borderCol);					// Set border color
	ColorPicker("lbcol",-1,true);
	$("#lbgcol").val(o.panes[this.curPane].backCol);					// Set back color
	ColorPicker("lbgcol",-1,true);
	$("#lbgimg").val(o.panes[this.curPane].backImg);					// Set back image
	$("#lbs").val(o.panes[this.curPane].borderSty);						// Set border style
	$("#lbw").val(o.panes[this.curPane].borderWid);						// Set border width
	$("#lmark").val(o.panes[this.curPane].markUp);						// Set markup
}

layout.prototype.MakeParams=function()									// PAGE SIZER 
{
	var str="<div id='layoutParamsDiv' class='sf-layoutParams'>";			// Overall div
	str+="<table style='width:100%;text-align:left'>";						// Table
	str+="<tr><td>Pane<td style='color:#009900;font-weight:bold' id='paneTitle'></td></tr>";	// Pane name
	str+="<tr height='28'><td>Background image &nbsp;</td>";				// Back Pic
	str+="<td><input class='sf-is' id='lbgimg' type='text'></td></tr>";
	str+="<tr height='28'><td>Background color &nbsp;</td>";				// Back col
	str+="<td><input class='sf-is' style='width:50px' id='lbgcol' type='text'></td></tr>";
	str+="<tr height='28'><td>Border style</td><td>";						// Border style
	str+=MakeSelect("lbs",false,["None","Solid","Dashed","Double","Groove","Ridge","Inset","Outset"])+"</td></tr>";
	str+="<tr height='28'><td>Border width</td><td>";						// Border width
	str+=MakeSelect("lbw",false,["None",1,2,3,4,5])+"</td></tr>";
	str+="<tr height='28'><td>Border color &nbsp;</td>";					// Back col
	str+="<td><input class='sf-is' id='lbcol' style='width:50px' type='text'></td></tr>";
	str+="<tr height='28'><td>Header/footer space</td>";					// Gutter
	str+="<td><input class='sf-is' style='width:50px' id='tgut' type='text'> &nbsp;/&nbsp; ";
	str+="<input class='sf-is' style='width:50px' id='bgut' type='text'></td></tr>";
	str+="<tr height='28'><td>Left/right space</td>";						// Gutter
	str+="<td><input class='sf-is' style='width:50px' id='lgut' type='text'> &nbsp;/&nbsp; ";
	str+="<input class='sf-is' style='width:50px' id='rgut' type='text'></td></tr>";
	str+="<tr><td>Default text</td><td><textarea class='sf-is' id='lmark' ";// Markup
	str+="style='font-family:sans-serif'></textarea></td></tr>";
	str+="</table>";	
	str+="<p><div class='sf-layoutPcts'>";	
	str+="&nbsp; Top <span id='headPtc'></span>&nbsp Left <span id='leftPtc'></span> "; 
	str+="&nbspMid <span id='bodyPtc'></span>&nbsp Right <span id='rightPtc'></span> "; 
	str+="&nbspBot <span id='footerPtc'></span>&nbsp;</div></p>"; 
	str+="Click on a pane to show its current settings.<br>";				// Help
	str+="Drag in the space between panes to set a pane's height<br>or width.";
	return str+"</div>";													// Return sizer
}

layout.prototype.MakeSizer=function()									// PAGE SIZER 
{
	var str="<div  id='layoutSizerDiv' class='sf-layoutSizer'>";			// Overall div
	str+="<div id='sizerHeaderDiv' class='sf-sizerHeader'>";				// Header div
	str+="<div id='headerSizBar' style='position:relative;top:100%;width:100%;height:8px;cursor:row-resize' class='sf-unselectable' title='Resize header'></div></div>";
	str+="<div id='sizerLeftDiv' class='sf-sizerLeft'>";					// Left div
	str+="<div id='leftSizBar' style='position:relative;top:0px;left:100%;height:100%;width:8px;cursor:col-resize' class='sf-unselectable' title='Resize left'></div></div>";
	str+="<div id='sizerBodyDiv'   class='sf-sizerBody'>";					// Body div
	str+="<div id='rightSizBar' style='position:relative;top:0px;left:100%;height:100%;width:8px;cursor:col-resize' class='sf-unselectable' title='Resize right'></div></div>";
	str+="<div id='sizerRightDiv'  class='sf-sizerRight'></div>";			// Right div
	str+="<div id='sizerFooterDiv' class='sf-sizerFooter'>";				// Footer div
	str+="<div id='footerSizBar' style='position:relative;width:100%;height:8px;cursor:row-resize' class='sf-unselectable' title='Resize footer'></div></div>";
	return str+"</div>";													// Return sizer
}
