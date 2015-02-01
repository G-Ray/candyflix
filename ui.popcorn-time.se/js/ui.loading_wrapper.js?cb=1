ui.loading_wrapper = {

	init:function(){
		for(var i=0;i<50;i++)
		$('<div class="bar"></div>').appendTo('#loading_wrapper .incont .bars_cont')

		var elems = document.getElementsByClassName('bar');

		var increase = Math.PI * 2 / elems.length;
		var x = 0, y = 0, angle = 0;

		for (var i = 0; i < elems.length; i++) {
			var elem = elems[i];
			var radius = 115;
			x = radius * Math.cos(angle) + radius;
			y = radius * Math.sin(angle) +radius;
			elem.style.position = 'absolute';
			elem.style.left =  x + 'px';
			elem.style.top = y + 'px';
			var rot = angle * 180 / Math.PI - 90;
			elem.style['-webkit-transform'] = "rotate("+rot+"deg)";
			angle += increase;
		}
	},

	show: function(){

		this.percent = 0;
		ui.loading_wrapper.change_stats(0,0,0,0,'');

		$('#loading_wrapper').addClass('activated');
		$('body').addClass('loading');
/*
		if(!hostApp.vpn_isConnected())
			$('#loading_wrapper .icon.locked').css('visibility','hidden');

		else
			$('#loading_wrapper .icon.locked').css('visibility','visible');


*/
	},

	hide: function(native_call){

		$('#loading_wrapper').removeClass('activated');
		$('body').removeClass('loading');
		$('#loading_wrapper .bar').removeClass('on')
		this.percent=0;

		if(!native_call)
			app.torrent.cancel();
	},

	change_stats: function(percentage, speed, seeders, peers, msg){

		percentage = Math.round(percentage);
		var
		from 	= this.percent;
		to		= Math.ceil(percentage/2);

		if(from>to){
			from=0;
			$('#loading_wrapper .bar').removeClass('on')
		}

		if(to){
			$('#loading_wrapper .bar').slice(from, to).addClass('on');
		}
		this.percent=to;


		$('#loading_wrapper .percents').html(percentage+'%');
		$('#loading_wrapper .peers .val').html(seeders  + ' / ' + peers );
		$('#loading_wrapper .speed .val').html(speed + ' Kb/s');
		$('#loading_wrapper .msg').html(locale.translate(msg));

	},


}
