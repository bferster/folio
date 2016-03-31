////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PLAYER
// Assumes access to curPage, page and layout structures, layoutObj
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function player()													// CONSTRUCTOR
{
	this.divs=["#playerPaneTop","#playerPaneLeft","#playerPaneMid","#playerPaneRight","#playerPaneBot"]; // Array of div names
	this.paneNames=["Top","Left","Mid","Right","Bot"];						// Name of all the panes
	this.guts=[];															// Gutter sizes
	this.guts["None"]=0;  this.guts["Thin"]=2;  this.guts["Medium"]=8; this.guts["Wide"]=16;	
	this.ckTop=this.ckMid=this.ckLeft=this.ckRight=this.ckBot=null;			// Holds CKEditor instances
	this.editable=false;
	this.page=null;
}	

player.prototype.Make=function(showOnly)								// MAKE PLAYER
{
	this.editable=!showOnly;												// Editable mode
	var s=this.editable ? " contenteditable='true'" : "";					// Editable flag for CKEditor if editing
	var str="<div id='playerDiv'  class='sf-player'>";						// Player container
	str+="<div id='playerPaneTop'  class='sf-playerPane'"+s+"></div>"; 		// Top			
	str+="<div id='playerPaneLeft' class='sf-playerPane'"+s+"></div>";		// Left
	str+="<div id='playerPaneMid'  class='sf-playerPane'"+s+"></div>";		// Mid
	str+="<div id='playerPaneRight' class='sf-playerPane'"+s+"></div>";		// Right
	str+="<div id='playerPaneBot'  class='sf-playerPane'"+s+"></div>";		// Bot	
	return str+"</div>";													// Return player
}

player.prototype.Update=function(page, defLayout)						// UPDATE PLAYER
{
	if (this.editable && this.page) {										// If editable and not first time
		this.page.markUpTop=playerObj.ckTop.getData();						// Clean up html data
		this.page.markUpLeft=playerObj.ckLeft.getData();					
		this.page.markUpMid=playerObj.ckMid.getData();						
		this.page.markUpRight=playerObj.ckRight.getData();					
		this.page.markUpBot=playerObj.ckBot.getData();						
		}
	var markUp,s,css,id;
	var asp=defLayout.aspect;												// Start with default
	var parent=$("#playerDiv").parent();									// Point at panrent container
	if (!page)																// If no page
		return;																// Quit
	this.page=page;															// Save page object
	var w=$(parent).width();												// Get width of parent
	var h=$(parent).height()-3;												// Get height 

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
		
	if (!this.editable) {													// Show mode
		if (projectFormat == "Wide screen") 								// Wide screen format
			$(parent).css({ "width":"100%" });								// Go full screen							
		}

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

	for (i=0;i<5;++i) {														// For each pane
		if (this["ck"+this.paneNames[i]]) this["ck"+this.paneNames[i]].destroy(); // Remove old editors
		$(this.divs[i]).html(page["markUp"+this.paneNames[i]] ? page["markUp"+this.paneNames[i]] : defLayout.panes[i].markUp ? defLayout.panes[i].markUp : ""); 		// Set html of panes
		s=defLayout.panes[i].bodyStyle.split(',');							// Get pane style array (font,size,color,weight,align,height)
		css={ "font-family":s[0],"font-size":s[1],"color":s[2],"font-weight":s[3],"text-align":s[4],"line-height":s[5] };

		$.each($('[id^="sfItem-"]'), function(index, val) {					// For each item
			if ($(val).attr("frameborder") != undefined) {					// If not an iframe	
				var r=.75;													// Start of assuming .75
				if ($(val).attr("hgt")) 									// If height set
					r=""+$(val).attr("hgt").replace(/%/,"")/100;			// Get %
				$(val).attr("height",$(val).width()*r+"px");				// Set height
				}
			});
		
		$(this.divs[i]).css(css);											// Set style
		if (this.editable) 													// If editable
			this["ck"+this.paneNames[i]]=CKEDITOR.inline( $(this.divs[i])[0] );	// Enable rich text editor
		}

	if (this.editable) {														// If editable
		CKEDITOR.on('instanceReady', function(ev) {							// When instance is ready
	    	ev.editor.editable().attachListener(ev.editor.document, "click", function(e) {	// Attach new click handler
	    		var id=$(e.data.getTarget()).attr("id");					// Get id
				if (id && id.match(/sfItemDiv-/)) {							// Click on item
		    		layoutObj.SetItemSize(id);								// Set item size
		    		ev.cancel();											// Stop multiple hits
		    		}
	    		});
			});
  
/*	    this.ckTop.on("getData", function() {
	   		$("#playerPaneTop").html(playerObj.ckTop.getData());
	    	});    
*/

		}

	this.StylePage(page,defLayout);											// Style page
	this.AddMenubar();														// Add menubar navigation?
	if (!this.editable) {													// If not editable
		$('[id^="sfItemDiv-"]').removeClass("sf-playerItem");				// Remove class added to manipulate size
		$('[id^="sfItem-"]').removeClass("sf-playerItemInt");				// Remove class added to manipulate size
		this.AddNavigation();												// Add navigation
		}
}	

