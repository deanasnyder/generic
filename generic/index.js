/*
DONE:
		√ XXX
*/

A.toDo = `To Do: 
		`;
		
		
A.app = new function()
	{	
	// gather these from our CSS coloring code; better than using jQuery('*');
	var mColorSchemeableElements = `header, 
									main, 
									a, 
									hr, 
									.doAnimatedFocus, 
									#contactInfo, 
									#footerBox, 
									#mainMenuButton span, 
									#mainMenu, 
									.mainMenuItemButton, 
									.mainMenuItemCheckboxLabel`;
						
	this.init = function()
		{
		var samePageLinks;
		var fragmentIdentifier;		

		log(A.toDo);			
		if (window.matchMedia)		// listen for color scheme changes
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setColorScheme);
		jQuery('main a').addClass('doAnimatedFocus');		// do not animate focus in main menu
		samePageLinks = A.utils.getSamePageLinks('main');	
		if (samePageLinks) 
			samePageLinks.on('click', {animate: true}, A.utils.goToURLFragment);
		initMainMenu();
		A.footer.init();
		setColorScheme(A.utils.userPrefersDarkColorScheme());	// call after all HTML has loaded
		fragmentIdentifier = A.utils.getURLFragmentIdentifier();
		if (fragmentIdentifier)
			A.utils.goToURLFragment(fragmentIdentifier, !A.utils.pageWasReloaded());
		
		
		function initMainMenu()
			{
			A.MenuManager('mainMenuButton', 'mainMenu', '176px', 'auto'); 
			jQuery('#schemeCheckbox').on('change', setColorScheme);
			jQuery('#showCurrentHTMLBtn').on('click', A.utils.showCurrentHTML);
			}
		}
		
		
	function setColorScheme(param)
		{
		var checkbox;
		var useDarkColorScheme;
		
		checkbox = document.getElementById('schemeCheckbox');
		if (typeof param === 'boolean')
			useDarkColorScheme = param;
		else if (param.media)
			useDarkColorScheme = A.utils.userPrefersDarkColorScheme();
		else
			useDarkColorScheme = checkbox.checked;
		checkbox.checked = useDarkColorScheme;
    	if (useDarkColorScheme)
    		{
    		jQuery('html, body').css('background', '#141414');
    		jQuery('body').css('color', '#fff');
    		jQuery('html').css('color-scheme', 'only dark');	// make sure scrollbars, etc. match
			jQuery(mColorSchemeableElements).addClass('dark');
    		}
		else
			{
    		jQuery('html, body').css('background', '#fff');
    		jQuery('body').css('color', '#000');
    		jQuery('html').css('color-scheme', 'only light');	// make sure scrollbars, etc. match
			jQuery(mColorSchemeableElements).removeClass('dark');
			}
		}
	};


	

	