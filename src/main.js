const { invoke } = window.__TAURI__.tauri;


window.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("pong");

  if (canvas.getContext) {

    document.onkeydown = checkKey;

    let animationId;

    const ctx = canvas.getContext("2d");

    // ball var and the scores
    var ballX = 350;
    var ballY = 250;
    var ballRadius = 10;
    var speed = 2;
    var ballDirectionX = 1; 
    var ballDirectionY = 1; 
    var playerOneScore = 0;
    var playerTwoScore = 0;

    // have this so that we can draw the rects of the player durning the drawball animation
    var playerOne = { x: 30, y: 250, width: 25, height: 100 };
    var playerTwo = { x: 730, y: 250, width: 25, height: 100 };
    var middleLine = { x: 397, y: 0, width: 10, height: 590 };

    function drawRect(rect) {
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    function gameOver(winner){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw the players and the middle line
      ctx.fillStyle = "white";
      drawRect(playerOne);
      drawRect(playerTwo);

      ctx.font = "48px Comic Sans MS";
      ctx.fillText(`${playerOneScore}    ${playerTwoScore}`, 340, 50);

      if (winner == "Opponent") {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "green";
      }
      ctx.font = "50px Comic Sans MS";
      ctx.fillText(`${winner} wins!`, 250, 150);
  
      ctx.fillText("Play Again?", 250, 250);

      ctx.fillText("Quit", 250, 350);

      // quit or restart.
      canvas.addEventListener('click', function(event) {
        const playAgainTextX = 250;
        const playAgainTextY = 250;
        const playAgainTextWidth = ctx.measureText("Play Again?").width;
        const playAgainTextHeight = 30;
    
        if (
            event.clientX >= playAgainTextX &&
            event.clientX <= playAgainTextX + playAgainTextWidth &&
            event.clientY >= playAgainTextY - playAgainTextHeight &&
            event.clientY <= playAgainTextY
        ) {
            location.reload();
        }
    
        const quitTextX = 250;
        const quitTextY = 350; 
        const quitTextWidth = ctx.measureText("Quit").width;
        const quitTextHeight = 30;
    
        if (
            event.clientX >= quitTextX &&
            event.clientX <= quitTextX + quitTextWidth &&
            event.clientY >= quitTextY - quitTextHeight &&
            event.clientY <= quitTextY
        ) {
           invoke("quit_game");
        }
    });


      cancelAnimationFrame(animationId); // Stop the animation
      ballX = 50;
      ballY = 50;
    }

    // this moves the other player around 
    function movePlayerTwo() {
      playerTwo.y = ballY;
      
      // make sure bro stays on the paeg
      playerTwo.y = Math.max(0, Math.min(canvas.height - playerTwo.height, playerTwo.y));

      setTimeout(movePlayerTwo, 200);

    
    }

    // check if the ball is actually touching a player
    function checkCollision(ballX, ballY, player) {
      return (
        ballX + ballRadius > player.x &&
        ballX - ballRadius < player.x + player.width &&
        ballY + ballRadius > player.y &&
        ballY - ballRadius < player.y + player.height
      );
    }

    // collision handler 
    function handleCollision(player) {
      console.log(`Hit ${player === playerOne ? "playerOne" : "playerTwo"}`);
      ballDirectionX *= -1;
      ballDirectionY = Math.random() > 0.5 ? 1 : -1;
      ballY += speed * ballDirectionY;
    }

  

    function drawBall() {
      // clear caanvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);


      // draw the players and the middle line
      ctx.fillStyle = "white";
      drawRect(middleLine);
      drawRect(playerOne);
      drawRect(playerTwo);

      // fill the score on the top 
      ctx.font = "48px Comic Sans MS";
      ctx.fillText(`${playerOneScore}    ${playerTwoScore}`, 340, 50);

      // draw the ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
      ctx.fill();


      // check if ball hits players
      if (checkCollision(ballX, ballY, playerOne)) {
        handleCollision(playerOne);
      } else if (checkCollision(ballX, ballY, playerTwo)) {
        handleCollision(playerTwo);
      }

      // ball speed and movement per frame
      ballX += speed * ballDirectionX;
      ballY += speed * ballDirectionY;

      // add to score if its on the right or left side
      if(ballX == 40){
        playerTwoScore++
        console.log("player two scored");
      } else if (ballX == 754){
        playerOneScore++
        console.log("player one scored");
      }

      // game overss
      if (playerOneScore == 5){
        gameOver("Player One");
      } else if (playerTwoScore == 5){
        gameOver("Opponent");
      }

      // bounce off the walls 
      if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballX = 350;
        ballY = 250;
      }

      if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballDirectionY *= -1;
      }

      animationId = requestAnimationFrame(drawBall);
    }


    // thanks stack overflow for once this is for up and down key presses.
    function checkKey(e) {
      e = e || window.event;
      const movementSpeed = 80;
      if (e.keyCode == "38") {
        console.log("up");
        playerOne.y = Math.max(0, playerOne.y - movementSpeed); 
      } else if (e.keyCode == "40") {
        console.log("down");
        playerOne.y = Math.min(canvas.height - playerOne.height, playerOne.y + movementSpeed); 
      }
    }

    drawBall();
    movePlayerTwo();
  }
});