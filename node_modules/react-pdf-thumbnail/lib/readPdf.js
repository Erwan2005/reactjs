'use strict';
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js');
const { createCanvas, createImage } = require('./createThumbImage');
module.exports = function readPdf(pdf, config) {
	pdfjsLib.getDocument(pdf).promise.then(function (doc) {
		var pages = [];
		while (pages.length < doc.numPages) pages.push(pages.length + 1);
		return Promise.all(
			pages.map(function (num) {
				return doc
					.getPage(num)
					.then((page) => {
						createCanvas(page, config).then((canvas) => {
							console.log(canvas);
							return createImage(canvas, config.name);
						});
					})
					.catch((err) => {
						return [false, err];
					});
			})
		);
	});
};
