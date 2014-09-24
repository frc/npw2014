$(function() {
	var TOPIC_CHANGE_INTERVALL = 30000;

/*  -- DISABLED due to not working with slow connections

	$('.js-nav-link').on('click', function(event){
		event.preventDefault();
		var url = $(this).attr('href');


		$('body').removeClass('menu-open');
		setTimeout( function(){
			window.location.href = url;
		}, 450);

	});
	*/

	// To track elements visible in viewport
	function isElementInViewport (el) {
		var rect = el.getBoundingClientRect();
		return (
			Math.abs(rect.top) < ( window.innerHeight/2 ) &&
			Math.abs(rect.bottom) >=  ( window.innerHeight/2 ) // (window.innerHeight || document.documentElement.clientHeight)
		);
	}
	// Destroy non-js elements and loader and stuff
	$('.js-destroy').remove();
	/*
		****************************************
		-- Section/viewport anchor formats
		****************************************
	*/
	// Function to show anchors. Called only if anchor links exist on the page.
	/*function showAnchors(scrolling){
		if( scrolling ){
			$('.js-section-anchor').stop().fadeOut(100);
		}
		if( !scrolling ){
			$('.js-section-anchor').stop().fadeIn(300);
		}
	}*/
	// Call on if exists.
	/*
	if( $('.js-section-anchor').length ){
		// Destroy the last anchor
		//$('.js-section-anchor').last().remove();
		// Show anchors with 2s delay once.

		// Watch the scroll and hide if scrolling, but show after 2s idle.
		var newtimer = null;
		$(window).scroll(function(){
			$('.js-section-anchor').stop().fadeOut(100);
			if( newtimer !== null ) {
				clearTimeout( newtimer );
			}
			newtimer = setTimeout(function() {
				$('.js-section-anchor').stop().fadeIn(100);
			}, 750 );
		});

	}*/
	// Menu actions
	$('#mobile').on('click', function(){

		if( $('body').hasClass('menu-open') ){
			// Closing menu.
			//document.cookie = 'menu_open=false';
		}/*else{
			// Opening menu.
			document.cookie = 'menu_open=true';
		}*/

		$('.icon-menu').removeClass('paused'); // Animation starts paused.
		$('body').toggleClass('menu-open');
	});
	// Variables
	var resizeid,
			changeid,
			windowheight,
			navheight,
			real_height,
			vph,
			viewports = $(".viewport"),
			images_to_replace = $(".js-replace-image"),
			placeholder_img = $('.placeholder-content-image');

		if( $('#js-first-content').length > 0 ){
			var el_top = $('#js-first-content').offset().top;
		}

	// Lazyload people images. Important to load before any player scripts are called.
	if( $('.people-wrapper').length ){
		$('.js-ll-person').each( function(){
			$(this).attr("src", $(this).attr('data-src') );
		});
		$('.js-ll-video').each(function(){
			$(this).attr("src", $(this).attr('data-src') );
		});
	}
	/*
		****************************************
		-- Resize listener and set viewport size
		****************************************
	*/
	window.onresize = function(){
		//sets the height of .viewport elements
		clearTimeout(resizeid);
		resizeid = setTimeout(setViewportHeight, 500);

		//changes case images when resizing on desktop
		clearTimeout(changeid);
		if(device.desktop()){
			if( $('.single-case').length > 0 ){
				changeDesktopCaseImage();
				setPlaceholderImagePosition();
				changeCaseImage();
			}

			// And then remove unnecessary load-more-notes -buttons if they exist.

			if( $('.notes-wrapper').length > 0 && $('.js-load-notes').length > 1 ){

				$('.js-load-notes').each( function(){
					if( $(this).parent().css('display') == 'block' && $(this).parent().next('.viewport').css('display') != 'none' ){
						$(this).remove();
					}
				});
			}
		}
	}
	function setViewportHeight(){
		navheight = $(".nav-header").outerHeight();
		windowheight = window.innerHeight;
		real_height = windowheight - navheight;
		var it = 0;
		// if it's mobile, we only wanna affect video viewports. Catch it with .viewport.video-wrapper-outer
		if( device.mobile() ){
			if( $('.video-wrapper-outer').length ){
				$('.video-wrapper-outer').each(function(){
					$(this).css({ 'height': real_height+'px'});
				});
			}
		}else{
			//if viewport content is too long, we set the height to be min-height instead of height
			viewports.each(function(){
				// This is the height of .viewport element.
				vph = $(this)[0].scrollHeight;

				// If viewport's height is bigger than window's height...
				if(vph > real_height && it != 0){
					// Give it only minimum height and unset height
					$(this).css({ 'min-height': real_height+'px', 'height': ''});
				
				}else if(vph > real_height && it==0){
					$(this).css({ 'min-height': real_height+'px', 'height': ''});

				// This is quite... mainly use is to hide the bug described in the comment ahead
				}else if ( window.innerWidth < 768 ){
					$(this).css('height','auto').css({ 'min-height': '400px'});
				}
				else{	
					// If it's not first element and it's height is less than window height.
					// Bug at 676px height, while win.h=756 and navheight = 80, so real.h=676
					$(this).css({ 'height': real_height+'px'});
					
				}
				it++;
			});
		}
	}
	/*
		*******************
		-- Hide extra notes
		*******************
	*/
	var current = 1;
	$('.notes-wrapper .viewport').slice(current).hide();

	//show a new group of notes

	$('.js-load-notes').on('click', function(){
		if( device.mobile() || device.tablet() || window.innerWidth < 768 ){
			current++;
			$('.notes-wrapper .viewport:nth-child('+current+')').fadeIn('slow');
			$('html, body').animate({
					scrollTop: $('.notes-wrapper .viewport:nth-child('+current+')').offset().top - $(".nav-header").outerHeight()
			}, 100 );
			$(this).remove();
		}
	});

	$(window).scroll(function(){
		if( device.desktop() && window.innerWidth >= 768 ){
			var win = $(window);
			var doc = $(document);
			if( $('.notes-wrapper').length > 0 && win.scrollTop() == doc.height() - win.height() ) {
				current++;
				$('.notes-wrapper .viewport:nth-child('+current+')').fadeIn('slow');
			}
			// If cases page and have cases. Would suck if there were none.
			if( $('.single-case').length > 0 ){
				changeCaseImage();

				setPlaceholderImagePosition();
				// Breakpoint is

			}
			// Calculate nav here.
			if( $('body').hasClass('menu-open') && ( $(window).scrollTop() + $(".nav-header").outerHeight() ) > ( $('#js-first-content').offset().top/2 ) ){ // && if cookie[override_navigation] etc
				// Do cookie checks here.
				$('body').removeClass('menu-open');
			}
		}
		setShadow();
	});
	/*
		***********************
		-- Calculate header shadow
		***********************
	*/
	function setShadow(){
		el_top = $('#js-first-content').offset().top;
		// If window scrolltop is larger than the distance between it and the first element, add shadow
		if( ( $(window).scrollTop() + $(".nav-header").outerHeight() ) > el_top ){
			$('.nav-header').addClass('box-shadow');
		}else if( ( $(window).scrollTop() + $(".nav-header").outerHeight() ) < el_top ){
			$('.nav-header').removeClass('box-shadow');
		}
	}
	/*
		***********************
		-- Newsletter functions
		***********************
	*/
	//show submit button only if input field has text
	$(".newsletter__email").keyup(function(){
		var emailaddr = $(this).val();
		if (emailaddr !== ""){
			$(".newsletter__submit").removeClass('hidden');

			if(simpleValidateEmail(emailaddr)) {
				$(".newsletter__submit").removeClass('inactive');
			}
			else {
				$(".newsletter__submit").addClass('inactive');
			}
		}
		else{
			$(".newsletter__submit").addClass('hidden');
		}
	});

	$(".newsletter__submit").click(function(event) {
		// do something
	});

	function simpleValidateEmail(addr){
		var re = /\S+@\S+\.\S+/;
		return re.test(addr);
	}

	/*
		*****************
		-- Chaging topics
		*****************
	*/
	var topics =
	{
		"notes": [
					"Watch and learn, dude. Watch and learn.",
					"We’re giving you the knowledge. Use it wisely.",
					"The truth, the whole truth and nothing but the truth.",
					"One day we’ll write a book.",
					"You heard it from us first.",
					"Here’s our two cents. "
		],
		"careers": [
					"We don’t offer jobs, we offer a lifestyle.",
					"Oh, you're a nerd too? Great!",
					"Don’t like our website? Come make a better one.",
					"Wizards, witches and weirdos wanted.",
					"Life is short. Work somewhere awesome.",
					"Got mad skills? Wow us."
		],
		"people": [
					"We’re mostly hipsters. Mostly.",
					"Meet the rockstars. But no autographs, please.",
					"Meet the Jedi Knights of the internet.",
					"We’re like the mafia. It’s a family business.",
					"We’re awesome. But humble about it.",
					"We are the ones who knock."
		],
		"cases": [
					"Look mom, we made all these cool things.",
					"We made the web. At least the best parts of it.",
					"Rocking the interwebs since 1996.",
					"1.000 projects delivered. Big and small.",
					"Internet. That’s our sh*t.",
					"Practice makes perfect. Since 1996."
		],
		"contact": [
					"Just imagine what we could do together.",
					"Talk to me, baby.",
					"Calling the mothership.",
					"We’re just a few clicks away.",
					"Just one call. That’s all it takes.",
					"Who you gonna call."
		],
		"events": [
					"Party like it’s 1999.",
					"We only party with cool people.",
					"Dresscode: nerdy casual.",
					"What happens in Frantic, stays in Frantic.",
					"Bet you’d love an invite.",
					"VIPs only."
		]
	};
	var current_topic = 0, is_shuffled = false;
	// randomise topics for current page
	function shuffleTopics(topic, path) {
		var i, j, temp;

		for(i = topics[path].length-1; i > 0; i--) {
			j = Math.floor(Math.random() * i);
			temp = topic[i];
			topic[i] = topic[j];
			topic[j] = temp;
		}
		is_shuffled = true;
	}

	function changeTopic(){
		var path = window.location.pathname;
		path = path.substring(1, path.length-1);

		if (isPage(path)) {
			if(!is_shuffled){
				shuffleTopics(topics[path], path);

				// make sure first topic in array doesn't match hardcoded h1 text on page
				if ( topics[path][0] === $('h1').text() ) {
					current_topic = 0;
				}
			}

			$(".viewport--"+path+" .main-block h1").fadeOut('slow', function() {
				$(this).html(topics[path][current_topic]).fadeIn('slow', function() {

					if (++current_topic >= topics[path].length) {
						current_topic = 0;
					}
				});
			});
		}
	}

	function isPage(path){
		return topics.hasOwnProperty(path);
	}

	window.setInterval(function(){changeTopic()}, TOPIC_CHANGE_INTERVALL);
	/*
		****************
		-- Image replace
		****************
	*/
	function selectCaseImage(device){
		images_to_replace.each( function() {
			var devices = {
				tablet : $(this).data('tablet'),
				mobile : $(this).data('mobile'),
				desktop : $(this).data('desktop')
			}
			$(this).fadeOut(0, function(){
				$('body').removeClass('simulate-tablet simulate-mobile simulate-desktop').addClass('simulate-'+device);
				$(this).attr('src', devices[device] ).fadeIn(700);
				setViewportHeight();
			});

		});
	}
	/*
		****************
		-- Change case image to placeholder slot.
		****************
	*/
	var current_img; // Variable for old/previous image

	function changeCaseImage(){
		var case_img;
		$('.single-case').each(function(){
			if( isElementInViewport( $(this)[0] ) ){
				// Get the possibly new image.
				case_img = $(this).find('.case-image').attr('src');
				// Get the current displayed image
				current_img = placeholder_img.attr('src');

				// If the current image is the same as new image, we dont want to do any effects, otherwise we wanan crossfade.
				if( current_img != case_img ){
					placeholder_img.fadeOut(100, function(){
						placeholder_img.attr('src', case_img).fadeIn(50);
					});
				}
			}
		});
	}
	/*
		****************
		-- Placeholder image position when nearing top or bottom.
		****************
	*/
	function setPlaceholderImagePosition(){
		if( $('.single-case').length > 0 ){
			var first_case_block = $('.first-case').find('.case-block');
			var last_case_block = $('.last-case').find('.case-block');

			// Breakpoint at the top.
			var breakpoint_top = ( first_case_block.offset().top + ( first_case_block[0].scrollHeight/2) ) - ( window.innerHeight/2 ); // 655
			// Breakpoint at the bottom
			var breakpoint_bottom = ( last_case_block.offset().top + ( last_case_block[0].scrollHeight/2 ) ) - ( window.innerHeight/2 );
			// Helper
			var scrollBottom = $(window).scrollTop() + $(window).height();

			if( breakpoint_top > $(window).scrollTop() ){
				$('.js-placeholder-image').addClass('freeze');
				$('.freeze').css('top', first_case_block.offset().top );
			}
			else if( breakpoint_bottom < $(window).scrollTop() ){
				$('.js-placeholder-image').addClass('freeze');
				$('.freeze').css('top', last_case_block.offset().top );
			}
			else{
				$('.freeze').css('top', '');
				$('.js-placeholder-image').removeClass('freeze');
			}
		}
	}
	if( $('.single-case').length > 0 ){
		setPlaceholderImagePosition();
	}

	if(device.mobile()){
		selectCaseImage('mobile');
	}else if( device.tablet() || device.androidTablet() ){
		selectCaseImage('tablet');
	}else{
		selectCaseImage('desktop');
	}
	/*
		****************************************
		-- Change case image on resize of desktop
		****************************************
	*/
	var olddevice = "desktop";

	function changeDesktopCaseImage(){
		var currentdevice;
		var width = window.innerWidth;

		if( device.androidTablet() ) {
			currentdevice = 'tablet';
		}else if(width < 768){
			currentdevice = "mobile";
		}else if(width >= 768 && width <= 1132){
			currentdevice = "tablet";
		}else{
			currentdevice = "desktop";
		}

		if(currentdevice != olddevice){
			selectCaseImage(currentdevice);
			olddevice = currentdevice;
		}
		setViewportHeight();
	}
	changeDesktopCaseImage();
	setPlaceholderImagePosition();
	/* Load */
	$('.js-load').removeClass('js-load');
	$('body').addClass('ready');


	/*
		***************
		-- Video player
		***************
	*/
	if( $('.video-wrapper-outer').length ){
		var f = $('.frc-player'),
			url = f.attr('src').split('?')[0];

		$('.video-description').on('click', function(){
			$(this).parent().toggleClass('active inactive');
			$(this).parent().siblings('iframe').removeClass('hide-video inactive');
			$('.video-wrapper-outer').find('.frc-player').each(function(){
				$(this)[0].contentWindow.postMessage( JSON.stringify({ method: "pause" }), url );
			});
			$(this).parent().siblings('.frc-player')[0].contentWindow.postMessage( JSON.stringify({ method: "play" }), url );

		});

		$('.video-close').on('click', function(){
				$(this).siblings('.flex-wrap').toggleClass('inactive active');
				$(this).siblings('iframe').addClass('inactive');
				$(this).addClass('hidden');
		});

		// Add identifiers to f's parent
		var counter = 1;
		f.each( function(){
			$(this).parent().addClass('vidw-'+counter);
			counter++;
		});

		// Listen for messages from the player
		if (window.addEventListener){
				window.addEventListener('message', onMessageReceived, false);
		}
		else {
				window.attachEvent('onmessage', onMessageReceived, false);
		}

		// Handle messages received from the player
		function onMessageReceived(e) {
				var data = JSON.parse(e.data);
				var id = data.player_id;
				switch (data.event) {
						case 'ready':
								onReady();
								break;

						case 'pause':
								onPause(id);
								break;

						case 'play':
								onPlay(id);
								break;

						case 'finish':
								onFinish(id);
								break;
				}
		}
		// Helper function for sending a message to the player
		function post(action, value) {
				var data = { method: action };
				if (value) {
						data.value = value;
				}
				f.each( function(){
					$(this)[0].contentWindow.postMessage(JSON.stringify(data), url);
				});
		}
		function onReady() {
				//status.text('ready');
				post('addEventListener', 'pause');
				post('addEventListener', 'play');
				post('addEventListener', 'finish');
		}
		function onPause(id) {
				// On pause
				$('.vidw-'+id).find('.video-close').removeClass('hidden');
		}
		function onPlay(id){
				// On play
				$('.vidw-'+id).find('.video-close').addClass('hidden');
		}
		function onFinish(id) {
				// On finish bring up the overlay element
				var vid_wrapper = $('.vidw-'+id);
				var overlay = vid_wrapper.find('.flex-wrap');
				overlay.toggleClass('inactive active');
				vid_wrapper.find('iframe').addClass('inactive');

				// Just to make sure
				if( !vid_wrapper.find('.video-close').hasClass('hidden') ){
					vid_wrapper.find('.video-close').addClass('hidden');
				}
		}
	} // ------ end of video controls

	// Disqus/comments display
	if( $('.single-note').length ){
		$('.js-comments').on('click', function(){
			$('#disqus_thread').toggleClass('hidden');
		});
	}

	// Add anchor link scroll if page has more .viewports than 1 (so there's actually something to scroll to) and it's not notes-page.
	if( $('.viewport').length > 1 && !$('.viewport--notes').length ){
		var scroll_target;

		$('.page-aside').find('a').on('click', function(event){
			event.preventDefault();
			scroll_target = $(this).attr('href');
			$('html, body').animate({
				scrollTop: $(scroll_target).find('.flex-wrap').offset().top - $(".nav-header").outerHeight()
			}, 500 );
		});
	}
	// Scroll to top for breadcrumbs.
	$('.js-scroll-to-top').on('click', function(){
		$('html, body').animate({
			scrollTop: 0
		}, 500 );
	});
	// Scroll to next viewport-element
	/*
	$('.js-section-anchor').on('click', function(){
		var el;
		viewports.each(function(){
			if( isElementInViewport( $(this)[0] ) ){
				el = $(this);
			}
		});
		if(el.length > 0){
			pressToScroll( el.next() );
		}
	});
	*/
	// On keypress events
	document.onkeydown = checkKey;

	function pressToScroll(target){
		$('html, body').animate({
			scrollTop: target.offset().top - $(".nav-header").outerHeight()
		}, 250 );
	}

	function checkKey(e) {
		var el;
		viewports.each(function(){
			if( isElementInViewport( $(this)[0] ) ){
				el = $(this);
			}
		});
		e = e || window.event;

		if (e.keyCode == '38') {
			// up arrow
			pressToScroll( el.prev() );
		}
		else if (e.keyCode == '40') {
			// down arrow
			pressToScroll( el.next() );
		}
	}

	setViewportHeight();

	// Mobile swipes on single note pages.
	/*
	if( $('.single').length ){
		var back_to_notes = $('#js-notes-link').attr('href');
		var to_next_note = $('.teaser-title:first-of-type').attr('href');

		$('body').on('swipe', function(){ console.log('event'); })

		$('body').on('swipeleft', function(event){
			window.location.href = back_to_notes;
		});
		$('body').on('swiperight', function(event){
			window.location.href = to_next_note;
		});
	}*/
});