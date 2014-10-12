var fetcher = {

	scrappers:{

		tv_idx:			0,
		movies_idx:		0,
		subtitles_idx:	0,

		movies:		['t4p_movies','yts'],
		tv:			['t4p_tv'],
		subtitles:	['ysubs']

	},

	fetch:{
		items: function(section, genre, keywords, callback){

			var
			idx 			= fetcher.scrappers[section + '_idx'],
			scrapper_name 	= fetcher.scrappers[section][idx];


			if(typeof(scrapper_name)=='string'){

				var scrapper = fetcher.scrappers[scrapper_name];

				if(typeof(scrapper)=='function'){
					scrapper(genre, keywords, null, function(movies){

						if(!movies){
							fetcher.scrappers[section + '_idx']++;
							fetcher.fetch.items(section, genre,keywords, callback);
						}
						else{

							callback(false, movies)

						}

					})
				}
				else{
					logger.log('error_no_scrapper_function_' + scrapper_name)
					fetcher.scrappers[section + '_idx']++;
					fetcher.fetch.items(section, genre,keywords, callback);
				}
			}
			else{
				fetcher.scrappers[section + '_idx']=0;
				callback('end_of_scrappers_movies');
			}

		},

		tv_show:function(imdb, callback){

			$.get('http://api.torrentsapi.com/show?cb='+Math.random()+'&formats=mp4&imdb=' + imdb, function(json){
				if(json){

					try{

						for(var s in json) {
							for(var e in json[s]) {
								for(var i=json[s][e].items.length-1; i>=0; i-- ) {
									if(json[s][e].items[i].file.toLowerCase().indexOf('avi') !== -1)
										json[s][e].items.splice(i, 1);
								}
							}
						}

						callback(0, json);

					}catch(e){
						console.log(e.message);
						callback('error_parsing_t4p_tv');

					}
				}
				else
					callback('error_t4p_tv_not_responding');


			},'json');
		},

		movie_info: function(movie_id, callback){

			$.get('http://www.omdbapi.com/?i=' + movie_id, function(d){

				try{

					d = JSON.parse(d);

					if(!d)
						return;


					if(ui.home.catalog.items[movie_id]){
						ui.home.catalog.items[movie_id].description = d.Plot + ' &nbsp;<b>' + d.Country + '. &nbsp;' + d.Runtime.replace(' ', '&nbsp;') + '.</b>';
						ui.home.catalog.items[movie_id].actors = '<b>Staring:</b><br>' + d.Actors;
						ui.home.catalog.items[movie_id].runtime = d.Runtime;
						ui.home.catalog.items[movie_id].genre = d.Genre.split(',')[0];


						callback({
							description: ui.home.catalog.items[movie_id].description,
							actors: ui.home.catalog.items[movie_id].actors,
							runtime: ui.home.catalog.items[movie_id].runtime,
							genre: ui.home.catalog.items[movie_id].genre
						})
					}

				}
				catch(e){
					logger.log('error_fetch_from_imdb_' + movie_id);
				}


			})
		},

		subtitles:function(movie_id, callback){

			var
			idx 			= fetcher.scrappers['subtitles_idx'],
			scrapper_name 	= fetcher.scrappers.subtitles[idx];


			if(typeof(scrapper_name)=='string'){

				var scrapper = fetcher.scrappers[scrapper_name];

				if(typeof(scrapper)=='function'){
					scrapper(movie_id, function(subtitles){

						if(!subtitles || !subtitles.length){
							fetcher.scrappers.subtitles_idx++;
							fetcher.fetch.subtitles(movie_id);
						}
						else
							callback(subtitles);
					})
				}
				else{
					logger.log('error_no_scrapper_function_' + scrapper_name)
					fetcher.scrappers.subtitles_idx++;
					fetcher.fetch.subtitles(movie_id);
				}
			}
			else{
				fetcher.scrappers.subtitles_idx=0;
			}
		}
	}
}
