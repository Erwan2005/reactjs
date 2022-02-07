'use strict';
const dataURLtoFile = (dataURl, filename) => {
	var arr = dataURl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
};

const getExtension = (filename, isVideo) => {
	var name = filename.split('.');
	return {
		fileName: name[0],
		extension: isVideo ? 'png' : name[1] || 'png',
	};
};

const createImage = (canvas, filename) => {
	var image = canvas.toDataURL();
	var success = image.length > 100000;
	var file = [];
	var imageUrl = '';
	if (success) {
		file = dataURLtoFile(image, filename);
		imageUrl = URL.createObjectURL(file);
	}
	return [success, file, image, imageUrl];
};
function createCanvas(page, config) {
	try {
		var vp = page.getViewport(1);
		var canvas = document.createElement('canvas');
		canvas.width = config.width || '300';
		canvas.height = config.height || '200';
		var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
		console.log('sss', scale);
		return page
			.render({
				canvasContext: canvas.getContext('2d'),
				viewport: page.getViewport(scale),
			})
			.promise.then(function () {
				return canvas;
			})
			.catch((err) => {
				console.log(err);
				return err;
			});
	} catch (err) {
		return err;
	}
}
module.exports = {
	dataURLtoFile,
	getExtension,
	createImage,
	createCanvas,
};
