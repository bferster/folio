CKEDITOR.editorConfig = function( config ) {
	config.extraPlugins = 'font,panelbutton,colorbutton,justify';
	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'colors', groups: [ 'colors' ] }
	];
	config.removeButtons = 'Cut,Copy,Paste,PasteText,Anchor,Maximize,Format,PasteFromWord,Source,Strike,Iframe';
	config.enterMode = CKEDITOR.ENTER_BR 					// ENTER KEY = <br>
	config.shiftEnterMode = CKEDITOR.ENTER_P;				// SHIFT + ENTER KEYS = <p>
	config.autoParagraph = false; 							// Stops insertion of <p> on focus
 };