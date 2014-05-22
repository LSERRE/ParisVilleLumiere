//recuperer les element de l'id spot pour le curseur
var spot = document.getElementById('spot');
var center = document.getElementById('centre');
// var lien = document.getElementById('lien');

// spot.hide();
// center.hide();


//variables verification
var i=0;
var erreur = 0;

//recuperer les données de l'enigme
var enigme = $('#enigme');

//recuper les données des indices
var clue1 = $('#indice1');
var clue2 = $('#indice2');
var clue3 = $('#indice3');

// les deux images de la scène
var bgOn = $('#on');
var bgOff = $('#off');
// close popin button 
var exit = $('.continue');

// pour surveiller l'allumage
var isOn = false;

var next = $('#lien');
next.on('click', nextScene);

function nextScene(e) {
	e.preventDefault();

	// récupère le cookie pour l'incrémenter
	var sceneNbr = $.cookie('sceneNbr');
	sceneNbr++;

	// je reset le cookie avec le niveau au dessus
	$.cookie('sceneNbr', sceneNbr, { expires: 1 });

	$('#status').fadeIn(); 
    $('#preloader').fadeIn('slow');	
    $('#scene').remove();

    if ( sceneNbr != 6 ) {
    	setTimeout(function() {
	        var nextScene = 'scene' + sceneNbr + '.html';
			$.ajax({
	            url: nextScene,
	            success: function(data){
	            	$('#scene-wrap').empty();
	                $('#scene-wrap').html(data);
	                $.ajax({
						dataType: 'script',
					    url: 'javascripts/scene.js',
					    crossDomain:true
					});
	            }	
	        });
		}, 1000);  

	 	setTimeout(function() {
	        $('#status').fadeOut(); 
	        $('#preloader').fadeOut('slow');
		}, 4000); 
    }
    else {
    	var url = "/merci.html";
		$(location).attr('href',url);
    }

    
}

// Affiche/Cache les instructions
function toggleInfo() {
	var intro = $('#intro');
	intro.fadeToggle(1000);
}

// Pour bouger le curseur
function moveDiv(e){
	var x = 0;
    var y = 0;
	
	if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft;
        y = e.clientY + document.body.scrollTop;
    }
	
	if (navigator.userAgent.match('AppleWebKit')) {
		var DivLeft = x+"px"; 
		var DivTop = y+"px";
		var style = '-webkit-gradient(radial, '+x+' '+y+', 0, '+x+' '+y+', 100, from(rgba(255,255,255,0.3)), to(rgba(0,0,0,0.4)), color-stop(0.8, rgba(0,0,0,0)))';
	}
	else {
		var style = '-moz-radial-gradient('+x+'px '+y+'px 45deg,circle closest-side,transparent 0,transparent 100px,rgba(0, 0, 0, 0.4) 120px)';
		var DivLeft = x+"px"; 
		var DivTop = y+"px";
	}
	
	center.style.top = DivTop;
	center.style.left = DivLeft;
	spot.style.backgroundImage = style;
}

// Gère la collision avec .indice
function collision(zone, centre) {
	
	var collision = false ;

	var x1 = zone.position().left;
	var y1 = zone.offset().top;
	var h1 = zone.outerHeight(true);
	var w1 = zone.outerWidth(true);
	var b1 = y1 + h1;
	var r1 = x1 + w1;
	var x2 = centre.offset().left;
	var y2 = centre.offset().top;
	var h2 = centre.outerHeight(true);
	var w2 = centre.outerWidth(true);
	var b2 = y2 + h2;
	var r2 = x2 + w2;
    

	if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
		collision =  false;
	}
	else   {
		collision = true;
	}
  
    if (collision == true) {
    	console.log("colision");
  
		if(zone[0].id=='zone1'){
			$('#indice1').addClass('visible');
			zone.hide();
		} 
		else if (zone[0].id=='zone2'){
			$('#indice2').addClass('visible');
			zone.hide();
		} 
		else if (zone[0].id=='zone3'){
			$('#indice3').addClass('visible');
			zone.hide();
		}
	
	}
}

//Permet de fermer la pop in
function closePopIn(e){
	e.preventDefault();

	wrap = $(this).parent('.wrap');
	popIn = wrap.parent('.pop-in');
	
	popIn.removeClass('visible');
	
	i++;
	question(i);
}

//function pour faire apparaitre l'enigme
function question(iFind){
	var usage = $.cookie('device');
	var scene = $('body').find('#scene');
	var thisScene = scene.attr('class');
	var nbQuestion;

	if ( (thisScene == 'scene1' || thisScene == 'scene4') && iFind == 2 && isOn == false ) {
		nbQuestion = 2;
		if(usage == 'mouse' || usage == 'leap'){
			enigme.fadeIn(800);
		}
		else if (usage =='mobile'){
			socket.emit('afficherQuestion', { scene: thisScene, question: nbQuestion, userNumber : userNum});
		}
	}
	else if ( (thisScene != 'scene1' || thisScene != 'scene4') && iFind == 3 && isOn == false ) {
		nbQuestion = 3;
		if ( usage == 'mouse' || usage == 'leap' ) {
			enigme.fadeIn(800);
		}
		else if ( usage =='mobile' ){
			socket.emit('afficherQuestion', { scene: thisScene, question: nbQuestion, userNumber : userNum});
		}
	}
}

function ActiveLight(){

	var reponse;
	var scene = $('body').find('#scene');
	var thisScene = scene.attr('class');
	// Condition pour les reponse
	if(thisScene=="scene1" || thisScene=="scene5"){
		reponse = document.getElementById('1').checked;
	}
	else if (thisScene=="scene2"){
		reponse = document.getElementById('3').checked;
	}
	else if(thisScene=="scene3" || thisScene=="scene4"){
		reponse = document.getElementById('2').checked;
	}
	
	if (reponse){
		SetLightOn();
	} else {
		document.getElementById('erreur').innerHTML='Mauvaise reponse';
 	}
}


function SetLightOn(){	
	bgOn.fadeIn(1000);
	bgOff.fadeOut(1200);
	$('div').removeClass('spotlight');
	//$('div').removeClass('center');
	center.style.zindex= '0';
	center.style.cursor= 'auto';
	lien.style.visibility = 'visible';
	enigme.fadeOut(700);
	isOn = true;
}


// cache la scene allumée
bgOn.hide();
//cache l'énigme et les indices 
enigme.hide();


// Pour la box d'intro
setTimeout(function() {
    var intro = $('#intro');
	intro.fadeOut(1000);
}, 15000);
// Toggle box d'info 
$('.info').on('click', toggleInfo);

// Ferme la popin 
exit.on('click', closePopIn);

// move spotlight 
var theDevice = $.cookie('device');
if ( theDevice == 'mouse' || theDevice == 'leap') {
	window.onmousemove = moveDiv;
	detectCollision();
}

// Pour écouter la collision
function detectCollision() {
	window.setInterval(function() {
	  collision($('#zone1'), $('#centre'));
	}, 2000);

	window.setInterval(function() {
	  collision($('#zone2'), $('#centre'));
	}, 2000);

	var scene = $('body').find('#scene');
	var laScene = scene.attr('class');
	console.log(laScene);

}


