////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PLAYER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function player()														// CONSTRUCTOR
{
	this.ckTop=this.ckMid=this.ckLeft=this.chRight=this.ckBot=null;			// Holds CKEditor instances
}	

player.prototype.Make=function()										// MAKE PLAYER
{
	var str="<div id='playerDiv'  class='sf-player'>";						// Player container
	str+="<div id='playerPaneTop'  class='sf-playerPane'  contenteditable='true'></div>";				
	str+="<div id='playerPaneLeft' class='sf-playerPane'  contenteditable='true'></div>";	// Left
	str+="<div id='playerPaneMid'  class='sf-playerPane'  contenteditable='true'></div>";	// Mid
	str+="<div id='playerPaneRight' class='sf-playerPane' contenteditable='true'></div>";	// Right
	str+="<div id='playerPaneBot'  class='sf-playerPane'  contenteditable='true'></div>";	// Bot	
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
	$("#playerDiv").height(h);												// Set overall height

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
	$("#playerPaneTop").css({ width:"100%",height:tpct+"%" });
	$("#playerPaneLeft").css({ width:+lpct+"%",height:mhgt+"%" });
	$("#playerPaneMid").css({ width:+cpct+"%",height:mhgt+"%"});
	$("#playerPaneRight").css({ width:+rpct+"%",height:mhgt+"%"});
	$("#playerPaneBot").css({ width:"100%",height:bpct+"%" });

	if (!mhgt) {															// No middle's
		$("#playerPaneLeft").hide();											// Hide them
		$("#playerPaneMid").hide();
		$("#playerPaneRight").hide();
		}	
	if (!$("#playerPaneTop").height())	$("#playerPaneTop").hide();			// Hide top if invisible
	if (!$("#playerPaneLeft").width())	$("#playerPaneLeft").hide();			// Hide left if invisible
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
	
	this.ckTop=CKEDITOR.inline( $("#playerPaneTop")[0] );					// Enable rich text
	this.ckLeft=CKEDITOR.inline( $("#playerPaneLeft")[0] );
	this.ckMid=CKEDITOR.inline( $("#playerPaneMid")[0] );
	this.ckRight=CKEDITOR.inline( $("#playerPaneRight")[0] );
	this.ckBot=CKEDITOR.inline( $("#playerPaneBot")[0] );
}	



