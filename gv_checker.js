/**
 * @author Osama Ibrahim
 */

var gvChecker = new (function(){
	var animationFrames = 36;
	var animationSpeed = 10;
	var canvas;
	var canvasContext;
	var loggedInImage;
	var rotation = 0;
	
	var loadingAnimation = new LoadingAnimation();
	var badgeBackgroundColor = [0, 75, 155, 150];	// [R, G, B, A]
	
	var gvoice = 'https://www.google.com/voice';
	var gvoiceUnreadCounts = 'https://clients4.google.com/voice/request/unread/';
	
	var gvDataPollInterval = 1000 * 60 * 60; 		// 60 minute
	var pollInterval = 1000 * 30; 					// 30 seconds
	var requestTimeout = 1000 * 10; 				// 10 seconds
	
	var unreadTimeoutID;
	var dataTimeoutID;
	
	this.onDataUpdated = new chrome.Event('onDataUpdated');
	this.onMessagesUpdated = new chrome.Event('onMessagesUpdated');
	this.unreadCounts = null;
	this.gvData = null;
	this.isLoadingData = true;
	
	var self = this;
	
	this.init = function (){
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
			if (changeInfo.url && changeInfo.url.indexOf(gvoice) >= 0) {
				if (unreadTimeoutID) {
					window.clearTimeout(unreadTimeoutID);
					unreadTimeoutID = null;
				}
				
				startRequest();
			}
		});
	
		canvas = document.getElementById('canvas');
		loggedInImage = document.getElementById('logged_in');
		canvasContext = canvas.getContext('2d');
		
		chrome.browserAction.setIcon({
			path: 'images/gv_logged_in.png'
		});
		
		loadingAnimation.start();
		startRequest();
	};
	
	this.refresh = function(){
		if (unreadTimeoutID) {
			window.clearTimeout(unreadTimeoutID);
			unreadTimeoutID = null;
		}
		
		startRequest();
	};
	
	this.reloadGVData = function(){
		getGVData(function(data){
			updateGVData(data);
			
			if (dataTimeoutID) {
				window.clearTimeout(dataTimeoutID);
				dataTimeoutID = null;
			}
			dataTimeoutID = window.setTimeout(self.reloadGVData, gvDataPollInterval);
			
		}, logoutAndReschedule);
	};


	function scheduleRequest(){
		if (unreadTimeoutID) {
			window.clearTimeout(unreadTimeoutID);
			unreadTimeoutID = null;
		}
		
		unreadTimeoutID = window.setTimeout(startRequest, pollInterval);
	}
	
	function startRequest(){
		// GET UnreadCounts
		getUnreadCounts(function(counts){
			// UnreadCounts is OK... Update
			loadingAnimation.stop();
			updateUnreadCount(counts);
			scheduleRequest();
			
			// GET gvData
			if (!self.gvData) {
				self.isLoadingData = true;
				self.reloadGVData();
			}
			
		}, function(){
			// UnreadCounts is NOT OK... LOGOUT
			logoutAndReschedule();
		});
	}

	
	function logoutAndReschedule(){
		self.isLoadingData = false;
		updateGVData(null);
		updateUnreadCount(null);
		loadingAnimation.stop();
		showLoggedOut();
		scheduleRequest();
	}
	
	
	function getGVData(onSuccess, onError){
		$.ajax({
			type: 'GET',
			
			url: gvoice,
			
			timeout: requestTimeout,
			
			success: function(response){
				if (response) {
					try {
						var result = response.match(/var gcData = (\{(?:.|\r|\n)*\});/);
						
						if (result) {
							try {
								var data = JSON.parse(result[1].replace(/'/g, '"'));
								
								if (data) {
									if (onSuccess) {
										onSuccess(data);
									}
								}
								else {
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
						}
						else {
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
				}
				else {
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
	}
	
	function getUnreadCounts(onSuccess, onError){
		$.ajax({
			type: 'GET',
			
			url: gvoiceUnreadCounts,
			
			timeout: requestTimeout,
			
			success: function(response){
				if (response) {
					try {
						var jsonResponse = JSON.parse(response);
						
						if (jsonResponse && jsonResponse.unreadCounts) {
							if (onSuccess) {
								onSuccess(jsonResponse.unreadCounts);
							}
						}
						else {
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
				}
				else {
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
	}
	
	
	function updateUnreadCount(counts){
		if (!self.unreadCounts || (self.unreadCounts && !counts) || (JSON.stringify(self.unreadCounts) != JSON.stringify(counts))) {
			var flip = false;
			
			if (!self.unreadCounts || !counts || (self.unreadCounts && counts && self.unreadCounts.inbox != counts.inbox)) {
				flip = true;
			}
			
			self.unreadCounts = counts;
			self.onMessagesUpdated.dispatch();
			
			var title = 'Google Voice Dialer';
			if (self.unreadCounts) {
			
				if (self.unreadCounts.voicemail) {
					title += '\n' + self.unreadCounts.voicemail + ' new voicemail';
				}
				
				if (self.unreadCounts.sms) {
					title += '\n' + self.unreadCounts.sms + ' new SMS';
				}
				
				if (self.unreadCounts.missed) {
					title += '\n' + self.unreadCounts.missed + ' new missed calls';
				}
				
				if (flip) {
					animateFlip();
				}
			}
			else {
				title += ' (Offline)';
			}
			
			chrome.browserAction.setTitle({
				title: title
			});
		}
	}
	
	function updateGVData(data){
		self.gvData = data;
		self.isLoadingData = false;
		self.onDataUpdated.dispatch();
	}


	function LoadingAnimation(){
		this.timerId_ = 0;
		this.maxCount_ = 8; // Total number of states in animation
		this.current_ = 0; // Current state
		this.maxDot_ = 4; // Max number of dots in animation
	}
	
	LoadingAnimation.prototype.paintFrame = function(){
		var text = '';
		for (var i = 0; i < this.maxDot_; i++) {
			text += (i == this.current_) ? '.' : ' ';
		}
		
		if (this.current_ >= this.maxDot_) {
			text += '';
		}
		
		chrome.browserAction.setBadgeBackgroundColor({
			color: badgeBackgroundColor
		});
		
		chrome.browserAction.setBadgeText({
			text: text
		});
		
		this.current_++;
		
		if (this.current_ == this.maxCount_) {
			this.current_ = 0;
		}
	};
	
	LoadingAnimation.prototype.start = function(){
		if (this.timerId_) {
			return;
		}
		
		var self = this;
		this.timerId_ = window.setInterval(function(){
			self.paintFrame();
		}, 100);
	};
	
	LoadingAnimation.prototype.stop = function(){
		if (!this.timerId_) {
			return;
		}
		
		window.clearInterval(this.timerId_);
		this.timerId_ = 0;
	};
	
	
	function ease(x){
		return (1 - Math.sin(Math.PI / 2 + x * Math.PI)) / 2;
	}
	
	function animateFlip(){
		rotation += 1 / animationFrames;
		drawIconAtRotation();
		
		if (rotation <= 1) {
			setTimeout(animateFlip, animationSpeed);
		}
		else {
			rotation = 0;
			drawIconAtRotation();
			
			chrome.browserAction.setBadgeText({
				text: (self.unreadCounts && self.unreadCounts.inbox.toString() != '0') ? self.unreadCounts.inbox.toString() : ''
			});
			
			chrome.browserAction.setBadgeBackgroundColor({
				color: badgeBackgroundColor
			});
		}
	}
	
	function showLoggedOut(){
		chrome.browserAction.setIcon({
			path: 'images/gv_not_logged_in.png'
		});
		chrome.browserAction.setBadgeBackgroundColor({
			color: [190, 190, 190, 230]
		});
		chrome.browserAction.setBadgeText({
			text: '?'
		});
	}
	
	function drawIconAtRotation(){
		canvasContext.save();
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		canvasContext.translate(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
		canvasContext.rotate(2 * Math.PI * ease(rotation));
		canvasContext.drawImage(loggedInImage, -Math.ceil(canvas.width / 2), -Math.ceil(canvas.height / 2));
		canvasContext.restore();
		
		chrome.browserAction.setIcon({
			imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)
		});
	}
})();
