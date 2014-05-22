var player={
	
	params : {
		video:'',
		onloaded:function(){},
		onplay:function(){},
		onfinished:function(){}
	},

	init : function (options) {
		this.params=$.extend(this.params,options);
		$(this.params.video).bind('timeupdate',this.updateProgress);
		$(this.params.video).bind('ended',this.onFinished);
		
	},
	
	
	playPause : function () {
		var media=$(player.params.video)[0];
		$(player.params.button).removeClass('loading');
		
			media.play();
			$(player.params.video).addClass('play');
			$(player.params.button).addClass('off');
			player.params.onplay.call(this);
		
		},

	
	onFinished : function () {
		$(player.params.video)[0].play();
	},
	

} 


player.init({
	video:'#video',
	onloaded:function(){
		console.log('loaded');
		player.playPause();
	},
	onplay:function(){
		console.log('playing');  
	},

	onfinish:function(){
		console.log('finished');
	}
});

player.playPause();

$('#progressBar').on('click',player.setTime);
$('#random').on('click',player.random);
$("#video").prop('muted', true);

















