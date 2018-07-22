/*  
 *
 * Namespace for all the scripts implemented in the frontend
 */
if ( ThriveApp === undefined ) {
	var ThriveApp = {};
}

var _isAdmin = 0;
var _is_blankPage = 0;

ThriveApp.is_theme_layout = false;

ThriveApp.winWidth = jQuery( window ).width();
ThriveApp.viewportHeight = jQuery( window ).height();

jQuery( function () {
	_isAdmin = jQuery( '#wpadminbar' ).length;
	_is_blankPage = jQuery( '.bp-t' ).length;
	if ( ! _is_blankPage ) {
		ThriveApp.menuPositionTop = (
			jQuery( "nav.right" ).length
		) ? jQuery( "nav.right" ).position().top : 0;
	}
	ThriveApp.is_theme_layout = jQuery( '.bSe .awr' ).length + jQuery( '.bp-t .wrp' ).length ? true : false;
	ThriveApp.menuResponsive();
	ThriveApp.shortcodeTabsResize();
	ThriveApp.setPageSectionHeight();
	ThriveApp.bind_comments_handlers();
	ThriveApp.check_comments_hash();
	ThriveApp.videoShorcode();
	ThriveApp.image_post_resize();
	ThriveApp.blog_gallery();
	jQuery( '.cdt' ).thrive_timer();
	ThriveApp.post_format_gallery();
	ThriveApp.bold_first_paragraph();
	ThriveApp.grid_layout();
	ThriveApp.bind_share_buttons();

	jQuery( '.sm_icons, .scfm .ss' ).each( function () {
		jQuery( this ).mouseover( function () {
			jQuery( '.bubb', this ).css( 'left', function () {
				return (
					       jQuery( this ).parent().width() - jQuery( this ).width()
				       ) / 2;
			} ).show( 0 );
		} );
		jQuery( this ).mouseout( function () {
			jQuery( '.bubb', this ).hide();
		} );
	} );

	jQuery( ".tmw" ).hover(
		function () {
			jQuery( this ).find( '.tmm' ).slideDown();
		}, function () {
			jQuery( this ).find( '.tmm' ).slideUp();
		}
	);

	jQuery( '.faqB' ).click( function () {
		var $toggle = jQuery( this ).parents( '.faq' );
		$toggle.toggleClass( 'oFaq' );
		jQuery( '.faqC', $toggle ).slideToggle( 'fast' );
		return false;
	} );

	jQuery( '.accss .acc-h' ).click( function () {
		var accordion_element = jQuery( this ),
			accordion_context = jQuery( this ).parents( '.accs' ),
			accordion_parent = accordion_context.find( '.accss' );
		if ( accordion_element.parent().hasClass( 'opac' ) ) {
			return false;
		}
		accordion_element.parents( '.accs' ).find( '.opac' ).find( '.accsi' ).slideUp( function () {
			accordion_parent.removeClass( 'opac' );
		} );
		accordion_element.next( '.accsi' ).slideDown( function () {
			accordion_element.parents( '.accss' ).addClass( 'opac' );
		} );
	} );

	if ( jQuery( ".thrive-borderless .wp-video-shortcode" ).length > 0 ) {
		jQuery( ".thrive-borderless .wp-video-shortcode" ).css( 'width', '100%' );
		jQuery( ".thrive-borderless div" ).css( 'width', '100%' );
	}

	ThriveApp.comments_page = 1;
	if ( ThriveApp.lazy_load_comments == 1 ) {
		jQuery( window ).scroll( ThriveApp.bind_scroll );
		ThriveApp.load_comments();
	}

	jQuery( window ).trigger( 'scroll' );

	jQuery( '#shf' ).on( 'click', function () {
		jQuery( '.lrp.hid' ).slideToggle();
	} );

	jQuery( window ).resize( function () {
		var winNewWidth = jQuery( window ).width();
		var winNewViewportHeight = jQuery( window ).height();

		if ( ThriveApp.winWidth !== winNewWidth ) {
			ThriveApp.delay( function () {
				ThriveApp.menuResponsive();
			}, 1 );
		}
		ThriveApp.winWidth = winNewWidth;
		ThriveApp.viewportHeight = winNewViewportHeight;
		ThriveApp.shortcodeTabsResize();
		ThriveApp.videoShorcode();
		ThriveApp.setVideoPosition();
		ThriveApp.setPageSectionHeight();
		ThriveApp.image_post_resize();
		ThriveApp.grid_layout();
	} );

	jQuery( 'body' ).on( 'added_to_cart', function ( event, fragments, cart_hash, $thisbutton ) {
		var _a = (
			jQuery( fragments['.mini-cart-contents'] ).find( 'a.cart-contents-btn' )
		);
		jQuery( '.mobile-mini-cart' ).html( '' ).append( _a );
	} );

	if ( window.FB && window.FB.XFBML ) {
		jQuery( '.fb-comments' ).each( function () {
			window.FB.XFBML.parse( this.parentNode );
		} );
	}

	ThriveApp.bind_masonry_layout();

} );

