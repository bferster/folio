////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TEMPLATE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function template()													// CONSTRUCTOR
{
	var t,i,o;
	this.paneNames=["Top","Left","Mid","Right","Bot"];					// Name of all the panes
	this.templates=[{ layout:{}} ];										// Create array with default
	t=this.templates[0];												// Point at default template
	t.name="Default";													// Template name
	t.layout.topGut="None";												// Set default gutters
	t.layout.leftGut="None";
	t.layout.rightGut="None";
	t.layout.botGut="None";
	t.layout.topPct=20;													// Set default sizes
	t.layout.leftPct=30;
	t.layout.rightPct=20;
	t.layout.botPct=10;
	t.layout.aspect="Portrait";									
	t.layout.panes=[];													// Create panes array

	for (i=0;i<this.paneNames.length;++i) {								// For each pane
		o={};															// Pane obj
		o.borderCol="#999999";											// Set default pane params
		o.borderSty="None";								
		o.borderWid="1";							
		o.backCol="#eeeeee";
		o.backImg="";
		o.markUp="";
		t.layout.panes.push(o);											// Add pane to array
		}
}	

template.prototype.Init=function()										// INIT
{
		
}

template.prototype.Set=function(project)								// template DIALOG
{
	var _this=this;														// Get context
	this.project=project
	this.Init();														// Init object
	var str="<br><br>This will contain ways to edit template ";			 
	Sound("click");														// Click
	ShowLightBox(700,"Templates",str);									// Create dialog
}	