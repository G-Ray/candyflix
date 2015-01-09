ui.vpn_page = {

	show:function(){

		if(ui.sliders.slider.vpn){
			ui.sliders.slider.vpn.hide()
			return;
		}

		var slider = new ui.slider('vpn','left');
		$('#slider_vpn *').not('.close').remove();

		app.state = 'vpn_page';
		slider.destruct = function(){
			app.state='mainWindow';
		}

		slider.el.append($('#vpn_page_html').html())

		ui.vpn_page.updateDisplay();


		slider.show();


	},

	updateDisplay:function(){

		//var hostApp = {vpn_isConnected:function(){return 0},vpn_connect:function(){},vpn_disconnect:function(){}}
		$('#slider_vpn .vpn_icon span.icon').removeClass('spinner').parent().removeClass('rotation');

		if(app.config.hostApp.isVpnConnected){

			$('#slider_vpn .vpn_icon span.icon').removeClass('unlocked').addClass('locked');
			$('#slider_vpn .vpn_button').html('Disconnect').click(function(){
				hostApp.vpn_disconnect();
			});

		}
		else{

			$('#slider_vpn .vpn_icon span.icon').removeClass('locked').addClass('unlocked');
			$('#slider_vpn .vpn_button').html('Connect').click(function(){

				hostApp.vpn_connect();
				$('#slider_vpn .vpn_icon span.icon').removeClass('unlocked');
				$('#slider_vpn .vpn_icon span.icon').addClass('spinner');
				$('#slider_vpn .vpn_icon div').addClass('rotation');
				$('#slider_vpn .vpn_button').html('Connecting...').unbind('click');

				setTimeout(function(){
					if(ui.sliders.slider.vpn)
						ui.vpn_page.updateDisplay();
				},13000)

			});

		}
	}


}