ThriveApp.grid_layout = function () {
	if ( jQuery( '.gin' ).length > 0 ) {
		var gridBlock = jQuery( '.gr-i' ),
			noOfItems = gridBlock.length;

		var setGridHeights = function ( noOfElementsOnRow ) {
			var _condition = '';
			for ( var i = 0; i < noOfItems; i += noOfElementsOnRow ) {
				if ( noOfElementsOnRow == 3 ) {
					_condition = ':eq(' + i + '),:eq(' + (i + 1) + '),:eq(' + (i + 2) + ')';
				}

				if ( noOfElementsOnRow == 2 ) {
					_condition = ':eq(' + i + '),:eq(' + (i + 1) + ')';
				}

				var gridGroup = gridBlock.filter( _condition ),
					elementHeights = jQuery( gridGroup ).map( function () {
						gridGroup.css( 'height', '' );//reset height so that we can recalculate
						return jQuery( this ).height();
					} ),
					maxHeight = Math.max.apply( null, elementHeights );
				gridGroup.height( maxHeight );
			}
		}

		if ( ThriveApp.winWidth >= 940 ) {
			if ( jQuery( '.bSe' ).hasClass( 'fullWidth' ) ) {
				setGridHeights( 3 );
			} else {
				setGridHeights( 2 );
			}
		} else if ( 940 > ThriveApp.winWidth && ThriveApp.winWidth >= 741 ) {
			setGridHeights( 2 );
		}

		jQuery( '.bSe' ).find( '.tcb-window-width' ).removeClass( 'tcb-window-width' ).css( {
			'width': 'auto',
			'left': 'auto'
		} );
	}
};

ThriveApp.bold_first_paragraph = function () {
	//bold first pagraph
	if ( ThriveApp.post_type == 'post' ) {
		jQuery( '.bSe .awr-i' ).children().each( function () {
			var _this = jQuery( this );
			var text = jQuery.trim( _this.text() ), html = _this.html().replace( /&nbsp;/g, '' );

			if ( ! (
					_this.is( ':hidden' )
				) && ! (
					_this.is( ':empty' )
				) ) {
				if ( _this.prop( "tagName" ) == 'P' ) {
					if ( text != '' && html != '' ) {
						_this.addClass( 'ifp' );
						return false;
					} else {
						if ( ! (
								text == '' && html == ''
							) ) {
							return false;
						}
					}
				} else {
					return false;
				}
			}
		} );
	}
}

ThriveApp.bind_masonry_layout = function () {
	if ( jQuery( '.bSe' ).hasClass( 'mry' ) ) {
		var container = document.querySelector( '.mry' ),
			msnry = new Masonry( container, {
				itemSelector: '.mry-i',
				gutter: ".mry-g"
			} );

		jQuery( '.bSe' ).find( '.tcb-window-width' ).removeClass( 'tcb-window-width' ).css( {
			'width': 'auto',
			'left': 'auto'
		} );
	}
};

jQuery( window ).on( 'load', function () {
	ThriveApp.bind_masonry_layout();
	ThriveApp.resize_blank_page();
} );

ThriveApp.post_format_gallery = function () {
	var _this_gallery = jQuery( ".hru" );
	_this_gallery.each( function () {
		jQuery( this ).attr( "data-count", jQuery( this ).find( ".thrive-gallery-item" ).length );
		var _context = jQuery( this ),
			_gallery_item = _context.find( '.hui' ),
			_gallery_next_button = _context.find( '.gnext' ),
			_gallery_prev_button = _context.find( '.gprev' ),
			_gallery_dummy = _context.find( '.gallery-dmy' ),
			_gallery_items = parseInt( _gallery_item.attr( 'data-count' ) ),
			_gallery_carousel = _context.find( '.g-ul' );
		_gallery_carousel.css( 'width', (
			                                _gallery_items * 78
		                                ) + 'px' );
		jQuery( ".thrive-gallery-item", _context ).click( function () {
			_gallery_item.attr( "data-index", jQuery( this ).attr( "data-index" ) );
			_gallery_item.css( 'background-image', 'url(' + jQuery( this ).attr( "data-src" ) + ')' );
			_gallery_dummy.attr( 'src', jQuery( this ).attr( "data-src" ) );
			return false;
		} );

		_gallery_prev_button.click( function () {
			var _current_index = parseInt( _gallery_item.attr( 'data-carousel' ) );
			if ( _gallery_item.attr( 'data-carousel' ) > 0 ) {
				_current_index --;
				_gallery_item.attr( 'data-carousel', _current_index );
				_gallery_carousel.css( 'left', - (
					_current_index * 78
				) + 'px' );
			}
			return false;
		} );

		_gallery_next_button.click( function () {
			var _current_index = parseInt( _gallery_item.attr( 'data-carousel' ) );
			if ( _current_index < _gallery_items - 4 ) {
				_current_index ++;
				_gallery_item.attr( 'data-carousel', _current_index );
				_gallery_carousel.css( 'left', - (
					_current_index * 78
				) + 'px' );
			}
			return false;
		} );
	} );
};

ThriveApp.progress_bar = function () {
	jQuery( '.pbfc:not(".stopCount")' ).each( function ( e ) {
		if ( jQuery( this ).parents( '.nsd' ).hasClass( 'nsds' ) ) {
			var progress_element = jQuery( this ),
				progress = progress_element.attr( 'data-percent' ),
				progress_box = progress_element.parents( '.pbs' ).find( '.pbbn' );
			jQuery( {countNum: 0} ).animate( {countNum: progress}, {
				duration: 3000,
				easing: 'linear',
				step: function () {
					progress_box.text( Math.ceil( this.countNum ) );
				},
				done: function () {
					if ( progress_box.text() == progress ) {
						progress_element.addClass( 'stopCount' );
					}
				}
			} );
		}
	} )
}

//ThriveApp.circle_fill = function () {
//    jQuery('.fill-counter').each(function () {
//        var percentage = jQuery(this).attr('data-percentage');
//        if (jQuery(this).hasClass('nsds')) {
//            jQuery('circle', this).attr('stroke-dasharray', percentage);
//        }
//    });
//}

