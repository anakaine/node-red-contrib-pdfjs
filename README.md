A node to help extract text contents from a pdf. Uses the Mozilla library found at [https://github.com/mozilla/pdfjs-dist](https://github.com/mozilla/pdfjs-dist) to extract text data.

## Inputs
#### payload
This node expects in the payload either a buffer object of a pdf file (loaded either through the file in node or generated through other means) or a file location for an absolute filename to a pdf. If the pdf object is not found in the payload it will then look for a pdf filename in the config

## Outputs
#### payload
Results of the parsing will be returned as an array with each element in the array corresponding to a page in the pdf. Each page in the array is stored as an array of objects which can be seen below.
```
[
	{
		"p": 1, // order on the page
		"x": 328.78, // distance away from the right edge
		"y": 1175.676, // distance away from the bottom of the page
		"t": "Survey Responses 1/02/19 - 31/04/19" // text content
	},
	{
		"p": 2, 
		"x": 428.78, 
		"y": 1175.676, 
		"t": "Survey Responses 1/05/19 - 31/07/19"
	}
]
```