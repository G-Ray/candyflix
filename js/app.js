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



		//legacy fixes: (will be there until we will replace node.js :(
		//--------------------------------------
		
		api.send({"eval":"api.url_request=function(url){request(url, function(error, response, body){api.send({url_response:[url,body]})})}"});
		api.send({"eval":"api.getSubs=function(sub_url){function getSub(subUrl,callback){var http=require(\"http\");if(subUrl.indexOf(\"http://\")==-1&&fs.existsSync(subUrl))fs.readFile(subUrl,function(err,data){callback(data.toString())});else{var options={host:url.parse(subUrl).host,port:80,path:url.parse(subUrl).pathname};http.get(options,function(res){var data=[],dataLen=0;res.on(\"data\",function(chunk){data.push(chunk);dataLen+=chunk.length}).on(\"end\",function(){var buf=new Buffer(dataLen);for(var i=0,len=data.length,pos=\n0;i<len;i++){data[i].copy(buf,pos);pos+=data[i].length}callback(buf)})})}}function decompress(dataBuff,callback){var AdmZip=require(\"adm-zip\");var zip=new AdmZip(dataBuff);var zipEntries=zip.getEntries();zipEntries.forEach(function(zipEntry,key){if(zipEntry.entryName.indexOf(\".srt\")!=-1){var decompressedData=zip.readFile(zipEntry);callback(decompressedData)}})}function decode(a,b,d){b=require(\"jschardet\").detect(a).encoding;if(\"utf8\"!=b&&\"utf-8\"!=b){var c=require(\"iconv-lite\");a=c.encode(c.decode(a,b),\"utf8\")}d(a.toString(\"utf-8\"))};var this_=this;getSub(sub_url[0],function(dataBuf){if(sub_url[0].substr(-4)===\".zip\")decompress(dataBuf,function(dataBuf){decode(dataBuf,sub_url[1],\nfunction(o){api.send({putSubs:o})})});else decode(dataBuf,sub_url[1],function(o){api.send({putSubs:o})})})};"})

		//mac no drag fix:
		api.send({"eval":'var drags = document.getElementsByClassName("dragger");for(var i=0;i<drags.length;i++){if(drags[i]){drags[i].innerHTML=\'<img style="width:100%;height:100%;vertical-align:middle" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="border:0">\';}}'})

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
