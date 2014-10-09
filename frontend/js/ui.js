var ui = {

  construct:function(){

    this.home.catalog.show();


    $('#titlebar_buttons button').click(function(){
      var obj = {win:{}}
      obj.win[$(this).attr('id')]=true;
      api.send(obj)
    })

    $('#toolbar .section_indicator').click(function(){

      $('#toolbar .section_indicator.activated').removeClass('activated');
      $(this).addClass('activated');

      ui.home.catalog.show();

    })



    for(var i=0;i<resource.genres.length;i++)
      $('<div class="genre" data-genre="' + resource.genres[i] + '">' + locale.translate(resource.genres[i]) + '</div>').appendTo('#genres_box');

    $('#genres_box .genre:nth-child(1)').addClass('activated');

    $('#toolbar_genres').hover(
      function(){
        setTimeout('ui.home.genres_box.on=1',1)
        ui.home.genres_box.show();


      },
      function(){
        ui.home.genres_box.on=0;
        ui.home.genres_box.hide();

      }
    );

    $('#genres_box').hover(
      function(){
        setTimeout('ui.home.genres_box.on=1',1)

      },

      function(){
        ui.home.genres_box.on=0;
        ui.home.genres_box.hide();
      }
    );


    $('#genres_box .genre').click(function(){
      $('#genres_box .genre.activated').removeClass('activated')
      $(this).addClass('activated');
      $('#toolbar_genres .selection_title').html($(this).html());
      $('#search_input').val('')
      ui.home.catalog.show();
      setTimeout(function(){
        ui.home.genres_box.on=0;
        ui.home.genres_box.hide();
      },300);

    })

    $('#search_input').keydown(function(e){

      if(e.which==13)
        ui.home.catalog.show();

    });

    $('#search_bar .icon').click(ui.home.catalog.show)

    api.send({dragger:{areas:[
      ['calc(100% - 48px)','35px',0,0],
      ['calc(100% - 472px)','30px;','30px','302px']
    ]}})


    ui.home.catalog.center();

  },

  home:{

    genres_box:{
      on:0,
      show:function(){
        $('#genres_box').css({left:'167px',opacity:1});
      },

      hide:function(){
        setTimeout(function(){
          if(!ui.home.genres_box.on)
            $('#genres_box').css({left:'-140px',opacity:0})
        },2)
      }

    },

    catalog:{
      items:{},
      show:function(page){

        if(!page)
          ui.home.catalog.page=1;
        else
          ui.home.catalog.page=page;

        $('#movies_catalog').unbind('scroll');


        ui.sliders.close_all();

        var
        keywords  = $('#search_input').val(),
        genreEl   = $('.genre.active'),
        genre     = keywords ? 'all' : ($('#genres_box .genre.activated').data('genre') || 'all'),
        section    = $('#toolbar .section_indicator.activated').data('section');


        fetcher.fetch.items(section, genre, keywords, function(err, items){

          if(err || !(items instanceof Array)){

            ui.home.catalog.noResult();
            logger.log(err);
          }
          else{
            if(!page)
              ui.home.catalog.clear();

            for(var i=0;i<items.length;i++)
              ui.home.catalog.appendItem(items[i], section, i);


            $('#movies_catalog').bind('scroll', function() {
              if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight-400) {
                ui.home.catalog.show(++ui.home.catalog.page);
              }
            })
            ui.home.catalog.showUnloadedItems();

          }

        });
      },

      appendItem:function(movie, section, i){

        var
        tokens = {
          title:    movie.title,
          year:    movie.year,
          runtime:  movie.runtime,
          stars:    movie.stars,
          poster_img:  '<img src="' + movie.image + '" onload="setTimeout(function(){$(\'#movie-'+movie.imdb + '\').css({opacity: 1,transform: \'scale(1, 1)\'})},1);$(\'#movie-'+movie.imdb + '\').removeClass(\'unloaded\')">'

        },
        html = utils.tokenizer(tokens, document.getElementById('movie_cover_html').innerHTML),
        onclick = section=='tv' ? 'ui.home.catalog.tv_show.slider' : 'ui.home.catalog.movie.slider';


        if(!ui.home.catalog.items[movie.imdb.toString()])
          ui.home.catalog.items[movie.imdb.toString()] = movie;

        $('<div onclick="' + onclick + '(\''+movie.imdb+'\')"  id="movie-'+movie.imdb+'" style="transition-delay: 0s, '+(i/15)+'s;" class="movie unloaded" tabindex="'+(i+4)+'">'+html+'</div>').appendTo('#movies_catalog');

      },

      showUnloadedItems:function(){
        setTimeout(function(){
          $('#movies_catalog .unloaded').css({opacity:1,transform: "scale(1, 1)"}).removeClass('unloaded');
        },5000)
      },

      clear:function(){
        $('#movies_catalog').html('');
        document.getElementById('movies_catalog').scrollTop=0;
      },

      noResult:function(){

        if(ui.home.catalog.page==1)
          utils.msgbox( locale.translate('noResults') );

        fetcher.scrappers.tv_idx=0;
        fetcher.scrappers.movies_idx=0;
      },

      movie:{
        slider: function(imdb){

          if(ui.sliders.slider[imdb])
            return;

          ui.sliders.close_all();


          var
          slider       = new ui.slider(imdb),
          movie       = ui.home.catalog.items[imdb],
          html       = utils.tokenizer(movie, $('#movie_page_html').html()),
          slider_selector = '#slider_' + imdb ;


          if(!movie){
            return;
            logger.log('error_missing_movie_catalog_id_' + imdb)
          }


          slider.el.addClass('movie').append(html);


          var img = (new Image);
          img.onload = function(){

            $('#slider_'+imdb+' .movie_poster').html('<img src="' + movie.bigImage + '">');

          }
          img.src=movie.bigImage;



          if(movie.trailer){

            $('.slider .trailer_btn').click(function(){

              var trailer_slider = new ui.slider('trailer_' + imdb, 'right');
              trailer_slider.el.append('<iframe src="' + movie.trailer + '" style="width:100%;height:100%;" frameborder="0" scrolling="0"></iframe>');
              trailer_slider.show();
            });

          }
          else
            $('.slider .trailer_bar').css('display','none');


          if(!movie.description){
            fetcher.fetch.movie_info(imdb, function(info){

              $(slider_selector + ' .description').html(info.description);
              $(slider_selector + ' .runtime').html(info.runtime);
              $(slider_selector + ' .genre').html(info.genre);
              $(slider_selector + ' .actors').html(info.actors);


            });
          }
          $('#slider_'+imdb+' .likebox iframe').attr("src", $('#slider_'+imdb+' .likebox iframe').data('src'));

          fetcher.fetch.subtitles(imdb, function(subs){
            api.subtitles = [];
            for(var i=0;i<subs.length;i++){

              api.subtitles.push(subs[i]);

              var flag = subs[i][2] == "Brazilian-portuguese" ? "br" : resource.lang2code[subs[i][1]];
              if(flag)
                $('#slider_'+imdb+' .subtitles_flags').append('<img title="' + subs[i][2] + '" src="/images/flags/' + flag + '.png" style="display:none" onload="this.style.display=\'inline\'">')
            }

          })

          if(movie.torrents){
            var html = $('#torrent_option_html').html();

            // Swap torrents if 720p is not in first position
            if(movie.torrents.length>1 && movie.torrents[0].quality !== '720p') {
              var tmp = movie.torrents[1];
              movie.torrents[1] = movie.torrents[0]
              movie.torrents[0] = tmp;
            }

            for(var i=0;i<movie.torrents.length;i++){
              var option = utils.tokenizer({
                quality:  movie.torrents[i].quality,
                peers:    movie.torrents[i].torrent_seeds + ' Seeds, &nbsp;' + movie.torrents[i].torrent_peers + ' Peers',
                health:    utils.calculateTorrentHealth(movie.torrents[i].torrent_seeds, movie.torrents[i].torrent_peers)

              }, html);
              $(option).appendTo(slider_selector + ' .torrents').click(function(){

                $('#slider_'+imdb+' .torrent_option.activated').removeClass('activated');
                $(this).addClass('activated');

              });

            }
            $(slider_selector + ' .torrent_option:nth-child(1)').addClass('activated')
          }


          $(slider_selector + ' .watch_btn').click(function(){
            var el = $(slider_selector + ' .torrent_option.activated');

            if(!el.length){
              utils.msgbox('Error - please choose a torrent');
              return;
            }

            var idx = el.index();

            if(!movie.torrents[idx] || !movie.torrents[idx].torrent_url){

              utils.msgbox('Error - please choose a diffrent torrent');
              el.remove();
              $(slider_selector + ' .torrent_option').eq(0).addClass('activated');

              return;
            }



            var
            torrent   = movie.torrents[idx].torrent_url,
            video_file   = movie.torrents[idx].file;

            api.send({torrent:{stream:[torrent, video_file]}});

            socket.once('streamUrl', function(port){
              var url = document.URL.substring(0, document.URL.length - 1) + ':' + port
              console.log(url);
              setTimeout(function() {
                api.play_video(url);
              }, 4000);
            });

            ui.loading_wrapper.show();

            var percent = 0;
            var loading = setInterval(function(){
              percent += 100/3;
              ui.loading_wrapper.change_stats(percent, 0,'Loading...');
            }, 1000);

            setTimeout(function() {
              clearInterval(loading);
            }, 4000);

            /*setTimeout(function(){
              if($('#loading_wrapper .msg').html()==''){
                api.send({torrent:{stream_stop:true}});
                ui.loading_wrapper.hide();
                ui.cover.hide();
                utils.msgbox('Error fetching this torrent! - Please try again or choose another one.')
              }

            },5000)*/

          })

          slider.show();

        }

      },


      tv_show:{
        slider: function(imdb){

          if(ui.sliders.slider[imdb])
            return;

          ui.sliders.close_all();


          var
          slider   = new ui.slider(imdb),
          movie   = ui.home.catalog.items[imdb],
          html   = utils.tokenizer(movie, $('#tvshow_page_html').html());

          if(!movie){
            return;
            logger.log('error_missing_movie_catalog_id_' + imdb)
          }


          slider.el.addClass('tvshow').append(html);


          var img = (new Image);
          img.onload = function(){

            $('#slider_'+imdb+' .movie_poster').html('<img src="' + movie.bigImage + '">');

          }
          img.src=movie.bigImage;



          if(movie.trailer){

            $('.slider .trailer_btn').click(function(){

              var trailer_slider = new ui.slider('trailer_' + imdb, 'right');
              trailer_slider.el.append('<iframe src="' + movie.trailer + '" style="width:100%;height:100%;" frameborder="0" scrolling="0"></iframe>');
              trailer_slider.show();
            });

          }
          else
            $('.slider .trailer_bar').css('display','none');


          if(!movie.description){
            fetcher.fetch.movie_info(imdb, function(info){

              $('#slider_' + imdb + ' .description').html(info.description);
              $('#slider_' + imdb + ' .runtime').html(info.runtime);
              $('#slider_' + imdb + ' .genre').html(info.genre);
              $('#slider_' + imdb + ' .actors').html(info.actors);


            });
          }
          $('#slider_'+imdb+' .likebox iframe').attr("src", $('#slider_'+imdb+' .likebox iframe').data('src'));

          fetcher.fetch.tv_show(imdb, function(err, items){

            if(err){

              slider.hide();
              utils.msgbox('Error fetching the TV Show');
              logger.log(err);

            }
            else{

              ui.home.catalog.tv_show.items = [items, imdb];

              var
              seasons_counter  = 0,
              seasons_cont   = $('#slider_' + imdb + ' .choose_season select');

              for(var i in items){
                seasons_cont.append('<option value="'+i+'">' + locale.translate('season') + ' ' + i + '</div>');

                if(!seasons_counter){

                  ui.home.catalog.tv_show.set_season(i);
                }

                seasons_counter++;
              }

              seasons_cont.css('display','inline');


            }

          });


          slider.show();

        },

        set_season:function(season_id){

          var
          imdb      = ui.home.catalog.tv_show.items[1],
          episodes     = ui.home.catalog.tv_show.items[0][season_id],
          episodes_cont   = $('#slider_' + imdb + ' .episodes_box'),
          poster_url    = $('#slider_'+imdb+' .movie_poster img').attr('src');

          episodes_cont.html('');

          for(var i=0;i<episodes.length;i++){
            episodes_cont.append('<div onclick="ui.home.catalog.tv_show.show_episode(\''+season_id+'\','+i+')" class="episode"><div class="episode_num">' + (i+1) + '</div></div>');
          }

          ui.home.catalog.tv_show.show_episode(season_id,0);
          episodes_cont[0].scrollTop=0;

        },

        show_episode:function(season_id, episode_id){

          var
          imdb  = ui.home.catalog.tv_show.items[1],
          episode  = ui.home.catalog.tv_show.items[0][season_id][episode_id];

          $('#slider_' + imdb + ' .episode.activated').removeClass('activated');
          $('#slider_' + imdb + ' .episode:nth-child(' + (episode_id+1) + ')').addClass('activated');
          $('#slider_' + imdb + ' .episode_title').html(episode.title);
          $('#slider_' + imdb + ' .episode_description').html(episode.synopsis);
          $('#slider_' + imdb + ' .watch_btn').css('visibility','visible');
          $('#slider_' + imdb + ' .torrents').html('')

          if(episode.items && episode.items.length){
            $('#slider_' + imdb + ' .watch_btn').css('visibility','visible');

            var html = $('#torrent_option_html').html();
            for(var i=0;i<episode.items.length;i++){

              var option = utils.tokenizer({
                quality:  episode.items[i].quality,
                peers:    episode.items[i].torrent_seeds + ' Seeds, &nbsp;' + episode.items[i].torrent_peers + ' Peers',
                health:    utils.calculateTorrentHealth(episode.items[i].torrent_seeds, episode.items[i].torrent_peers)

              }, html);
              $(option).appendTo('#slider_' + imdb + ' .torrents').click(function(){

                $('#slider_'+imdb+' .torrent_option.activated').removeClass('activated');
                $(this).addClass('activated');

              });

            }
            $('#slider_' + imdb + ' .torrent_option:nth-child(1)').addClass('activated')


            api.subtitles = [];
            fetcher.scrappers.torrentsapi_subs(imdb, season_id, episode_id, function(subs){
                for(var i=0;i<subs.length;i++){
                                api.subtitles.push(subs[i]);
                }
            })

          }
          else{
            $('#slider_' + imdb + ' .watch_btn').css('visibility','hidden');
            $('#slider_' + imdb + ' .episode_description').append('<div style="padding-top:20px;font-size:14px;color:red">No available torrents for this episode at this time. Please come back later</div>')
          }



          $('#slider_' + imdb + ' .watch_btn').unbind('click').click(function(){
            var el = $('#slider_' + imdb + ' .torrent_option.activated');

            if(!el.length){
              utils.msgbox('Error - please choose a torrent');
              return;
            }

            var idx = el.index();

            if(!episode.items[idx] || !episode.items[idx].torrent_url){

              utils.msgbox('Error - please choose a diffrent torrent');
              el.remove();
              $(slider_selector + ' .torrent_option').eq(0).addClass('activated');

              return;
            }



            var
            torrent   = episode.items[idx].torrent_url,
            video_file   = episode.items[idx].file;

            api.send({torrent:{stream:[torrent, video_file]}});

            socket.once('streamUrl', function(port){
              var url = document.URL.substring(0, document.URL.length - 1) + ':' + port
              console.log(url);
              setTimeout(function() {
                api.play_video(url);
              }, 4000);
            });

            ui.loading_wrapper.show();

            var percent = 0;
            var loading = setInterval(function(){
              percent += 100/3;
              console.log(percent);
              ui.loading_wrapper.change_stats(percent, 0,'Loading...');
            }, 1000);

            setTimeout(function() {
              clearInterval(loading);
            }, 4000);
            /*setTimeout(function(){
              if($('#loading_wrapper .msg').html()==''){
                api.send({torrent:{stream_stop:true}});
                ui.loading_wrapper.hide();
                ui.cover.hide();
                utils.msgbox('Error fetching this torrent! - Please try again or choose another one.')
              }

            },5000)*/

          })


        }


      },

      center:function(){
        $('#movies_catalog').css('padding-left', Math.floor(($(window).width()- 8 - 158*Math.floor($(window).width() / 158))/2) + 'px')
      }

    }

  },

  cover:{
    show:function(close_callback){

      $('.cover').remove();
      $('<div class="cover"><div class="close">X</div></div>').appendTo('body')
      setTimeout(function(){
          $('.cover').css({opacity:1});
      },1);
      $('.cover .close').click(function(){

        ui.cover.hide();
        if(close_callback)
          close_callback();

      });

    },
    hide:function(){
      $('.cover').attr("ontransitionEnd","this.parentNode.removeChild(this)").css({opacity:0});
    }
  },

  sliders:{
    slider:{},
    close_all:function(){

      for(var i in ui.sliders.slider)
        ui.sliders.slider[i].hide();

    }
  },
  slider:  function(id, position){

    if(ui.sliders[id]){

      return ui.sliders[id];

    }
    else{

      var
      positions = (function(){

        var pos = {
          "bottom": [{"top": "50%"}, {"top": "200%"}],
          "right": [{"left": "50%"}, {"left": "200%"}],
          "left": [{"left": "50%"}, {"left": "-200%"}]
        }

        return position && pos[position] ? [pos[position],position] : [pos['bottom'], 'bottom'];

      })(),
      slider = $('<div id="slider_' + id + '" class="slider ' + positions[1] + '"><div class="close" onclick="ui.sliders.slider[\'' + id + '\'].hide()">&nbsp;X</div></div>');


      slider.appendTo('body');
      ui.sliders.slider[id] = {
        el: slider,
        show: function(){
          setTimeout(function(){slider.css(positions[0][0])},1);
        },
        hide: function(){
          slider.attr('ontransitionEnd', '$(this).remove()').css(positions[0][1]);
          delete ui.sliders.slider[id];
        }
      }

    }

    return ui.sliders.slider[id];

  },

  loading_wrapper:{
    show: function(){
      ui.loading_wrapper.change_stats(0,0,'');
      document.getElementById('loading_wrapper').style.display='inline';
      ui.cover.show(function(){
        api.send({torrent:{stream_stop:true}});
        ui.loading_wrapper.hide();
      });
    },

    hide: function(){

      document.getElementById('loading_wrapper').style.display='none';

    },

    change_stats: function(percentage, speed, msg){

      percentage = Math.round(percentage);

      $('#loading_wrapper .progress_bar .fill').css('width', percentage+'%');
      $('#loading_wrapper .percentage').html(percentage+'%');
      $('#loading_wrapper .msg').html(msg);

    },


  },
  events:{


    watch_btn_click:function(){

      //ui.loading_wrapper.show();

      var
      slider    = document.section.chosen[0].checked ? 'movie_slider' : 'tvshow_slider',
      torrent   = $('#' + slider + ' .torrents_list').val().toString()!='0' ? $('#' + slider + ' .torrents_list').val().split(',') : $('#' + slider + ' .torrents_list option')[1].value.split(','),
      subtitles   = $('#' + slider + ' .subtitles_list').val().toString()!='0' ? $('#' + slider + ' .subtitles_list').val() : null;

      app.torrent.get(torrent[0], torrent[1], subtitles);

    }

  }

}
