////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITEMS
// Assumes access to sf, curItem globals
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function item()													// CONSTRUCTOR
{
}	

item.prototype.item=function()									// DRAW
{
}

item.prototype.Set=function(project)							// DIALOG
{
	var _this=this;													// Get context
	this.items=project.items;
}

item.prototype.Preview=function(id)								// PREVIEW ITEM
{
	var o=sf.items[id];												// Point at item
	var str="<div class='sf-previewTitle'>"+o.title+"</div><br>";	// Add title
	str+="<iframe frameborder='0' height='500' width='100%' style='opacity:0,border:1px solid #666' src='"+o.src+"'/>";
	ShowLightBox(800,"Preview",str);								// Show lightbox
}

item.prototype.UpdatePage=function()							// UPDATE ITEM PAGE	
{
	if (curItem != -1) {											// If a valid item
		var o=sf.items[curItem];									// Point at item
		$("#iType").val(o.type);									// Set type
		$("#iTitle").val(o.title ? o.title: "") 					// Set title
		$("#iDesc").val(o.desc ?   o.desc: "");						// Set desc
		$("#iCite").val(o.cite ?   o.cite: "");						// Set cite
		$("#iThumb").val(o.thumb ? o.thumb: "");					// Set thumb
		}
	var pic="";
	if ($("#iThumb").val())											// If a thumb spec'd
		pic=$("#iThumb").val();										// Use it
	else{															// Use generic images
		pic="img/";													// Add folder
		switch ($("#iType").val().toLowerCase()) {					// Route on type
			case 	"media": 		pic+="mediaitem"; 		break;	// Set icon
			case 	"qmedia": 		pic+="qmediaitem"; 		break;			
			case 	"image": 		pic+="imageitem"; 		break;			
			case 	"pdf": 			pic+="pdfitem"; 		break;			
			case 	"map": 			pic+="mapitem"; 		break;			
			case 	"shiva": 		pic+="shivaitem"; 		break;			
			case 	"visualeyes": 	pic+="veitem"; 			break;			
			case 	"mandala": 		pic+="mandalaitem"; 	break;			
			case 	"wordpress": 	pic+="wordpressitem"; 	break;			
			default: 				pic+="webitem"; 		break;	// All others use web pic
			}
		pic+=".png";												// Add ext
		}	
	$("#iPic").prop("src",pic);
	sf.AddProjectItems(true);										// Add items
}
	
item.prototype.MakePage=function()								// PREVIEW ITEM
{
	var str="<div id='projectDiv' class='sf-projectPage'>";			// Items container
	str+="<table style='width:90%;font-weight:bold;text-align:left'>";
	str+="<tr><td height='28'>Item type</td><td>";
	str+=MakeSelect("iType",false,["Web","Image","Map","Media","WordPress","Mandala","SHIVA","Qmedia","VisualEyes"])+"</td></tr>";
	str+="<tr><td height='28'>Title</td><td>";
	str+="<input type='text' class='sf-is' id='iTitle'></td></tr>";
	str+="<tr><td height='28'>Description</td><td>";
	str+="<textarea class='sf-is' id='iDesc'></textarea></td></tr>";		
	str+="<tr><td height='28'>Citation</td><td>";
	str+="<input type='text' class='sf-is' id='iCite'></td></tr>";
	str+="<tr><td height='28'>Thumbnail pic</td><td>";
	str+="<input type='text' class='sf-is' id='iThumb'></td></tr>";
	str+="<tr><td>Icon</td><td><img id='iPic' class='sf-itemPic'>";				
	str+="</table>";
	str+="<p style='text-align:center'>Drag item  from the right to edit and existing item, or click on the + button below to add a new item to your collection.</p>";
	str+="<br><div style='text-align:center;'><img id='itemAddBut' class='sf-galleryBut' src='img/addbut.gif' title='Add new item'>";
	str+="<img id='itemDeleteBut' class='sf-galleryBut'src='img/trashbut.gif'  title='Delete an item'></div>";
	str+="</div><div id='itemPickerDiv' class='sf-itemsPicker'></div>";	// Item picker container
	return str;														// Return page
}

item.prototype.AddHandlers=function()								// ADD  HANDLERS
{
	var _this=this;														// Save context
	this.UpdatePage();													// Update page

	$("#iType").on("change",function() { 								// CHANGE TYPE
		if (curItem != -1) {											// If an existing item	
			sf.Do();													// something changed
			sf.items[curItem].type=$(this).val();						// Set value
			sf.AddProjectItems(true);									// Redraw items
			}								
		_this.UpdatePage();												// Update page
		});
	$("#iTitle").on("blur",function() { 								// EDIT TITLE
		if (curItem != -1) {											// If an existing item	
			sf.Do();													// something changed
			sf.items[curItem].title=$(this).val();						// Set value
			sf.AddProjectItems(true);									// Redraw items
			}								
		_this.UpdatePage();												// Update page
		});
	$("#iDesc").on("blur",function() { 									// EDIT DESC
		if (curItem != -1) {											// If an existing item	
			sf.Do();													// something changed
			sf.items[curItem].desc=$(this).val();						// Set value
			sf.AddProjectItems(true);									// Redraw items
			}								
		_this.UpdatePage();												// Update page
		});
	$("#iCite").on("blur",function() { 									// EDIT CITE
		if (curItem != -1) {											// If an existing item	
			sf.Do();													// something changed
			sf.items[curItem].cite=$(this).val();						// Set value
			sf.AddProjectItems(true);									// Redraw items
			}								
		_this.UpdatePage();												// Update page
		});
	$("#iThumb").on("blur",function() { 								// EDIT THUMB
		if (curItem != -1) {											// If an existing item	
			sf.Do();													// something changed
			sf.items[curItem].thumb=$(this).val();						// Set value
			sf.AddProjectItems(true);									// Redraw items
			}								
		_this.UpdatePage();												// Update page
		});
	
	$("#itemAddBut").on("click",function() { 							// ADD NEW ITEM
		sf.Do()															// Something changed
		Sound("add");													// Add sound
		var o={};														// Holds new item
		o.type=$("#iType").val();										// Set type
		o.title=$("#iTitle").val() ? $("#iTitle").val() : "New item" ;	// Set title
		o.desc=$("#iDesc").val();										// Set desc
		o.cite=$("#iCite").val();										// Set cite
		o.thumb=$("#iThumb").val();										// Set thumb
		sf.items.push(o)
		curItem=sf.items.length-1;										// Point to this one
		_this.UpdatePage();												// Update page
		});
	
	$("#itemDeleteBut").on("click",function() { 						// ADD NEW ITEM
		if (curItem != -1)
			ConfirmBox("This will delete the item titled:<br><br><b><i>"+sf.items[curItem].title+"</b></i>", function() {
				sf.Do()													// Something changed
				sf.items.splice(curItem,1);								// Remove it
				curItem=-1;												// Go to previous projcet
				Sound("delete");										// Delete
				_this.UpdatePage();											// Update page
				})
		});
	

}
