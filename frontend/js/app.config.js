app.config={

	init:function(){

		this.fetcher = {
			mode:	'imdb',
			sortBy: 'seeds'

		}

		this.api_keys = {

			tmdb:		'470fd2ec8853e25d2f8d86f685d2270e',
			tmdb_url:	'http://api.themoviedb.org/3/',
			tmdb_src:	'http://image.tmdb.org/t/p/',

		}

		this.locale = {

			preferredSubs: localStorage.getItem('conf_locale_preferredSubs')

		}


		var storage = {
			ui:{
				coverScale: 	1.1,
				coverWidth:		133,
				coverTiteSize:	12,
				coverYearSize:	12,
				coverToolsSize:	12,
				coverStarsSize:	17,
			}
		}

		for(var i in storage){
			this[i] = {};
			for(var key in storage[i])
				this[i][key] = localStorage.getItem('conf_' + i + '_' + key)  || storage[i][key];
		}
	},

	set:function(values){
		for(var i in values){
			for(var key in values[i]){
				this[i][key] = values[i][key]
				localStorage.setItem('conf_' + i + '_' + key, values[i][key])
			}
		}

	},

	hostApp:{
		isVpnConnected:	false,
		tempPath:		localStorage.getItem('conf_hostapp_tempPath') || '',
		subsFontSize:	localStorage.getItem('conf_hostapp_subsFontSize') || "0",
		cleanOnExit:	localStorage.getItem('conf_hostapp_cleanOnExit') && localStorage.getItem('conf_hostapp_cleanOnExit')!="0" && false || true
	},


	updateView:function(){

		$('.temp_path.txt').val(app.config.hostApp.tempPath)

	}


}
