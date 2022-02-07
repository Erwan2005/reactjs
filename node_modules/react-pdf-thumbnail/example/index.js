const Pdfthumbnail = require('../index');

console.log(
	Pdfthumbnail(
		'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
		{
			fileName: 'myImage.png',
			height: 200,
			width: 200,
		}
	)
);