ThriveApp.number_counter = function () {
	jQuery( '.nbc.nsds' ).each( function () {
		var counter_element = jQuery( '.nbcn', this ),
			count_to = counter_element.attr( 'data-counter' );
		var i = 0, t = null, step = 1;
		if ( jQuery( this ).attr( 'data-started' ) == 'false' ) {
			stepper( i, count_to );
			jQuery( this ).attr( 'data-started', 'true' );
		}

		function stepper( i, count_to ) {
			step = Math.ceil( count_to / 100 );

			if ( i <= count_to ) {
				counter_element.text( i );
				i += step;
				if ( i + step > count_to ) {
					counter_element.text( count_to );
					clearTimeout( t );
				}
				t = setTimeout( function () {
					stepper( i, count_to )
				}, 50 );
			} else {
				clearTimeout( t );
			}
		}
	} );
};

ThriveApp.image_post_resize = function () {
	jQuery( '.tt-dmy' ).css( {
		'max-height': ThriveApp.viewportHeight,
		'max-width': ThriveApp.winWidth
	} );
};

ThriveApp.setPageSectionHeight = function () {
	var containerWidthElement = jQuery( ' .wrp .bpd,.wrp .fullWidth , .wrp  .lnd ' ),
		isFullWidth = containerWidthElement.length,
		defaultWidth = isFullWidth ? (
			ThriveApp.winWidth + 'px'
		) : '100%';

	//jQuery('.pdfbg.pdwbg').css({
	//    'box-sizing': "border-box",
	//    width: defaultWidth,
	//    height: ThriveApp.viewportHeight + 'px'
	//});

	jQuery( '.pddbg, .scvps, .vt' ).css( 'max-width', ThriveApp.winWidth + 'px' );

	jQuery( '.pdfbg' ).each( function () {
		var img = jQuery( this ).css( "box-sizing", "border-box" ),
			h = parseInt( img.attr( 'data-height' ) ),
			w = parseInt( img.attr( 'data-width' ) ),
			min_height = '100%';

		if ( h && ! isNaN( h ) && w && ! isNaN( w ) ) {
			var max_width = Math.min( ThriveApp.winWidth, img.parent().width() );
			min_height = ( max_width < w ? (max_width * h / w) : h ) + 'px';
		}

		img.css( 'min-height', min_height );
	} );
};

ThriveApp.showMenu = function () {
	jQuery( 'header nav ul li' ).each( function () {
		jQuery( this ).mouseenter( function () {
			if ( jQuery( this ).hasClass( 'has-extended' ) && ThriveApp.winWidth >= 722 ) {
				var _submenu_element = jQuery( this ).children( '.sub-menu' ),
					_main_item_position = jQuery( this ).offset().left,
					_submenu_width = _submenu_element.width(),
					_contentElement = jQuery( '.wrp.cnt' ),
					_contentWidth = _contentElement.width(),
					_contentOffset = _contentElement.offset().left;
				if ( _main_item_position < _contentOffset || _main_item_position + _submenu_width > _contentOffset + _contentWidth ) {
					_submenu_element.addClass( 'position_menu' );
					if ( _main_item_position < _contentOffset ) {
						if ( ! _submenu_element.hasClass( 'position_right' ) ) {
							_submenu_element.addClass( 'position_left' );
						}
					} else if ( _main_item_position + _submenu_width > _contentOffset + _contentWidth ) {
						if ( ! _submenu_element.hasClass( 'position_left' ) ) {
							_submenu_element.addClass( 'position_right' );
						}
					}
				}
				jQuery( this ).children( '.sub-menu' ).stop().fadeIn( 'fast' );
			} else {
				jQuery( this ).children( '.sub-menu' ).show();
			}

		} );
		jQuery( this ).mouseleave( function () {
			var _submenu_hidden = jQuery( this );
			_submenu_hidden.children( '.sub-menu' ).stop().fadeOut( 'fast' );
		} );

	} );
}

ThriveApp.menuResponsive = function () {
	if ( ThriveApp.winWidth < 774 ) {
		jQuery( 'header nav ul li' ).each( function () {
			jQuery( this ).unbind( 'mouseenter' );
			jQuery( this ).unbind( 'mouseleave' );
		} );
		jQuery( '.hsm' ).unbind( 'click' ).on( 'click', function () {
			var headerHeight = jQuery( '#floating_menu' ).height(),
				topBar = jQuery( '#wpadminbar' ).length ? 46 : 0,
				distanceFromTop = headerHeight + topBar,
				menuMaxHeight = ThriveApp.viewportHeight - distanceFromTop;
			jQuery( '.m-si' ).slideToggle( 'fast', function () {
				var menuHeight = jQuery( '#floating_menu nav ul' ).height();
				if ( ThriveApp.viewportHeight <= menuHeight + distanceFromTop ) {
					jQuery( ".m-si" ).css( {
						'max-height': menuMaxHeight + "px"
					} );
					jQuery( 'html' ).addClass( 'html-hidden' );
				}
				if ( menuHeight <= 0 ) {
					jQuery( 'html' ).removeClass( 'html-hidden' );
				}
			} );
		} );
	} else if ( ThriveApp.winWidth >= 774 ) {
		//jQuery(".m-si nav").css('max-height', 'auto').show();
		ThriveApp.showMenu();
	}
}

ThriveApp.shortcodeTabsResize = function () {
	jQuery( ".scT ul.scT-tab li" ).on( 'click', function ( e ) {
		var $li = jQuery( this ),
			tabs_wrapper = $li.parents( ".shortcode_tabs, .tabs_widget" ).first(),
			target_tab = tabs_wrapper.find( ".scTC" ).eq( $li.index() );
		tabs_wrapper.find( ".tS" ).removeClass( "tS" );
		$li.addClass( 'tS' );
		tabs_wrapper.find( ".scTC" ).hide();
		target_tab.show();
		e.preventDefault();
	} );
};

ThriveApp.delay = (function () {
	var timer = 0;
	return function ( callback, ms ) {
		clearTimeout( timer );
		timer = setTimeout( callback, ms );
	};
})();

