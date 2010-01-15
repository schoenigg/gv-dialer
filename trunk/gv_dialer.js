/**
 * @author Osama Ibrahim
 */
(function($){
	$.extend($.expr[':'], {
		focus: function(elem){
			return (elem === document.activeElement);
		}
	});
	
	$.fn.autoResize = function(html){
		return this.each(function(){
			if ($(this).is(':empty') || !$(this).data('origWidth')) {
				$(this).data('origWidth', $(this).width());
			}
			
			var origWidth = $(this).data('origWidth');
			
			var elem = $('#dummy');
			
			if (elem.length < 1) {
				elem = $(this).clone().attr('id', 'dummy').css({
					display: 'none',
					width: 'auto',
					height: 'auto'
				}).appendTo('body');
			}
			
			elem.html(html);
			
			var oldWidth = ($(this).width() > origWidth) ? $(this).width() : origWidth;
			var oldHeight = $(this).height();
			var newWidth = (elem.width() > origWidth) ? elem.width() : origWidth;
			var newHeight = elem.height();
			var oldOpacity = (oldHeight) ? 1 : 0;
			var newOpacity = (newHeight) ? 1 : 0;
			
			if (html) {
				$(this).html(html);
			}
			
			$(this).css({
				display: 'block',
				width: oldWidth,
				height: oldHeight,
				opacity: oldOpacity
			}).data('expanded', newHeight).stop(true, false).animate({
				width: newWidth,
				height: newHeight,
				opacity: newOpacity
			}, 150, function(){
				$(this).css({
					width: '',
					height: ''
				});
				
				if (!newHeight) {
					$(this).empty().css('display', 'none');
				}
			});
		});
	};
	
	$.fn.toggleAutoResize = function(html){
		return this.each(function(){
			if ($(this).data('expanded')) {
				$(this).data('expanded', false).autoResize(null);
			}
			else {
				$(this).data('expanded', true).autoResize(html);
			}
		});
	};
	
	$.fn.openAutoResize = function(html, callback){
		return this.each(function(){
			if (!$(this).data('expanded')) {
				$(this).autoResize(html);
				
				if (callback) {
					callback(false);
				}
			}
			else if (callback) {
				callback(true);
			}
		});
	};
	
	$.fn.closeAutoResize = function(callback){
		return this.each(function(){
			if ($(this).data('expanded')) {
				$(this).autoResize('');
				
				if (callback) {
					callback(false);
				}
			}
			else if (callback) {
				callback(true);
			}
		});
	};
	
	$.fn.highlightText = function(options){
		var defaults = {
			fadeInSpeed: 100,
			fadeOutSpeed: 200,
			innerInterval: 50
		};
		
		options = $.extend(defaults, options);
		
		return this.each(function(){
			if ($(this).text().length) {
				var children = $(this).children();
				var textOnly = children.remove().end().text().trim();
				
				$(this).html(jQuery.map(textOnly.split(''), function(letter){
					return '<span>' + letter + '</span>';
				}).join('')).append(children);
			}
			
			$(this).children('span').each(function(i, letter){
				setTimeout(function(){
					$(letter).animate({
						opacity: '0.3'
					}, options.fadeOutSpeed).animate({
						opacity: '1.0'
					}, options.fadeInSpeed, function(){
						$(this).removeAttr('style');
					});
				}, i * options.innerInterval);
			});
		});
	};
	
	$.fn.createButton = function(){
		/*
		 * <div class='button'>
		 * 		<div class='button-content'>
		 * 			<!--[ORIGINAL CONTENT HERE]-->
		 * 		</div>
		 * </div>
		 */
		return this.each(function(){
			var origContent = $(this).html();
			$(this).empty().addClass('button').mousedown(function(event){
				if (event.which === 1) {
					if (!$(this).is(':focus')) {
						$('*:focus').blur();
						$(this).focus();
					}
					
					var self = $(this).addClass('button-active');
					
					$(window).bind('mouseup.gvDialer', function(){
						self.removeClass('button-active');
						$(window).unbind('mouseup.gvDialer');
					});
					
					return false;
				}
			}).mouseup(function(){
				$(this).removeClass('button-active');
			}).click(function(event){
				if ($(this).hasClass('button-disabled')) {
					event.stopImmediatePropagation();
				}
			}).hover(function(){
				$(this).addClass('button-hover');
			}, function(){
				$(this).removeClass('button-hover');
			}).focus(function(){
				$(this).addClass('button-focus');
			}).blur(function(){
				$(this).removeClass('button-focus').removeClass('button-active');
			}).keydown(function(event){
				if (event.which === 13) {
					$(this).click();
				}
				
				if (event.which === 32) {
					$(this).addClass('button-active').addClass('button-hover');
					return false;
				}
			}).keyup(function(){
				if (event.which === 32) {
					$(this).removeClass('button-active').removeClass('button-hover');
					$(this).click();
				}
			});
			
			
			$('<div class="button-content"/>').append(origContent).appendTo($(this));
		});
	};
	
	$.fn.createToolbarItem = function(){
		/*
		 *	<div class='toolbar-item'>
		 *		<div class='toolbar-item-content'>
		 *			<!--[ORIGINAL CONTENT HERE]-->
		 *		</div>
		 *	</div>
		 * */
		return $(this).each(function(){
			var origContent = $(this).html();
			$(this).empty().addClass('toolbar-item').mousedown(function(event){
				if (event.which === 1) {
					if (!$(this).is(':focus')) {
						$('*:focus').blur();
						$(this).focus();
					}
					
					var self = $(this).addClass('toolbar-item-active');
					
					$(window).bind('mouseup.gvDialer', function(){
						self.removeClass('toolbar-item-active');
						$(window).unbind('mouseup.gvDialer');
					});
					
					return false;
				}
			}).mouseup(function(){
				$(this).removeClass('toolbar-item-active');
			}).click(function(event){
				if ($(this).hasClass('toolbar-item-disabled')) {
					event.stopImmediatePropagation();
				}
			}).hover(function(){
				$(this).addClass('toolbar-item-hover');
			}, function(){
				$(this).removeClass('toolbar-item-hover');
			}).focus(function(){
				$(this).addClass('toolbar-item-focus');
			}).blur(function(){
				$(this).removeClass('toolbar-item-focus').removeClass('toolbar-item-active');
			}).keydown(function(event){
				if (event.which === 13) {
					$(this).click();
				}
				
				if (event.which === 32) {
					$(this).addClass('toolbar-item-active').addClass('toolbar-item-hover');
					return false;
				}
			}).keyup(function(){
				if (event.which === 32) {
					$(this).removeClass('toolbar-item-active').removeClass('toolbar-item-hover');
					$(this).click();
				}
			});
			
			$('<div class="toolbar-item-content"/>').append(origContent).appendTo($(this));
		});
	};
})(jQuery);

/**
 * The main global object for the application.
 */
