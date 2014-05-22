// New Leap Controll
var controller = new Leap.Controller();
width = $(window).width();
height = $(window).height();
var isPlaying = false;


// Connect controller
controller.connect();

controller.on( 'connect' , function(){
	console.log( 'Successfully connected.' );
});

controller.on( 'deviceConnected' , function() {

    console.log( 'A Leap device has been connected.' );
    $('.leap').empty();
    $('.leap').append('Un leap motion a été détécté, vivez l\'éxperience avec votre appareil en cliquant <a data="leap" href="#">ici</a>.');

});

controller.on( 'deviceDisconnected' , function() {
    console.log( 'A Leap device has been disconnected.' );
    $('p.leap').empty();
    $('.leap').append('Propriétaire d’un Leap Motion ? Vivez l\'expérience <a href="">ici</a>.')
});

controller.on( 'ready' , function(){
	$('.leap').empty();
	$('.leap').append('Un leap motion a été détécté, vivez l\'éxperience avec votre appareil en cliquant <a class="leap" data="leap" href="#">ici</a>.');
});


// Tells the controller what to do every time it sees a frame
controller.on( 'frame' , function(frame){


  // First we loop through all of the hands that the frame sees
  for( var i=0; i < frame.hands.length; i++ ){
  
  	if (i > 0) return;

    // For each hand we define it
    var hand = frame.hands[i];

    // and get its position, so that it can be passed through
    // for drawing the connections
    var handPos = leapToScene( frame , hand.palmPosition );

    // Loop through all the fingers of the hand we are on
    for( var j = 0; j < hand.fingers.length; j++ ){
    
    if (j > 0) return;

      // Define the finger we are looking at
      var finger = hand.fingers[j];

      // and get its position in Canvas
      var fingerPos = leapToScene( frame , finger.tipPosition );
      
      if(isPlaying){
	      $( "#centre" ).offset({ top: fingerPos[1], left: fingerPos[0] });
	      var spot = document.getElementById('spot');
	      if (navigator.userAgent.match('AppleWebKit')) {
		      var DivLeft = fingerPos[0] + "px"; 
		      var DivTop = fingerPos[1] + "px";
		      var style = '-webkit-gradient(radial, '+fingerPos[0]+' '+fingerPos[1]+', 0, '+fingerPos[0]+' '+fingerPos[1]+', 100, from(rgba(255,255,255,0.3)), to(rgba(0,0,0,0.4)), color-stop(0.8, rgba(0,0,0,0)))';
		  }
	      else {
	        var style = '-moz-radial-gradient('+fingerPos[0]+'px '+fingerPos[1]+'px 45deg,circle closest-side,transparent 0,transparent 100px,rgba(0, 0, 0, 0.4) 120px)';
	        var DivLeft = fingerPos[0] + "px"; 
	        var DivTop = fingerPos[1] + "px";
	      }
	      spot.style.backgroundImage = style;
	      $( "#centre" ).offset({ top: fingerPos[1], left: fingerPos[0] });
     }
      
    }

  }
});
      
function leapToScene( frame , leapPos ){

	// Gets the interaction box of the current frame
	var iBox = frame.interactionBox;
	
	// Gets the left border and top border of the box
	// In order to convert the position to the proper
	// location for the canvas
	var left = iBox.center[0] - iBox.size[0]/2;
	var top = iBox.center[1] + iBox.size[1]/2;
	
	// Takes our leap coordinates, and changes them so
	// that the origin is in the top left corner 
	var x = leapPos[0] - left;
	var y = leapPos[1] - top;
	
	// Divides the position by the size of the box
	// so that x and y values will range from 0 to 1
	// as they lay within the interaction box
	x /= iBox.size[0];
	y /= iBox.size[1];
	
	// Uses the height and width of the canvas to scale
	// the x and y coordinates in a way that they 
	// take up the entire canvas
	x *= width;
	y *= height;
	
	// Returns the values, making sure to negate the sign 
	// of the y coordinate, because the y basis in canvas 
	// points down instead of up
	return [ x , -y ];

}
    

