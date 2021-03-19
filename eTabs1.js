/**
 * eTabs.js v1.1
 */
 ;( function( window ) {

 	'use strict';

 	function extend( a, b ) {
 		for( var key in b ) {
 			if( b.hasOwnProperty( key ) ) {
 				a[key] = b[key];
 			}
 		}
 		return a;
 	}
 	function IW_Tabs( el, options ) {
 		this.el = el;
 		this.options = extend( {}, this.options );
   		extend( this.options, options );
   		this._init();
 	}
 	IW_Tabs.prototype.options = {
 		start : 0
 	};
 	IW_Tabs.prototype._init = function() {
 		// tabs elems
 		this.tabs = [].slice.call( this.el.querySelectorAll( 'nav > ul > li' ) );
 		// content items
 		this.items = [].slice.call( this.el.querySelectorAll( '.et-content-wrap > section' ) );
 		// current index
 		this.current = -1;
 		// show current content item
 		this._show();
 		// init events
 		this._initEvents();
 	};
 	IW_Tabs.prototype._initEvents = function() {
 		var self = this;
 		this.tabs.forEach( function( tab, idx ) {
 			tab.addEventListener( 'click', function( ev ) {
 				ev.preventDefault();
 				jQuery(document).trigger("resize");
 				self._show( idx );
 			} );
 		} );
 	};
 	IW_Tabs.prototype._show = function( idx ) {
 		if( this.current >= 0 ) {
 			this.tabs[ this.current ].className = this.items[ this.current ].className = '';
 		}
 		this.tabs.forEach( function( tab, idx ) {
 			tab.className = "";
 		});
 		// change current
 		this.current = idx != undefined ? idx : this.options.start >= 0 && this.options.start < this.items.length ? this.options.start : 0;
		var hash = jQuery( jQuery( this.tabs[ this.current ] ).find( 'a' )[0] ).data('href');
		hash = hash.substr( hash.indexOf("#") );
 		setTimeout( function(){
 			jQuery(document).trigger("elegantTabSwitched",[hash]);
 		}, 100 );
 		var anim = jQuery(this.items[ this.current ]).data('animation');
		this.items.forEach( function( tab, idx ) {
			tab.className = '';
		} );

		// Make first tab inactive.
		if ( -1 == this.options.start ) {
			var loaded = jQuery( jQuery( this.tabs[ this.current ] ).parents( '.elegant-tabs-container' )[0] ).data( 'loaded' );

			if ( 'undefined' !== typeof loaded || loaded ) {
				this.tabs[ this.current ].className = 'tab-current';
				this.items[ this.current ].className = 'content-current';
				jQuery( this.items[ this.current ] ).find( '.infi-content-wrapper' )[0].className = 'infi-content-wrapper animated '+anim;
			}
			jQuery( jQuery( this.tabs[ this.current ] ).parents( '.elegant-tabs-container' )[0] ).attr('data-loaded', true );
		} else {
			this.tabs[ this.current ].className = 'tab-current';
			this.items[ this.current ].className = 'content-current';
			jQuery( this.items[ this.current ] ).find( '.infi-content-wrapper' )[0].className = 'infi-content-wrapper animated '+anim;
		}

 	};
 	// add to global namespace
 	window.IW_Tabs = IW_Tabs;
 })( window );

 function checkHash( hashLink ) {
 	if ( hashLink !== '' ) {
 		hash 	= hashLink.substr(hashLink.indexOf("#") );
 		if ( jQuery( hash ).length ) {
 			var animation = jQuery( hash ).data( 'animation' ),
 			    tab_link = jQuery('a[data-href="'+hash+'"]').parents("ul").find('li'),
 			    tabs = jQuery(hash).parents(".et-tabs").find("section");
 			tab_link.removeClass('tab-current');
 			tab_link.each(function(index, element) {
 	      jQuery(this).removeClass('tab-current');
 	    });
 			tabs.each(function(index, element) {
 	      jQuery(this).removeClass('content-current');
 	    });
 			jQuery('a[data-href="'+hash+'"]').parent('li').addClass('tab-current');
 			jQuery( hash + ' > .infi-content-wrapper' )[0].className = 'infi-content-wrapper animated ' + animation;
 			jQuery(hash).addClass('content-current');
 			setTimeout( function(){
 				jQuery(document).trigger("elegantTabSwitched",[hash]);
 			}, 100 );
 		}
 	}
 }

