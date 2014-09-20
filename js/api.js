var api = {
	send:function(data){
		window.parent.postMessage({api:data}, "*");
	},

	url_response:function(data){
		
		if(typeof utils.url_response[data[0]]=='function'){
			utils.url_response[data[0]](data[1]);
			delete utils.url_response[data[0]];
		}

	},

	focus:function(){
		window.focus();
	},

	putSubs: function(subs){
		if(typeof(window.current_vjs)!='undefined'){
			(vjs.bind(window.current_vjs, window.current_vjs.parseCues))(subs)
		}
	},

	play_video:function(data){

		ui.loading_wrapper.hide();
		ui.cover.show();

		var subtitles = '';
		if(api.subtitles instanceof Array){
			api.subtitles.forEach(function(subs){
				subtitles += '<track kind="subtitles" src="' + subs[0] + '" srclang="'+ subs[1] +'" label="' + subs[2].capitalize() + '" charset="utf-8">';
			})
		}

		api.now_playing = data[0];
		$('.cover').html('<video id="video_player" class="video-js vjs-default-skin vjs-big-play-centered" width="100%" height="100%"><source src="' + api.now_playing + '" type="video/mp4" />'+subtitles+'</video>');



		videojs(document.getElementById('video_player'), {
				"controls": true, "autoplay": true, "preload": "auto", plugins: { biggerSubtitles: {}, smallerSubtitles: {}, customSubtitles:{} }
			},
			function(){

				$('.vjs-fullscreen-control').on('click', function(){
					api.send({"eval":'if(win.isFullscreen){win.leaveFullscreen()}else{win.enterFullscreen()}'})
				});


				$('<div class="close">X</div>').appendTo('.vjs-default-skin').click(function(){
					api.send({"eval":'if(win.isFullscreen){win.leaveFullscreen()}'})
					ui.cover.hide()
				});


			}
		);

			
		

/*
		api.playing = data ? data[0] : api.playing;
		$('#loading_screen').hide();
		$('.play_button').click(api.play_video);


		var subtitles = '';
		if(api.subtitles instanceof Array){
			api.subtitles.forEach(function(subs){
				subtitles += '<track kind="subtitles" src="' + subs[0] + '" srclang="'+ subs[1] +'" label="' + subs[2] + '" charset="utf-8">';
			})
		}

		$('#player').html();
		try{
	
		}
		catch(e){console.log(e)}
*/

	},

	progress:function(d){

		if(!d)
			return;
			

		if(d[1]<1)
			var msg = locale.translate('startingDownload');
		else
			var msg = locale.translate('downloading');


		ui.loading_wrapper.change_stats(Math.round(d[0]),0, msg);
	}

}


window.addEventListener("message", function(e){

	var handler = function(data, obj){
		obj = obj ? obj : window;
		for(var c in data){
			var otype = typeof(obj[c])
			if(otype!='undefined'){
				if(otype=='function'){
					(obj[c])(data[c])
				}
				else if(typeof(data[c])=='object')
					handler(data[c], obj[c]);
			}
		}
	}

	handler(e.data);

}, false);
