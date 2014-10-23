var
app = {
	init:function(){

		locale.construct(function(){
			ui.construct();
			locale.translate_interface();
		});

		String.prototype.capitalize = function(){
			return this.charAt(0).toUpperCase() + this.substr(1);
		}
	},

	torrent:{

		current_torrent_id: 0,

		get: function(url, file, subtitles_url){

			console.log(arguments)

		},

		drop:function(){

		},

		play_video:function(){

		}

	}

},
logger = {

	log:function(msg){
		console.log(msg);
	}
};


window.onresize = function(){
	ui.home.catalog.center();
}

$(app.init)