player.prototype.StylePage=function(page, defLayout)					// STYLE PAGE
{
	var val,val2,val3;
	for (i=0;i<this.divs.length;++i) {										// For each pane
		val=defLayout.panes[i].backCol ? defLayout.panes[i].backCol : "";	// If def back col, use it
		if (page.layout && page.layout.panes && (page.layout.panes[i].backCol != undefined))		// If a page override set
			val=page.layout.panes[i].backCol;								// Use it
		if (val) $(this.divs[i]).css("background-color",val);				// Apply value if set 
		val=defLayout.panes[i].margin ? defLayout.panes[i].margin : "";		// If def margin, use it
		if (page.layout && page.layout.panes && (page.layout.panes[i].margin != undefined))		// If a page override set
			val=page.layout.panes[i].margin;								// Use it
		val=defLayout.panes[i].scroll ? defLayout.panes[i].scroll : "";		// If def scroll, use it
		if (page.layout && page.layout.panes && (page.layout.panes[i].scroll != undefined))		// If a page override set
			val=page.layout.panes[i].scroll;								// Use it
		if (val) $(this.divs[i]).css("overflow-y",val);						// Apply value if set 
		val=defLayout.panes[i].backImg ? defLayout.panes[i].backImg : "";	// If def back image, use it
		if (page.layout && page.layout.panes && (page.layout.panes[i].backImg != undefined))	// If a page override set
			val=page.layout.panes[i].backImg;								// Use it
		if (val) $(this.divs[i]).css({ "background-size":"cover","background-image":"url('"+val+"')"});	// Apply value if set 
		val=defLayout.panes[i].borderSty ? defLayout.panes[i].borderSty : "";	// If def border style, use it
		if (page.layout && page.layout.panes && (page.layout.panes[i].borderSty != undefined))		// If a page override set
			val=page.layout.panes[i].borderSty;									// Use it
		val2=defLayout.panes[i].borderWid ? defLayout.panes[i].borderWid : "";	// If def border width, use it
		if (page.layout && page.layout.panes && (page.layout.panes[i].borderWid != undefined))		// If a page override set
			val2=page.layout.panes[i].borderWid;								// Use it
		val3=defLayout.panes[i].borderCol ? defLayout.panes[i].borderCol : "";	// If def border color, use it
		if (page.layout && page.layout.panes && (page.layout.panes[i].borderCol != undefined))		// If a page override set
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

player.prototype.AddNavigation=function()								// ADD NAVIGATION
{
	var y=45;
	$("#sfNavigationBar").remove();											// Remove any previous nav
	var p=sf.projects[curProject];											// Point at project
	if (inhibitNav)															// If no navigation
		return;																// Quit
	if ((projectFormat == "Canvas") || (projectFormat == "Single page") || (projectFormat == "Web-page"))	// Multipage display
		return;																// Quit
	var thisPage=curPage;													// Ger current page
	var startPage=0;														// Start page
	var endPage=sf.projects[curProject].pages.length-1;						// End page
	var maxPage=endPage;													// Maximum pages
	
	for (i=0;i<portSections.length;++i) {									// For each section
		if ((curPage >= portSections[i].start) && (curPage < portSections[i].start+portSections[i].num)) { // If in this section
			curSect=i;														// Current sectiom
			break;
			}
		}
	var str="<div class='sf-navigation unselectable' id='sfNavigationBar'>";// Enclosing div
	str+="<span class='sf-navButs' id='sfPageCtr'>";						// Center span start
	if (projectFormat == "Matrix") {										// If matrix mode
		y=85;
		startPage=portSections[curSect].start;								// Start at beginning of section
		maxPage=portSections[curSect].num-1;								// Num pages in this section
		endPage=startPage+maxPage;											// Show only pages in this section
		thisPage=curPage-startPage;											// Progress through section
		str+="<img class='sf-navPageButs' id='sfPrevSect' src='img/upbut.gif' title='"+(portSections[curSect] ? portSections[curSect].title : "")+"'><br>";
		}
	str+="<img class='sf-navPageButs' id='sfPrevPage' src='img/revbut.gif' title='Previous page'><span";
	if (projectFormat == "Matrix")											// If matrix mode
		str+=" id='sfChoosePage' style='cursor:pointer'";					// Chooose page on click
	str+=">Page "+(thisPage+1)+" of "+(maxPage+1)+"</span>";				// Page id
	str+="<img class='sf-navPageButs' id='sfNextPage' src='img/playbut.gif' title='Next page'>"
	if (projectFormat == "Matrix") 											// If matrix mode	
		str+="<br><img class='sf-navPageButs' id='sfNextSect' src='img/downbut.gif' title='"+(portSections[curSect+1] ? portSections[curSect+1].title : "")+"'>";
	$("body").append(str+"</span></div");									// Add to body
	$("#sfNavigationBar").css("top",$("#playerDiv").height()-y+"px");		// Position top
	$("#sfNavigationBar").width($("#playerDiv").width()-16);				// Width less padding
	$("#sfPageCtr").css("left",$("#playerDiv").width()/2-60+"px");			// Center page controls
	$("#sfNextSect").css("left",$("#playerDiv").width()-30+"px");			// Position next control
	
	$("#sfChoosePage").on("click",function() {								// CHOOSE PAGE
			Sound("click");													// Click
			playerObj.ChoosePage("#sfChoosePage", function(p) {				// Matrix overview
				curPage=p;													// Set page
				sf.Draw();													// Redraw
				});
		});
	$("#sfNextPage").on("click",function() {								// NEXT PAGE
		if (curPage < endPage) {											// If somewhere to go
			curPage++;														// Advance
			Sound("click");													// Click
			sf.Draw();														// Redraw
			}
		});
	$("#sfPrevPage").on("click",function() {								// BACK A PAGE
		if (curPage > startPage) {											// If somewhere to go
			curPage--;														// Go back
			Sound("click");													// Click
			sf.Draw();														// Redraw
			}
		});
	$("#sfNextSect").on("click",function() {								// NEXT SECTION
		if (curSect < portSections.length-1) {								// If somewhere to go
			curSect++;														// Go up a section
			curPage=portSections[curSect].start;							// Set current page
			Sound("click");													// Click
			sf.Draw();														// Redraw
			}
		});
	$("#sfPrevSect").on("click",function() {								// LAST SECTION
		if (curSect > 0) {													// If somewhere to go
			curSect--;														// Back a section
			curPage=portSections[curSect].start;							// Set current page
			Sound("click");													// Click
			sf.Draw();														// Redraw
			}
		});
}

player.prototype.ChoosePage=function(div, callback)						// CHOOSE PAGE
{
	var i,j,l;
	var _this=this;															// Get context
	var p=sf.projects[curProject].pages;									// Point at pages
	$("#alertBoxDiv").remove();												// Remove any old dialogs
	
	$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");	// Content													
	var str="<p><img src='img/shantilogo32.png' style='vertical-align:-10px'/>"; 	// Logo
	str+="&nbsp;&nbsp;<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#666'><b>Choose page to show</b></span><p>";
	str+="<div class='sf-matrixOverview'>";									// Scrolling div
	
	var trsty=" onMouseOver='this.style.backgroundColor=\"#dee7f1\"' ";		// Hover style
	trsty+="onMouseOut='this.style.backgroundColor=\"#f8f8f8\"'";

	for (i=0;i<portSections.length;++i) { 									// For each section
		str+="<div class='sf-matrixOverSect'>";								// Add section
		str+="<div class='sf-matrixOverTitle' "; 							// Add section title
		str+="id='sf-matrixOver-"+portSections[i].start+"' "+trsty+">";		// Add id
		str+=ShortenString(portSections[i].title,24)+"</div>";				// Add title, shorten if necessary
		if (portSections[i].num > 1) {										// If child pages
			str+="<br>|";													// Add line
			for (j=1;j<portSections[i].num;++j) {							// For each page
				str+="<br><span class='sf-matrixOverPage' ";				// Start of page display
				str+="id='sf-matrixOver-"+(portSections[i].start+j)+"' "+trsty+">";	// Add id
				l=p[portSections[i].start+j].layout;						// Point at page's layout
				if (l && l.title)											// If named page
					str+=ShortenString(l.title,16);							// Use namem shorten if neccessry
				else														// Un-named
					str+="Page "+(j+1);										// Use page number
				str+="</span>";												// Close page
				}
			}
		str+="</div>";
		}
	$("#alertBoxDiv").append(str);											// Add to dialog
	
	$("#alertBoxDiv").dialog({ 	width:$("#playerDiv").width()*.80, 
								position: {my: "bottom center", at: "top center", of: div},
								buttons: {
					           	"Cancel":  	function() {					// DONE
						          			$(this).remove(); 				// Close dialog			
											}
										}
								});	
		
	$(".ui-dialog-titlebar").hide();
	$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
	$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc", "z-index":3000});
	$(".ui-button").css({"border-radius":"30px","outline":"none"});

	$('[id^="sf-matrixOver-"]').on("click", function(e) {					// CLICK ON PAGE
		var id=e.target.id.substr(14);										// Get id
		callback(id);														// Do callback
		$("#alertBoxDiv").remove(); 										// Close dialog			
		});
}

player.prototype.AddMenubar=function(page, defLayout)					// ADD MENUBAR NAVIGATION
{
	$("#sfNavMenubar").remove();											// Remove any previous nav
	if ((curProject < 0) || (curPage < 0) )									// Invalid page
		return;																// Quit
	var p=sf.projects[curProject];											// Point a project layout
	var l=p.layout;															// Point a project layout
	var pg=p.pages[curPage];												// Point at page
	if (pg.layout && pg.layout.navigation)									// If layout override
		l=pg.layout;
	if (!l.navigation || (l.navigation == "None"))							// No menu bar
		return;																// Quit
	var i;
	var str="<div class='sf-navMenubar unselectable' id='sfNavMenubar'>";	// Enclosing div
	for (i=0;i<portSections.length;++i) {									// For each section
		str+="<span class='sf-navMenuItem' id='sfNavItem-"+i+"'";			// Span header
		if ((l.navigation == "Left") || (l.navigation == "Right")) 			// If vertical
			str+=" style='margin:0px'";										// No margins
		str+=">"+portSections[i].title+"</span>"							// Add page
		if ((l.navigation == "Left") || (l.navigation == "Right")) 			// If vertical
			str+="<br>"
		}
	$("body").append(str+"</div>");											// Add to body
	
	$('[id^="sfNavItem-"]').off(); 											// Remove old handlers
	$('[id^="sfNavItem-"]').on("click", function(e) { 						// CLICK HANDLER
		var id=e.currentTarget.id.substr(10)-0;								// Get index of section
		sf.Draw(portSections[id].start);									// Draw
		$("#editDiv").remove();												// Clear page menu
		});
	
	var css={};
	var pane="Top";
	
	if (l.navStyle) {
		var s=l.navStyle.split(",");										// Get as array (font,size,color,weight,align,height)
		css["font-family"]=s[0];											// Family
		css["font-size"]=s[1];												// Size
		css["color"]=s[2];													// Color
		css["font-weight"]=s[3];											// Weight
		css["line-height"]=s[5];											// Height
		}
	if ((l.navigation == "Top") || (l.navigation == "Middle" ))				// Top or middle
		pane="Top";															// Set pane
	else if (l.navigation == "Left") 										// Left
		pane="Left";														// Set pane
	else if (l.navigation == "Bottom") 										// Bot
		pane="Bot";															// Set pane
	else if (l.navigation == "Right") {										// Right
		pane="Right";
		css["text-align"]="right";											// Align right
		}
	if (l.navigation == "Right") 											// Right
		css.width=$("#playerPane"+pane).width()-16+"px";					// Width
	else																	// All others
		css.width=$("#playerPane"+pane).width()-32+"px";					// Width less padding
	css.left=$("#playerPane"+pane).position().left+"px"; 					// Left
	css.top=$("#playerPane"+pane).position().top+"px"; 						// Top
	if (l.navigation == "Middle") 											// Middle
		css.top=$("#playerPaneTop").position().top+$("#playerPaneTop").height()-s[1].replace(/px/,"")-10+"px"; 						
	$("#sfNavMenubar").css(css);											// Set css

	$('[id^="sfNavItem-"]').on("mouseenter",function(e) { 					// ON HOVER OVER HEADER
		$("#editDiv").remove();												// Remove previos entries
		var sid=e.currentTarget.id.substr(10)-0;							// Get index of section
		if (portSections[sid].num < 2)										// If just one child
			return;															// Don't bother
		var i,p;
		var ps=sf.projects[curProject].pages;								// Point at pages
		
		var str="<div class='sf-menuPullDown' id='editDiv'>";				// Enclosinfg div
		for (i=0;i<portSections[sid].num;++i) {								// For each section
			str+="<div class='sf-menuPullDownItem' id='sfNavpage-"+i+"'>"	// Start entry
			p=portSections[sid].start+i;									// Page index
			if (ps[p] && ps[p].layout && ps[p].layout.title)				// If a title		
				str+=ps[p].layout.title;									// Use it
			else															// Not title
				str+="Page "+(p+1);											// Use page num
			str+="</div>"
			}
		str+="</div>";
		$("body").append(str);
	
		var x=$(this).offset().left-8;										// Left side of box 
		var y=$(this).offset().top+28;										// Top
		if ((l.navigation == "Top") || (l.navigation == "Middle"))			// Top/Middle
			$("#editDiv").css({ left:x+"px",top:y+"px" });					// Set pos
		else if (l.navigation == "Bottom") 									// Bottom
			$("#editDiv").css({ left:x+"px",top:y-$("#editDiv").height()-20+"px" }); 	// Set pos
		else if (l.navigation == "Left") 									// Left
			$("#editDiv").css({ left:$("#playerPaneMid").position().left+"px",top:y-20+"px" }); 	// Set pos
		else if (l.navigation == "Right") 									// Right
			$("#editDiv").css({ left:$("#playerPaneRight").position().left-$("#editDiv").width()-16+"px",top:y-20+"px" }); 	// Set pos
	
		$("#editDiv").on("mouseleave",function() { 							// ON EXIT BOX
			$("#editDiv").remove();											// Remove box
			});
		$('[id^="sfNavpage-"]').on("click",function(e) { 					// ON PAGE CLICK
			var id=e.currentTarget.id.substr(10)-0;							// Get index of page
			sf.Draw(portSections[sid].start+id);							// Draw
			$("#editDiv").remove();											// Remove box
			});
		});
}


