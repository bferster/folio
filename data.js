////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function data()															// CONSTRUCTOR
{
	this.host="//qmediaplayer.com/";										// Get host
	this.version=5;															// Get version
	this.email=GetCookie("email");											// Get email from cookie
	this.password=GetCookie("password");									// Password
	this.butsty=" style='border-radius:10px;color#666;padding-left:6px;padding-right:6px' ";	// Button styling
	this.curFile="";
}	

data.prototype.Save=function()											// SAVE
{
	curJson=sf;																// Copy json to global
	var str="<br><br>"
	str+="Type your email address and a password to protect it.<br>"
	str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
	str+="<tr><td><b>Email</b></td><td><input class='sf-is' type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
	str+="<tr><td><b>Password</b>&nbsp;&nbsp;</b></td><td><input class='sf-is' type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
	str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
	str+="<button class='sf-bs' style='height:30px' id='saveBut'>Save</button> &nbsp;";	
	str+="<button class='sf-bs' style='height:30px' id='cancelBut'>Cancel</button></div>";	
	ShowLightBox(350,"Save portfolio",str);
	var _this=this;															// Save context
	
	$("#saveBut").button().click(function() {								// SAVE BUTTON
		var dat={};
		_this.password=$("#password").val();								// Get current password
		if (_this.password)													// If a password
			_this.password=_this.password.replace(/#/g,"@");				// #'s are a no-no, replace with @'s	
		_this.email=$("#email").val();										// Get current email
		if (!_this.password && !_this.email) 								// Missing both
			 return _this.LightBoxAlert("Need email and password");			// Quit with alert
		else if (!_this.password) 											// Missing password
			 return _this.LightBoxAlert("Need password");					// Quit with alert
		else if (!_this.email) 												// Missing email
			 return _this.LightBoxAlert("Need email");						// Quit with alert

		SetCookie("password",_this.password,7);						// Save cookie
		SetCookie("email",_this.email,7);								// Save cookie
		$("#lightBoxDiv").remove();											// Close
		var url=_this.host+"saveshow.php";									// Base file
		dat["id"]=curShow;													// Add id
		dat["email"]=_this.email;											// Add email
		dat["password"]=_this.password;										// Add password
		dat["ver"]=_this.version;											// Add version
		dat["script"]="LoadShow("+JSON.stringify(curJson,null,'\t')+")";	// Add jsonp-wrapped script
		if (curJson.title)													// If a title	
			dat["title"]=AddEscapes(curJson.title);							// Add title
		$.ajax({ url:url,dataType:'text',type:"POST",crossDomain:true,data:dat,  // Post data
			success:function(d) { 			
				if (d == -1) 												// Error
			 		AlertBox("Error","Sorry, there was an error saving.(1)");		
				else if (d == -2) 											// Error
			 		AlertBox("Error","Sorry, there was an error saving. (2)");		
				else if (d == -3) 											// Error
			 		AlertBox("Wrong password","Sorry, the password does not match the one you supplied.");	
			 	else if (d == -4) 											// Error
			 		AlertBox("Error","Sorry, there was an error updating . (4)");		
			 	else if (!isNaN(d)){										// Success if a number
			 		curShow=this.curFile=d;									// Set current file
					Sound("add");											// Add sound
					}
				},
			error:function(xhr,status,error) { trace(error) },				// Show error
			});		
		});

	$("#cancelBut").button().click(function() {								// CANCEL BUTTON
		$("#lightBoxDiv").remove();											// Close
			});
}

data.prototype.Load=function()											// LOAD 
{
	var str="<br><br>"
	str+="Type your email address and password.<br>"
	str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
	str+="<tr><td><b>Email</b></td><td><input class='sf-is' type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
	str+="<tr><td><b>Password&nbsp;&nbsp;</b></td><td><input class='sf-is'type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
	str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
	str+="<button class='sf-bs' style='height:30px' id='logBut'>Login</button> &nbsp;";	
	str+="<button class='sf-bs' style='height:30px' id='cancelBut'>Cancel</button></div>";	
	ShowLightBox(350,"Login",str);
	var _this=this;															// Save context
	
	$("#cancelBut").button().click(function() {								// CANCEL BUTTON
		$("#lightBoxDiv").remove();											// Close
		});

	$("#logBut").button().click(function() {								// LOGIN BUTTON
		_this.ListFiles();													// Get list of files
		});
}
	
data.prototype.ListFiles=function() 									//	LIST PROJECTS IN DB
{
	this.email=$("#email").val();											// Get current email
	this.password=$("#password").val();										// Get current password
	if (this.password)														// If a password
		this.password=this.password.replace(/#/g,"@");						// #'s are a no-no, replace with @'s	
	SetCookie("password",this.password,7);									// Save cookie
	SetCookie("email",this.email,7);										// Save cookie
	var url=this.host+"listshow.php?ver="+this.version;						// Base file
	if (this.email)															// If email
		url+="&email="+this.email;											// Add email and deleted to query line
	$.ajax({ url:url, dataType:'jsonp', complete:function() { Sound('click'); } });	// Get data and pass qmfListFiles()
}
	
data.prototype.LightBoxAlert=function(msg) 								//	SHOW LIGHTBOX ALERT
{
	Sound("delete");														// Delete sound
	$("#lightBoxTitle").html("<span style='color:#990000'>"+msg+"</span>");	// Put new
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSON-P CALLBACKS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function LoadShow(data)													// LOAD A SHOW
	{
		if (data.qmfmsg == "error") {											// If an error
			AlertBox("Sorry, but there was an error loading this portfolio");	// Show
			return;																// Quit
			}
		if (dataObj.curFile) 	curShow=dataObj.curFile;						// If a good file, set curshow
		sf.Init(data,"set");													// Init folio
	 	sf.Draw();																// Redraw
	}

	function qmfListFiles(files)											// CALLBACK TO List()
	{
		dataObj.password=$("#password").val();									// Get current password
		dataObj.email=$("#email").val();										// Get current email
		if (dataObj.password)													// If a password
			dataObj.password=dataObj.password.replace(/#/g,"@");				// #'s are a no-no, replace with @'s	
		SetCookie("password",dataObj.password,7);								// Save cookie
		SetCookie("email",dataObj.email,7);										// Save cookie
		$("#lightBoxDiv").remove();												// Close old one
	
		var url=dataObj.host+"loadshow.php";									// Base file
		url+="?id="+files[0].id;												// Add id
		if (dataObj.password)													// If a password spec'd
			url+="&password="+dataObj.password;									// Add to query line
		dataObj.curFile=files[0].id;											// Set as current file
		$.ajax({ url:url, dataType:'jsonp'});									// Get data and pass to LoadProject() in Edit
	}

