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
	t.layout.leftPct=15;
	t.layout.rightPct=15;
	t.layout.botPct=10;
	t.layout.aspect="Portrait";									
	t.layout.panes=[];													// Create panes array

	t.layout.itemWid="100%";												// Item width
	t.layout.itemHgt="30vh";											// Item height
	t.layout.itemAlign="center";										// Item align
	t.layout.itemBorder="2px solid #999999";							// Border 

	for (i=0;i<this.paneNames.length;++i) {								// For each pane
		o={};															// Pane obj
		o.borderCol="#999999";											// Set default pane params
		o.borderSty="None";								
		o.borderWid="1";							
		o.backCol="#eeeeee";
		o.backImg="";
		o.markUp="";
		o.bodyStyle="sans-serif,13px,#66666,normal,left,100%";			// Body text style
		o.titleStyle="sans-serif,18px,#cc6600,bold,center,100%";		// Title text style
		t.layout.panes.push(o);											// Add pane to array
		}
}	

template.prototype.Set=function(project)								// template DIALOG
{
	var _this=this;														// Get context
	this.project=project
	var str="<br><br>This will contain ways to edit template ";			 
	Sound("click");														// Click
	ShowLightBox(700,"Templates",str);									// Create dialog
}	