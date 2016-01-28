////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LAYOUT
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function layout()														// CONSTRUCTOR
{
	this.headerPct=10;
	this.footerPct=10;
	this.leftPct=33;
	this.bodyPct-33;
	this.rightPct=33;
	this.curPane="header";
}	

layout.prototype.Set=function()											// SET LAYOUT 
{
	var _this=this;														// Get context
	var str="<br>"+this.MakeParams();									// Make page params UI
	str+=this.MakeSizer();												// Make page sizer UI
	ShowLightBox(800,"Set page layout",str);

	$('[id^="sizer"]').on("click", function() {							// CLICK ON ANY DIV STARRING WITH 'SIZER'
		$('[class^="sf-sizer"]').css("border", "initial");				// Clear all
		$(this).css("border", "1px solid #009900")						// Add border 
		});
	
	$('[id*="SizBar"]').hover(											// HOVER ON HEADER
		function(){ $(this).css("background-color","#acc3db")},			// Highlight
		function(){ $(this).css("background-color","transparent")		// Hide
		});
	
	$("#headerSizBar").draggable({										// DRAG HEADER HEIGHT HANDLER
		cursor: "row-resize", axis:"y",									// X-only
		stop: function(event, ui) {										// When done
			$(this).css({ top:"0px" });									// Reset resizer bar
			},
		drag: function(event, ui) {										// On drag
			var y=event.clientY-$("#sizerHeaderDiv").offset().top;		// Position within layout block
			var r=y/$("#layoutSizerDiv").height();						// Ratio
			r=Math.min(1,Math.max(0,r));								// Cap 0-1
			var r1=1-r;													// Inverse
			$(this).css("background-color","transparent");				// Hide bar
			_this.headerPct=r*100;										// Set header
			_this.leftPct=r1*100;										// Set middle vals
			_this.bodyPct=r1*100;									
			_this.rightPct=r1*100;									
			_this.UpdateResizer();										// Update resizer
			}
		});



}

layout.prototype.UpdateResizer=function()							// UPDATE PAGE SIZER 
{
	$("#sizerHeaderDiv").css({ height:this.headerPct+"%" })				// Set val		
	$("#sizerLeftDiv").css({   height:this.leftPct+"%" })
	$("#sizerBodyDiv").css({   height:this.bodyPct+"%" })
	$("#sizerRightDiv").css({  height:this.rightPct+"%" })
	$("#sizerFooterDiv").css({ height:this.footerPct+"%" })			
	$("#headPtc").text(Math.floor(this.headerPct)+"%");					// Show %
	$("#leftPtc").text(Math.floor(this.leftPct)+"%");					
	$("#rightPtc").text(Math.floor(this.rightPct)+"%");					
	$("#bodyPtc").text(Math.floor(this.sbodyPct)+"%");					
	$("#footerPtc").text(Math.floor(this.footerPct)+"%");				
}

layout.prototype.MakeParams=function()									// PAGE SIZER 
{
	var str="<div id='layoutParamsDiv' class='sf-layoutParams'>";				// Overall div
	str+="<br><br><br>Parameters"
	
	return str+"</div>";													// Return sizer
}
layout.prototype.MakeSizer=function()									// PAGE SIZER 
{
	var str="<div  id='layoutSizerDiv' class='sf-layoutSizer'>";			// Overall div
	str+="<div id='sizerHeaderDiv' class='sf-sizerHeader'></div>";			// Header div
	str+="<div id='headerSizBar' style='width:100%;height:8px;cursor:row-resize' class='sf-unselectable' title='Resize header'></div>";
	str+="<div id='sizerLeftDiv' class='sf-sizerLeft'>";					// Left div
	str+="<div id='leftSizBar' style='position:relative;top:0px;left:100%;height:100%;width:8px;cursor:col-resize' class='sf-unselectable' title='Resize left'></div></div>";
	str+="<div id='sizerBodyDiv'   class='sf-sizerBody'>";					// Body div
	str+="<div id='rightSizBar' style='position:relative;top:0px;left:100%;height:100%;width:8px;cursor:col-resize' class='sf-unselectable' title='Resize right'></div></div>";
	str+="<div id='sizerRightDiv'  class='sf-sizerRight'></div>";			// Right div
	str+="<div id='footerSizBar' style='width:100%;height:8px;cursor:row-resize' class='sf-unselectable' title='Resize footer'></div>";
	str+="<div id='sizerFooterDiv' class='sf-sizerFooter'></div>";			// Footer div
	str+="<p><div class='sf-layoutPcts'>";	
	str+=" Top <span id='headPtc'>10%</span> Left <span id='leftPtc'>33%</span> "; 
	str+="Mid <span id='bodyPtc'>10%</span> Right <span id='rightPtc'>33%</span> "; 
	str+="Bot <span id='footerPtc'>10% </span></div>"; 
	str+="Click on a pane to change its current settings. ";				// Help
	str+="Drag between the panes to set the pane's height or width.</p>";
	return str+"</div>";													// Return sizer
}







/*
 	str+="<table style='width:100%;text-align:left'>";
	str+="<tr height='32'><td width='1%'>Title</td>";
	str+="<td><input class='sf-is' id='pTitle' ";
	str+="type='text' value='"+pTitle+"'></td></tr>";
	str+="<tr height='28'><td>Description</td><td><textarea class='sf-is' id='pDesc' ";
	str+="style='font-family:sans-serif'>"+pDesc+"</textarea></td></tr>";
	str+="<tr height='28'><td>Citation</td>";
	str+="<td><input class='sf-is' id='pCite' ";
	str+="type='text' value='"+pCite+"'></td></tr>";
	str+="<tr height='28'><td>Tags</td>";
	str+="<td><input class='sf-is' id='pTags' type='text' value='"+pTags+"'></td></tr>";
	str+="<tr height='28'><td>Collaborators&nbsp;&nbsp;&nbsp;</td>";
	str+="<td>"+MakeSelect("pCollab",false,pCollab);
	str+="<img id='collabAddBut' class='sf-galleryBut' src='img/addbut.gif' style='vertical-align:-4px;margin-left:20px;margin-right:10px' title='Add new collaborator'>";
	str+="<img id='collabTrashBut' class='sf-galleryBut' src='img/trashbut.gif' style='vertical-align:-4px;margin-right:0px' title='Remove a collaborator'></td></tr>";
	str+="<tr height='28'><td>Format style</td><td>";
	str+=MakeSelect("pFormat",false,["Booklet","SinglePage","Canvas","Slideshow"],pFormat)+"</td></tr>";
	str+="<tr height='50'><td colspan='2' style='text-align:center'>";
	str+="<button class='sf-bs' style='width:100px' id='addPages'>Add pages</button>&nbsp; &nbsp;";		// Add pages button
	str+="<button class='sf-bs' style='width:100px' id='setLayout'>Set layout</button>&nbsp; &nbsp;";	// Set layout button
	str+="<button class='sf-bs' style='width:100px' id='editPages'>Edit pages</button></td></tr>";		// View pages button
	str+="</table>";	

 */	