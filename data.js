////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function data()															// CONSTRUCTOR
{
	this.qmf=new QmediaFile("//qmediaplayer.com/",5);						// Alloc file system
}	

data.prototype.Save=function()											// SAVE
{
	curJson=sf;																// Copy json to global
	this.qmf.Save(0);
}

data.prototype.Load=function()											// LOAD 
{
	this.qmf.Load();														// Load portfolio
}

function LoadShow(data)													// LOAD A SHOW
{
	if (data.qmfmsg == "error") {											// If an error
		AlertBox("Sorry, but there was an error loading this project");		// Show
		return;																// Quit
		}
	if (qmf.curFile) curShow=qmf.curFile;									// If a good file, set curshow
	sf.Init(data,"set");													// Init folio
 	Sound("add");															// Add sound
 	sf.Draw();																// Redraw
}
