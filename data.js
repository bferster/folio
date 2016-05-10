////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function data()															// CONSTRUCTOR
{
	this.host="//qmediaplayer.com/";										// Get host
	this.version=5;															// Get version
	this.email=GetCookie("email");											// Get email from cookie
	this.password=GetCookie("password");									// Password
	this.curShow="";														// Holds currently loaded project
}	

data.prototype.Save=function()											// SAVE
{
	var str="<br><br>"
	str+="Type your email address and a password to protect it.<br>"
	str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
	str+="<tr><td><b>Email</b></td><td><input class='sf-is' type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
	str+="<tr><td><b>Password</b>&nbsp;&nbsp;</b></td><td><input class='sf-is' type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
	str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
	str+="<button class='sf-bs' id='saveBut'>Save</button>&nbsp;&nbsp;&nbsp;";	
	str+="<button class='sf-bs' id='cancelBut'>Cancel</button></div>";	
	ShowLightBox(350,"Save portfolio",str,null,true);
	var _this=this;															// Save context
	
	$("#saveBut").click(function() {									// SAVE BUTTON
		var dat={};
		_this.password=$("#password").val();								// Get current password
		if (_this.password)													// If a password
			_this.password=_this.password.replace(/#/g,"@");				// #'s are a no-no, replace with @'s	
		_this.email=$("#email").val();										// Get current email
		
		if (!offlineMode) {													// If not in offline mode
			if (!_this.password && !_this.email) 							// Missing both
				 return _this.LightBoxAlert("Need email and password");		// Quit with alert
			else if (!_this.password) 										// Missing password
				 return _this.LightBoxAlert("Need password");				// Quit with alert
			else if (!_this.email) 											// Missing email
				 return _this.LightBoxAlert("Need email");					// Quit with alert
			}
		SetCookie("password",_this.password,7);								// Save cookie
		SetCookie("email",_this.email,7);									// Save cookie
		$("#lightBoxDiv").remove();											// Close
		var url=_this.host+"saveshow.php";									// Base file
		dat["id"]=_this.curShow;											// Add id
		dat["email"]=_this.email;											// Add email
		dat["password"]=_this.password;										// Add password
		dat["ver"]=_this.version;											// Add version
		dat["private"]=1;													// Make it private
		dat["title"]="Portfolio";											// Add title
		dat["script"]="LoadShow("+JSON.stringify(sf,null,'\t')+")";			// Add jsonp-wrapped script
		if (offlineMode) {													// If offline		
			localStorage.setItem("Folio-sf",JSON.stringify(sf,null,'\t'))	// Set new data	
			return;															// Quit
			}
		LoadingIcon(true,32);												// Show loading icon
		$.ajax({ url:url,dataType:'text',type:"POST",crossDomain:true,data:dat,  // Post data
			success:function(d) { 			
				LoadingIcon(false);											// Clear loading icon
				if (d == -1) 												// Error
			 		AlertBox("Error","Sorry, there was an error saving.(1)");		
				else if (d == -2) 											// Error
			 		AlertBox("Error","Sorry, there was an error saving. (2)");		
				else if (d == -3) 											// Error
			 		AlertBox("Wrong password","Sorry, the password does not match the one you supplied.");	
			 	else if (d == -4) 											// Error
			 		AlertBox("Error","Sorry, there was an error updating . (4)");		
			 	else if (!isNaN(d)){										// Success if a number
			 		dataObj.curShow=d-0;									// Set current file
					Sound("add");											// Add sound
					}
				},
			error:function(xhr,status,error) { trace(error); LoadingIcon(false);},		// Show error
			});		
		});

	$("#cancelBut").click(function() {								// CANCEL BUTTON
		$("#lightBoxDiv").remove();											// Close
			});
}

data.prototype.Register=function()										// REGISTER
{
	$("#lightBoxDiv").remove();												// Close old one
	var str="<br><br>"
	str+="Type your email address and password.<br>"
	str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
	str+="<tr><td><b>First name&nbsp;&nbsp;</b></td><td><input class='sf-is' type='text' id='firstName' size='20'/></td></tr>";
	str+="<tr><td><b>Last name&nbsp;&nbsp;</b></td><td><input class='sf-is' type='text' id='lastName' size='20'/></td></tr>";
	str+="<tr><td><b>Email</b></td><td><input class='sf-is' type='text' id='email' size='20'/></td></tr>";
	str+="<tr><td><b>Password&nbsp;&nbsp;</b></td><td><input class='sf-is'type='password' id='password' size='20''/></td></tr>";
	str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
	str+="<button class='sf-bs' id='regBut'>Register</button>&nbsp;&nbsp;&nbsp;";	
	str+="<button class='sf-bs' id='cancelBut'>Cancel</button></div>";	
	ShowLightBox(350,"Register",str,null,true);

	$("#cancelBut").click(function() {										// CANCEL BUTTON
		LoadingIcon(false);													// Clear loading icon
		$("#lightBoxDiv").remove();											// Close
	});

	$("#regBut").click(function() {											// LOGIN BUTTON
		if (offlineMode) 													// If offline
			dataObj.HandleRegisterLocal();									// Register on local computer
		else
			dataObj.HandleRegister();										// Register
		});
}

data.prototype.HandleRegisterLocal=function()							// REGISTER LOCAL HANDLER
{
	$("#lightBoxDiv").remove();												// Close
}

data.prototype.HandleRegister=function()								// REGISTER HANDLER
{
	var dat={},o={ userInfo:{} };
	if (!$("#password").val() || !$("#email").val()) 						// Missing pw or email
		 return this.LightBoxAlert("Need email and password");				// Quit with alert
	if (!$("#firstName").val() || !$("#lastName").val()) 					// Missing names
		 return this.LightBoxAlert("Need both names");						// Quit with alert
	this.password=$("#password").val();										// Get current password
	this.email=$("#email").val();											// Get current email
	o.userInfo.firstName=$("#firstName").val();								// Get first name
	o.userInfo.lastName=$("#lastName").val();								// Get last name
	o.userInfo.id=MakeUniqueId();											// Get unique id
	if (this.password)														// If a password
		this.password=this.password.replace(/#/g,"@");						// #'s are a no-no, replace with @'s	
	SetCookie("password",this.password,7);									// Save cookie
	SetCookie("email",this.email,7);										// Save cookie
	$("#lightBoxDiv").remove();												// Close
	var url=this.host+"register.php";										// Base file
	dat["id"]="";															// No shiow
	dat["email"]=this.email;												// Add email
	dat["password"]=this.password;											// Add password
	dat["private"]=1;														// Make it private
	dat["title"]="Portfolio";												// Add title
	dat["script"]="LoadShow("+JSON.stringify(o,null,'\t')+")";				// Add jsonp-wrapped script
	LoadingIcon(true,32);													// Show loading icon
	$.ajax({ url:url,dataType:'text',type:"POST",crossDomain:true,data:dat,  // Post data
		success:function(d) { 			
			LoadingIcon(false);												// Clear loading icon
			if (d == -1) 													// Error
		 		AlertBox("Error","Sorry, there was an error saving.(1)");		
			else if (d == -2) 												// Error
		 		AlertBox("Error","Sorry, there was an error saving. (2)");		
			else if (d == -3) 											// Error
		 		AlertBox("Already registered","Sorry, but that email is already registered. Please try a new one.",dataObj.Register);	
		 	else if (d == -4) 												// Error
		 		AlertBox("Error","Sorry, there was an error updating . (4)");		
		 	else if (!isNaN(d)){											// Success if a number
		 		dataObj.curShow=d-0;										// Set current file
				Sound("add");												// Add sound
				dataObj.Load();												// Go onto load
				}
			},
		error:function(xhr,status,error) { trace(error); LoadingIcon(false);},		// Show error
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
	str+="<span id='registerBut' style='color:#000099;cursor:pointer;margin-right:150px;'>Register</span>"
	str+="<button class='sf-bs' id='logBut'>Login</button>&nbsp;&nbsp;&nbsp;";	
	str+="<button class='sf-bs' id='cancelBut'>Cancel</button></div>";	
	ShowLightBox(350,"Login",str,null,true);
	var _this=this;															// Save context
		
	$("#cancelBut").click(function() {										// CANCEL BUTTON
		LoadingIcon(false);													// Clear loading icon
		$("#lightBoxDiv").remove();											// Close
		});

	$("#logBut").click(function() {											// LOGIN BUTTON
		LoadingIcon(true,32);												// Show loading icon
		if (offlineMode) 													// If offline
			dataObj.LoadLocal();											// Load from local computer
		else
			dataObj.ListFiles();											// Get list of files
		});

	$("#registerBut").click(function() {									// REGISTER 
		dataObj.Register();													// Register
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
	
data.prototype.LoadLocal=function()										// LOAD JSON FROM LOCAL COMPUTER
{
	LoadingIcon(false);														// Clear loading icon
	$("#lightBoxDiv").remove();												// Close
	if (localStorage.getItem("Folio-sf")) {									// If JSON stored
		var data=$.parseJSON(localStorage.getItem("Folio-sf"))				// Set new data													
		sf.Init(data,"set");												// Init folio
	 	sf.Draw();															// Redraw
		}
}

data.prototype.LightBoxAlert=function(msg) 								//	SHOW LIGHTBOX ALERT
{
	Sound("delete");														// Delete sound
	$("#lightBoxTitle").html("<span style='color:#990000'>"+msg+"</span>");	// Put new
}

data.prototype.FindFromID=function(arr, id) 							//	GET INDEX FROM ID
{
	var i;
	if (!arr)																// No object
		return -1;															// Return nothing found
	var n=arr.length;														// Length of array
	for (i=0;i<n;++i)														// If each member
		if (id == arr[i].id)												// A match
			return i;														// Return index
	return -1;																// Return nothing found
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSON-P CALLBACKS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function LoadShow(data)													// LOAD A SHOW
	{
		LoadingIcon(false);														// Clear loading icon
		if (data.qmfmsg == "error") {											// If an error
			AlertBox("Sorry, but there was an error loading this portfolio");	// Show
			return;																// Quit
			}
		if (data.qmfmsg == "private") {											// If passwords don't match
	 		var str="Sorry, the password does not match the one you supplied when setting up your account.<br><br>";
	 		str+="Please try again or click <a href='//www.qmediaplayer.com/getshows.php?pass=5&email="+dataObj.email+"' target='blank'>here</a> to have it mailed to your email address."
	 		AlertBox("Wrong password",str,dataObj.Load);						// Show and retry
			return;																// Quit
			}
		sf.Init(data,"set");													// Init folio
	 	sf.Draw();																// Redraw
	}

	function qmfListFiles(files)											// CALLBACK TO List()
	{
		LoadingIcon(false);														// Clear loading icon
		if (!files || (!files.length))											// No record found
			 return dataObj.LightBoxAlert("User not found");					// Quit with alert
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
		dataObj.curShow=files[0].id;											// Set as current file
		$.ajax({ url:url, dataType:'jsonp'});									// Get data and pass to LoadProject() in Edit
	}

