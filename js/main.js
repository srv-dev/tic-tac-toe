
$(document).ready(function() {

  let boardArray, turn, win, playerMarkers;
  const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
  ];

  const markers = {
    "X" : $('<span>').text('X').attr('class','options')[0].outerHTML ,
    "O" : $('<span>').text('O').attr('class','options')[0].outerHTML ,
    "icon1" : $('<img>').attr('src','icons/iron-man.ico').attr('class','icons')[0].outerHTML ,
    "icon2" : $('<img>').attr('src','icons/ww.ico').attr('class','icons')[0].outerHTML
  };


  // This function initializes and re-initializes global variables.
  const init = function() {
    boardArray = [ '', '', '', '', '', '', '', '', '' ];
    turn = player1;
    win = null;
    playerMarkers = {
      "player1" : null ,
      "player2" : null
    };
    let retrieveScores = localStorage.getItem('scoreBoard');
    if(retrieveScores !== null) {
      $('#scoreBoard').html(retrieveScores);
    }
    $('.playersClass').hide();
    updatePlayerWins();
  };

  // This function returns game's winner
  const getWinner = function() {

    for(let i=0; i< winningCombos.length; i++){

      const combo = winningCombos[i];
      const board0 = boardArray[combo[0]];
      const board1 = boardArray[combo[1]];
      const board2 = boardArray[combo[2]];
      if((board0 != '') && (board0 === board1) && (board1 === board2)) {
        return board0;
      }
    }

    if(!boardArray.includes(''))
      return 'D';
  };

  const highlightWinGame = function(win) {

  };

  const updateLocalStore = function(win) {
    if(win === "player1"){
      let p1WinCounter = localStorage.getItem('p1WinCounter');
      if(p1WinCounter === null) {
        p1WinCounter = 0;
      }
      localStorage.setItem('p1WinCounter', ++p1WinCounter);
    } else {
      let p2WinCounter = localStorage.getItem('p2WinCounter');
      if(p2WinCounter === null) {
        p2WinCounter = 0;
      }
      localStorage.setItem('p2WinCounter', ++p2WinCounter);
    }

    localStorage.setItem('scoreBoard', $('#scoreBoard')[0].innerHTML);
  };

  const updatePlayerWins = function() {
    let p1WinCounter = localStorage.getItem('p1WinCounter') || 0;
    let p2WinCounter = localStorage.getItem('p2WinCounter') || 0;

    $('#player1Wins').html(p1WinCounter);

    $('#player2Wins').html(p2WinCounter);
  };

  // This function handles players turns and declares winner.
  const handleTurn = function(event) {

    let element = '';
    // Disables board once game is over.
    if(win != null || playerMarkers['player1'] === null || playerMarkers['player2'] === null)
      return;

    const squares = Array.from($('#board div'));

    let index = squares.findIndex(function(square) {
      return square === event.target;
    });
    // This returns if square is already played.
    if(boardArray[index] != '')
      return;

    turn = (turn === "player1" ? "player2" : "player1");
    boardArray[index] = turn;

    element = markers[playerMarkers[turn]];

    $(event.target).append(element);

    win = getWinner();

    if (win === 'D'){
      $('h2').html(`That's a Draw!!!`);
    } else if (win != null) {
      // highlightWinGame(win);
      $('h2').html(`${turn} wins the game!`);
      $('#won').append($('<div>').append(element));

      if(win === "player1"){
        $('#lost').append($('<div>').append(markers[playerMarkers["player2"]]));
      }else{
        $('#lost').append($('<div>').append(markers[playerMarkers["player1"]]));
      }
      updateLocalStore(win);
      updatePlayerWins();
    } else {
      $('h2').html(`${turn}'s turn!`);
    }
  };

  const iconSelectListener = function(event) {

    if(playerMarkers['player1'] === null) {
      playerMarkers['player1'] = event.target.id;
      $('#playerIcon1').append(markers[playerMarkers['player1']]);
    } else {
      playerMarkers.player2 = event.target.id;
      $('#playerIcon2').append(markers[playerMarkers['player2']]);
      $('.players').off('click');
    }
    $('.playersClass').show();
  };

  $('.players').on('click', iconSelectListener);

  $('.square').on('click', handleTurn);

  $('#reset').on('click', function() {
    init();
    $('h2').html('');
    $('.square').html('');
    $('.players').on('click', iconSelectListener);
    $('.selected-icon').html('');
  });

  init();

});
