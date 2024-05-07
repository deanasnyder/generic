A.MenuManager = function (menuButtonElementID, menuElementID, menuWidth, menuHeight) 
    {
    var NAV_CODES = Object.freeze({'TAB':9, 'RETURN':13, 'ESC':27, 'SPACE':32, 'PAGEUP':33,'PAGEDOWN':34, 'END':35, 'HOME':36, 'LEFT':37, 'UP':38, 'RIGHT':39, 'DOWN':40});
    var mMenuButtonElement;
    var mMenuElement;
    var mMenu;
    var mMenuIsVisible;
        
    (function init()		// IIFE
        {                 
        mMenuButtonElement = document.getElementById(menuButtonElementID); 
        mMenuElement = document.getElementById(menuElementID);
        if (mMenuButtonElement == null || mMenuElement == null)
            return; 
        
		jQuery('#' + menuElementID).css({width: menuWidth, height: menuHeight});
        mMenuIsVisible = false;
        mMenuButtonElement.setAttribute('aria-haspopup', 'true');
        mMenuButtonElement.setAttribute('aria-expanded', 'false');                                 
        mMenuButtonElement.addEventListener('keydown', menuEvent);
        document.querySelector('html').addEventListener('click', menuEvent);   
        mMenu = new Menu();
        //mMenu.show();		// convenient for testing and debugging
        })();
        
        
    function menuEvent(event)
        {
        var toThisMenuItem;
        
        switch (event.type)
            {
            case 'click':
				if (event.target.id === menuButtonElementID || 
					event.target.parentElement.id === menuButtonElementID)
					mMenuIsVisible ? mMenu.hide() : mMenu.show();
				else 
					mMenu.hide();
                break;
            case 'keydown':
                switch (event.keyCode) 
                    {
                    case NAV_CODES.SPACE:
                    case NAV_CODES.RETURN:
                    	if (mMenuIsVisible)
                    		return;
                    		
                        event.stopPropagation();
                        event.preventDefault();
                        mMenu.show();
                        break;
                    case NAV_CODES.DOWN:
                    case NAV_CODES.UP:
                    	if (!mMenuIsVisible)
                    		return;

						event.stopPropagation();
						event.preventDefault();
						toThisMenuItem = event.keyCode === NAV_CODES.UP ? 'lastMenuItem' : 'firstMenuItem';
						mMenu.shiftFocus(toThisMenuItem);
                        break;
                    case NAV_CODES.ESC:
                    case NAV_CODES.TAB:
                    	if (!mMenuIsVisible)
                    		return;

                        event.stopPropagation();
                        event.preventDefault();
                        mMenu.hide();
                    	break
                    }
                break;
            default:
                break;
            }
        }
     
        
     function Menu() 
        {      
        var kThis = this;
        var mMenuItems = [];    
        var mFirstMenuItem = null;    
        var mLastMenuItem = null;   
            
		(function init()		// IIFE
            {
            var menuItemElements = [];
            var subElements;
            var menuItemElement;  
            var menuLinks;
        
            mMenuElement.tabIndex = -1;		// disallow tab key focusing in menu
            mMenuElement.setAttribute('role', 'menu');
			// make button text accessible
            if (!mMenuElement.getAttribute('aria-labelledby') && 
                !mMenuElement.getAttribute('aria-label') && 
                !mMenuElement.getAttribute('title')) 
                mMenuElement.setAttribute('aria-label', mMenuButtonElement.innerHTML);
            subElements = mMenuElement.getElementsByTagName('*');
            for (var i = 0, n = subElements.length; i < n; i++)
                {
                if (subElements[i].getAttribute('role') === 'menuitem')
                    menuItemElements.push(subElements[i]);
                }
            for (var i = 0; i < menuItemElements.length; i++) 
                {
                menuItemElement = menuItemElements[i];
                mMenuItems.push(new MenuItem(menuItemElement, kThis));
                }
            if (mMenuItems.length > 1) 
                {
                mFirstMenuItem = mMenuItems[0];
                mLastMenuItem  = mMenuItems[mMenuItems.length - 1];
                }
			A.utils.isolateScrolling(menuElementID);
			menuLinks = A.utils.getSamePageLinks('#' + menuElementID);	
			if (menuLinks) 
				menuLinks.on('click', {animate: true}, A.utils.goToURLFragment);
            })();


        this.show = function() 
            {
            mMenuElement.style.display = 'block';
            mMenuButtonElement.setAttribute('aria-expanded', 'true');
			jQuery(mMenuButtonElement).addClass('X');
            mMenuIsVisible = true;
            };


        this.hide = function() 
            {
            mMenuElement.style.display = 'none';
            mMenuButtonElement.setAttribute('aria-expanded', 'false');
			jQuery(mMenuButtonElement).removeClass('X');
            mMenuIsVisible = false;
            }; 
    
    
        this.shiftFocus = function(newFocus, currentMenuItem, char)
            {
            var menuItem;
            var focusee;
                
            switch (newFocus)
                {
                case 'blur':
                    currentMenuItem.menuItemElement.blur(); 
                    return;
                case 'menuButton':
                    focusee = mMenuButtonElement;
                    break;
                case 'specifiedElement':
                    focusee = currentMenuItem.menuItemElement;
                    break;
                case 'firstMenuItem':
                    focusee = mFirstMenuItem.menuItemElement;
                    break;
                case 'lastMenuItem':
                    focusee = mLastMenuItem.menuItemElement;
                    break;
                case 'nextMenuItem':
                    focusee = currentMenuItem === mLastMenuItem ? mFirstMenuItem.menuItemElement 
                                : mMenuItems[mMenuItems.indexOf(currentMenuItem) + 1].menuItemElement;
                    break;
                case 'previousMenuItem':
                    focusee = currentMenuItem === mFirstMenuItem ? mLastMenuItem.menuItemElement 
                                : mMenuItems[mMenuItems.indexOf(currentMenuItem) - 1].menuItemElement;
                    break;
                default:
                    console.log("Can't recognize new focus request: '" + newFocus + "'");
                    return;
                }
            if (focusee)
            	focusee.focus();
            };            
        }


	function MenuItem(menuItemElement, myMenu) 
		{
		var kThis = this;
		var mMyMenu = myMenu;

		kThis.menuItemElement = menuItemElement;
		menuItemElement.tabIndex = -1;		// disallow tab key focusing in menu
		if (!menuItemElement.getAttribute('role')) 
			menuItemElement.setAttribute('role', 'menuitem');
		menuItemElement.addEventListener('keydown', menuItemEvent);
		menuItemElement.addEventListener('click', menuItemEvent);
		menuItemElement.addEventListener('mouseover', menuItemEvent);
		menuItemElement.addEventListener('mouseout', menuItemEvent);
	
	
		function menuItemEvent(event)
			{
			var char;
			var stopEventPropagation;
	
			switch (event.type)
				{
				case 'mouseover':
					mMyMenu.shiftFocus('specifiedElement', kThis);
					break;
				case 'mouseout':
					mMyMenu.shiftFocus('blur', kThis);
					break;
				case 'click':
					mMyMenu.hide(true);
					mMyMenu.shiftFocus('menuButton');
					break;
				case 'keydown':
					stopEventPropagation = true;
					switch (event.keyCode) 
						{
						case NAV_CODES.SPACE:
						case NAV_CODES.RETURN:
							event.target.click();
							break;
						case NAV_CODES.ESC:
						case NAV_CODES.TAB:
							mMyMenu.hide();
							mMyMenu.shiftFocus('menuButton');
							break;
						case NAV_CODES.UP:
						case NAV_CODES.LEFT:
							mMyMenu.shiftFocus('previousMenuItem', kThis);
							break;
						case NAV_CODES.DOWN:
						case NAV_CODES.RIGHT:
							mMyMenu.shiftFocus('nextMenuItem', kThis);
							break;
						case NAV_CODES.HOME:
						case NAV_CODES.PAGEUP:
							mMyMenu.shiftFocus('firstMenuItem');
							break;
						case NAV_CODES.END:
						case NAV_CODES.PAGEDOWN:
							mMyMenu.shiftFocus('lastMenuItem');
							break;
						default:
							stopEventPropagation = false;
							break;
						}
					if (stopEventPropagation) 
						{
						event.stopPropagation();
						event.preventDefault();
						}
					break;
				default:
					break;
				}
			}                
		};
    };