function checkHashPosition( hash ) {
	var hashPosition = 0;
	hashPosition = jQuery( 'a[data-href="' + hash + '"]' ).parent( 'li' ).index();
	return hashPosition;
}

function elegantAutoSwitchTabs( el, interval, startTab ) {
	var timeInterval, tabCount = 0, currnetIndex = 1;

	 tabCount = jQuery( el ).find( 'li' ).length;

	 currnetIndex = startTab + 1;

	 changeTabIndex();
	 timeInterval = setInterval( function () { changeTabIndex(); }, interval * 1000);


	 function changeTabIndex() {
			 if ( currnetIndex > tabCount ) {
					 currnetIndex = 1;
			 }

			 var currentAncorObj = jQuery( el ).find( 'li' ).eq( currnetIndex - 1 );

			 jQuery( currentAncorObj ).trigger( 'click' );

			 currnetIndex++;
	 };

	 jQuery( el ).find( 'li' ).mouseenter( function () {
			 clearInterval( timeInterval );
	 }).mouseleave( function () {
			 timeInterval = setInterval( function () { changeTabIndex(); }, interval * 1000);
	 });
}

function etGenerateCSS() {
	var css = '<style type="text/css" id="tabs-dynamic-css">',
    st = '',
    bg = '',
    color = '',
    bg_hover = '',
    color_hover = '';

	[].slice.call( document.querySelectorAll( '.et-tabs' ) ).forEach( function( el ) {

	var url 	= window.location;
 	    hash 	= url.href,
	    hashPosition = 0,
			listContainer = '',
			autoSwitch = false,
			autoSwitchInterval = 5;

 	if ( -1 !== hash.indexOf('#') ) {
 		hash = hash.replace( "/#", '#' );
		hash = hash.substr( hash.indexOf( "#" ) );

		if ( jQuery( el ).find( 'a[data-href="' + hash + '"]' ).length ) {
			hashPosition = checkHashPosition( hash );
			setTimeout( function() {
				jQuery( 'html, body' ).animate( { scrollTop:( ( jQuery( hash ) ).offset().top ) - ( 160 + jQuery( el ).find( 'a[data-href="' + hash + '"]' ).height() ) }, 300 );
			}, 500 );
		} else {
			hashPosition = ( 'undefined' !== typeof jQuery( el ).data( 'active-tab' ) ) ? jQuery( el ).data( 'active-tab' ) : 0;
		}
 	} else {
		hashPosition = ( 'undefined' !== typeof jQuery( el ).data( 'active-tab' ) ) ? jQuery( el ).data( 'active-tab' ) : 0;
	}

	hashPosition = ( '' !== hashPosition ) ? hashPosition : 0;

	new IW_Tabs( el, { start: hashPosition } );

	listContainer      = jQuery( el ).find( '.elegant-tabs-list-container' );
	autoSwitch         = jQuery( el ).data( 'auto-switch-tab' );
	autoSwitchInterval = jQuery( el ).data( 'switch-interval' );

	if ( 'no' !== autoSwitch && '' !== autoSwitch ) {
		elegantAutoSwitchTabs( listContainer[0], autoSwitchInterval, hashPosition );
	}

	var cn = el.className.split(" "),
	    cl = '';

	jQuery(cn).each(function(i,v){
		cl += "."+v;
	});

	st = jQuery(cl).data("tab_style");
	bg = jQuery(cl).data("active-bg");
	color = jQuery(cl).data("active-text");
	bg_hover = jQuery(cl).data("hover-bg");
	color_hover = jQuery(cl).data("hover-text");

		css += cl+' .infi-tab-accordion.infi-active-tab .infi_accordion_item{background:'+bg+' !important; color:'+color+' !important;}\n';
		css += cl+' .infi-tab-accordion.infi-active-tab .infi_accordion_item .infi-accordion-item-heading{color:'+color+' !important;}\n';
		css += cl+' .infi-tab-accordion.infi-active-tab .infi_accordion_item .infi-accordion-item-heading .iw-icons{color:'+color+' !important;}\n';
		switch(st){
			case 'bars':
				css += cl+' li.tab-current a{background:'+bg+'; color:'+color+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' li:not(.tab-current) a:hover{background:'+bg_hover+'; color:'+color_hover+';}\n';
				css += cl+' nav ul li:not(.tab-current) a:hover, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'iconbox':
		case 'iconbox-iconlist':
				css += cl+' li.tab-current a{background:'+bg+'; color:'+color+' !important;}\n';
				css += cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
				css += cl+' nav ul li.tab-current::after{color:'+bg+';}\n';
			css += cl+' nav ul li.tab-current{color:'+bg+' !important;}\n';
			css += cl+' li:not(.tab-current) a:hover{background:'+bg_hover+'; color:'+color_hover+';}\n';
				css += cl+' nav ul li:not(.tab-current) a:hover, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'underline':
				css += cl+' nav ul li a::after{background:'+bg+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current) a:hover:after{background:'+bg_hover+'; transform: translate3d(0,0,0);}\n';
				css += cl+' nav ul li:not(.tab-current) a:hover, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'topline':
			if ( '' == color ) {
				color = bg;
			}
				css += cl+' nav ul li.tab-current a{box-shadow:inset 0px 3px 0px '+bg+';}\n';
				css += cl+' nav ul li.tab-current {border-top-color: '+color+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a{box-shadow:inset 0px 3px 0px '+bg_hover+';}\n';
				css += cl+' nav ul li:not(.tab-current):hover {border-top-color: '+color_hover+';}\n';
				css += cl+' nav ul li:not(.tab-current):hover a, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'iconfall':
			case 'circle':
			case 'square':
				css += cl+' nav ul li::before{background:'+bg+'; border-color:'+bg+';}\n';
				css += cl+' nav ul li.tab-current::after { border-color:'+bg+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover::before{background:'+bg_hover+'; border-color:'+bg_hover+'; transform: translate3d(0,0,0);}\n';
				css += cl+' nav ul li:not(.tab-current):hover::after { border-color:'+bg_hover+';}\n';
			css += cl+' nav ul li:not(.tab-current):hover a, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'line':
				css += cl+' nav ul li.tab-current a{box-shadow:inset 0px -2px '+bg+' !important;}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a{box-shadow:inset 0px -2px '+bg_hover+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'linebox':
				css += cl+' nav ul li a::after{background:'+bg+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a::after{background:'+bg_hover+'; transform: translate3d(0,0,0);}\n';
			css += cl+' nav ul li:not(.tab-current):hover a, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'flip':
				css += cl+' nav ul li a::after, '+cl+' nav ul li.tab-current a{background:'+bg+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a::after, '+cl+' nav ul li:not(.tab-current):hover a{background:'+bg_hover+'; transform: translate3d(0,0,0);}\n';
			css += cl+' nav ul li:not(.tab-current):hover a, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'tzoid':
				var style = jQuery(cl + ' nav ul li').attr('style');
				css += cl+' nav ul li a::after{'+style+';}\n';
				css += cl+' li.tab-current a::after{background:'+bg+'; color:'+color+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
			css += cl+' li:not(.tab-current):hover a::after{background:'+bg_hover+'; color:'+color_hover+'; transform: perspective(5px) rotateX(0.93deg) translateZ(-1px);;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
			case 'fillup':
				css += cl+' nav ul li.tab-current a::after{background:'+bg+';}\n';
				css += cl+' nav ul li a::after{background:'+bg+'; border-color: '+bg+';}\n';
				css += cl+' nav ul li.tab-current a, '+cl+' nav ul li.tab-current a > i{color:'+color+' !important;}\n';
				css += cl+' nav ul li a {border-color:'+color+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a::after{background:'+bg_hover+'; translate3d(0,0,0)}\n';
				css += cl+' nav ul li:not(.tab-current):hover a::after{background:'+bg_hover+'; border-color: '+bg_hover+'; transform: translate3d(0,0,0)}\n';
				css += cl+' nav ul li:not(.tab-current):hover a {border-color:'+color_hover+' !important;}\n';
			css += cl+' nav ul li:not(.tab-current):hover a, '+cl+' nav ul li:not(.tab-current):hover a > i{color:'+color_hover+' !important;}\n';
				break;
		}
		// css += cl+' li.tab-current a{background:'+bg+'; color:'+color+';}\n';

	});
	css += '</style>';
	jQuery("head").append(css);
}
/* Call tabs function */
(function() {

	etGenerateCSS();

	jQuery( "select.et-mobile-tabs" ).change( function() {
		var hashLink = jQuery( this ).find( "option:selected" ).val();
		checkHash( hashLink );
	});

	jQuery("a").not('.et-anchor-tag').click( function(e){
		var url = jQuery(this).attr("href");
		if( url !== "" && typeof url !== "undefined"){
	        var isHash = url.indexOf('#section');
	        var isTabPage = '';
	        hash 	= url.substring(url.indexOf('#section'));
	        if( isHash !== -1 ){
	       		isTabPage = jQuery(hash).length;
	       	}
	        if( isHash !== -1 && isTabPage ) {
	        	e.preventDefault();
	            checkHash( url );
						jQuery( 'html, body' ).animate( { scrollTop:( ( jQuery(hash) ).offset().top ) - 150 }, 300 );
					}
			}
	});

	jQuery(".et-anchor-tag").hover(
		function(){
			if ( ! jQuery(this).parent('li').hasClass('tab-current') ) {
				var hover_src = jQuery(this).find('.elegant-tabs-image-icon').data( 'hover-src' );
				if ( '' !== hover_src ) {
					jQuery(this).find('.elegant-tabs-image-icon').attr( 'src', hover_src );
				}
			}
		},
		function(){
			if ( ! jQuery(this).parent('li').hasClass('tab-current') ) {
				var original_src = jQuery(this).find('.elegant-tabs-image-icon').data( 'original-src' );
				jQuery(this).find('.elegant-tabs-image-icon').attr( 'src', original_src );
			}
		}
	);

	jQuery( document ).on( "elegantTabSwitched", function( e, hash ) {
		jQuery(document).trigger("resize");
		if (typeof wpb_prepare_tab_content == 'function') {
			wpb_prepare_tab_content( e, { newPanel: jQuery('.et-content-wrap') } );
		}
		jQuery( hash ).parents( '.et-tabs' ).find( '.et-mobile-tabs' ).val( hash );
		jQuery( hash ).parent( '.et-content-wrap' ).find( '.infi-tab-accordion' ).removeClass( 'infi-active-tab' );
		jQuery('div[data-href="'+hash+'"]').parents( '.infi-tab-accordion' ).addClass( 'infi-active-tab' );
		jQuery( hash ).siblings().find('iframe').each( function( i ) {
			jQuery(this).attr('src', jQuery(this).attr('src'));
		} );
		var hover_src = jQuery('a[data-href*="'+hash+'"]').find('.elegant-tabs-image-icon').data( 'hover-src' );
		jQuery('a[data-href*="'+hash+'"]').parents( '.elegant-tabs-list-container' ).find( '.elegant-tabs-image-icon' ).each( function(){
			var original_src = jQuery(this).data( 'original-src' );
			jQuery(this).attr( 'src', original_src );
		});
		if ( '' !== hover_src ) {
			jQuery('a[data-href*="'+hash+'"]').find('.elegant-tabs-image-icon').attr( 'src', hover_src );
		}
	});

	// Responsive Tabs.
	jQuery(document).ready( function(){

		// Render tabs on widget ready in frontend editor.
		if ( undefined !== window.elementorFrontend && 'undefined' !== typeof elementorFrontend.hooks ) {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/elegant_tabs.default', function( $scope ) {
				etGenerateCSS();
			} );
		}

		var accHD = document.getElementsByClassName('infi-accordion-item-heading');
		for (i = 0; i < accHD.length; i++) {
				accHD[i].addEventListener('click', toggleItem.bind( self, i), false);
		}
		function toggleItem( index, event ) {
			var $this = jQuery( event.target ),
			    hash 	= $this.data('href'),
					itemID,
					animation,
					hashLink;

			if ( typeof hash == 'undefined' ) {
				hash = $this.parent( '.infi-accordion-item-heading' ).data( 'href' );
				$this = $this.parent( '.infi-accordion-item-heading' );
			}

			itemID = hash;
			animation = jQuery( itemID ).data( 'animation' );

			jQuery( itemID ).parents( '.et-tabs' ).find( 'nav > ul li').removeClass( 'tab-current' );
			jQuery( itemID ).parent( '.et-content-wrap' ).find( 'section' ).removeClass( 'content-current' );
			jQuery( itemID ).parent( '.et-content-wrap' ).find( '.infi-tab-accordion' ).removeClass( 'infi-active-tab' );
			$this.parents( '.infi-tab-accordion' ).addClass( 'infi-active-tab' );

			jQuery( itemID )[0].className = 'content-current';
			jQuery( itemID + ' > .infi-content-wrapper' )[0].className = 'infi-content-wrapper animated ' + animation;
			[].slice.call( document.querySelectorAll( '.et-tabs' ) ).forEach( function( el ) {
				var Tabs = new IW_Tabs( el, { start: index } );
			});
			jQuery( 'html, body' ).animate( { scrollTop:( ( $this ).offset().top ) - 85 }, 300 );
		}
	});
})();
