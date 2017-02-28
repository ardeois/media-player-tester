var URL = 'http://localhost:10001/mobile.landr.app/demo_full/1_original.mp3';

if (URL === null) {
  throw 'Please set `URL` property in index.js';
}
 
var AUDIO_EVENTS = [
  //Loading events	
  'loadstart',
  'durationchange',
  'loadedmetadata',
  'loadeddata',
  'progress',
  'canplay',
  'canplaythrough',

  //Interruption events
  'suspend',
  'abort',
  'error',
  'emptied',
  'stalled',

  //Playing events
  'timeupdate',
  'playing',
  'waiting',
  'play',
  'pause',
  'ended',
  'volumechange',
  
  //Buffering events
  'seeking',
  'seeked'
];

var Player = function(media) {
  this.media = media;
  this.logs = [];
  for (var i = 0; i < AUDIO_EVENTS.length; i++) {
  	this.listenTo(AUDIO_EVENTS[i]);
  }
};

Player.prototype.play = function() {
  this._log('action', 'play');
  this.media.play();
};

Player.prototype.pause = function() {
  this._log('action', 'pause');
  this.media.pause();
};

Player.prototype.seek = function(ratio) {
  var time = ratio * this.media.duration;
  this._log('action', 'seek', 'Seeking to ' + time);
  this.media.currentTime = time;
};

Player.prototype.listenTo = function(eventName) {
  this.media.addEventListener(eventName, function() {
  	this._log('event', eventName);
  }.bind(this));
};

Player.prototype.getMediaStatus = function() {
	return {
		currentTime: this.media.currentTime,
		duration: this.media.duration,
		ended: this.media.ended,
		error: this.media.error,
		paused: this.media.paused,
		played: this._timeRange(this.media.played), //TimeRange
		buffered: this._timeRange(this.media.buffered), //TimeRange
		seekable: this._timeRange(this.media.seekable), //TimeRange
		seeking: this.media.seeking, 
	}
};

Player.prototype.resetLogs = function() {
  this.logs = [];
};

Player.prototype.getLogs = function() {
  return this.logs;
};

Player.prototype._log = function(type, name, msg) {
	var item = {
  		type: type,
  		name: name,
  		time: (new Date()).toISOString(),
  		media: this.getMediaStatus()
  	};

  	if (msg) {
  		item.message = msg;
  	}
  
	this.logs.push(item);
	console.log(item);
};

Player.prototype._timeRange = function(timeRange) {
  var result = [];
  for (var i = 0; i < timeRange.length; i++) {
  	result.push({
  		position: i,
  		start: timeRange.start(i),
  		end: timeRange.end(i)
  	});
  }
  return result;
};

$(document).ready(function() {

	$('#player').html('<source src="' + URL + '?v=' + (new Date()).getTime() + '"></source>');


	var player = new Player(document.getElementById('player'));
	console.log(player);

	$('#seek').on('click', function() {
       player.seek(0.6);
       // player.play();
	});

	$('#play').on('click', function() {
       player.play();
	});

	$('#log').on('click', function() {
		var logs = JSON.stringify(player.getLogs());
		console.log(logs);
    $('#logs').val(logs);
	});
	
});
