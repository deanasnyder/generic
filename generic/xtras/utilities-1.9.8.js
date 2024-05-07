A.utils = new function()
	{
	var mThis = this;
		
		
	this.getDocumentElement = function(element, doc)
		// log(A.utils.getDocumentElement('title'));
		// log(A.utils.getDocumentElement('title', jQuery(iframe).contents()[0]));
		{
		doc = doc ? doc : document;
		return jQuery(doc).find(element).text();
		}
		
		
	this.getMetaContent = function(metaName, doc)
		// log(A.utils.getMetaContent('copyright'));
		// log(A.utils.getMetaContent('copyright', jQuery(iframe).contents()[0]));
		{
		var metas;
		var meta;

		doc = doc ? doc : document;
		metas = jQuery(doc).find('meta');
		for (var i = 0; i < metas.length; i++)
			{
			meta = metas[i];
			if (meta.getAttribute('name') == metaName)
				return meta.getAttribute('content');
			}
		return undefined;
		}
		
		
	this.firstInt = function(theString)
		{
		return (theString.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g) || [] ).map(function (v) {return +v;}).shift();
		};
		
		
	this.isClick = function(downTime, upTime) 
		{
		return upTime - downTime < 500;
		};
		
		
	this.clamp = function(x, min, max) 
		{
		if (typeof x === 'number' && typeof min === 'number' && typeof max === 'number')
			return x > max ? max : (x > min ? x : min);
			
		return undefined;
		};
		
		
	this.getTextSelectionRange = function() 
		{
		var selection;

		selection = window.getSelection();
		return selection.rangeCount ? selection.getRangeAt(0) : undefined;
		};
		
		
	this.setTextSelectionRange = function(range) 
		{	
		var selection;
		
		selection = window.getSelection();
		selection.removeAllRanges();
		if (range)
			selection.addRange(range);
		};
		
		
	this.preventDoubleClickOnHTMLDocument = function()
		{
		document.ondblclick = function(e) {e.preventDefault();}
		};
		
		
	this.preventTouchGesturesOnHTMLElement = function(element)
		{
		element.setAttribute('style', 'touch-action: none');
		};
		
		
	this.isContextMenuEvent = function(event)
		{
		if (mThis.isSecondaryMouseButton(event))
			return true;
			
		return mThis.isPrimaryMouseButton(event) && event.ctrlKey;
		};
		
	
	this.isPrimaryMouseButton = function(event)
		{
		if (event instanceof PointerEvent)
			return event.pointerType === 'mouse' && event.button === 0;
		if (event instanceof MouseEvent)
			return event.button === 0;
		};
		
	
	this.isSecondaryMouseButton = function(event)
		{
		if (event instanceof PointerEvent)
			return event.pointerType === 'mouse' && event.button === 2;
		if (event instanceof MouseEvent)
			return event.button === 2;
		};
		
	
	this.deleteHTMLElements = function(text)
		{
		return text.replace(/(<([^>]+)>)/g, '');
		};
		
		
	this.equalRects = function(rect1, rect2)
		{
		return rect1.left === rect2.left &&
			rect1.top === rect2.top &&
			rect1.width === rect2.width &&
			rect1.height === rect2.height;
		};
				
				
	this.ptInRect = function(x, y, rect)
		{				
		return x >= rect.left && y >= rect.top && x <= rect.left + rect.width && y <= rect.top + rect.height;
		};
		
			
	this.pageWasReloaded = function() 
		{
		var performanceEntries;
		
		if (!performance || !performance.getEntriesByType)
			return false;
			
		performanceEntries = performance.getEntriesByType('navigation');
		if (!performanceEntries.length)
			return false;
		
		return performanceEntries[0].type === 'reload';
		};
		
		
	this.getURLFragmentIdentifier = function() 
		{
		var href;
		
		href = window.location.href;
		if (href.indexOf('#' < 0))
			return undefined;
			
		return href.split('#')[1];
		};
		
		
	this.goToURLFragment = function(param, animate) 	
		// "param" can be either an anchor click event or the id of the fragment to scroll to.
		// Scrolling compensates for the height of a fixed header if it exists.
		// Usage:
		//  	A.utils.getSamePageLinks().on('click', {animate: true}, A.utils.goToURLFragment);
		// or on window load:fragmentIdentifier = A.utils.getURLFragmentIdentifier();
		// var fragmentIdentifier = A.utils.getURLFragmentIdentifier();
		// if (fragmentIdentifier)
		//	A.utils.goToURLFragment(fragmentIdentifier, !A.utils.pageWasReloaded());
		
		{
		var id;
		var header;
		var headerHeight;
		var numPixels;
		var scrollee;
		
		if (typeof param === 'string')
			id = param;
		else		// this is a click event on an anchor tag
			{
			id = this.href.split('#')[1];
			animate = param.data ? param.data.animate : false;
			}
		if (!id)
			return;
			
		scrollee = jQuery('html, body');		
		header = jQuery('header');
		headerHeight = header.length === 0 ? 0 : parseInt(header.css('height'));
		numPixels = jQuery('#' + id).offset().top - headerHeight;
		if (animate)
			scrollee.animate({scrollTop: numPixels}, 333);
		else
			scrollee.scrollTop(numPixels);
		};
		
		
	this.userPrefersDarkColorScheme = function()
		{
		return window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
		};
		
		
	this.getSamePageLinks = function(element)
		{
		var samePageLinks = 'a[href^="#"]';		// all anchor hrefs that start with # (same page links)
		
		if (element)
			samePageLinks = jQuery(element).find(samePageLinks); // get all in elment
		else
			samePageLinks = jQuery(samePageLinks);  // get all in page
		return samePageLinks.length ? samePageLinks : undefined;
		};
		
		
	this.isolateScrolling = function(id)
		{
		var element = document.getElementById(id);
		if (!element)
			return;
			
		var isMacWebkit = (navigator.userAgent.indexOf("Macintosh") !== -1 && navigator.userAgent.indexOf("WebKit") !== -1);
		var isFirefox = (navigator.userAgent.indexOf("firefox") !== -1);
		element.onwheel = wheelHandler;         // Future browsers
		element.onmousewheel = wheelHandler;    // Most current browsers
		if (isFirefox) 
			{
			element.scrollTop = 0;
			element.addEventListener("DOMMouseScroll", wheelHandler, false);
			}		
		function wheelHandler(event) 
			// prevent scrolling in element from scrolling parent elements
			{
			var e;
			var deltaX;
			var deltaY;
			e = event || window.event; // Standard or IE event object
			// Extract the amount of rotation from the event object, looking
			// for properties of a wheel event object, a mousewheel event object 
			// (in both its 2D and 1D forms), and the Firefox DOMMouseScroll event.
			// Scale the deltas so that one "click" toward the screen is 30 pixels.
			// If future browsers fire both "wheel" and "mousewheel" for the same
			// event, we'll end up double-counting it here. Hopefully, however,
			// cancelling the wheel event will prevent generation of mousewheel.
			deltaX = e.deltaX * -30 || // wheel event
				e.wheelDeltaX / 4 || // mousewheel
				0; // property not defined
			deltaY = e.deltaY * -30 || // wheel event
				e.wheelDeltaY / 4 || // mousewheel event in Webkit
				(e.wheelDeltaY === undefined && // if there is no 2D property then 
			e.wheelDelta / 4) || // use the 1D wheel property
				e.detail * -10 || // Firefox DOMMouseScroll event
				0; // property not defined
			// Most browsers generate one event with delta 120 per mousewheel click.
			// On Macs, however, the mousewheels seem to be velocity-sensitive and
			// the delta values are often larger multiples of 120, at 
			// least with the Apple Mouse. Use browser-testing to defeat this.
			if (isMacWebkit) 
				{
				deltaX /= 30;
				deltaY /= 30;
				}
			e.currentTarget.scrollTop -= deltaY;
			// If we ever get a mousewheel or wheel event in (a future version of)
			// Firefox, then we don't need DOMMouseScroll anymore.
			if (isFirefox && e.type !== "DOMMouseScroll") 
				{
				element.removeEventListener("DOMMouseScroll", wheelHandler, false);
				}
			// Don't let this event bubble. Prevent any default action.
			// This stops the browser from using the mousewheel event to scroll
			// the document. Hopefully calling preventDefault() on a wheel event
			// will also prevent the generation of a mousewheel event for the
			// same rotation.
			if (e.preventDefault) 
				e.preventDefault();
			if (e.stopPropagation) 
				e.stopPropagation();
			e.cancelBubble = true;      // IE events
			e.returnValue = false;      // IE events
			return false;
			}
		};
	
	
	this.calcTextWidth = function(text, fontFamily, fontSize, fontStyle)
		{
		var canvas;
		var context;
		var metrics;

		canvas = document.createElement('canvas');
		context = canvas.getContext('2d');
		context.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
		metrics = context.measureText(text);
		canvas.remove();
		return Math.ceil(metrics.width);
		};
    
    
    this.getDateTimeDictionary = function(dateTime)
        {
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dayNames = ['Sunday', 'Monday',  'Tuesday',  'Wednesday',  'Thursday',  'Friday',  'Saturday'];
        var date;
        var dateTimeDictionary;
        var hour24;
        var hour12;
        var ampm;
    
        date = new Date(dateTime);
        hour24 = date.getHours();
        ampm = hour24 >= 12 ? 'PM' : 'AM';
        hour12 = hour24 === 12 ? 12 : hour24 % 12;
        dateTimeDictionary =    {
                                'utcYear' : date.getUTCFullYear(),
                                'utcMonth' : monthNames[date.getUTCMonth()],
                                'utcDayOfMonth' : date.getUTCDate(),
                                'utcDayOfWeek' : dayNames[date.getUTCDay()],
                                'utcHour' : date.getUTCHours(),
                                'utcMinute' : date.getUTCMinutes(),
                                'utcSecond' : date.getUTCSeconds(),
                                'year' : date.getFullYear(),
                                'month' : monthNames[date.getMonth()],
                                'dayOfMonth' : date.getDate(),
                                'dayOfWeek' : dayNames[date.getDay()],
                                'hour24' : hour24,
                                'hour12' : hour12,
                                'ampm' : ampm,
                                'minute' : date.getMinutes(),
                                'second' : date.getSeconds(),
                                'timezone' : date.getTimezoneOffset() / 60
                                };
        return dateTimeDictionary;
        }  
		
		
	this.showCurrentHTML = function()
		{
		var htmlWindow = null;
		var html;
		var htmlStart;
		var htmlEnd;
		var currentHTML;
	
		htmlWindow = window.open("about:blank", "", "_blank");
		if (htmlWindow === null)
			{
			alert("Turn off the browser's popup window blocking so the current html of this window can be shown.");
			return;
			} 
		
		htmlStart = (function () 
			{/*   
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8">		
					<title>HTML</title>
					<meta name="apple-mobile-web-app-capable" content="yes">	
					<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.25, maximum-scale=8.0, user-scalable=yes">
				</head>
				<body>
					<h1>Current HTML of the Generic Web Page</h1>
					<h2>(after all scripting changes have been applied)</h2>
					<br>
					<pre style='width:100%;height:100%;white-space:pre-wrap;'>
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
		currentHTML = ('<!DOCTYPE html>\r<html lang="en">\r' +
						document.head.outerHTML + "\r\r\r" +
						document.body.outerHTML + 
						"\r\r</html>").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\t/g, "    ");
		htmlEnd = (function () 
			{/*  
					</pre>
				</body>
			</html>  
			*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
		htmlWindow.document.write(htmlStart + currentHTML + htmlEnd);
		};
    						    	

    this.loadFile = function(path, callback, asPlainText, start, end)
    	// 
    	// asynchronous function
    	// start and end are optional, if either is undefined this will not be a byte range fetch
    	// calback(response, status)
    	{
    	var xhr;
    	var getByteRange;
    	var async;
    	var textFiles;
    	var fileExtension;
    	
		//console.log('TRYING TO LOAD FILE ASYNCHRONOUSLY: ' + path);
		getByteRange = start && end;
    	async = true;
    	//fileExtension = this.getFileExtension(path).toLowerCase();
    	//textFiles = 'txt-html-xhtml-css-js-php-sh-conf-xml-svg-sgml-tex-json';
		xhr = new XMLHttpRequest();
		xhr.open('GET', path, async);	
		// only fill in responseType if not a text file - i.e. presumab/y a media of other binary file
		// empty responseType defaults to plain text return values
    	//xhr.responseType = textFiles.includes(fileExtension) ? '' : 'arraybuffer';
    	xhr.responseType = asPlainText ? '' : 'arraybuffer';
		xhr.setRequestHeader('Cache-Control', 'no-cache');
		if (getByteRange) 
			xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);
		xhr.onload = loading;
		xhr.onerror = failed;
		xhr.send(null);		
		function loading() 
			{					
			if (xhr.readyState !== 4) 
				return;
					
			if (xhr.status === 200) 
				callback(xhr.response, xhr.status);
			else 
				failed();
			}
		function failed() 
			{
			console.log('File ' + xhr.statusText + ' --- ' + path);
			}
    	};


	this.getFileExtension = function(fileName)
		{
		var fileparts = fileName.split(".");
	
		if (fileparts.length === 1 || (fileparts[0] === "" && fileparts.length === 2)) 
			// if a.length is one, it's a visible file with no extension like "file"
			// if a[0] === "" and a.length === 2 it's a hidden file with no extension like ".htaccess"
			{
			return "";
			}
		return fileparts.pop().toLowerCase();
		};
        
        
	this.writeFiles = function(texts, fileNames)
		// texts and fileNames are arrays of strings and both arrays need to have the same length
		{
		if (!texts || 
			!texts[0] ||
			!fileNames || 
			!fileNames[0] ||
			texts.length !== fileNames.length)
			return;
			
		writeFile(texts[0], fileNames[0], 'text/html');
		texts.shift();
		fileNames.shift();
		setTimeout(function() {mThis.writeFiles(texts, fileNames);}, 1000);
		
	
		function writeFile(text, fileName, mimeType) 	// mimeType example, 'text/html'
			// writes to browser's download folder
			{
			var tempLink;

			mimeType = mimeType || 'application/octet-stream';
			tempLink = document.createElement('a');
			if (navigator.msSaveBlob)  // IE10
				{
				navigator.msSaveBlob(new Blob([text],{type: mimeType}), fileName);
				} 
			else if (URL && 'download' in tempLink)  //html5 A[download]
				{
				tempLink.href = URL.createObjectURL(new Blob([text],{type: mimeType}));
				tempLink.setAttribute('download', fileName);
				document.body.appendChild(tempLink);
				tempLink.click();
				document.body.removeChild(tempLink);
				} 
			else 
				{
				location.href = 'data:application/octet-stream,' + encodeURIComponent(content); 	// only this mime type is supported
				}
			}
		};
	
	
	
	};