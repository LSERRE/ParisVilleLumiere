
$( document ).ready(function() {

	// génère le code pour sync mobile
	$('#mobileCode').append(roomId);	

	/* Pour la scene */ 
	var scene = $('#scene-wrap');
	scene.hide();

	/* La page sync */
	var sync = $('#sync');
	sync.hide();

	/* Pour passer d'une scene à l'autre sceneNbr */
	var sceneNbr = 0;

	var start = $('.welcome .button');
	start.on('click', loadScene);
	$('.leap').on('click', 'a', loadScene);


	// variable pour définir le device
	var usage;

	
	    
	// function pour charger une scène
	function loadScene(e) {
		e.preventDefault();
		sceneNbr++;
		usage = $(this).attr('data');
		$.cookie('device', usage, { expires: 1 });
		$.cookie('sceneNbr', sceneNbr, { expires: 1 });

	    $('#status').fadeIn(); 
	    $('#preloader').fadeIn('slow');

	    if ( usage == 'mouse' || usage == 'leap' ) {
	    	setTimeout(function() {
		        var nextScene = 'scene' + sceneNbr + '.html';
				$.ajax({
		            url: nextScene,
		            success: function(data){
		                $('#scene-wrap').html(data);
		                $.ajax({
							dataType: 'script',
						    url: 'javascripts/scene.js',
						    crossDomain:true
						});
		            }	
		        });
		        
				scene.show();
			}, 1000);  

	     	setTimeout(function() {
		        $('#status').fadeOut(); 
		        $('#preloader').fadeOut('slow');
			}, 4000);  

			if ( usage == 'leap' ) {
				isPlaying = true;
			} 	
	    }
	    else if ( usage == 'mobile' ) {

	     	setTimeout(function() {
	    		$('#sync').show();
		        $('#status').fadeOut(); 
		        $('#preloader').fadeOut('slow');	
			}, 1000);   	
	    }
	}


});
