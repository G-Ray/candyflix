fetcher.scrappers.ysubs = function(movie_id, callback){

    var
    baseUrl	= 'http://api.yifysubtitles.com/subs/',
    prefix 	= 'http://www.yifysubtitles.com';

    var url = baseUrl + movie_id;

    // The server does the request
    api.send({url_request:url});
    socket.on('url_request', function(json) {

		try{

			json = JSON.parse(json);
			var subs = json.subs && json.subs[movie_id] || false;

			if(subs){
				var subs_list = [];
				for(var i in subs){

					var
					lang_code	= locale.lang2iso[i] ? locale.lang2iso[i] : 'xx',
					lang_name	= locale.langs[lang_code] ? locale.langs[lang_code]  : i.capitalize()
					most_rated = [];

					if(subs[i] instanceof Array){
						for(var x=0;x<subs[i].length;x++)
							if(!most_rated[1] || subs[i][x].rating>most_rated[1]){

								most_rated = [[

									prefix + subs[i][x].url,
									lang_code,
									lang_name.capitalize()

								], subs[i][x].rating];
							}

						subs_list.push(most_rated[0]);
					}

				}

				callback(subs_list);
			}
			else
				callback(false);


		}
		catch(e){
			callback(false);
			logger.log('error_scrap_ysubs_' + movie_id)
		}

	})

}
