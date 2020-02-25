module.exports = function(RED) {
	const fs = require('fs');
	const pdfjsLib = require("pdfjs-dist/build/pdf.js");
	
	// for each pageNum retrieve text on that page
	async function loadPage(doc, pageNum) {
		return doc.getPage(pageNum)
		.then((page) => page.getTextContent())
		.then((content) => {
			var pageText = [];
			content.items.forEach((el, index) => {pageText.push({'p': index, 'x': el.transform[4], 'y': el.transform[5], 't': el.str.trim()});});
			return pageText;
		});
	};
	
	async function retrievePdfTextContent(node, doc)
	{
		var numPages = doc.numPages;
		// get array of pages from [1..numPages];
		var pages = Array.from(Array(numPages),(el, index) => index+1);
		// loop over each promise and retrieve each page's text content in the pdf
		let resolvedArray = await Promise.all(pages.map(async(value) => loadPage(doc, value)));
		return resolvedArray;
	}

    function pdfOutNode(config)
	{
		RED.nodes.createNode(this, config);
		this.filename = config.filename || "";
		var node = this;
		node.on('input', function(msg)
		{
			// if there is content in the payload to read from or a filename provided in config
			let target = msg.payload || node.filename;
			if(target) {
				var loadingTask = pdfjsLib.getDocument(target);
				loadingTask.promise.then((doc) => retrievePdfTextContent(node, doc))
				.then((pageArray) => {
					msg.payload = pageArray;
					node.send(msg);
				})  
				.catch(err => {
					msg.payload = err;
					node.send([null, msg]);
				});
			}
			else {
				msg.payload = "MissingFieldError: Missing msg.payload / filename, please provide a path to a pdf file in the payload/filename or the pdf file contents in the payload.";
				node.send([null, msg]);
			}
		});
	}
	RED.nodes.registerType("pdf", pdfOutNode);
}