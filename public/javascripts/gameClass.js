function player(id){
  this.id            = id;
  this.smoothingLR   = new Array();
  this.smoothingFB   = new Array();
  this.smoothedLR    = 0;
  this.smoothedFB    = 0;
  this.width = $(window).width();
  this.height = $(window).height();
  this.x = this.width/2;
  this.y = this.height/2;

  var theDevice = $.cookie('device');
   
  this.draw = function(num) { 
     if ( theDevice == 'mobile' ) {
      var spot = document.getElementById('spot');
      $( "#centre" ).offset({ top: this.y, left: this.x });

      if (navigator.userAgent.match('AppleWebKit')) {
        var DivLeft = this.x + "px"; 
        var DivTop = this.y + "px";
        var style = '-webkit-gradient(radial, '+this.x+' '+this.y+', 0, '+this.x+' '+this.y+', 100, from(rgba(255,255,255,0.3)), to(rgba(0,0,0,0.4)), color-stop(0.8, rgba(0,0,0,0)))';
      }
      else {
        var style = '-moz-radial-gradient('+this.x+'px '+this.y+'px 45deg,circle closest-side,transparent 0,transparent 100px,rgba(0, 0, 0, 0.4) 120px)';
        var DivLeft = this.x + "px"; 
        var DivTop = this.y + "px";
      }
      spot.style.backgroundImage = style;
    }    
    
  }

  this.update = function(){
    //Stay within Bounds
    if(this.x < 0){
      this.x = 0;
    }else if(this.x > this.width-50){
      this.x = this.width-50;
    }

    if(this.y < 0){
      this.y = 0;
    }else if(this.y > this.height-50){
      this.y = this.height-50;
    }
    
  }
}