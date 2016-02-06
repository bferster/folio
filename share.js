////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SHARE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function share()													// CONSTRUCTOR
{
}	

share.prototype.Draw=function()										// DRAW
{
}

share.prototype.Init=function()										// INIT
{
	if (!this.project.share)											// If no share object yet
		this.project.share={};											// Create share object in project
}

share.prototype.Set=function(project)								// SHARE DIALOG
{
	var _this=this;														// Get context
	this.project=project
	this.Init();														// Init object
	var str="<br><br>This will contain ways to share portfolios";			// 
	Sound("click");														// Click
	ShowLightBox(700,"Portfolio Sharing",str);							// Create dialog
}	