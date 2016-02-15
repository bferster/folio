////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function data()															// CONSTRUCTOR
{
	this.qmf=new QmediaFile("//qmediaplayer.com/",5);						// Alloc file system
}	

data.prototype.Save=function(		)									// SAVE
{
	curJson=sf;																// Copy json to global
	this.qmf.Save(0);														// Save 
}

function LoadShow(data)													// LOAD A SHOW
{
	if (data.qmfmsg == "private") {											// If a private file		
		AlertBox("Private project","Sorry, but this project is marked <i>private</i>. You will need to supply the password to load it");
		return;																// Quit
		}
	else if (data.qmfmsg == "error") {										// If an error
		AlertBox("Sorry, but there was an error loading this project");		// Show
		return;																// Quit
		}
	if (qmf.curFile)														// If a good file
		curShow=qmf.curFile;												// Set curshow
	sf.Init(data,"set");													// Init folio
 	sf.Draw();																// Redraw
}
