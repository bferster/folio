////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PLAYER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function player(showOnly)														// CONSTRUCTOR
{
	this.divs=["#playerPaneTop","#playerPaneLeft","#playerPaneMid","#playerPaneRight","#playerPaneBot"]; // Array of div names
	this.guts=[];																// Gutter sizes
	this.guts["None"]=0;  this.guts["Thin"]=2;  this.guts["Medium"]=8; this.guts["Wide"]=16;	
	this.ckTop=this.ckMid=this.ckLeft=this.chRight=this.ckBot=null;				// Holds CKEditor instances
	this.editable=!showOnly;													// Editable mode?
}	

player.prototype.Make=function()										// MAKE PLAYER
{
	var s=this.editable ? " contenteditable='true'" : "";					// Editable flag for CKEditor if editing
	var str="<div id='playerDiv'  class='sf-player'>";						// Player container
	str+="<div id='playerPaneTop'  class='sf-playerPane'"+s+" style='margin-bottom:-3px'></div>"; // Top			
	str+="<div id='playerPaneLeft' class='sf-playerPane'"+s+"></div>";		// Left
	str+="<div id='playerPaneMid'  class='sf-playerPane'"+s+"></div>";		// Mid
	str+="<div id='playerPaneRight' class='sf-playerPane'"+s+"></div>";		// Right
	str+="<div id='playerPaneBot'  class='sf-playerPane'"+s+"style='margin-top:-3px'></div>";	// Bot	
	return str+"</div>";													// Return player
}

player.prototype.Update=function(page, defLayout)						// UPDATE PLAYER
{
	var markUp;
	var asp=defLayout.aspect;												// Start with default
	var parent=$("#playerDiv").parent();									// Point at panrent container
	if (!page)																// If no page
		return;																// Quit
	if (page.layout && (page.layout.aspect != undefined))					// If a layout val set
		asp=page.layout.aspect;												// Use page override
	var w=$("#playerDiv").width();											// Get width of container
	var h=$("#playerDiv").height();											// Get height of container
	if (asp == "Square")			h=w;									// Set square size
	else if (asp == "Landscape")	h=w/2;									// Set landscape size
	else 							h=$("#playerDiv").height();				// Set portrait size

	var v1=defLayout.topGut ? this.guts[defLayout.topGut] : 0;				// If def top gutter, use it
	if (page.layout && (page.layout.topGut != undefined))					// If a page override set
		v1=this.guts[page.layout.topGut];									// Use it
	var v2=defLayout.topGut ? this.guts[defLayout.botGut] : 0;				// If def bt gutter, use it
	if (page.layout && (page.layout.botGut != undefined))					// If a page override set
		v2=this.guts[page.layout.botGut];									// Use it
	$("#playerDiv").height(h-v1-v2);										// Set overall height
	
	var tpct=defLayout.topPct;												// Start with default
	if (page.layout && (page.layout.topPct != undefined))					// If a layout val set
		tpct=page.layout.topPct;											// Use page override
	var bpct=defLayout.botPct;												// Start with default
	if (page.layout && (page.layout.topPct != undefined))					// If a layout val set
		bpct=page.layout.botPct;											// Use page override
	var lpct=defLayout.leftPct;												// Start with default
	if (page.layout && (page.layout.leftPct != undefined))					// If a layout val set
		lpct=page.layout.leftPct;											// Use page override
	var rpct=defLayout.rightPct;											// Start with default
	if (page.layout && (page.layout.rightPct != undefined))					// If a layout val set
		rpct=page.layout.rightPct;											// Use page override

	var mhgt=Math.max(100-tpct-bpct,0);
	var cpct=Math.max(100-lpct-rpct,0);
	$('[id^="player"]').show(); 											// Show all
	
	v1=defLayout.leftGut ? this.guts[defLayout.leftGut] : 0;				// If def left gutter, use it
	if (page.layout && (page.layout.leftGut != undefined))					// If a page override set
		v1=this.guts[page.layout.leftGut];									// Use it
	v2=defLayout.rightGut ? this.guts[defLayout.rightGut] : 0;				// If def right gutter, use it
	if (page.layout && (page.layout.rightGut != undefined))					// If a page override set
		v2=this.guts[page.layout.rightGut];									// Use it
	
	$("#playerPaneTop").css({ width:"100%",height:tpct+"%" });
	$("#playerPaneLeft").css({ width:"calc("+lpct+"% - "+v1+"px)",height:mhgt+"%" });
	$("#playerPaneMid").css({ width:+cpct+"%",height:mhgt+"%"});
	$("#playerPaneRight").css({ width:"calc("+rpct+"% - "+v2+"px)",height:mhgt+"%"});
	$("#playerPaneBot").css({ width:"100%",height:bpct+"%" });

	if (!mhgt) {															// No middle's
		$("#playerPaneLeft").hide();										// Hide them
		$("#playerPaneMid").hide();
		$("#playerPaneRight").hide();
		}	
	if (!$("#playerPaneTop").height())	$("#playerPaneTop").hide();			// Hide top if invisible
	if (!$("#playerPaneLeft").width())	$("#playerPaneLeft").hide();		// Hide left if invisible
	if (!$("#playerPaneMid").width())	$("#playerPaneMid").hide();			// Hide mid if invisible
	if (!$("#playerPaneRight").width())	$("#playerPaneRight").hide();		// Hide right if invisible
	if (!$("#playerPaneBot").height())	$("#playerPaneBot").hide();			// Hide bot if invisible

	if (this.ckTop)		this.ckTop.destroy();								// Remove old editors
	if (this.ckLeft)	this.ckLeft.destroy();								
	if (this.ckMid)		this.ckMid.destroy();								
	if (this.ckRight)	this.ckRight.destroy();								
	if (this.ckTop)		this.ckTop.destroy();								
	
	$("#playerPaneTop").html(page.markUpTop ? page.markUpTop : ""); 		// Set html of panes
	$("#playerPaneLeft").html(page.markUpLeft ? page.markUpLeft : ""); 		
	$("#playerPaneMid").html(page.markUpMid ? page.markUpMid : ""); 		
	$("#playerPaneRight").html(page.markUpRight ? page.markUpRight : ""); 		
	$("#playerPaneBot").html(page.markUpBot ? page.markUpBot : ""); 		
	if (this.editable) {													// If editable
		this.ckTop=CKEDITOR.inline( $("#playerPaneTop")[0] );				// Enable rich text
		this.ckLeft=CKEDITOR.inline( $("#playerPaneLeft")[0] );
		this.ckMid=CKEDITOR.inline( $("#playerPaneMid")[0] );
		this.ckRight=CKEDITOR.inline( $("#playerPaneRight")[0] );
		this.ckBot=CKEDITOR.inline( $("#playerPaneBot")[0] );
		}
	this.StylePage(page,defLayout);											// Style page
}	

