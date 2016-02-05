fetcher.scrappers.t4p_tv = function(genre, keywords, page, callback, fallback){

	var domain =  '//api.apidomain.info';
	if(fallback) {
		domain = '//apinc.apidomain.info';
	}


		if(genre=='all')
			genre = !1;


		var url = ''+domain+'/shows?cb='+Math.random()+'&sort=' + app.config.fetcher.sortBy + '&page=' + ui.home.catalog.page;

        if (keywords) {
            url += '&keywords=' + keywords;
        }

        if (genre) {
            url += '&genre=' + genre;
        }

        if (page && page.toString().match(/\d+/)) {
           url += '&set=' + page;
        }

		$.ajax({
			url: url,
			dataType:'json',
			error:function(){
			if(!fallback) {
				fetcher.scrappers.t4p_tv(genre, keywords, page, callback, true);
			} else {
				callback(false)
			}
			},
			success:function(data){

				var movies = [],
					memory = {};

				if (data.error || typeof data.MovieList === 'undefined') {
					if(!fallback) {
						fetcher.scrappers.t4p_tv(genre, keywords, page, callback, true);
					} else {
						callback(false)
					}
					return;
				}

				data.MovieList.forEach(function (movie){
					// No imdb, no movie.

					if( typeof movie.imdb != 'string' || movie.imdb.replace('tt', '') == '' ){ return;}

			try{

					// Temporary object
					var movieModel = {
						id:       movie.imdb,
						imdb:       movie.imdb,
						title:      movie.title,
						year:       movie.year ? movie.year : '&nbsp;',
						runtime:    movie.runtime,
						synopsis:   "",
						imdb_rating: parseFloat(movie.rating),

						poster_small:	movie.poster_med,
						poster_big:		movie.poster_big,
						seeders:    movie.torrent_seeds,
						leechers:   movie.torrent_peers,
						trailer:	movie.trailer ? 'http://www.youtube.com/embed/' + movie.trailer + '?autoplay=1': false,
						stars:		utils.movie.rateToStars(parseFloat(movie.rating)),

					};



					var stored = memory[movie.imdb];

					// Create it on memory map if it doesn't exist.
					if (typeof stored === 'undefined') {
						stored = memory[movie.imdb] = movieModel;
					}

					// Push it if not currently on array.
					if (movies.indexOf(stored) === -1) {
						movies.push(stored);
					}
			}catch(e){ console.log(e.message);}

				});

				callback(movies)
			},
		});

}
