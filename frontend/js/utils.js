var utils = {

	load_script:function(src, callback) {
	
		var script = document.createElement('script'), loaded;
		
		script.setAttribute('src', src);
		if (callback) {
		  script.onreadystatechange = script.onload = function() {
			if (!loaded) {
			  callback();
			}
			loaded = true;
		  };
		}
		document.getElementsByTagName('head')[0].appendChild(script);

	},

	tokenizer:function(tokens, str){
		return str.replace(/\[##([^#]+)##\]/g, function(){
			return tokens[arguments[1]] || '';
		});
	},

	movie:{
		rateToStars:function(rate){
			if(!rate)
				return [
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>'
				].join();


			var
			p_rating = Math.round(rate.toFixed(1)) / 2,
			stars = '';
			
			for (var i = 1; i <= Math.floor(p_rating); i++){
				stars += '<span class="icon star"></span>';
			}
			if(p_rating % 1 > 0){
				stars += '<span class="icon star_half"></span>';
			}

			for (var i = Math.ceil(p_rating); i < 5; i++) {
				stars += '<span class="icon star_empty"></span>';
			}

			return stars;

		}
	},

	msgbox:function(str){
		$('#msg div').html(str);
		$('#msg').show();
		setTimeout(function(){
			$('#msg').hide();
		},3000)
	},

	url_response:{},
	url_request:function(url, callback){

		utils.url_response[url] = callback;
		api.send({url_request:url})
		
		//$.get(url,callback);

	},

	calculateTorrentHealth: function (seeders, peers) {
      // Calculates the "health" of the torrent (how easy it is to stream)
      var leechers = peers - seeders;
      var ratio = leechers > 0 ? (seeders / leechers) : seeders;

      if (seeders < 100) {
        return 'bad';
      }
      else if (seeders >= 100 && seeders < 200) {
        if( ratio > 5 ) {
         return 'good';
        } else if( ratio > 3 ) {
          return 'medium';
        } else {
          return 'bad';
        }
      }
      else if (seeders >= 200) {
        if( ratio > 5 ) {
          return  'excellent';
        } else if( ratio > 3 ) {
          return 'good';
        } else if( ratio > 2 ) {
          return 'medium';
        } else {
          return 'bad';
        }
      }
    }

},
resource = {

	genres:[
		"all",
		"action",
		"adventure",
		"animation",
		"biography",
		"comedy",
		"crime",
		"documentary",
		"drama" ,
		"family",
		"fantasy",
		"film-noir",
		"history",
		"horror",
		"music",
		"musical",
		"mystery",
		"romance",
		"sci-fi",
		"short",
		"sport",
		"thriller",
		"war",
		"western"
	],

	lang2code:{
			"af":"za",
			"sq":"al",
			"ar":"sa",
			"hy":"am",
			"cy":"az",
			"lt":"az",
			"eu":"es",
			"be":"by",
			"bg":"bg",
			"ca":"es",
			"zh":"cn",
			"hr":"hr",
			"cs":"cz",
			"da":"dk",
			"nl":"nl",
			"en":"us",
			"et":"ee",
			"fo":"fo",
			"fa":"ir",
			"fi":"fi",
			"fr":"fr",
			"gl":"es",
			"de":"de",
			"el":"gr",
			"gu":"in",
			"he":"il",
			"hi":"in",
			"hu":"hu",
			"is":"is",
			"id":"id",
			"it":"it",
			"ja":"jp",
			"kn":"in",
			"kk":"kz",
			"kok":"in",
			"ko":"kr",
			"ky":"kz",
			"lv":"lv",
			"lt":"lt",
			"mk":"mk",
			"ms":"my",
			"mr":"in",
			"mn":"mn",
			"nb":"no",
			"nn":"no",
			"pl":"pl",
			"pt":"br",
			"pt":"pt",
			"pa":"in",
			"ro":"ro",
			"ru":"ru",
			"sa":"in",
			"cy":"sr",
			"lt":"sr",
			"sk":"sk",
			"sl":"si",
			"es":"es",
			"sw":"ke",
			"sv":"se",
			"syr":"sy",
			"ta":"in",
			"tt":"ru",
			"te":"in",
			"th":"th",
			"tr":"tr",
			"uk":"ua",
			"ur":"pk",
			"cy":"uz",
			"lt":"uz",
			"vi":"vn",
		}
}
