fetcher.scrappers.t4p_tv = function(genre, keywords, page, callback){



		if(genre=='all')
			genre = !1;


		var url = 'http://api.torrentsapi.com/shows?formats=mp4&cb='+Math.random()+'&sort=seeds&page=' + ui.home.catalog.page;

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
			error:function(){callback(false)},
			success:function(data){

				var movies = [],
					memory = {};

				if (data.error || typeof data.MovieList === 'undefined') {
					callback(false)
					return;
				}

				data.MovieList.forEach(function (movie){
					// No imdb, no movie.

					if( typeof movie.imdb != 'string' || movie.imdb.replace('tt', '') == '' ){ return;}

			try{

					// Temporary object
					var movieModel = {
						imdb:       movie.imdb,
						title:      movie.title,
						year:       movie.year ? movie.year : '&nbsp;',
						runtime:    movie.runtime,
						synopsis:   "",
						voteAverage:parseFloat(movie.rating),

						image:      movie.poster_med,
						bigImage:   movie.poster_big,
						backdrop:   "",
						videos:     {},
						seeders:    movie.torrent_seeds,
						leechers:   movie.torrent_peers,
						trailer:	movie.trailer ? 'http://www.youtube.com/embed/' + movie.trailer + '?autoplay=1': false,
						stars:		utils.movie.rateToStars(parseFloat(movie.rating)),
						
						hasMetadata:false,
						hasSubtitle:false
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
