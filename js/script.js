$(function () {
  /* disable  double click event default behavior to prevent zoom in touch screens */
  $(document).on('dblclick', function (event) {
    event.preventDefault();
  });
});

/* game properties */
const gameTime = 30;
let seconds = gameTime;
let gameIntervalId;
const itemsDroppedPerInterval = 8;
const timeInterval = 2; // Seconds

const objectSpeedRange = [1000, 3500]; // in milliseconds
const objectSizeRange = [100, 150]; // in px

let currentPlayer;
let score = 0;

// const smashSound = new Audio();
// smashSound.src = 'sounds/crash.mp4';

function dropBox() {
  let object = createObject();

  //insert gift element
  $('#gameContainer').append(object);

  //random start for animation
  setTimeout(function () {
    object.addClass('move');
  }, random(0, 5000));
}

function createObject() {
  let xPosition = random(100, $('#gameContainer').width() - 100);
  let yPosition = $('#gameContainer').height() + 100;
  let width = random(objectSizeRange[0], objectSizeRange[1]);
  let height = width * 1.07;
  let velocity = linearEquation(
    width,
    objectSizeRange[0],
    objectSizeRange[1],
    objectSpeedRange[0],
    objectSpeedRange[1]
  );

  const newObject = $('<div/>', {
    class: 'box',
    style:
      'width:' +
      width +
      'px;' +
      'height:' +
      height +
      'px;' +
      'left:' +
      xPosition +
      'px;' +
      'top:' +
      yPosition +
      'px;' +
      'transition: transform ' +
      velocity +
      'ms linear;',
  });

  if (velocity < objectSpeedRange[1] * 0.1) {
    newObject.addClass('double');
  }

  //remove this object when animation is over
  newObject.one(
    'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
    function (event) {
      $(this).remove();
    }
  );

  return newObject;
}

function hitOjectHandler(objectElement) {
  $(objectElement).addClass('smashed');
  const gifUrl = 'url("images/crashing-effect.gif?nocache=' + Date.now() + '")';
  $(objectElement).css('backgroundImage', gifUrl);
  setTimeout(function () {
    $(objectElement).fadeOut(500);
  }, 800);

  if (objectElement.classList.contains('double')) {
    score += 200;
  } else {
    score += 100;
  }
  $('.points').html((score < 10 ? '0' : '') + String(score));
}

function countdown() {
  seconds--;
  $('#counter').html((seconds < 10 ? '0' : '') + String(seconds));
  if (seconds > 0) {
    setTimeout(countdown, 1000);
  } else {
    endGame();
  }
}

function startGame() {
  $('#instructionsPage').hide();
  $('#gamePage').show();

  for (i = 0; i < itemsDroppedPerInterval; i++) {
    dropBox();
  }
  gameIntervalId = setInterval(function () {
    for (i = 0; i < itemsDroppedPerInterval; i++) {
      dropBox();
    }
  }, timeInterval * 1000);

  countdown();
}

function endGame() {
  currentPlayer.score = score;
  $('#finalScore').html(Math.floor(score));
  $('#gamePage').hide();
  $('#resultPage').show();
  clearInterval(gameIntervalId);
  saveToFirebase(currentPlayer);
}

function resetGame() {
  score = 0;
  seconds = gameTime;
  $('.points').html('00');
  $('.box').remove();
  // $('.gloves').css({
  //   left: '45%',
  //   top: '80%',
  // });
}

function restartGame() {
  resetGame();
  $('#resultPage').hide();
  $('#homePage').show();
}

$('#registerButton').click(function (eInfo) {
  eInfo.preventDefault();
  currentPlayer = registerPlayer();
  if (currentPlayer) {
    $('#homePage').hide();
    $('#instructionsPage').show();
  }
});

$('#startGameButton').click(startGame);

$('#gameContainer').on('click', function (eInfo) {
  let objectElement;
  if (
    eInfo.target.classList.contains('box') &&
    !eInfo.target.classList.contains('smashed')
  ) {
    objectElement = eInfo.target;
  } else {
    return;
  }
  // smashSound.play();
  hitOjectHandler(objectElement);
});

$('#restartGameButton').click(restartGame);

/* toggle Full Screen */
function toggleFullscreen() {
  var element = document.getElementById('fullscreenElement');
  var icon = document.getElementById('fullscreenIcon');

  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    // If already in fullscreen, exit fullscreen
    exitFullscreen();
    icon.className = 'fas fa-expand'; // Change icon to represent fullscreen
  } else {
    // If not in fullscreen, request fullscreen
    requestFullscreen(element);
    icon.className = 'fas fa-compress'; // Change icon to represent exit fullscreen
  }
}

function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/* math Functions */
function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
/* 
  
linear equation formula:to map values from range x to range y.
  y=mx+b
  y is the value in range y,
  x is the value in range x,
  m is the slope of the line,
  b is the y-intercept.

*/
function linearEquation(x, x1, x2, y1, y2) {
  let m = (y2 - y1) / (x2 - x1); // slope
  let b = y1 - m * x1;
  let y = m * x + b;
  return y;
}