ThriveApp.check_comments_hash = function () {
	if ( location.hash ) {
//this part is commented because when you click on the comments link and the lazy load is on, it takes you to the bottom of the page and it freezes until all comments are loaded.
		//if (location.hash.indexOf("#comments") >= 0) {
		//    var aTag = jQuery("#commentform");
		//    jQuery('html,body').animate({
		//        scrollTop: aTag.offset().top
		//    }, 'slow');
		//    return;
		//}
		if ( location.hash.indexOf( "#comment-" ) !== - 1 ) {
			var tempNo = location.hash.indexOf( "#comment-" ) + 9;
			var comment_id = location.hash.substring( tempNo, location.hash.length );

			var aTag = jQuery( "#comment-container-" + comment_id );
			if ( aTag.length !== 0 ) {
				jQuery( 'html,body' ).animate( {
					scrollTop: aTag.offset().top - 30
				}, 'slow' );
			}
		}
	}
};

ThriveApp.videoShorcode = function () {

	jQuery( ".scvps .pvb a" ).click( function ( event ) {
		event.preventDefault();
		//return false;
	} );

	jQuery( ".scvps .pvb" ).click( function () {
		var eventTarget = jQuery( this ),
			eventParent = eventTarget.parents( '.scvps' ),
			elementHeight = eventParent.height();

		//var elementHeight = jQuery(this).parents('.scvps').height();
		jQuery( this ).parents( '.scvps' ).css( 'height', elementHeight + 'px' );

		jQuery( this ).parents( ".vdc" ).find( "h2" ).hide();
		jQuery( this ).parents( ".vdc" ).find( "h3" ).hide();
		jQuery( this ).parents( ".vdc" ).find( "p" ).hide();
		jQuery( this ).hide();
		jQuery( this ).parents( ".scvps" ).find( ".video-container" ).show();

		if ( eventParent.find( "iframe" ).length > 0 ) {
			var _current_iframe = eventParent.find( "iframe" );
			var _container_width = eventParent.outerWidth();
			var _iframe_width = _current_iframe.attr( 'width' );
			if ( jQuery( this ).hasClass( 'is-video-format' ) ) {
				var _container_height = eventParent.outerHeight();
			} else {
				var _container_height = (
					                        _container_width * 9
				                        ) / 16;
			}
			if ( _container_width < _iframe_width ) {
				_current_iframe.attr( 'width', _container_width );
				_current_iframe.attr( 'height', _container_height );
			}
		}

		var _video_element = jQuery( this ).parents( ".scvps" ).find( ".vwr" );
		var _video_el_top = jQuery( this ).parents( ".scvps" ).outerHeight() / 2 - _video_element.height() / 2;
		_video_element.css( {
			top: (
				_video_el_top < 0
			) ? 0 : _video_el_top,
			left: jQuery( this ).parents( ".scvps" ).outerWidth() / 2 - _video_element.width() / 2
		} );

		if ( eventParent.find( "video" ).length > 0 ) {
			var _player_element = eventParent.find( "video" )[0];
			if ( jQuery( this ).hasClass( 'is-video-format' ) ) {
			}
			_player_element.player.play();
		}

		if ( eventParent.find( "iframe" ).length > 0 ) {
			var _current_iframe = eventParent.find( "iframe" );
			var _iframe_id = _current_iframe.attr( 'id' );
			var _iframe_src = _current_iframe.attr( 'src' );

			if ( _iframe_src.indexOf( "vimeo" ) >= 0 ) {
				_current_iframe.attr( 'src', ThriveApp.updateQueryStringParameter( _iframe_src, "autoplay", "1" ) );
			} else if ( _iframe_src.indexOf( "youtube" ) >= 0 ) {
				_current_iframe.attr( 'src', ThriveApp.updateQueryStringParameter( _iframe_src, "autoplay", "1" ) );
			}
			eventParent.find( "iframe" ).trigger( "click" );
		}
	} );

};

ThriveApp.bind_scroll = function () {
	if ( jQuery( "#comment-bottom" ).length > 0 ) {
		var top = jQuery( "#comment-bottom" ).offset().top;
		if ( top > 0 && top < jQuery( window ).height() + jQuery( document ).scrollTop() ) {
			ThriveApp.load_comments();
		}
	}
};

ThriveApp.load_comments = function () {
	if ( ThriveApp.comments_loaded == 1 ) {
		return;
	} else {
		ThriveApp.comments_loaded = 1;
	}

	if ( typeof _thriveCurrentPost === 'undefined' ) {
		_thriveCurrentPost = 0;
	}
	jQuery( "#thrive_container_preload_comments" ).show();
	var post_data = {
		action: 'thrive_lazy_load_comments',
		post_id: _thriveCurrentPost,
		comment_page: ThriveApp.comments_page
	};
	if ( window.TVE_Dash && ! TVE_Dash.ajax_sent ) {
		jQuery( document ).on( 'tve-dash.load', function () {
			TVE_Dash.add_load_item( 'theme_comments', post_data, ThriveApp.load_comments_handle );
		} );
	} else {
		jQuery.post( ThriveApp.ajax_url, post_data, ThriveApp.load_comments_handle );
	}
};

ThriveApp.load_comments_handle = function ( response ) {
	ThriveApp.comments_page ++;
	if ( response == '' ) {
		ThriveApp.comments_loaded = 1;
	} else {
		ThriveApp.comments_loaded = 0;
	}

	jQuery( "#thrive_container_preload_comments" ).hide();
	jQuery( "#thrive_container_list_comments" ).append( response );
	jQuery( "#thrive_container_form_add_comment" ).show();
	ThriveApp.bind_comments_handlers();
	ThriveApp.check_comments_hash();
};

