////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SHARE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function share()													// CONSTRUCTOR
{
}	

share.prototype.Init=function()										// INIT
{
//	if (!this.project.share)											// If no share object yet
//		this.project.share={};											// Create share object in project
}



share.prototype.Set=function(project)								// SHARE DIALOG
{
	var i, v=["All"];
	this.project=project
	this.Init();														// Init object
	var str="<br><br>You can share portfolios with others in a number of formats. Please pick the format below:";			
	str+="<br><br>"+MakeSelect("sFormat",false,["Choose share format","Web page","WordPress","Iframe","JSON"]);
	for (i=0;i<project.pages.length;++i)	v.push(i+1);				// Add pages
	str+="&nbsp; &nbsp;Page &nbsp;"+MakeSelect("sPage",false,v);		// Page select
	str+="<br><br><div id='sCode' class='sf-is selectable' style='margin-bottom:8px;padding:12px;background-color:#fff;width:80%;height:80px;font-family:monospace;overflow:auto'><div>"
	Sound("click");														// Click
	ShowLightBox(500,"Portfolio Sharing",str);							// Create dialog

	$("#sFormat").on("change",function() { 								// If changed
		var str="";
		var f=$(this).val();											// Get format
		var p=$("#sPage").val();										// Get page
		var src="http://www.viseyes.org/folio?"+dataObj.curShow;		// Get source
		if (p != "All")		src+="|"+p;									// If getting a particular page
		switch(f) {														// Route
			case "Web page": 	str=src;															break; 	// Web page
			case "WordPress": 	str="[iframe height='100%' width='100%' src='"+src+"']";			break;	// WordPress
			case "Iframe": 		str="<iframe height='100%' width='100%' src='"+src+"'</iframe>";	break;	// Iframe
			case "JSON": 		str=JSON.stringify(sf,undefined,2);									break;	// JSON
			}						
		$("#sCode").text(str);											// Show embed
		});
}	