var gvDialer = new (function(){
	var fadeOutDuration = 150;
	var fadeInDuration = 150;
	var slideDuration = 200;
	var callStatusTimeout = 20000;
	var maxSearchContactResult = 5;
	var gvoice = 'https://www.google.com/voice';
	var tmrQuickCallMsg;
	var tmrQuickSMSMsg;
	var gvChecker;
	var audioPlayer;
	
	/**
	 * Initialize the application and bind  the events handlers.
	 */
	this.init = function(){
		if (window.opener) {
			$('body').addClass('popout');
		}
		
		gvChecker = chrome.extension.getBackgroundPage().gvChecker;
		
		gvChecker.onDataUpdated.addListener(onGVDataUpdated);
		gvChecker.onMessagesUpdated.addListener(onMessagesUpdated);
		
		$(window).unload(function(){
			gvChecker.onDataUpdated.removeListener(onGVDataUpdated);
			gvChecker.onMessagesUpdated.removeListener(onMessagesUpdated);
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('.caption-button').mousedown(function(event){
			return false;
		});
		
		$('.caption-button-reload').click(reloadGVData);
		
		$('.caption-button-close').click(function(){
			window.close();
		});
		
		$('.caption-button-popout').click(function(){
			openPopup($('body').width(), $('body').height(), chrome.extension.getURL('popup.html'));
		});
		
		$('.caption-button-settings').click(function(){
			goToUrl(chrome.extension.getURL('options.html'));
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('.label-status').click(function(){
			goToUrl(gvoice);
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('.toolbar-item-call').createToolbarItem().click(function(){
			if (!$(this).hasClass('toolbar-item-selected')) {
				$('*:focus').blur();
				
				if (!$(this).siblings('.toolbar-item-selected').length) {
					$('.panel-sms').hide().css('opacity', '0');
					$('.panel-call').css({
						'opacity': 1,
						'display': 'inline-block'
					});
					
					$('.panels-holder').stop(true, true).animate({
						height: 'show',
						opacity: 'show'
					}, slideDuration, function(){
						$('.panel-call').find('*[tabindex]:first').focus();
					});
				}
				else {
					var oldHeight = $('.panel-sms').outerHeight(true);
					var newHeight = $('.panel-call').outerHeight(true);
					$({
						height: oldHeight,
						opacity: 1
					}).animate({
						height: newHeight,
						opacity: 0
					}, {
						duration: fadeOutDuration,
						
						step: function(now, fx){
							if (fx.prop == 'height') {
								$('.panels-holder')[0].style[fx.prop] = fx.now + fx.unit;
							}
							else if (fx.prop == 'opacity') {
								$('.panel-sms')[0].style[fx.prop] = fx.now;
							}
						},
						
						complete: function(){
							$('.panels-holder').height('auto');
							$('.panel-sms').hide();
							
							$('.panel-call').css({
								'opacity': 0,
								'display': 'inline-block'
							}).stop(true, true).animate({
								opacity: 1
							}, fadeInDuration, function(){
								$('.panel-call').find('*[tabindex]:first').focus();
							});
						}
					});
				}
				
				$(this).siblings('.toolbar-item-selected').removeClass('toolbar-item-selected').end().addClass('toolbar-item-selected');
			}
			else {
				$(this).removeClass('toolbar-item-selected');
				
				$('.panels-holder').stop(true, true).animate({
					height: 'hide',
					opacity: 'hide'
				}, slideDuration);
			}
		});
		
		$('.toolbar-item-sms').createToolbarItem().click(function(){
			if (!$(this).hasClass('toolbar-item-selected')) {
				$('*:focus').blur();
				
				if (!$(this).siblings('.toolbar-item-selected').length) {
					$('.panel-call').hide().css('opacity', '0');
					$('.panel-sms').css({
						'opacity': 1,
						'display': 'inline-block'
					});
					
					$('.panels-holder').animate({
						height: 'show',
						opacity: 'show'
					}, slideDuration, function(){
						$('.panel-sms').find('*[tabindex]:first').focus();
					});
				}
				else {
					var oldHeight = $('.panel-call').outerHeight(true);
					var newHeight = $('.panel-sms').outerHeight(true);
					
					$({
						height: oldHeight,
						opacity: 1
					}).animate({
						height: newHeight,
						opacity: 0
					}, {
						duration: fadeOutDuration,
						
						step: function(now, fx){
							if (fx.prop == 'height') {
								$('.panels-holder')[0].style[fx.prop] = fx.now + fx.unit;
							}
							else if (fx.prop == 'opacity') {
								$('.panel-call')[0].style[fx.prop] = fx.now;
							}
						},
						
						complete: function(){
							$('.panels-holder').height('auto');
							
							$('.panel-call').hide();
							
							$('.panel-sms').css({
								'opacity': 0,
								'display': 'inline-block'
							}).stop(true, true).animate({
								opacity: 1
							}, fadeInDuration, function(){
								$('.panel-sms').find('*[tabindex]:first').focus();
							});
						}
					});
				}
				
				$(this).siblings('.toolbar-item-selected').removeClass('toolbar-item-selected').end().addClass('toolbar-item-selected');
			}
			else {
				$(this).removeClass('toolbar-item-selected');
				
				$('.panels-holder').stop(true, true).animate({
					height: 'hide',
					opacity: 'hide'
				}, slideDuration);
			}
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('#forwardNumber').mousedown(function(event){
			if (event.which === 1) {
				$(this).find('.dd-list').stop(true, true).animate({
					opacity: 'toggle',
					height: 'toggle'
				}, slideDuration);
				
				$(this).find('.dd-menuItem-hover').removeClass('dd-menuItem-hover');
				
				if (!$(this).is(':focus')) {
					$('*:focus').blur();
					$(this).focus();
				}
				
				return false;
			}
		});
		
		$('#forwardNumber').blur(function(){
			$(this).find('.dd-menuItem-hover').removeClass('dd-menuItem-hover');
			
			$(this).find('.dd-list').stop(true, true).animate({
				opacity: 'hide',
				height: 'hide'
			}, slideDuration);
		});
		
		$('#forwardNumber').keydown(function(event){
			var curr = $(this).find('.dd-menuItem-hover');
			curr = (curr.length) ? curr : $(this).find('.dd-menuItem-selected');
			
			switch (event.which) {
				case 13: // Enter Key
					if ($(this).find('.dd-list').is(':visible')) {
						$('.dropdown .dropdown-text').text(curr.text()).attr('id', 'defaultPhone:' + (/phone:(\d+)/).exec(curr.attr('id'))[1]);
						curr.siblings('.dd-menuItem-selected').removeClass('dd-menuItem-selected').end().addClass('dd-menuItem-selected');
						
						$(this).find('.dd-list').stop(true, true).animate({
							opacity: 'hide',
							height: 'hide'
						}, slideDuration);
					}
					return false;
					
				case 32: // Space Key
					$(this).find('.dd-list').animate({
						opacity: 'show',
						height: 'show'
					}, slideDuration);
					curr.addClass('dd-menuItem-hover');
					break;
					
				case 38: // Arrow Up
					if ($(this).find('.dd-list').is(':visible')) {
						if (curr.prev().length) {
							curr.removeClass('dd-menuItem-hover').prev().addClass('dd-menuItem-hover');
						}
						else {
							curr.removeClass('dd-menuItem-hover');
							curr.parent().children(':last-child').addClass('dd-menuItem-hover');
						}
					}
					else {
						$(this).find('.dd-list').stop(true, true).animate({
							opacity: 'show',
							height: 'show'
						}, slideDuration);
						curr.addClass('dd-menuItem-hover');
					}
					break;
					
				case 40: // Arrow Down
					if ($(this).find('.dd-list').is(':visible')) {
						if (curr.next().length) {
							curr.removeClass('dd-menuItem-hover').next().addClass('dd-menuItem-hover');
						}
						else {
							curr.removeClass('dd-menuItem-hover');
							curr.parent().children(':first-child').addClass('dd-menuItem-hover');
						}
					}
					else {
						$(this).find('.dd-list').stop(true, true).animate({
							opacity: 'show',
							height: 'show'
						}, slideDuration);
						curr.addClass('dd-menuItem-hover');
					}
					break;
					
				default:
					break;
			}
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('.ac_contacts *[tabindex]').keydown(function(event){
			var ac_contacts = $(this).parents('.ac_contacts');
			var curr = ac_contacts.find('.dd-list .dd-menuItem-hover');
			
			switch (event.which) {
				case 13: // Enter Key
					if (curr.length) {
						if (ac_contacts.find('.dd-list').data('expanded')) {
							ac_contacts.find('.dd-list').autoResize(null);
							
							var id = /contact:(.+)/.exec(curr[0].id)[1];
							$(this).val(InboxManager.gvData.contactPhones[id].displayNumber);
							
							return false;
						}
					}
					return true;
					
				case 38: // Arrow Up.
					if (curr.prev().length) {
						curr.prev().addClass('dd-menuItem-hover');
						curr.removeClass('dd-menuItem-hover');
					}
					else {
						curr.removeClass('dd-menuItem-hover');
						curr.parent().children(':last-child').addClass('dd-menuItem-hover');
					}
					return false;
					
				case 40: // Arrow Down.
					if (curr.next().length) {
						curr.next().addClass('dd-menuItem-hover');
						curr.removeClass('dd-menuItem-hover');
					}
					else {
						curr.removeClass('dd-menuItem-hover');
						curr.parent().children(':first-child').addClass('dd-menuItem-hover');
					}
					return false;
					
				default:
					return true;
			}
			
		});
		
		$('.ac_contacts *[tabindex]').keyup(function(event){
			var ac_query = $(this).data('query');
			
			if (!ac_query || $(this).val().trim() != ac_query) {
				ac_query = ($(this).val()).trim();
				$(this).data('query', ac_query);
				
				var ac_contacts = $(this).parents('.ac_contacts');
				var contacts = ac_contacts.find('.dd-list');
				var ac_results;
				
				if (ac_query && event.which != 13) {
					ac_results = autoComplete(ac_query);
					
					if (ac_results.length) {
						var grp = '<div>';
						for (var i = 0, len = ac_results.length; i < len; i++) {
							grp += '<div id="contact:' + ac_results[i].phone + '" class="dd-menuItem">' + ac_results[i].html + '</div>';
						}
						grp += '</div>';
						
						grp = $(grp);
						
						grp.find('.dd-menuItem:first-child').addClass('dd-menuItem-hover');
						
						grp.children().hover(function(){
							$(this).siblings('.dd-menuItem-hover').removeClass('dd-menuItem-hover').end().addClass('dd-menuItem-hover');
						});
						
						grp.mousedown(function(event){
							var target = $(event.target);
							var ac_Contacts = target.parents('.ac_contacts');
							
							ac_Contacts.find('.dd-list').autoResize(null);
							
							var id = /contact:(.+)/.exec(event.target.id)[1];
							ac_Contacts.find('input[type=text]').val(InboxManager.gvData.contactPhones[id].displayNumber);
							
							return false;
						});
						
						contacts.autoResize(grp);
					}
				}
				
				if (!ac_query || !ac_results || ac_results && !ac_results.length) {
					if (ac_contacts.find('.dd-list').html() !== '') {
						ac_contacts.find('.dd-list').autoResize(null);
					}
				}
			}
		});
		
		
		$('.ac_contacts *[tabindex]').focus(function(){
			$(this).parents('.dropdown').addClass('dropdown-focused');
		});
		
		$('.ac_contacts *[tabindex]').blur(function(){
			var dropdown = $(this).parents('.dropdown');
			if (dropdown.find('.dd-list').html() !== '') {
				dropdown.find('.dd-list').autoResize(null);
			}
			$(this).parents('.dropdown').removeClass('dropdown-focused');
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('#text').keyup(function(){
			var length = $(this).val().length;
			var counter = 160 - length;
			
			if (counter <= 0) {
				counter = parseInt(length / 160, 10) + 1 + '.' + (160 - length % 160);
			}
			
			$('.quicksms-counter').text(counter);
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('.panel-call').keypress(function(event){
			if (event.target.id !== 'forwardNumber' && event.which == 13) {
				$('.button-call-connect').click();
			}
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('.button-call-connect').createButton().click(function(){
			if (!$('.button-call-connect').hasClass('button-disabled')) {
				if (tmrQuickCallMsg) {
					clearTimeout(tmrQuickCallMsg);
					tmrQuickCallMsg = null;
					$('.quickcall-msg').removeClass('quickcall-error').attr('style', 'display:none');
				}
				
				$('.button-call-connect').addClass('button-disabled').removeAttr('tabindex');
				$('.button-call-connect .button-content').text('Connecting...');
				
				var outgoingNumber = $('#outgoingNumber').val();
				var id = /defaultPhone:(\d+)/.exec($('.dropdown .dropdown-text').attr('id'))[1];
				
				if (document.getElementById('chkRemember').checked) {
					localStorage.quickcall_phone = InboxManager.gvData.phones[id].phoneNumber;
				}
				else {
					delete localStorage.quickcall_phone;
				}
				
				var remember = (localStorage.quickcall_phone) ? 1 : 0;
				
				CallManager.connectCall({
					'outgoingNumber': outgoingNumber,
					'forwardingNumber': InboxManager.gvData.phones[id].phoneNumber,
					'phoneType': InboxManager.gvData.phones[id].type,
					'remember': remember
				}, function(){
					$('.quickcall-msg').attr('style', 'inline-bock').text('Calling you...');
					
					$('.button-call-connect').attr('style', 'display:none;');
					$('.button-call-connect .button-content').text('Connect');
					$('.button-call-cancel').attr('style', 'display:inline-block;');
					
				}, function(data){
					if (data && data.code) {
						if (data.code == 20) {
							$('.quickcall-msg').text('Invalid number.');
						}
						else {
							//$('.quickcall-msg').text('Unknown error (' + data.code + ').');
							$('.quickcall-msg').text('We had an error.');
						}
					}
					else {
						$('.quickcall-msg').text('We had an error.');
					}
					
					$('.button-call-connect').removeClass('button-disabled').attr('tabindex', 0);
					$('.button-call-connect .button-content').text('Connect');
					
					$('.quickcall-msg').addClass('quickcall-error').attr('style', 'inline-bock');
				});
				
				tmrQuickCallMsg = setTimeout(function(){
					$('.quickcall-msg').attr('style', 'display:none;').removeClass('quickcall-error');
					$('.button-call-cancel').attr('style', 'display:none;');
					$('.button-call-connect').removeClass('button-disabled').attr('style', 'display:inline-block;').attr('tabindex', 0);
				}, callStatusTimeout);
			}
		});
		
		$('.button-call-cancel').createButton().click(function(){
			if (!$('.button-call-cancel').hasClass('button-disabled')) {
				if (tmrQuickCallMsg) {
					clearTimeout(tmrQuickCallMsg);
					tmrQuickCallMsg = 0;
					$('.quickcall-msg').removeClass('quickcall-error').attr('style', 'display:none');
				}
				
				$('.button-call-cancel').addClass('button-disabled').removeAttr('tabindex');
				$('.button-call-cancel .button-content').text('Canceling...');
				
				CallManager.cancelCall(function(){
					$('.button-call-connect').removeClass('button-disabled').attr('style', 'display:inline-block;').attr('tabindex', 0);
					
					$('.button-call-cancel').removeClass('button-disabled').attr('style', 'display:none;').attr('tabindex', 0);
					$('.button-call-cancel .button-content').text('Cancel');
				});
			}
		});
		
		$('.button-sms-send').createButton().click(function(){
			if (!$('.button-sms-send').hasClass('button-disabled')) {
				if (tmrQuickSMSMsg) {
					clearTimeout(tmrQuickSMSMsg);
					tmrQuickSMSMsg = null;
					$('.quicksms-msg').attr('style', 'display:none;').removeClass('quickcall-error');
				}
				
				$('.button-sms-send').addClass('button-disabled').removeAttr('tabindex');
				$('.button-sms-send .button-content').text('Sending...');
				
				var outgoingNumber = $('#phoneNumber').val();
				var txtMessage = $('#text').val();
				
				CallManager.sendSMS({
					phoneNumber: outgoingNumber,
					text: txtMessage
				}, function(){
					$('.button-sms-send').removeClass('button-disabled').attr('tabindex', 0);
					$('.button-sms-send .button-content').text('Send');
					$('.quicksms-msg').attr('style', 'display:inline-block;').text('Text Sent');
				}, function(data){
					if (data && data.code) {
						if (data.code == 20) {
							$('.quicksms-msg').text('Invalid number.');
						}
						else {
							//$('.quicksms-msg').text('Unknown error (' + data.code + ').');
							$('.quickcall-msg').text('We had an error.');
						}
					}
					else {
						$('.quicksms-msg').text('We had an error.');
					}
					
					$('.button-sms-send').removeClass('button-disabled').attr('tabindex', 0);
					$('.button-sms-send .button-content').text('Send');
					$('.quicksms-msg').attr('style', 'display:inline-block;').addClass('quickcall-error');
				});
				
				tmrQuickSMSMsg = setTimeout(function(){
					$('.quicksms-msg').attr('style', 'display:none;').removeClass('quickcall-error');
				}, callStatusTimeout);
			}
		});
		
		////////////////////////////////////////////////////////////////////////
		
		if (localStorage.gc_all_unread) {
			InboxManager.getAllInbox = (localStorage.gc_all_unread == 'inbox');
		}
		
		if (InboxManager.getAllInbox) {
			$('.toolbar-item-inbox-all').addClass('toolbar-item-selected');
		}
		else {
			$('.toolbar-item-inbox-unread').addClass('toolbar-item-selected');
		}
		
		$('.toolbar-item-inbox-all').createToolbarItem().click(function(){
			if (InboxManager.online) {
				$(this).siblings().removeClass('toolbar-item-selected').end().addClass('toolbar-item-selected');
				
				InboxManager.getAllInbox = true;
				localStorage.gc_all_unread = 'inbox';
				getInbox(InboxManager.views.inbox, 1);
			}
		});
		
		$('.toolbar-item-inbox-unread').createToolbarItem().click(function(){
			if (InboxManager.online) {
				$(this).siblings().removeClass('toolbar-item-selected').end().addClass('toolbar-item-selected');
				
				InboxManager.getAllInbox = false;
				localStorage.gc_all_unread = 'unread';
				getInbox(InboxManager.views.inbox_unread, 1);
			}
		});
		
		if (localStorage.show_menu === 'true') {
			$('.toggle-menu').toggleClass('toggle-show').toggleClass('toggle-hide').find('.toggle-menu-content').text('Hide Menu');
			
			$('.nav-menu').css({
				left: 0,
				opacity: 1
			});
			
			$('.inbox-holder').css({
				marginLeft: 132
			});
			
		}
		
		$('.toggle-menu').mousedown(function(){
			return false;
		});
		
		$('.toggle-menu').click(function(){
			$(this).toggleClass('toggle-show').toggleClass('toggle-hide');
			
			if ($(this).hasClass('toggle-show')) {
				localStorage.show_menu = false;
				$(this).find('.toggle-menu-content').text('Show Menu');
				
				$('.nav-menu').stop(true, false);
				$('.inbox-holder').stop(true, false);
				
				$({
					left: 132,
					opacity: 1
				}).animate({
					left: 0,
					opacity: 0
				}, {
					duration: 300,
					
					step: function(now, fx){
						if (fx.prop == 'left') {
							$('.nav-menu')[0].style[fx.prop] = fx.now - 132 + fx.unit;
							$('.inbox-holder')[0].style['margin-left'] = fx.now + fx.unit;
						}
						else if (fx.prop == 'opacity') {
							$('.nav-menu')[0].style[fx.prop] = fx.now;
						}
					},
					
					complete: function(){
					}
				});
			}
			else {
				localStorage.show_menu = true;
				$(this).find('.toggle-menu-content').text('Hide Menu');
				
				
				$('.nav-menu').stop(true, false);
				$('.inbox-holder').stop(true, false);
				
				$({
					left: 0,
					opacity: 0
				}).animate({
					left: 132,
					opacity: 1
				}, {
					duration: 300,
					
					step: function(now, fx){
						if (fx.prop == 'left') {
							$('.nav-menu')[0].style[fx.prop] = fx.now - 132 + fx.unit;
							$('.inbox-holder')[0].style['margin-left'] = fx.now + fx.unit;
						}
						else if (fx.prop == 'opacity') {
							$('.nav-menu')[0].style[fx.prop] = fx.now;
						}
						
					}
				});
			}
		});
		
		
		$('.inbox-refresh').click(function(){
			getInbox(InboxManager.currentView);
		});
		
		$('.inbox-page-older, .inbox-page-oldest, .inbox-page-newer, .inbox-page-newest').mousedown(function(){
			if (!$(this).is(':focus')) {
				$('*:focus').blur();
				$(this).focus();
			}
			return false;
		});
		
		$('.inbox-page-older').click(function(){
			getInbox(InboxManager.currentView, InboxManager.page + 1);
		});
		
		$('.inbox-page-oldest').click(function(){
			var noOfPages = Math.ceil(InboxManager.totalMessages / InboxManager.resultsPerPage);
			getInbox(InboxManager.currentView, noOfPages);
		});
		
		$('.inbox-page-newer').click(function(){
			getInbox(InboxManager.currentView, InboxManager.page - 1);
		});
		
		$('.inbox-page-newest').click(function(){
			getInbox(InboxManager.currentView, 1);
		});
		
		////////////////////////////////////////////////////////////////////////
		
		$('.nav-menuitem-content').mousedown(function(){
			return false;
		});
		
		$('.nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
				$(this).parents('.nav-menuitem').addClass('nav-menuitem-selected');
			}
		});
		
		$('.nav-menuitem-contacts').click(function(){
			goToUrl('https://www.google.com/voice#contacts');
		});
		
		$('.nav-menuitem-inbox .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').show();
				
				if (InboxManager.getAllInbox) {
					getInbox(InboxManager.views.inbox, 1);
				}
				else {
					getInbox(InboxManager.views.inbox_unread, 1);
				}
				
			}
		});
		
		$('.nav-menuitem-starred .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.starred, 1);
			}
		});
		
		$('.nav-menuitem-history .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.history, 1);
			}
		});
		
		$('.nav-menuitem-spam .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.spam, 1);
			}
		});
		
		$('.nav-menuitem-trash .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.trash, 1);
			}
		});
		
		$('.nav-menuitem-voicemail .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.voicemail, 1);
			}
		});
		
		$('.nav-menuitem-sms .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.sms, 1);
			}
		});
		
		$('.nav-menuitem-recorded .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.recorded, 1);
			}
		});
		
		$('.nav-menuitem-placed .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.placed, 1);
			}
		});
		
		$('.nav-menuitem-received .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.received, 1);
			}
		});
		
		$('.nav-menuitem-missed .nav-menuitem-content').click(function(){
			if (InboxManager.online) {
				$('.all-unread-switch').hide();
				
				getInbox(InboxManager.views.missed, 1);
			}
		});
		
		updateNavigationItems(gvChecker.unreadCounts);
		
		////////////////////////////////////////////////////////////////////////
		
		if (!gvChecker.isLoadingData) {
			setTimeout(function(){
				InboxManager.getUserData();
				
				if (InboxManager.online) {
					loadPhones();
					
					if (InboxManager.getAllInbox) {
						getInbox(InboxManager.views.inbox, 1);
					}
					else {
						getInbox(InboxManager.views.inbox_unread, 1);
					}
					
				}
				else {
					$('.label-status').removeClass('gv-number').css({
						color: "#748CA1"
					}).text("Offline");
					goToUrl('https://www.google.com/voice');
				}
			}, 50);
		}
	};
	
	
	function openPopup(width, height, url){
		var w = width;
		var h = height;
		var left = (screen.width / 2) - (w / 2);
		var top = (screen.height / 2) - (h / 2);
		
		var popupWin = window.open(url, url, 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		popupWin.focus();
		
		return popupWin;
	}
	
	/**
	 * Callback function fires when the gvData is changed.
	 */
	function onGVDataUpdated(){
		if (gvChecker.gvData) {
			InboxManager.gvData = gvChecker.gvData;
			InboxManager.online = true;
			
			if (!InboxManager.jsonInbox) {
				getInbox(InboxManager.currentView);
			}
			
			$('.button-call-connect, .button-sms-send, .gc-message-sms-send, .gc-message-note-save, .gc-message-note-delete').removeClass('button-disabled').attr('tabindex', 0);
		}
		else {
			InboxManager.online = false;
			$('.button-call-connect, .button-sms-send, .gc-message-sms-send, .gc-message-note-save, .gc-message-note-delete').addClass('button-disabled').removeAttr('tabindex');
		}
		
		loadPhones();
	}
	
	/**
	 * Callback function fires when the unreadCounts is changed.
	 */
	function onMessagesUpdated(){
		updateNavigationItems(gvChecker.unreadCounts);
	}
	
	
	function updateNavigationItems(unreadCounts){
		if (!unreadCounts) {
			return;
		}
		
		if(InboxManager.testAnyView('inbox', 'inbox_unread')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-inbox').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('starred')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-starred').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('history')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-history').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('spam')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-spam').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('trash')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-trash').addClass('nav-menuitem-selected');
		}
		
		else if(InboxManager.testAnyView('voicemail')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-voicemail').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('sms')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-sms').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('recorded')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-recorded').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('placed')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-placed').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('received')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-received').addClass('nav-menuitem-selected');
		}
		else if(InboxManager.testAnyView('missed')){
			$('.nav-menuitem.nav-menuitem-selected').removeClass('nav-menuitem-selected');
			$('.nav-menuitem-missed').addClass('nav-menuitem-selected');
		}
		
		
		if (unreadCounts.inbox) {
			$('.nav-menuitem-inbox').addClass('nav-menuitem-unread')
			.find('.nav-menuitem-content').text('Inbox (' + unreadCounts.inbox + ')');
		}
		else {
			$('.nav-menuitem-inbox').removeClass('nav-menuitem-unread')
			.find('.nav-menuitem-content').text('Inbox');
		}
		
		if (unreadCounts.voicemail) {
			$('.nav-menuitem-voicemail').addClass('nav-menuitem-unread')
			.find('.nav-menuitem-content').text('Voicemail (' + unreadCounts.voicemail + ')');
		}
		else {
			$('.nav-menuitem-voicemail').removeClass('nav-menuitem-unread')
			.find('.nav-menuitem-content').text('Voicemail');
		}
		
		if (unreadCounts.sms) {
			$('.nav-menuitem-sms').addClass('nav-menuitem-unread')
			.find('.nav-menuitem-content').text('SMS (' + unreadCounts.sms + ')');
		}
		else {
			$('.nav-menuitem-sms').removeClass('nav-menuitem-unread')
			.find('.nav-menuitem-content').text('SMS');
		}
	}
	
	/**
	 * Force the background page to refresh and update the icon.
	 */
	function refreshBackground(){
		gvChecker.refresh();
	}
	
	/**
	 * Force the background page to refresh the user data.
	 */
	function reloadGVData(){
		$('.label-status').removeClass('gv-number').text("Connecting...");
		gvChecker.reloadGVData();
	}
	
	/**
	 * Open a URL into a new tab in a seperate process.
	 * or refresh the page if it's already opened.
	 * @param {string} url The url to be opened.
	 */
	function goToUrl(url){
		chrome.tabs.getAllInWindow(undefined, function(tabs){
			var baseUrl = url.substring(0, url.indexOf('#'));
			
			if (url.indexOf('#') < 0) {
				baseUrl = url;
			}
			
			for (var i = 0, len = tabs.length; i < len; i++) {
				if (tabs[i].url && tabs[i].url.indexOf(baseUrl) >= 0) {
					chrome.tabs.update(tabs[i].id, {
						url: url,
						selected: true
					});
					
					return;
				}
			}
			
			chrome.tabs.create({
				url: url
			});
		});
	}
	
	/**
	 * AutoComplete the query string from the contacts names and phones.
	 * @param {String} query The query string to search with.
	 * @return {Array} A list of all matched contacts.
	 */
	function autoComplete(query){
		var results = [];
		
		if (InboxManager.gvData) {
			var keyword = query.replace(/([\)\(\{\}\+\*\?\.\\])/g, '\\$1');
			var regexName = new RegExp('(?:(^' + keyword + ')(.*))|(?:(.* +)(' + keyword + ')(.*))', 'im');
			var regexNumber = '(.*)(' + keyword + ')(.*)';
			var counter = 0;
			var name, number, phoneType;
			var result;
			var contactPhones = InboxManager.gvData.contactPhones;
			
			for (var phone in contactPhones) {
				if (contactPhones.hasOwnProperty(phone)) {
					name = null;
					number = null;
					phoneType = null;
					var contact = contactPhones[phone];
					
					try {
						result = regexName.exec(contact.name);
					} 
					catch (e1) {
						result = null;
					}
					
					if (result) {
						if (result[1]) {
							name = '<b>' + result[1] + '</b>' + result[2];
						}
						else if (result[3]) {
							name = result[3] + '<b>' + result[4] + '</b>' + result[5];
						}
					}
					else {
						try {
							result = contact.displayNumber.match(regexNumber);
						} 
						catch (e2) {
							result = null;
						}
						
						if (result) {
							number = result[1] + '<b>' + result[2] + '</b>' + result[3];
						}
						else {
							try {
								result = phone.match(regexNumber);
							} 
							catch (e3) {
								result = null;
							}
							
							if (result) {
								number = contact.displayNumber;
							}
						}
					}
					
					if (name || number) {
						phoneType = contact.phoneTypeName;
						
						if (!phoneType) {
							phoneType = ' (O)';
						}
						else if (phoneType == 'mobile') {
							phoneType = ' (M)';
						}
						else if (phoneType == 'home') {
							phoneType = ' (H)';
						}
						else {
							phoneType = ' (O)';
						}
						
						name = (name) ? (name + ' ') : ((contact.name) ? (contact.name + ' ') : '');
						number = (number) ? number : ((contact.displayNumber) ? (contact.displayNumber + ' ') : '');
						
						results.push({
							phone: phone,
							name: contact.name,
							displayNumber: contact.displayNumber,
							phoneType: phoneType,
							html: name + number + phoneType
						});
						counter++;
					}
					
					if (counter == maxSearchContactResult) {
						break;
					}
				}
			}
		}
		return results;
	}
	
	/**
	 * Load the user phones into the page and bind their events handlers.
	 */
	function loadPhones(){
		if (InboxManager.online) {
			$('.label-status').text(InboxManager.gvData.number.formatted).addClass('gv-number');
			
			var rememberPhone = localStorage.quickcall_phone;
			$('#chkRemember').attr('checked', (rememberPhone) ? true : false);
			
			var phonesHtml = '<div>';
			var phones = InboxManager.gvData.phones;
			var divForwardNumber = $('#forwardNumber');
			var divPhones = divForwardNumber.find('.dd-list');
			
			for (var phone in phones) {
				if (phones.hasOwnProperty(phone)) {
					phonesHtml += '<div class="dd-menuItem';
					
					if (!rememberPhone) {
						rememberPhone = phones[phone].phoneNumber;
					}
					
					if (phones[phone].phoneNumber == rememberPhone) {
						$('#forwardNumber .dropdown-text').html(phones[phone].name).attr('id', 'defaultPhone:' + phone);
						
						//phonesHtml.find('#phone\\:' + phone).addClass('dd-menuItem-selected');
						phonesHtml += ' dd-menuItem-selected';
					}
					
					phonesHtml += '" id="phone:' + phone + '">' + phones[phone].name + '</div>';
				}
			}
			
			phonesHtml += '</div>';
			
			divPhones.html(phonesHtml);
			
			divPhones.find('.dd-menuItem').hover(function(){
				$(this).addClass('dd-menuItem-hover');
			}, function(){
				$(this).removeClass('dd-menuItem-hover');
			});
			
			divPhones.mousedown(function(event){
				var target = $(event.target);
				$('#forwardNumber .dropdown-text').text(target.text()).attr('id', 'defaultPhone:' + (/phone:(\d+)/).exec(target.attr('id'))[1]);
				
				target.siblings('.dd-menuItem-selected').removeClass('dd-menuItem-selected').end().addClass('dd-menuItem-selected');
				
				$('#forwardNumber .dd-list').stop(true, true).animate({
					opacity: 'hide',
					height: 'hide'
				}, slideDuration);
				
				return false;
			});
		}
		else {
			$('.label-status').removeClass('gv-number').css({
				color: "#748CA1"
			}).text("Offline");
		}
		
		// Highlight the GV-Number.
		$('.label-status').highlightText();
	}
	
	/**
	 * Validate and adjust the current pagination info for the current inbox page.
	 */
	function validatePagination(){
		if (InboxManager.totalMessages) {
			var start = (InboxManager.page - 1) * InboxManager.resultsPerPage + 1;
			var noOfPages = Math.ceil(InboxManager.totalMessages / InboxManager.resultsPerPage);
			var end = InboxManager.page * InboxManager.resultsPerPage;
			end = (end < InboxManager.totalMessages) ? end : InboxManager.totalMessages;
			
			$('.inbox-paging').show();
			$('.inbox-page-range').text(start + '-' + end);
			$('.inbox-page-total').text(InboxManager.totalMessages);
			
			$('.inbox-page-newer')[(InboxManager.page > 1) ? 'show' : 'hide']();
			$('.inbox-page-newest')[(InboxManager.page > 2) ? 'show' : 'hide']();
			$('.inbox-page-older')[(InboxManager.page < noOfPages) ? 'show' : 'hide']();
			$('.inbox-page-oldest')[(InboxManager.page < noOfPages - 1) ? 'show' : 'hide']();
		}
		else {
			$('.inbox-paging').hide();
		}
	}
	
	/**
	 * EventHandlers for messages in the inbox.
	 */
	var MessagesEventsHandler = {
		msg_click: function(msgID, read){
			return function(){
				if (InboxManager.online) {
					var parentMsg = $('#' + msgID);
					
					if (!$(parentMsg).hasClass('inbox-message-read') && read) {
						$(parentMsg).addClass('inbox-message-read');
						InboxManager.readMessage(msgID, read, function(){
							refreshBackground();
						});
					}
					else if ($(parentMsg).hasClass('inbox-message-read') && !read) {
						$(parentMsg).removeClass('inbox-message-read');
						InboxManager.readMessage(msgID, read, function(){
							refreshBackground();
						});
					}
				}
				
				$('*:focus').blur();
			};
		},
		
		name_click: function(msgID){
			return function(event){
				goToUrl('https://www.google.com/voice#contacts/' + $(this).text().replace(' ', '+'));
				event.stopPropagation();
			};
		},
		
		playName_click: function(msgID){
			return function(event){
				if (InboxManager.online) {
					if (audioPlayer) {
						audioPlayer.pause();
						audioPlayer = null;
					}
					
					audioPlayer = new Audio(InboxManager.gvData.baseUrl + '/media/sendPhonebookName/' + InboxManager.jsonInbox.messages[msgID].phoneNumber);
					audioPlayer.play();
				}
				
				event.stopPropagation();
			};
		},
		
		location_click: function(msgID){
			return function(event){
				goToUrl('http://maps.google.com/maps?q=' + $(this).text());
				event.stopPropagation();
			};
		},
		
		star_click: function(msgID){
			return function(event){
				if (InboxManager.online) {
					var parentMsg = $('#' + msgID);
					$(this).toggleClass('gc-message-star-on').toggleClass('gc-message-star-off');
					
					var star = $(this).hasClass('gc-message-star-on');
					InboxManager.starMessage(msgID, star);
				}
				
				event.stopPropagation();
			};
		},
		
		smsShowOld_click: function(msgID){
			return function(event){
				$(this).hide().parents('.gc-message-sms-more').siblings('.gc-message-sms-old').attr('style', '');
				event.stopPropagation();
			};
		},
		
		call_click: function(msgID){
			return function(event){
				$('#outgoingNumber').val(InboxManager.jsonInbox.messages[msgID].displayNumber);
				$('.toolbar-item-call').not('.toolbar-item-selected').click();
				
				event.stopPropagation();
			};
		},
		
		sms_click: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				parentMsg.find('.gc-message-sms-actions').hide();
				parentMsg.find('.gc-message-sms-reply').show().find('textarea').focus();
				event.stopPropagation();
			};
		},
		
		smsSend_click: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				var jsonMsg = InboxManager.jsonInbox.messages[msgID];
				var txtMessage = parentMsg.find('.gc-message-sms-reply textarea').val();
				
				var smsOptions = {
					phoneNumber: jsonMsg.phoneNumber,
					text: txtMessage,
					id: jsonMsg.id,
					conversationId: jsonMsg.id
				};
				
				if (InboxManager.gvData.contactPhones[jsonMsg.phoneNumber].name) {
					smsOptions.contact = InboxManager.gvData.contactPhones[jsonMsg.phoneNumber].name;
				}
				
				CallManager.sendSMS(smsOptions, function(response){
					InboxManager.jsonInbox.messages[response.JSON.id] = response.JSON;
					buildMessage($(response.HTML), $('#' + response.JSON.id));
				}, function(error){
					console.log('Error: ' + error);
				});
				
				parentMsg.find('.gc-message-sms-reply').hide().find('textarea').text('');
				parentMsg.find('.gc-message-sms-actions').show();
				event.stopPropagation();
			};
		},
		
		smsCancel_click: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				parentMsg.find('.gc-message-sms-reply').hide().find('textarea').text('');
				parentMsg.find('.gc-message-sms-actions').show();
				event.stopPropagation();
			};
		},
		
		smsText_keyup: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				var length = $(this).val().length;
				var counter = 160 - length;
				
				if (counter <= 0) {
					counter = parseInt(length / 160, 10) + 1 + '.' + (160 - length % 160);
				}
				
				parentMsg.find('.gc-sms-counter').text(counter);
			};
		},
		
		noteDisplay_click: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				parentMsg.find('.gc-message-note-display').hide();
				parentMsg.find('.gc-message-sms-actions').hide();
				
				if (InboxManager.jsonInbox.messages[msgID].note) {
					parentMsg.find('.gc-message-note-delete').show();
				}
				else {
					parentMsg.find('.gc-message-note-delete').hide();
				}
				
				$('*:focus').blur();
				parentMsg.find('.gc-message-note-edit').show().find('textarea').text(InboxManager.jsonInbox.messages[msgID].note).focus();
				
				event.stopPropagation();
			};
		},
		
		noteSave_click: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				var note = parentMsg.find('.gc-message-note-edit textarea').val();
				
				$(this).addClass('button-disabled').removeAttr('tabindex').find('div').text('Saving...');
				
				var self = this;
				
				InboxManager.saveNote(msgID, note, function(){
					$(self).removeClass('button-disabled').attr('tabindex', 0).find('div').text('Save Note');
					
					parentMsg.find('.gc-message-note-edit').hide().find('textarea').val('');
					parentMsg.find('.gc-message-note-display .gc-message-note').text(InboxManager.jsonInbox.messages[msgID].note);
					
					if(InboxManager.jsonInbox.messages[msgID].note){
						parentMsg.find('.gc-message-note-display').show();
					}
					
					parentMsg.find('.gc-message-sms-actions').show();
				});
				
				event.stopPropagation();
			};
		},
		
		noteCancel_click: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				parentMsg.find('.gc-message-note-edit').hide().find('textarea').val('');
				
				if (InboxManager.jsonInbox.messages[msgID].note) {
					parentMsg.find('.gc-message-note-display').show();
				}
				
				parentMsg.find('.gc-message-sms-actions').show();
				event.stopPropagation();
			};
		},
		
		noteDelete_click: function(msgID){
			return function(event){
				var parentMsg = $('#' + msgID);
				
				InboxManager.deleteNote(msgID);
				
				parentMsg.find('.gc-message-note-edit').hide().find('textarea').val('');
				parentMsg.find('.gc-message-sms-actions').show();
				
				event.stopPropagation();
			};
		},
		
		moreMenu_mousedown: function(msgID){
			return function(event){
				if ($(event.target).is('.goog-menu.gc-message-menu') || (event.which && event.which != 1)) {
					return true;
				}
				
				var parentMsg = $('#' + msgID);
				var msgMenu = $(this).find('.goog-menu.gc-message-menu');
				
				if (msgMenu.is(':visible')) {
					msgMenu.hide().empty();
				}
				else {
					var message = InboxManager.jsonInbox.messages[msgID];
					
					var regexLabels = new RegExp('^(' + message.labels.join('|') + ')$'); 
					
					if(regexLabels.test('inbox')){
						$('<li class="goog-menuitem">Archive</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.more_archive_click(msgID, true)).appendTo(msgMenu);
					}
					else if(regexLabels.test('voicemail') || regexLabels.test('sms') || regexLabels.test('recorded')) {
						$('<li class="goog-menuitem">Move to Inbox</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.more_archive_click(msgID, false)).appendTo(msgMenu);
					}
					 
					if (message.isRead) {
						$('<li class="goog-menuitem">Mark as unread</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.msg_click(msgID, false)).appendTo(msgMenu);
					}
					else {
						$('<li class="goog-menuitem">Mark as read</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.msg_click(msgID, true)).appendTo(msgMenu);
					}
					
					if (message.note) {
						$('<li class="goog-menuitem">Edit note</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.noteDisplay_click(msgID)).appendTo(msgMenu);
					}
					else {
						$('<li class="goog-menuitem">Add note</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.noteDisplay_click(msgID)).appendTo(msgMenu);
					}
					
					if (message.type === 2 || message.type === 4) {
						$('<li class="goog-menuseparator"/>').appendTo(msgMenu).mousedown(MessagesEventsHandler.cancelEvent);
						
						$('<li class="goog-menuitem">Download</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.download_click(msgID)).appendTo(msgMenu);
					}
					
					$('<li class="goog-menuseparator"/>').appendTo(msgMenu).mousedown(MessagesEventsHandler.cancelEvent);
					
					if (message.isSpam){
						$('<li class="goog-menuitem">Not Spam</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.more_reportSpam_click(msgID, false)).appendTo(msgMenu);
					}
					else {
						$('<li class="goog-menuitem">Report Spam</li>').mousedown(MessagesEventsHandler.cancelEvent)
						.click(MessagesEventsHandler.more_reportSpam_click(msgID, true)).appendTo(msgMenu);
						
						if(message.isTrash){
							$('<li class="goog-menuitem">Undelete</li>').mousedown(MessagesEventsHandler.cancelEvent)
							.click(MessagesEventsHandler.more_delete_click(msgID, false)).appendTo(msgMenu);
						}
						else {
							$('<li class="goog-menuitem">Delete</li>').mousedown(MessagesEventsHandler.cancelEvent)
							.click(MessagesEventsHandler.more_delete_click(msgID, true)).appendTo(msgMenu);
						}
					}
					
					/*if (message.isTrash || message.isSpam) {
						$('<li class="goog-menuitem">Delete Forever</li>').mousedown(function(){
							return false;
						}).click(MessagesEventsHandler.more_deleteForever_click(msgID)).appendTo(msgMenu);
					}*/
					
					msgMenu.removeAttr('style');
					
					if ($(this).offset().top + $(this).height() + msgMenu.outerHeight(true) > $('.inner-inbox-holder').offset().top + $('.inner-inbox-holder').innerHeight()) {
						msgMenu.css({
							top: 'auto',
							bottom: $(this).height()
						});
					}
					
					msgMenu.find('.goog-menuitem').hover(function(){
						$(this).siblings('.goog-menuitem').removeClass('goog-menuitem-highlight');
						$(this).addClass('goog-menuitem-highlight');
					}, function(){
						$(this).removeClass('goog-menuitem-highlight');
					});
					
					msgMenu.show();
				}
				
				if (!$(this).is(':focus')) {
					$('*:focus').blur();
					$(this).focus();
				}
				
				event.stopPropagation();
				return false;
			};
		},
		
		moreMenu_keydown: function(msgID){
			return function(event){
				var curr = $(this).find('.goog-menuitem-highlight');
				var msgMenu = $(this).find('.goog-menu.gc-message-menu');
				
				switch (event.which) {
					case 13: // Enter Key
						if (msgMenu.is(':visible')) {
							curr.removeClass('goog-menuitem-highlight').click();
						}
						else {
							$(this).trigger('mousedown');
						}
						return false;
						
					case 32: // Space Key
						if (msgMenu.is(':visible')) {
						}
						else {
							$(this).trigger('mousedown');
						}
						return false;
						
					case 38: // Arrow Up
						if (msgMenu.is(':visible')) {
							var prev = curr.prev();
							
							if (!curr.length) {
								prev = msgMenu.find('.goog-menuitem:last-child');
							}
							
							if (prev.length && !prev.hasClass('goog-menuitem')) {
								prev = prev.prev();
							}
							
							if (prev.length) {
								curr.removeClass('goog-menuitem-highlight');
								prev.addClass('goog-menuitem-highlight');
							}
							else {
								curr.removeClass('goog-menuitem-highlight');
								msgMenu.find('.goog-menuitem:last-child').addClass('goog-menuitem-highlight');
							}
						}
						else {
							$(this).trigger('mousedown');
						}
						return false;
						
					case 40: // Arrow Down
						if (msgMenu.is(':visible')) {
							var next = curr.next();
							
							if (!curr.length) {
								next = msgMenu.find('.goog-menuitem:first-child');
							}
							
							if (next.length && !next.hasClass('goog-menuitem')) {
								next = next.next();
							}
							
							if (next.length) {
								curr.removeClass('goog-menuitem-highlight');
								next.addClass('goog-menuitem-highlight');
							}
							else {
								curr.removeClass('goog-menuitem-highlight');
								msgMenu.find('.goog-menuitem:first-child').addClass('goog-menuitem-highlight');
							}
						}
						else {
							$(this).trigger('mousedown');
						}
						return false;
						
					default:
						break;
				}
				
			};
		},
		
		moreMenu_blur: function(msgID){
			return function(){
				$(this).find('.goog-menu.gc-message-menu').empty().hide();
			};
		},
		
		more_archive_click: function(msgID, archive){
			return function(event){
				if (InboxManager.online) {
					var parentMsg = $('#' + msgID); 
					var animate = InboxManager.testAnyView('inbox', 'inbox_unread');
					
					if(animate){
						parentMsg.animate({
							opacity: 0
						}, 500, function(){
							$(this).animate({
								height: 0
							}, 500, function(){
								$(this).hide();
							});
						});
					}
						
					InboxManager.archiveMessage(msgID, archive, function(){
						getInbox(InboxManager.currentView);
					}, function(){
						if(animate){
							parentMsg.css({
								opacity: 1,
								height: ''
							});
						}
					});
				}
				
				$('*:focus').blur();
				event.stopPropagation();
			};
		},
		
		more_reportSpam_click: function(msgID, spam){
			return function(event){
				if (InboxManager.online) {
					var parentMsg = $('#' + msgID);
					parentMsg.animate({
						opacity: 0
					}, 500, function(){
						$(this).animate({
							height: 0
						}, 500, function(){
							$(this).hide();
						});
					});
					
					InboxManager.reportSpam(msgID, spam, function(){
						getInbox(InboxManager.currentView);
					}, function(){
						parentMsg.css({
							opacity: 1,
							height: ''
						});
					});
				}
				
				$('*:focus').blur();
				event.stopPropagation();
			};
		},
		
		more_delete_click: function(msgID, del){
			return function(){
				if (InboxManager.online) {
					var parentMsg = $('#' + msgID);
					parentMsg.animate({
						opacity: 0
					}, 500, function(){
						$(this).animate({
							height: 0
						}, 500, function(){
							$(this).hide();
						});
					});
					
					InboxManager.deleteMessage(msgID, del, function(){
						getInbox(InboxManager.currentView);
					}, function(){
						parentMsg.css({
							opacity: 1,
							height: ''
						});
					});
				}
				
				$('*:focus').blur();
				event.stopPropagation();
			};
		},
		
		more_deleteForever_click: function(msgID){
			return function(){
				if (InboxManager.online) {
					var parentMsg = $('#' + msgID);
					parentMsg.animate({
						opacity: 0
					}, 500, function(){
						$(this).animate({
							height: 0
						}, 500, function(){
							$(this).hide();
						});
					});
					
					InboxManager.deleteForeverMessage(msgID, function(){
						getInbox(InboxManager.currentView);
					}, function(){
						parentMsg.css({
							opacity: 1,
							height: ''
						});
					});
				}
				
				$('*:focus').blur();
				event.stopPropagation();
			};
		},
		
		download_click: function(msgID){
			return function(){
				goToUrl('https://www.google.com/voice/media/send_voicemail/' + msgID);
			};
		},
		
		msgPlay_click: function(msgID){
			return function(event){
				if (InboxManager.online) {
					var flashObj = $('<object id="gc-audioPlayer" name="gc-audioPlayer" height="20" width="100%"' +
					' type="application/x-shockwave-flash"' +
					' movie="' +
					"https://www.google.com" +
					InboxManager.gvData.swfPath +
					'"' +
					' data="' +
					"https://www.google.com" +
					InboxManager.gvData.swfPath +
					'">' +
					' <param name="wmode" value="transparent"/>' +
					' <param name="' +
					"https://www.google.com" +
					InboxManager.gvData.swfPath +
					'"/>' +
					'<param name="flashvars" value="messagePath=' +
					encodeURIComponent(InboxManager.gvData.baseUrl + '/media/send_voicemail/' + msgID + '?read=0') +
					'&baseurl=' +
					encodeURIComponent(InboxManager.gvData.baseUrl) +
					'&conv=' +
					msgID +
					'"/>' +
					'</object>');
					
					$('.gc-message-flashplayer').hide().empty().parents('.gc-message-player').find('.gc-message-play').show();
					$(this).hide().parents('.gc-message-player').find('.gc-message-flashplayer').show().append(flashObj);
				}
				
				event.stopPropagation();
			};
		},
		
		click_stopPropagation: function(event){
				event.stopPropagation();
		},
		
		cancelEvent: function(event){
			return false;
		}
	};
	
	/**
	 * Build an inbox message from html data.
	 * @param {Object} divMsgOrig Original HTML data.
	 * @param {Object} divMsg HTML DIV holder for the message.
	 */
	function buildMessage(divMsgOrig, divMsg){
		var msgID = divMsgOrig.attr('id');
		
		divMsg.find('.message-block').html(divMsgOrig.find('.gc-message-tbl'));
		divMsg.find('.message-actions-panel').html(divMsgOrig.find('.gc-message-bg-m.gc-message-bg-g').html());
		
		divMsg.find('.gc-message-add-contact, .gc-message-rating-container').remove();
		
		divMsg.find('.gc-message-star, .gc-message-call, .gc-message-sms, .gc-message-more-menu, ' +
		'.gc-message-sms-send, .gc-message-sms-cancel, .gc-message-note-save, ' +
		'.gc-message-note-cancel, .gc-message-note-delete').attr('tabindex', '0');
		
		divMsg.find('.gc-message-label-o, .gc-message-label-i').attr('style', '');
		divMsg.find('.gc-message-more-menu .goog-menu.gc-message-menu').empty();
		divMsg.find('.gc-message-more-menu').append(divMsg.find('.goog-menu.gc-message-menu'));
		
		divMsg.find('img').each(function(i, elem){
			$(elem).attr('src', 'https://www.google.com' + $(elem).attr('src'));
		});
		
		if (InboxManager.jsonInbox.messages[msgID].isRead) {
			divMsg.addClass('inbox-message-read');
		}
		
		////////////////////////////////////////////////////////////////////////
		// Events Handler
		////////////////////////////////////////////////////////////////////////
		
		divMsg.find('.gc-control.gc-message-sms, .gc-control.gc-message-call, .gc-message-star').keydown(function(event){
			if (event.which === 32 || event.which === 13) {
				$(this).click();
				return false;
			}
		});
		
		divMsg.find('.gc-control.gc-message-call').click(MessagesEventsHandler.call_click(msgID));
		
		divMsg.find('.gc-control.gc-message-sms, .gc-message-sms-box').click(MessagesEventsHandler.sms_click(msgID));
		
		
		divMsg.find('.gc-message-sms-send').createButton().click(MessagesEventsHandler.smsSend_click(msgID));
		
		divMsg.find('.gc-message-sms-cancel').createButton().click(MessagesEventsHandler.smsCancel_click(msgID));
		
		divMsg.find('.gc-message-sms-reply textarea').keyup(MessagesEventsHandler.smsText_keyup(msgID));
		
		
		divMsg.find('.gc-message-note-display').click(MessagesEventsHandler.noteDisplay_click(msgID));
		
		divMsg.find('.gc-message-note-save').createButton().click(MessagesEventsHandler.noteSave_click(msgID));
		
		divMsg.find('.gc-message-note-cancel').createButton().click(MessagesEventsHandler.noteCancel_click(msgID));
		
		divMsg.find('.gc-message-note-delete').createButton().click(MessagesEventsHandler.noteDelete_click(msgID));
		
		
		divMsg.find('.gc-message-sms-reply textarea, .gc-message-note-edit textarea').click(MessagesEventsHandler.click_stopPropagation);
		
		
		divMsg.find('.gc-message-more-menu').click(MessagesEventsHandler.click_stopPropagation);
		
		divMsg.find('.gc-message-more-menu').keydown(MessagesEventsHandler.moreMenu_keydown(msgID));
		
		divMsg.find('.gc-message-more-menu').mousedown(MessagesEventsHandler.moreMenu_mousedown(msgID));
		
		divMsg.find('.gc-message-more-menu').blur(MessagesEventsHandler.moreMenu_blur(msgID));
		
		
		divMsg.find('.gc-message-name-link').click(MessagesEventsHandler.name_click(msgID));
		
		divMsg.find('.gc-message-play-name').click(MessagesEventsHandler.playName_click(msgID));
		
		
		divMsg.find('.gc-message-location a').attr('href', 'javascript://').click(MessagesEventsHandler.location_click(msgID));
		
		divMsg.find('.gc-message-star').click(MessagesEventsHandler.star_click(msgID));
		
		divMsg.find('.gc-message-sms-show').click(MessagesEventsHandler.smsShowOld_click(msgID));
		
		divMsg.find('.gc-message-play').click(MessagesEventsHandler.msgPlay_click(msgID));
		
		divMsg.find('.gc-message-flashplayer').click(MessagesEventsHandler.click_stopPropagation);
		
		divMsg.click(MessagesEventsHandler.msg_click(msgID, true));
	}
	
	/**
	 * Load the selected inbox page and parse it.
	 */
	function getInbox(view, page){
		
		if (InboxManager.online) {
			page = (page) ? page : InboxManager.page;
			
			$('.inbox-refresh-image').css({
				display: 'inline-block'
			});
			
			InboxManager.loadView(view, page, function(htmlInbox){
				$('.inner-inbox-holder').empty().scrollTop(0);
				var jsonInbox = InboxManager.jsonInbox;
				
				if (jsonInbox.totalSize > 0) {
					for (var msg in jsonInbox.messages) {
						if (jsonInbox.messages.hasOwnProperty(msg)) {
							var divMsg = $('<div class="inbox-message" id="' + msg + '">' +
							'<div class="message-content-panel">' +
							'<table width="100%;">' +
							'<tr>' +
							'<td class="gc-message-sline"></td>' +
							'<td class="message-block"></td>' +
							'</tr>' +
							'</table>' +
							'</div>' +
							'<div class="message-actions-panel"></div>' +
							'</div>');
							
							buildMessage(htmlInbox.find('#' + msg), divMsg);
							$('.inner-inbox-holder').append(divMsg);
						}
					}
				}
				else {
					$('.inner-inbox-holder').html(htmlInbox.find('.gc-inbox-no-items'));
				}
				
				validatePagination();
				updateNavigationItems(jsonInbox.unreadCounts);
				
				$('.inbox-refresh-image').hide();
			}, function(){
				$('.inbox-refresh-image').hide();
			});
		}
	}
	
	/**
	 * Encapsulate inbox management functionalities.
	 */
	var InboxManager = new (function(){
		var self = this;
		
		this.gvData = null;
		
		this.jsonInbox = null;
		
		this.online = true;
		
		this.page = 1;
		
		this.resultsPerPage = 10;
		
		this.totalMessages = 0;
		
		this.getAllInbox = false;
		
		this.xhrLoadView = null;
		
		this.views = {
			inbox: '/inbox/recent/',
			inbox_unread: '/inbox/recent/unread/',
			starred: '/inbox/recent/starred/',
			history: '/inbox/recent/all',
			spam: '/inbox/recent/spam/',
			trash: '/inbox/recent/trash/',
			voicemail: '/inbox/recent/voicemail/',
			sms: '/inbox/recent/sms/',
			recorded: '/inbox/recent/recorded/',
			placed: '/inbox/recent/placed/',
			received: '/inbox/recent/received/',
			missed: '/inbox/recent/missed/'
		};
		
		this.currentView = this.views.inbox_unread;
		
		this.testAnyView = function(){
			for (var i = 0, len = arguments.length; i < len; i++){
				if (self.currentView == self.views[arguments[i]]) {
					return true;
				}
			}
			
			return false;
		};
		
		this.getUserData = function(){
			if (gvChecker.gvData) {
				self.gvData = gvChecker.gvData;
				self.online = true;
			}
			else {
				self.online = false;
			}
		};
		
		this.loadView = function(view, page, onSuccess, onError){
			var url = self.gvData.baseUrl + view +
			'?' +
			((page > 1) ? 'page=p' + page + '&' : '') +
			'v=' +
			self.gvData.v;
			
			if(self.xhrLoadView){
				self.xhrLoadView.abort();
			}
			
			self.xhrLoadView = $.ajax({
				type: 'GET',
				
				url: url,
				
				success: function(data){
					try {
						self.jsonInbox = JSON.parse($(data).find('response json').text());
						
						if (self.jsonInbox) {
							self.currentView = view;
							self.page = page;
							self.totalMessages = self.jsonInbox.totalSize;
							self.resultsPerPage = self.jsonInbox.resultsPerPage;
							var htmlInbox = $('<div/>').append($(data).find('response html').text());
							
							if (onSuccess) {
								onSuccess(htmlInbox);
							}
						}
						else {
							console.log('Error: No JSON node in the response.');
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						try {
							var jsonRefresh = JSON.parse(data);
							
							if (jsonRefresh && jsonRefresh.refresh) {
								reloadGVData();
							}
							else {
								if (onError) {
									onError();
								}
							}
						} 
						catch (e2) {
							if (onError) {
								onError();
							}
						}
					}
					
					
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
			
		};
		
		this.archiveMessage = function(msg, archive, onSuccess, onError){
			archive = (typeof(archive) == 'undefined') ? true : archive;
			var url = self.gvData.baseUrl + '/inbox/archiveMessages/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'messages': msg,
				'archive': (+archive)
			};
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							if (onSuccess) {
								onSuccess();
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.readMessage = function(msg, read, onSuccess, onError){
			read = (typeof(read) == 'undefined') ? true : read;
			var url = self.gvData.baseUrl + '/inbox/mark/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'messages': msg,
				'read': (+read)
			};
			
			self.jsonInbox.messages[msg].isRead = read;
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							if (onSuccess) {
								onSuccess();
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.starMessage = function(msg, star, onSuccess, onError){
			star = (typeof(star) == 'undefined') ? true : star;
			var url = self.gvData.baseUrl + '/inbox/star/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'messages': msg,
				'star': (+star)
			};
			
			self.jsonInbox.messages[msg].star = star;
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							if (onSuccess) {
								onSuccess();
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.reportSpam = function(msg, spam, onSuccess, onError){
			del = (typeof(del) == 'undefined') ? true : del;
			var url = self.gvData.baseUrl + '/inbox/spam/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'messages': msg,
				'spam': (+spam)
			};
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							if (onSuccess) {
								onSuccess();
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.deleteMessage = function(msg, del, onSuccess, onError){
			del = (typeof(del) == 'undefined') ? true : del;
			var url = self.gvData.baseUrl + '/inbox/deleteMessages/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'messages': msg,
				'trash': (+del)
			};
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							if (onSuccess) {
								onSuccess();
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.deleteForeverMessage = function(msg, onSuccess, onError){
			var url = self.gvData.baseUrl + '/inbox/deleteForeverMessages/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'messages': msg
			};
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							if (onSuccess) {
								onSuccess();
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.saveNote = function(msg, note, onSuccess, onError){
			var url = self.gvData.baseUrl + '/inbox/savenote/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'id': msg,
				'note': note
			};
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							self.jsonInbox.messages[msg].note = jsonResult.data.note;
							
							if (onSuccess) {
								onSuccess(jsonResult.data.note);
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.deleteNote = function(msg, onSuccess, onError){
			var url = self.gvData.baseUrl + '/inbox/deletenote/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'id': msg
			};
			
			self.jsonInbox.messages[msg].note = '';
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						
						if (jsonResult && jsonResult.ok) {
							
							if (onSuccess) {
								onSuccess(jsonResult.data.note);
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.doNotDisturb = function(dnd, onSuccess, onError){
			dnd = (typeof(dnd) == 'undefined') ? true : dnd;
			var url = self.gvData.baseUrl + '/settings/setDoNotDisturb/';
			var data = {
				'_rnr_se': self.gvData._rnr_se,
				'dnd': (+dnd)
			};
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var jsonResult = JSON.parse(result);
						if (jsonResult && jsonResult.ok) {
							if (onSuccess) {
								onSuccess(jsonResult.data.note);
							}
						}
						else {
							console.log('Error in th response:\n' + result);
							
							if (onError) {
								onError();
							}
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
	})();
	
	/**
	 * Encapsulate Call and SMS functionalities.
	 */
	var CallManager = new (function(){
		this.connectCall = function(callOptions, onSuccess, onError){
			var url = InboxManager.gvData.baseUrl + '/call/connect/';
			var defaults = {
				'outgoingNumber': '',
				'forwardingNumber': '',
				'subscriberNumber': undefined,
				'phoneType': '',
				'remember': 0,
				'_rnr_se': InboxManager.gvData._rnr_se
			};
			
			callOptions = $.extend(defaults, callOptions);
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: callOptions,
				
				success: function(result){
					try {
						var gvResponse = JSON.parse(result);
						
						if (gvResponse) {
							if (gvResponse.ok) {
								if (onSuccess) {
									onSuccess(gvResponse.data);
								}
							}
							else if (onError) {
								onError(gvResponse.data);
							}
						}
						else if (onError) {
							onError();
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
			
		};
		
		this.cancelCall = function(onSuccess, onError){
			var url = InboxManager.gvData.baseUrl + '/call/cancel/';
			var data = {
				'_rnr_se': InboxManager.gvData._rnr_se,
				'cancelType': 'C2C',
				'outgoingNumber': undefined,
				'forwardingNumber': undefined
			};
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: data,
				
				success: function(result){
					try {
						var gvResponse = JSON.parse(result);
						
						if (gvResponse && gvResponse.ok) {
							if (onSuccess) {
								onSuccess();
							}
						}
						else if (onError) {
							onError();
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
		
		this.sendSMS = function(smsOptions, onSuccess, onError){
			var url = InboxManager.gvData.baseUrl + '/sms/send/';
			var defaults = {
				'_rnr_se': InboxManager.gvData._rnr_se,
				'phoneNumber': '',
				'text': ''
			};
			
			smsOptions = $.extend(defaults, smsOptions);
			
			$.ajax({
				type: 'POST',
				
				url: url,
				
				data: smsOptions,
				
				success: function(result){
					try {
						var gvResponse = JSON.parse(result);
						
						if (gvResponse) {
							if (gvResponse.ok) {
								if (onSuccess) {
									onSuccess(gvResponse);
								}
							}
							else if (onError) {
								onError(gvResponse);
							}
						}
						else if (onError) {
							onError();
						}
					} 
					catch (e) {
						if (onError) {
							onError();
						}
					}
				},
				
				error: function(){
					if (onError) {
						onError();
					}
				}
			});
		};
	})();
})();
