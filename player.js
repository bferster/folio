////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PLAYER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function player()														// CONSTRUCTOR
{
}	

player.prototype.Make=function()										// MAKE PLAYER
{
	var str="<div id='playerDiv'  class='sf-player'>";						// Player container
	str+="<div id='playerTopDiv'  class='sf-playerPane'  contenteditable='true'></div>";				
	str+="<div id='playerLeftDiv' class='sf-playerPane'  contenteditable='true'></div>";	// Left
	str+="<div id='playerMidDiv'  class='sf-playerPane'  contenteditable='true'></div>";	// Mid
	str+="<div id='playerRightDiv' class='sf-playerPane' contenteditable='true'></div>";	// Right
	str+="<div id='playerBotDiv'  class='sf-playerPane'  contenteditable='true'></div>";	// Bot	
	return str+"</div>";													// Return player
}

player.prototype.Update=function(page, defLayout)						// UPDATE PLAYER
{
	var asp=defLayout.aspect;												// Start with project default
	var parent=$("#playerDiv").parent();									// Point at panrent container
	if (page.layout && (page.layout.aspect != undefined))					// If a layout val set
		asp=page.layout.aspect;												// Use page override
	var w=$("#playerDiv").width();											// Get width of container
	var h=$("#playerDiv").height();											// Get height of container
	if (asp == "Square")			h=w;									// Set square size
	else if (asp == "Landscape")	h=w/2;									// Set landscape size
	else 							h=$("#playerDiv").height();				// Set portrait size
	$("#playerDiv").height(h);												// Set overall height

	var tpct=defLayout.topPct;												// Start with project default
	if (page.layout && (page.layout.topPct != undefined))					// If a layout val set
		tpct=page.layout.topPct;											// Use page override
	var bpct=defLayout.botPct;												// Start with project default
	if (page.layout && (page.layout.topPct != undefined))					// If a layout val set
		bpct=page.layout.botPct;											// Use page override
	var lpct=defLayout.leftPct;												// Start with project default
	if (page.layout && (page.layout.leftPct != undefined))					// If a layout val set
		lpct=page.layout.leftPct;											// Use page override
	var rpct=defLayout.rightPct;											// Start with project default
	if (page.layout && (page.layout.rightPct != undefined))					// If a layout val set
		rpct=page.layout.rightPct;											// Use page override

	var mhgt=Math.max(100-tpct-bpct,0);
	var cpct=Math.max(100-lpct-rpct,0);
	$('[id^="player"]').show(); 											// Show all
	$("#playerTopDiv").css({ width:"100%",height:tpct+"%" });
	$("#playerLeftDiv").css({ width:+lpct+"%",height:mhgt+"%" });
	$("#playerMidDiv").css({ width:+cpct+"%",height:mhgt+"%"});
	$("#playerRightDiv").css({ width:+rpct+"%",height:mhgt+"%"});
	$("#playerBotDiv").css({ width:"100%",height:bpct+"%" });
	if (!mhgt) {															// No middle's
		$("#playerLeftDiv").hide();											// Hide them
		$("#playerMidDiv").hide();
		$("#playerRightDiv").hide();
		}	
	if (!$("#playerTopDiv").height())	$("#playerTopDiv").hide();			// Hide top if invisible
	if (!$("#playerLeftDiv").width())	$("#playerLeftDiv").hide();			// Hide left if invisible
	if (!$("#playerMidDiv").width())	$("#playerMidDiv").hide();			// Hide mid if invisible
	if (!$("#playerRightDiv").width())	$("#playerRightDiv").hide();		// Hide right if invisible
	if (!$("#playerBotDiv").height())	$("#playerBotDiv").hide();			// Hide bot if invisible
	CKEDITOR.inline( $("#playerTopDiv")[0] );								// Enable rich text
	CKEDITOR.inline( $("#playerLeftDiv")[0] );
	CKEDITOR.inline( $("#playerMidDiv")[0] );
	CKEDITOR.inline( $("#playerRightDiv")[0] );
	CKEDITOR.inline( $("#playerBotDiv")[0] );
}	