ThriveApp.bind_comments_handlers = function () {

	jQuery( document ).on( 'click', ".txt_thrive_link_to_comments", function () {
		var aTag = jQuery( "#commentform" );
		jQuery( 'html,body' ).animate( {
			scrollTop: aTag.offset().top
		}, 'slow' );
	} );

	jQuery( document ).on( 'click', ".reply", function () {
		var comment_id = jQuery( this ).attr( 'cid' );
		jQuery( "#respond-container-" + comment_id ).slideDown();
		return false;
	} );

	jQuery( document ).on( 'click', '.cancel_reply', function () {
		var comment_id = jQuery( this ).attr( 'cid' );
		jQuery( "#respond-container-" + comment_id ).slideUp();
		return false;
	} );
};

ThriveApp.youtube_play = function ( vcode, width, height ) {
	"use strict";
	jQuery( "#videoContainer" ).html( '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + vcode + '?autoplay=1&loop=1&rel=0&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>' );
};

ThriveApp._get_element_height = function ( elmID ) {
	var elmHeight, elmMargin, elm = document.getElementById( elmID );
	if ( document.all ) {// IE
		elmHeight = elm.currentStyle.height;
		elmMargin = parseInt( elm.currentStyle.marginTop, 10 ) + parseInt( elm.currentStyle.marginBottom, 10 ) + "px";
	} else {// Mozilla
		elmHeight = document.defaultView.getComputedStyle( elm, '' ).getPropertyValue( 'height' );
		elmMargin = parseInt( document.defaultView.getComputedStyle( elm, '' ).getPropertyValue( 'margin-top' ) ) + parseInt( document.defaultView.getComputedStyle( elm, '' ).getPropertyValue( 'margin-bottom' ) ) + "px";
	}
	return (
		elmHeight + elmMargin
	);
};

ThriveApp.updateQueryStringParameter = function ( uri, key, value ) {
	var re = new RegExp( "([?|&])" + key + "=.*?(&|$)", "i" );
	separator = uri.indexOf( '?' ) !== - 1 ? "&" : "?";
	if ( uri.match( re ) ) {
		return uri.replace( re, '$1' + key + "=" + value + '$2' );
	}
	else {
		return uri + separator + key + "=" + value;
	}
};

ThriveApp.social_scripts = {
	twitter: {src: "https://platform.twitter.com/widgets.js", loaded: 0},
	google: {src: "https://apis.google.com/js/plusone.js?onload=onLoadCallback", loaded: 0},
	facebook: {src: "://platform.twitter.com/widgets.js", loaded: 0},
	linkedin: {src: "//platform.linkedin.com/in.js", loaded: 0},
	pinterest: {src: "//assets.pinterest.com/js/pinit.js", loaded: 0},
	youtube: {src: "https://apis.google.com/js/platform.js", loaded: 0}
};

ThriveApp.load_script = function ( script_name ) {
	if ( ThriveApp.social_scripts[script_name].loaded === 0 ) {
		/**
		 * We did this to avoid a conflict when there is a pinterest button in THRIVE FOOTER WIDGET
		 * and you add a pinterest button from the TCB (social sharing buttons - default design)
		 * */
		if ( ThriveApp.social_scripts[script_name].src == "//assets.pinterest.com/js/pinit.js" ) {
			var s = document.createElement( "script" );
			s.type = "text/javascript";
			s.async = true;
			s.src = "https://assets.pinterest.com/js/pinit.js";
			s["data-pin-build"] = "parsePins";

			var x = document.getElementsByTagName( "script" )[0];

			x.parentNode.insertBefore( s, x );
			ThriveApp.social_scripts[script_name].loaded = 1;
		} else {
			jQuery.getScript( ThriveApp.social_scripts[script_name].src, function () {
				ThriveApp.social_scripts[script_name].loaded = 1;
			} );
		}
	}
};

ThriveApp.setVideoPosition = function () {
	jQuery( '.scvps .pvb' ).each( function () {
		var _video_element = jQuery( this ).parents( ".scvps" ).find( ".vwr" );
		_video_element.css( {
			top: jQuery( this ).parents( ".scvps" ).outerHeight() / 2 - _video_element.height() / 2,
			left: jQuery( this ).parents( ".scvps" ).outerWidth() / 2 - _video_element.width() / 2
		} );
	} );
};

ThriveApp.bind_share_buttons = function () {

	if ( ThriveApp.is_singular != '0' && jQuery( '.cou .share-no' ).length ) {
		ThriveApp.fetch_share_count();
	}
};

ThriveApp.fetch_share_count = function ( post_id, bypass_cache ) {
	if ( typeof bypass_cache === 'undefined' ) {
		bypass_cache = 0;
	}

	function post_it( id, $share_count_total ) {
		var post_data = {
			action: 'thrive_get_share_count',
			post_id: id,
			no_cache: bypass_cache
		}, _r = function ( response ) {
			var nn = parseInt( response );
			if ( ! isNaN( nn ) ) {
				$share_count_total.html( response );
			}
		};

		if ( window.TVE_Dash && ! TVE_Dash.ajax_sent ) {
			jQuery( document ).on( 'tve-dash.load', function () {
				TVE_Dash.add_load_item( 'theme_shares', post_data, _r );
			} );
		} else {
			jQuery.post( ThriveApp.ajax_url, post_data ).done( _r );
		}
	}

	/**
	 * single page - update all instances from the page
	 */
	if ( typeof post_id === 'undefined' ) {
		var $all = jQuery( '.mets .cou, .fl-s .cou.thive-share-count' );
		var $share_count = $all.first();
		if ( $share_count.length ) {
			post_it( $share_count.data( 'id' ), $share_count.add( $all ) );
		}
	} else {
		post_it( post_id, jQuery( '.thive-share-cnt-' + post_id ) );
	}
};

ThriveApp.open_share_popup = function ( url, width, height, post_id ) {
	var leftPosition, topPosition;
	leftPosition = (
		               window.screen.width / 2
	               ) - (
		               (
			               width / 2
		               ) + 10
	               );
	topPosition = (
		              window.screen.height / 2
	              ) - (
		              (
			              height / 2
		              ) + 50
	              );
	/**
	 * store a reference to the opened window, so we can refresh share count after the window closes
	 * @type {Window}
	 */
	var child_window = window.open( url, "Window", "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no" ),
		tt = 0;

	function close_listener() {
		if ( child_window.closed ) {
			ThriveApp.fetch_share_count( post_id, 1 );
			clearTimeout( tt );
			return;
		}
		tt = setTimeout( close_listener, 1000 );
	}

	tt = setTimeout( close_listener, 4000 );
	return false;
};
ThriveApp.hasFloatingMenu = jQuery( '#floating_menu' ).attr( 'data-float' ) === 'float';
ThriveApp.hasSocialIcons = jQuery( '#floating_menu' ).attr( 'data-social' ) === '1';
ThriveApp.menu_float = {
	current_scroll_top: 0,
	scroll_dir: 'down',
	hasScroll: function () {
		return this.current_scroll_top > 0;
	},
	onScroll: function ( st ) {
		if ( this.current_scroll_top < st ) {
			this.scroll_dir = 'down';
		} else {
			this.scroll_dir = 'up';
		}
		this.current_scroll_top = st;
		return this.handle();
	},
	handle: function () {
		var _socialElement = jQuery( '.fln' ),
			_header = jQuery( '#floating_menu' ),
			_theMenu = _header.find( 'header' ),
			_headerHeight = _header.outerHeight(),
			_nextElement = jQuery( '.bSe' ).offset().top,
			_post_height = jQuery( '.bSe .awr-i' ).outerHeight(),
			_bottom_limit = _nextElement + _post_height;

		if ( _isAdmin ) {
			_socialElement.addClass( 'adm' );
			_theMenu.addClass( 'adm' );
		}

		if ( this.scroll_dir == 'down' ) {
			if ( ThriveApp.winWidth > 774 ) {
				_header.css( 'height', _headerHeight + 'px' );
			}

			if ( ThriveApp.hasFloatingMenu && ThriveApp.hasSocialIcons ) {
				if ( this.current_scroll_top > _nextElement ) {
					_socialElement.addClass( 'fff' );
					if ( this.current_scroll_top > _bottom_limit ) {
						_socialElement.removeClass( 'fff' );
						_theMenu.addClass( 'fbh' );
					}
				}
			}

			if ( ThriveApp.hasFloatingMenu && ! ThriveApp.hasSocialIcons ) {
				if ( this.current_scroll_top > 10 ) {
					_theMenu.addClass( 'fbh' );
				}
			}

			if ( ThriveApp.hasSocialIcons && ! ThriveApp.hasFloatingMenu ) {
				if ( this.current_scroll_top > 10 ) {
					_socialElement.addClass( 'fff' );
				}
			}

		} else if ( this.scroll_dir == 'up' ) {
			if ( ThriveApp.hasFloatingMenu && ThriveApp.hasSocialIcons ) {
				if ( this.current_scroll_top < _bottom_limit ) {
					_socialElement.addClass( 'fff' );
					_theMenu.removeClass( 'fbh' );
				}
				if ( this.current_scroll_top < _nextElement ) {
					_socialElement.removeClass( 'fff' );
				}
			}
			if ( ThriveApp.hasFloatingMenu && ! ThriveApp.hasSocialIcons ) {
				if ( this.current_scroll_top < _nextElement ) {
					_theMenu.removeClass( 'fbh' );
				}
			}
			if ( ThriveApp.hasSocialIcons && ! ThriveApp.hasFloatingMenu ) {
				if ( this.current_scroll_top < _nextElement ) {
					_socialElement.removeClass( 'fff' );
				}
			}

		}
	}
};

ThriveApp.show_shortcodes = function ( position ) {
	jQuery( '.nsd' ).each( function () {
		var $this = jQuery( this );
		if ( position + ThriveApp.viewportHeight >= $this.offset().top + $this.outerHeight() ) {
			$this.addClass( 'nsds' );
			ThriveApp.number_counter();
			ThriveApp.progress_bar();
		}
	} );
};

var _overlayElement = jQuery( '.galleryOverlay' );

ThriveApp.blog_gallery = (
	function ( $ ) {
		return function () {
			var currentImageIndex = 0,
				timer = 0;

			function createGalleryItem( $link, $container ) {
				$( '<div class="galleryWrapper"><img data-pos="' + $link.attr( 'data-position' ) + '" data-cap="' + $link.attr( 'data-caption' ) + '" data-index="' + $link.attr( 'data-index' ) + '" src="' + $link.attr( 'data-src' ) + '" alt=""/></div>' )
					.appendTo( $container );
			}

			function showImage( $container, index, animate ) {
				if ( ! animate ) {
					$container.addClass( 'g-n-a' );
				} else {
					$container.removeClass( 'g-n-a' );
				}

				var toBeShown = $container.find( 'img[data-index=' + index + ']' ),
					_cap = toBeShown.attr( 'data-cap' ),
					_pos = toBeShown.attr( 'data-pos' );

				index = toBeShown.parent().index();
				$container.css( {
					left: '-' + (
						index * 100
					) + '%'
				} );
				currentImageIndex = index;
				if ( ThriveApp.winWidth > 650 ) {
					positionCloseBtn( toBeShown );
				}
				jQuery( '.img_count' ).text( _pos );
				jQuery( '.cap_txt' ).text( _cap );
				if ( _cap != "" ) {
					jQuery( ".mob_text" ).text( _cap );
				} else {
					jQuery( ".mob_text" ).text( " - Swipe left/right to see more" );
				}
			}

			function positionCloseBtn( $img ) {
				var $closeBtn = $img.parents( '.galleryOverlay' ).first().find( '.nav_close' );
				if ( ! $img.width() ) {
					return $closeBtn.css( {
						top: '20px',
						right: '20px'
					} );
				}
				var l = $img.position().left - $img.parent().position().left + $img.width(),
					t = $img.position().top;

				if ( $img.width() >= ThriveApp.winWidth ) {
					l -= 16;
					t += 16;
				}

				if ( _isAdmin && $img.position().top <= 32 ) {
					t += 32;
				}

				$closeBtn.css( {
					top: (
						     t - 16
					     ) + 'px',
					left: (
						      l - 16
					      ) + 'px'
				} );
			}

			$( '.gallery' ).each( function () {
				var $gallery = $( this ), // images container
					$overlay = $( this ).find( '.galleryOverlay' ),
					$stage = $( this ).find( '.galleryStage' ),
					total = $gallery.find( '.gallery-item a' ).length,
					isOpen = false,
					animating = false,
					showNext = function () {
						if ( animating ) {
							return;
						}
						if ( currentImageIndex < total - 1 ) {
							showImage( $stage, currentImageIndex + 1, true );
						} else {
							$stage.addClass( 'g-n-a' ).css( 'left', '100%' );
							animating = true;
							setTimeout( function () {
								showImage( $stage, 0, true );
								animating = false;
							}, 20 );
						}
					},
					showPrev = function () {
						if ( animating ) {
							return;
						}
						if ( currentImageIndex > 0 ) {
							showImage( $stage, currentImageIndex - 1, true );
						} else {
							$stage.addClass( 'g-n-a' ).css( 'left', - 100 * (
								total
							) + '%' );
							animating = true;
							setTimeout( function () {
								showImage( $stage, total - 1, true );
								animating = false;
							}, 20 );
						}
					};

				$gallery.find( '.gallery-item a' ).each( function ( index ) {
					$( this ).click( function () {
						isOpen = true;
						$overlay.show( 0 ).addClass( 'g-v' );
						showImage( $stage, index, false );
						return false;
					} );
					createGalleryItem( $( this ), $overlay.find( '.galleryStage' ) );
				} );

				$gallery.find( 'a.nav_prev' ).click( function () {
					showPrev();
					return false;
				} );
				$gallery.find( 'a.nav_next' ).click( function () {
					showNext();
					return false;
				} );
				$gallery.find( '.nav_close' ).click( function () {
					isOpen = false;
					$overlay.removeClass( 'g-v' ).hide();
					return false;
				} );
				$gallery.find( '.galleryWrapper' ).touchwipe( {
					wipeLeft: function () {
						showNext();
					},
					wipeRight: function () {
						showPrev();
					},
					wipeUp: function () {
						isOpen = false;
						$overlay.removeClass( 'g-v' ).hide();
					},
					wipeDown: function () {
						return false
					},
					min_move_x: 20,
					min_move_y: 20,
					preventDefaultEvents: true
				} );
				if ( ThriveApp.winWidth <= 650 ) {
					$stage.click( function () {
						var $target = $( e.target );
						if ( $target.is( 'img' ) ) {
							return false;
						}
						isOpen = false;
						$overlay.removeClass( 'g-v' ).hide();
//                    jQuery(".gl_ctrl_mob").toggle();
//                    return false;
					} );
				} else {
					$stage.click( function ( e ) {
						var $target = $( e.target );
						if ( $target.is( 'img' ) ) {
							return false;
						}
						isOpen = false;
						$overlay.removeClass( 'g-v' ).hide();
					} );
					$gallery.mousemove( function ( e ) {
						clearTimeout( timer );
						$( '.gl_ctrl, .gl_ctrl_mob' ).fadeIn( 200 );
						if ( ThriveApp.winWidth <= 650 ) {
							return;
						}
						if ( ! $( e.target ).is( '.gl_ctrl,.gl_ctrl_mob' ) ) {
							timer = setTimeout( function () {
								jQuery( '.gl_ctrl, .gl_ctrl_mob' ).fadeOut( 200 );
							}, 1000 );
						}
					} );
				}
				$( 'html' ).unbind( 'keydown' ).keydown( function ( e ) {
					if ( ! isOpen ) {
						return true;
					}
					if ( e.keyCode == 37 ) {
						showPrev();
						return false;
					}
					if ( e.keyCode == 39 ) {
						showNext();
						return false;
					}
					if ( e.keyCode == 27 ) {
						$overlay.removeClass( 'g-v' ).hide();
						return false;
					}
				} );
			} );
		}

	}( jQuery )
);

jQuery.fn.thrive_timer = function () {
	return this.each( function () {
		var el = jQuery( this ),
			server_time = el.attr( 'data-server-now' ),
			now = server_time ? new Date( server_time ) : new Date(),
			event_date = new Date( el.attr( 'data-date' ) ),
			day = 0, hour = 0, min = 0, sec = 0, day_digits = 2,
			fade = el.attr( 'data-fade' ),
			message = el.attr( 'data-message' ),
			interval_id;

		/* utility functions */
		/**
		 * setup html <span>s to hold each of the digits making up seconds, minutes, hours, days
		 *
		 * check the number of digits required for days (this might be bigger than 2)
		 */
		var htmlSetup = function () {

			/**
			 * create a new span containing the value
			 *
			 * @param index
			 * @param value
			 * @returns {jQuery|jQuery}
			 * @private
			 */
			var _span = function ( index, value ) {
				return jQuery( '<span class="part-' + index + '">' + value + '</span>' );
			}
			el.find( '.second .cdfc' )
			  .append( _span( 2, Math.floor( sec / 10 ) ) )
			  .append( _span( 1, sec % 10 ) );
			el.find( '.minute .cdfc' )
			  .append( _span( 2, Math.floor( min / 10 ) ) )
			  .append( _span( 1, min % 10 ) );
			el.find( '.hour .cdfc' )
			  .append( _span( 2, Math.floor( hour / 10 ) ) )
			  .append( _span( 1, hour % 10 ) );

			var $dayContainer = el.find( '.day .cdfc' ),
				total_days = day;
			for ( var i = 1; i <= day_digits; i ++ ) {
				$dayContainer.append( _span( i, total_days % 10 ) );
				total_days = Math.floor( total_days / 10 );
			}
			setValues( $dayContainer.css( 'min-width', (
				                                           28 * day_digits
			                                           ) + 'px' ), day, day_digits );
		};

		/**
		 * if value is the same as current value, do nothing, else, we need to create animation
		 *
		 * @param $part
		 * @param value
		 */
		var setValue = function ( $part, value ) {
			if ( $part.html() == value ) {
				return $part;
			}
			$part.removeClass( 'next' );
			//create another span, and insert it before the original part, in order to animate it nicely
			var _new = $part.clone().removeClass( 'go-down' ).addClass( 'next' ).html( value );
			$part.before( _new ).next( '.go-down' ).remove();
			$part.addClass( 'go-down' );
			setTimeout( function () {
				_new.addClass( 'go-down' );
			}, 20 );

			return $part;
		};

		/**
		 * set each of the new values on a group (seconds, minutes, hours, days)
		 * @param container
		 * @param value
		 * @param number_length
		 */
		var setValues = function ( container, value, number_length ) {

			if ( typeof number_length === 'undefined' ) {
				number_length = false;
			}
			var index = 0;
			if ( value <= 99 ) {
				setValue( container.find( '.part-1' ).first(), value % 10 );
				setValue( container.find( '.part-2' ).first(), Math.floor( value / 10 ) );
				index = 2;
			} else {
				while ( value ) {
					index ++;
					setValue( container.find( '.part-' + index ).first(), value % 10 );
					value = Math.floor( value / 10 );
				}
			}
			if ( number_length !== false && index < number_length ) {
				for ( var i = index + 1; i <= number_length; i ++ ) {
					setValue( container.find( '.part-' + i ).first(), 0 );
				}
			}
		}

		/**
		 * called every second, it decrements the time and updates the HTML accordingly
		 */
		var step = function () {
			sec --;

			if ( sec < 0 ) {
				sec = 59;
				min --;
			}
			if ( min < 0 ) {
				min = 59;
				hour --;
			}
			if ( hour < 0 ) {
				hour = 23;
				day --;
			}
			setValues( el.find( '.second .cdfc' ), sec );
			setValues( el.find( '.minute .cdfc' ), min );
			setValues( el.find( '.hour .cdfc' ), hour );
			setValues( el.find( '.day .cdfc' ), day, day_digits );

			if ( day == 0 && hour == 0 && min == 0 && sec == 0 ) {
				//done!
				clearInterval( interval_id );
				finished();
			}
		}

		/**
		 * finished counting, or the event time is somewhere in the past
		 */
		var finished = function () {
			if ( fade == '1' ) {
				el.find( '.cdti' ).addClass( 'fdtc' );
			} else {
				el.find( '.cdti' ).addClass( 'fv' );
			}
			if ( message == '1' ) {
				el.find( '.cdti' ).addClass( 'fdtc' );
				setTimeout( function () {
					el.find( '.cdtm' ).fadeIn( 2000 );
				}, 500 );
			}
		}

		if ( now > event_date ) {
			finished();
		} else {

			sec = Math.floor( (
				                  event_date.getTime() - now.getTime()
			                  ) / 1000 );
			min = Math.floor( sec / 60 );
			sec = sec % 60;
			hour = Math.floor( min / 60 );
			min = min % 60;
			day = Math.floor( hour / 24 );
			hour = hour % 24;
			if ( day > 99 ) {
				day_digits = day.toString().length;
			}

			htmlSetup();
			el.find( '.cdti' ).addClass( 'init_done' );
			// setup the interval function
			interval_id = setInterval( step, 1000 );
		}
	} );
}

jQuery( window ).scroll( function () {
	var position = jQuery( document ).scrollTop();
	ThriveApp.show_shortcodes( position );
	if ( ThriveApp.hasFloatingMenu && ThriveApp.is_singular == '1' ) {
		ThriveApp.menu_float.onScroll( position );
	}
} );
ThriveApp._get_share_count_display_text = function ( number, decPlaces ) {
	decPlaces = Math.pow( 10, decPlaces );
	var abbrev = ["k", "m"];
	for ( var i = abbrev.length - 1; i >= 0; i -- ) {
		var size = Math.pow( 10, (
			                         i + 1
		                         ) * 3 );
		if ( size <= number ) {
			number = Math.round( number * decPlaces / size ) / decPlaces;
			if ( (
				     number == 1000
			     ) && (
				     i < abbrev.length - 1
			     ) ) {
				number = 1;
				i ++;
			}
			number += abbrev[i];
			break;
		}
	}
	return number;
};
ThriveApp.resize_blank_page = function () {
	_is_blankPage = jQuery( 'html.bp-th' ).length;
	if ( _is_blankPage ) {
		var contentHeight = jQuery( '.wrp' ).outerHeight(),
			$body = jQuery( 'body' );
		if ( ThriveApp.viewportHeight >= contentHeight ) {
			$body.css( 'height', ThriveApp.viewportHeight );
		} else {
			$body.css( 'height', contentHeight );
		}
	}
};