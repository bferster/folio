CKEDITOR.editorConfig=function(config) {
	config.width="100%";
	config.removePlugins = 'elementspath';
	config.resize_enabled = false;
	config.toolbar =[
	{ name: 'links', items : [ 'Link','Unlink' ] },
	{ name: 'insert', items : [ 'Image','Table','HorizontalRule','SpecialChar' ] },
	{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript' ] },
	{ name: 'colors', items : [ 'TextColor','BGColor' ] },
	{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote',
	'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
	{ name: 'styles', items : [ 'Font','FontSize' ] }
	];
};

