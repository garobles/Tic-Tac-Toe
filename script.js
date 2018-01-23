$(document).ready(function() {
  $("#show").hide();
  
  var c = document.getElementById("canvas");
  var canvas = c.getContext("2d");
  canvas.lineWidth = 2;
  canvas.strokeStyle = "#F3F2F2";
  
  var index = 0;
  var i = 0;
  var turnnum = 0;
  var raf;
  var turn = true; //first==true
  var player = true; //if the turn is for a player
  var pc = false;  //if is one player mode
  var states = [0,1,2,3,4,5,6,7,8];
  var win = false;
  var winp1 = 0;
  var winp2 = 0;
  var nowin = 0;
  var mode = 'P2 ';
  var mode1 = 'Player 2: ';
  var mode2 = 'P1';
  
  
  var O=function(l,u){
    this.draw=function(){
      canvas.beginPath;
      canvas.moveTo(l+84,u+56);
      canvas.arc(l+56,u+56,28,0,2*Math.PI);
      canvas.stroke();
      canvas.closePath();
    }
  }
  var X=function(l,u){
    this.draw=function(){
      canvas.beginPath();
      canvas.moveTo(l+28, u+28);
      canvas.lineTo(l+84, u+84);
      canvas.moveTo(l+84, u+28);
      canvas.lineTo(l+28, u+84);
      canvas.stroke();
      canvas.closePath();
    };
  };
  
  var square = function(l, u) {
    this.u = u;
    this.l = l;
    this.state = false;
    this.reset=function(){
      canvas.clearRect(l,u,111,111);
    };
    this.check = function() {
      if (!this.state) {
        if (
          this.x >= l &&
          this.x <= l + 112 &&
          this.y >= u &&
          this.y <= u + 112
        ) {
          if (turn) {
            new X(l,u).draw();
            states[i] = "x";
            this.state = true;
            turnnum++;
            show(mode,mode1);
          } else {
            new O(l,u).draw();
            states[i] = "o";
            this.state = true;
            turnnum++;
            show(mode2 ,mode1);
          }
          turn = !turn;
        }
      }
    };
  };
  
  var squares = [];
  squares[0] = new square(0, 0);
  squares[1] = new square(112, 0);
  squares[2] = new square(224, 0);
  squares[3] = new square(0, 112);
  squares[4] = new square(112, 112);
  squares[5] = new square(224, 112);
  squares[6] = new square(0, 224);
  squares[7] = new square(112, 224);
  squares[8] = new square(224, 224);
  
  var line = function(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.draw = function() {
      canvas.beginPath();
      canvas.moveTo(this.x1, this.y1);
      canvas.lineTo(this.x2, this.y2);
      canvas.stroke();
      canvas.closePath();
    };
  };
  var lines = [];
  lines[0] = new line(112, 0, 112, 0);
  lines[1] = new line(224, 0, 224, 0);
  lines[2] = new line(0, 112, 0, 112);
  lines[3] = new line(0, 224, 0, 224);
  
  function draw() {
    canvas.clearRect(0, 0, c.width, c.heigth);
    lines[index].draw();
    if (index < 2) {
      if (lines[index].y1 <= c.height) {
        lines[index].y1 += 9;
      } else {
        index++;
      }
    } else if (index < 4) {
      if (lines[index].x1 <= c.width) {
        lines[index].x1 += 9;
      } else {
        index++;
      }
    } else {
      window.cancelAnimationFrame(raf);
    }
    raf = window.requestAnimationFrame(draw);
  }
  function animation() {
    raf = window.requestAnimationFrame(draw);
  }
  
  function show(a, b) {
    $("h1").animate({ fontSize: "30px", top: "-80px" }, "slow");
    $("#buttons").remove();
    $("#show").show();
    setTimeout(animation, 300);
    $("#information").html(
      "<h2>" +
        a +
        "turn</h2><p>Player 1: " +
        winp1 +
        "</p><p>" +
        b +
        winp2 +
        "</p><p>Draw: " +
        nowin +
        '</p><a class="btn btn-link" href="#" style="color:#F3F2F2; font-size:25px" id="reset"">Reset</a>'
    );
  }
  
  function reset(){
    turn = true;
    states = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    win = false;
    turnnum = 0;
    for(j=0;j<squares.length;j++){
      squares[j].state=false;
      squares[j].reset();
    }
  }
  function checkwin(){
     if (states[0] == states[1] && states[0] == states[2]) {
        win = true;
      } else if (states[0] == states[3] && states[0] == states[6]) {
        win = true;
      } else if (states[0] == states[4] && states[0] == states[8]) {
        win = true;
      } else if (states[1] == states[4] && states[1] == states[7]) {
        win = true;
      } else if (states[2] == states[4] && states[2] == states[6]) {
        win = true;
      } else if (states[2] == states[5] && states[2] == states[8]) {
        win = true;
      } else if (states[3] == states[4] && states[3] == states[5]) {
        win = true;
      } else if (states[6] == states[7] && states[6] == states[8]) {
        win = true;
      } else if (turnnum == 9){
        nowin++;
        alert("Draw");
        reset();
        show(mode2, mode1);
      }
      if (win) {
        if (turn) {
          winp2++;
          alert("Second Player Wins");
          reset();
        } else {
          alert("First Player Wins");
          winp1++;
          reset();
        }
        show(mode2, mode1);
      }
  }
  
  function betamax(){
    
  }
  
    $("#canvas").click(function(e) {
      var x = e.offsetX;
      var y = e.offsetY;
      for (i = 0; (i < squares.length)&&player; i++) {
        squares[i].x = x;
        squares[i].y = y;
        squares[i].check(mode, mode1);
      }
      setTimeout(checkwin,200);
      if(pc){
        player=false;
        betamax();
      }
    });
  
  $("#buttons").click(function() {
    $(this).html(
      '<div class="btn-group" role="group"><a class="btn btn-link button" href="#" id="One">One Player</a><a class="btn btn-link button" href="#" id="Two">Two Players</a></div>'
    );
  });

  $("#buttons").on("click", "#One", function() {
    $("#buttons").remove();
    $("#content").append(
      '<div id=buttons><div class="btn-group" role="group"><a class="btn btn-link button" href="#" id="First">First</a><a class="btn btn-link button" href="#" id="Second">Second</a></div></div>'
    );
  });
  $("#content").on("click", "#First", function() {
    mode2 = "Your ";
    mode1 = "PC: ";
    mode = "PC ";
    player = true;
    pc = true;
    show(mode2, mode1);
  });
  $("#content").on("click", "#Second", function() {
    mode2 = "PC ";
    mode1 = "PC: ";
    mode = "Your ";
    player = false;
    pc = true;
    betamax();
    show(mode2, mode1);
  });
  $("#buttons").on("click", "a#Two", function() {
    mode2 = "P1 ";
    mode1 = "Player 2: ";
    mode = "P2 ";
    player = true;
    pc = false;
    show(mode2, mode1);
  });
  $("#information").on("click","#reset",function(){
    location.reload(true);
  }
  );
});
