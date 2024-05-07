A.footer = new function()		
	{
	var footerHTML;
	var footerCSS;
	var errorMessage;
	var millisecondsElapsed;
	var timeElapsed;
	var filesInfo;
	var numFiles;
		
	this.init = function()
		{
		var copyright;
		
		copyright = document.querySelector('meta[name="copyright"]').getAttribute('content');
		jQuery(footerCSS).appendTo('head');
		jQuery('footer').replaceWith(footerHTML);
		if (!copyright)
			{
			errorMessage = 'Footer not created because no copyright year was passed to A.footer.init().';
			jQuery('#footerBox').html(errorMessage);
			console.log(errorMessage);
			return false;
			}
			
		//jQuery('#footerCopyrightDate').html(year);
		
		
		jQuery('#footerCopyright').html(copyright);
		filesInfo = getFilesInfo();
		numFiles = filesInfo.length;
		jQuery('#footerFiles').html(getFileInfoHTML(filesInfo));				
		millisecondsElapsed = A.timer() - A.startupTime;
		timeElapsed = ('' + (millisecondsElapsed / 1000)).substr(0, 6);
		jQuery('#footerNumFiles').html(numFiles);
		jQuery('#footerNumElements').html(document.getElementsByTagName('*').length);
		jQuery('#footerLoadTime').html(timeElapsed);
		}
	
						
	function getFilesInfo()
		{
		var filePaths;
		var filesInfo = [];
		var path;
		var lastModified;
			
		filePaths = getFilePaths();
		for (var i = 0; i < filePaths.length; i++)
			{
			path = filePaths[i];
			lastModified = requestHeader(path, 'Last-Modified');
			if (lastModified) filesInfo.push(new FileInfo(path, lastModified));
			}	
		filesInfo.sort(function sort(a, b){return a.sorter <= b.sorter;});
		return filesInfo;
		}
	
						
	function getFileInfoHTML(filesInfo)
		{
		var path;
		var lastModified;
		var html;	
		
		html = '';
		for (var i = 0; i < filesInfo.length; i++)
			{
			path = filesInfo[i].path;
			path = truncateStartOfString('……………………………………………………………………………… ' + path, 21);
			html += "<div class='footerModification'><div class='footerModifiedFile'>" + path + "</div>";
			html += "<div class='footerModificationTime'>" + filesInfo[i].modificationDate + " GMT</div></div>\n";
			}
		return html;
		}
		
		
	function requestHeader(url, header) 
		{
		var xhr;
		
		try 
			{
			xhr = new XMLHttpRequest();
			xhr.open("HEAD", url, false);
			xhr.send(null);
			if (xhr.status === 200)
				return xhr.getResponseHeader(header);
			else
				return false;
			} 
		catch (error) 
			{
			console.log(error.message);
			return false;
			}
		}
		

	function getFilePaths()
		{
		var filePaths = [];

		filePaths.push(window.location.pathname.includes('.html') ? window.location.pathname : 'index.html');
		jQuery(document).find('link').each(addPath);
		jQuery(document).find('script').each(addPath);

		function addPath(index, element)
			{
			element = jQuery(element);
			if (element.attr('src') !== undefined)			// script file
				filePaths.push(element.attr('src'));
			else if (element.attr('rel') === 'stylesheet')	// CSS file
				filePaths.push(element.attr('href'));
			}
		return filePaths;
		}
		

	function numMonth(monthName)
		{
		var monthNames = 'JanFebMarAprMayJunJulAugSepOctNovDec';
		var numMonth;
		
		numMonth = (monthNames.indexOf(monthName) / 3) + 1;
		return numMonth > 9 ? numMonth : '0' + numMonth;
		}
		
		
	function truncateStartOfString(string, toNumChars)
		{
		string = string.substring(string.length - toNumChars, string.length);
		return string.length < toNumChars ? string : string.substring(0, 0) + '…' + string.substring(0 + '…'.length);
		}		
	
	
	this.setColors = function(backgroundColor, borderColor, textColor, anchorColor, hrColor)
		{
		var footer;

		if (arguments.length === 0)
			{
			footer = jQuery('footer');
			backgroundColor = footer.css('--footerBackgroundColor');
			borderColor = footer.css('--footerBorderColor');
			textColor = footer.css('--footerTextColor');
			anchorColor = footer.css('--footerAnchorColor');
			hrColor = footer.css('--footerHRColor');
			}
		jQuery('#footerBox').css({'background': backgroundColor, 
							'border-color': borderColor, 
							'color': textColor});
		jQuery('footer hr').css({'background': hrColor});
		jQuery('footer a').css({'color': anchorColor});
		};
		
		
	function FileInfo(path, lastModified)
		{
		var year;
		var month;
		var day;
		var hour;
		var minute;
		var second;
	
		this.path = path;
		this.lastModified = lastModified;
		year = lastModified.substring(12, 16);
		month = numMonth(lastModified.substring(8, 11));
		day = lastModified.substring(5, 7);
		hour = lastModified.substring(17, 19);
		minute = lastModified.substring(20, 22);
		second = lastModified.substring(23, 25);
		this.modificationDate = year + ' ' + month + ' ' + day + ' ' + hour + ':' + minute + ':' + second;
		this.sorter = year + month + day + hour + minute + second;
		}
		
		
	/* NOTE footerHTML */
	footerHTML = `
<footer role='contentinfo'>
	<hr>
	<div id='footerBox'>
		<!--<div id='footerCopyright'>Copyright <span id='footerCopyrightDate'>2023</span> Dean A. Snyder. All Rights Reserved.</div>-->
		<div id='footerCopyright'></div>
		<div id='footerURL'>
			<a href='http://studyhebrewandgreek.com' target='_blank' class='doAnimatedFocus'> 
				studyhebrewandgreek.com 
			</a>
		</div>
		<div id='footerEmail'>studyhebrewandgreek at gmail dot com</div>
		<div> 
			<span id='footerNumFiles'></span> files and
			<span id='footerNumElements'></span> html tags loaded in 
			<span id='footerLoadTime'></span> seconds.
		</div>
		<div id='footerLastModifiedBox'>
			<div id='footerLastModifiedTitle'>File Modification Dates</div>
			<div id='footerFiles'></div>
		</div>
	</div>
</footer>
		`;		
	
	/* NOTE footerCSS */		
	footerCSS = `
	<style>
	footer
		{
		width: 100%;
		margin-top: 80px;
		margin-bottom: 40px;
		}
	footer hr
		{
		width: 90%;
		margin: auto;
		}
	#footerBox	
		{
		width: 300px;
		margin: auto;
		margin-top: 24px;
		margin-bottom: 0px;
		text-align: center;
		font-family: Arial, Verdana, sans-serif;
		font-size: 11px;
		line-height: 1.3;
		border-width: 1px;
		border-style: solid;
		border-radius: 5px;
		padding-bottom: 8px;
		}	
	#footerCopyright
		{
		margin-top: 9px;
		}			
	#footerLastModifiedBox
		{
		width: auto;
		margin-top: 8px;
		margin-bottom: 6px;
		text-align: left;
		font-family: Courier, monospace;
		font-size: 10px;
		line-height: 1;
		}	
	#footerLastModifiedTitle
		{
		margin-bottom: 2px;
		text-align: center;
		}	
	.footerModifiedFile
		{
		display: inline-block;
		width: 135px;
		text-align: right;
		}	
	.footerModificationTime
		{
		display: inline-block;
		width: 155px;
		text-align: right;
		}	
	/* NOTE footer colors */	
	footer
		{
		display: block;
		position: relative;
		--footerBackgroundColor: #f9f9f9;
		--footerBackgroundColorDark: #222;
		--footerBorderColor: #aaa;
		--footerBorderColorDark: #555;
		--footerTextColor: #444;
		--footerTextColorDark: #ddd;
		--footerAnchorColor: #33d;
		--footerAnchorColorDark: #99e;
		--footerHRColor: #aaa;
		--footerHRColorDark: #555;
		background: transparent;
		}
	#footerBox	
		{
		background: var(--footerBackgroundColor);
		border-color: var(--footerBorderColor);
		color: var(--footerTextColor);
		}	
	#footerBox.dark	
		{
		background: var(--footerBackgroundColorDark);
		border-color: var(--footerBorderColorDark);
		color: var(--footerTextColorDark);
		}	
	footer hr
		{
		background: var(--footerHRColor);
		}
	footer hr.dark
		{
		background: var(--footerHRColorDark);
		}
	footer a
		{
		color: var(--footerAnchorColor);
		}
	footer a.dark
		{
		color: var(--footerAnchorColorDark);
		}
	</style>
		`;
	};
	
	