player.prototype.StylePage=function(page, defLayout)					// STYLE PAGE
{
	var val,val2,val3;
	for (i=0;i<this.divs.length;++i) {										// For each pane
		val=defLayout.panes[i].backCol ? defLayout.panes[i].backCol : "";	// If def back col, use it
		if (page.layout && (page.layout.panes[i].backCol != undefined))		// If a page override set
			val=page.layout.panes[i].backCol;								// Use it
		if (val) $(this.divs[i]).css("background-color",val);				// Apply value if set 

		val=defLayout.panes[i].backImg ? defLayout.panes[i].backImg : "";	// If def back image, use it
		if (page.layout && (page.layout.panes[i].backImg != undefined))		// If a page override set
			val=page.layout.panes[i].backImg;								// Use it
		if (val) $(this.divs[i]).css("background-image","url('"+val+"')");	// Apply value if set 

		val=defLayout.panes[i].borderSty ? defLayout.panes[i].borderSty : "";	// If def border style, use it
		if (page.layout && (page.layout.panes[i].borderSty != undefined))		// If a page override set
			val=page.layout.panes[i].borderSty;									// Use it
		val2=defLayout.panes[i].borderWid ? defLayout.panes[i].borderWid : "";	// If def border width, use it
		if (page.layout && (page.layout.panes[i].borderWid != undefined))		// If a page override set
			val2=page.layout.panes[i].borderWid;								// Use it
		val3=defLayout.panes[i].borderCol ? defLayout.panes[i].borderCol : "";	// If def border color, use it
		if (page.layout && (page.layout.panes[i].borderCol != undefined))		// If a page override set
			val3=page.layout.panes[i].borderCol;								// Use it
		if (val) $(this.divs[i]).css("border",val2+"px "+val+" "+val3);			// Apply value if set 
		}
	
	val=defLayout.topGut ? this.guts[defLayout.topGut] : 0;					// If def top gutter, use it
	if (page.layout && (page.layout.topGut != undefined))					// If a page override set
		val=this.guts[page.layout.topGut];									// Use it
	if (val) $(this.divs[0]).css("margin-bottom",val);						// Apply value if set 
	
	val=defLayout.botGut ? this.guts[defLayout.botGut] : 0;					// If def bot override set
	if (page.layout && (page.layout.botGut != undefined))					// If a page override set
		val=this.guts[page.layout.botGut];									// Use it
	if (val) $(this.divs[4]).css("margin-top",val);							// Apply value if set 
	
	val=defLayout.leftGut ? this.guts[defLayout.leftGut] : 0;				// If def left override set
	if (page.layout && (page.layout.leftGut != undefined))					// If a page override set
		val=this.guts[page.layout.leftGut];									// Use it
	if (val) $(this.divs[1]).css("margin-right",val);						// Apply value if set 

	val=defLayout.rightGut ? this.guts[defLayout.rightGut] : 0;				// If def right override set
	if (page.layout && (page.layout.rightGut != undefined))					// If a page override set
		val=this.guts[page.layout.rightGut];								// Use it
	if (val) $(this.divs[3]).css("margin-left",val);						// Apply value if set 

}

