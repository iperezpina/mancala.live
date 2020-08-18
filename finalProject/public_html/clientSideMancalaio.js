


///////////////////////////////////////////////////////////ACCOUNT CREATION JAVASCRIPT ////////////////////////////////////////////////////////////////////////////////////////////////




/*
Login button on the front page 
*/
function loginHome() {
	window.location.href = '/login.html';
}

/*
Login for user creations

*/
function login() {
	var usernameSend = $('#usernameLogin').val();
	var passwordSend = $('#passwordLogin').val();
	//console.log(usernameSend);
	//console.log(passwordSend);
	sessionStorage.setItem("username", usernameSend);
	$.ajax({
		url: '/login',
		data: { 'username': usernameSend, 'password': passwordSend },
		method: 'POST',
		success: function (result) {
			if (result) {
				window.location.href = '/index.html';
			} else {
				$('#loginError').html('Issue loggin in with that info')
			}
		}

	});

}

//changes the html of the page
function change() {
	if (sessionStorage.getItem('username') != null) {
		var elem = document.getElementById('clear');
		elem.parentNode.removeChild(elem);
		$('#greeting').html('Welcome ' + sessionStorage.getItem('username') + '!');
	}
}


function goToHelp() {
	window.location.href = '/help.html';

}
function goToIndex() {
	window.location.href = '/index.html';

}

function goToLeaderboard() {
	window.location.href = '/leaderboard.html';

}




//Function for adding a user to the databases, uses Jquery for the adding
function addUser() {
	var usernameSend = $('#UsernameIn').val();
	var passwordSend = $('#PassIn').val();
	sessionStorage.setItem("username", usernameSend);

	//console.log(usernameSend);
	//console.log(passwordSend);

	$.ajax({
		url: '/add/user',
		data: { 'username': usernameSend, 'password': passwordSend },
		method: 'POST',
		success: function (result) {
			if (result) {
				//alert("Successful!");
				window.location.href = '/index.html';
				$('#errorCheck').html("");
			} else {
				$('#errorCheck').html("Username already taken!");
			}

		}

	});
}



////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////LeaderBoard shiz////////////



setInterval(updateLeaderboard, 10);

function updateLeaderboard() {


	$.ajax({
		url: '/update/leaderboard',
		method: 'GET',
		success: function (result) {
			result.sort(function (a, b) {
				return parseFloat(a.username) - parseFloat(b.username);
			});

			var leaderBoard = '';

			for (i in result) {
				let wins = Object.keys(result[i]);
				let user = String(wins[0]);
				let score = result[i][user];
				//console.log(score);
				leaderBoard += "<div class=\"row\">";
				leaderBoard += "<div class=\"name\"> " + user + "</div><div class=\"score\"> Wins: " + score + "</div>";
				leaderBoard += "</div>"

			}

			$("#container").html(leaderBoard);

		}

	});

}




function updateWin() {
	//Function for adding a user to the databases, uses Jquery for the adding

	var usernameSend = sessionStorage.getItem('username');

	//console.log(usernameSend);
	//console.log(passwordSend);

	$.ajax({
		url: '/update',
		data: { 'username': usernameSend },
		method: 'POST',
		success: function (result) {
			if (result) {
				;
			}
		}


	});

}

//////////////////////////////Servers shiz//////////////////////////////////////


function goToOnline() {

	if (sessionStorage.getItem('username') == null) {
		alert("Please make a account or login to play online");
	} else {
		window.location.href = '/online.html'
	}
}


function allServers() {
	$.ajax({
		url: '/search/',
		method: 'GET',
		success: function (result) {
			let master = '';

			for (i in result) {
				let pass;
				let current = result[i];
				if (current.password == null) {
					pass = 'protected'
				} else {
					pass = "open"
				}

				master += '</br> <span class="buttons"><input onclick="joinGame();" type="button" id="onlineGame" value="';
				master += "id: " + current.serverid + "         username:" + current.usernameOne + "         password: " + pass + '">';
				master += '</span> </br>'

			}
			$('#secondCol').html(master);
		}
	});

}


function searchServer() {
	var keyword = $('#search').val();

	$.ajax({
		url: '/search/' + String(keyword),
		method: 'GET',
		success: function (result) {
			let master = '';
			for (i in result) {
				let pass;
				let current = result[i];
				if (current.password == null) {
					pass = 'protected'
				} else {
					pass = "open"
				}

				master += '</br> <span class="buttons"><input onclick="joinGame();" type="button" id="onlineGame" value="';
				master += "id: " + current.serverid + "         username:" + current.usernameOne + "         password: " + pass + '">';
				master += '</span> </br>'

			}
			$('#secondCol').html(master);
		}
	});

}



function postToMongo() {
	let serverid = $('#serverid').val();
	let password = $('#password').val();
	let user = sessionStorage.getItem('username');

	$.ajax({
		url: '/create/',
		data: { 'serverid': serverid, 'pass': password, 'user': user },
		method: 'POST',
		success: function (result) {
			if (result) {
				alert('success');
				sessionStorage.setItem('check', 't');
				window.location.href = '/index.html'
			} else {
				alert('error please try again, maybe with a different serverid')
			}
		}
	});

}

sessionStorage.setItem('check', 'f');


function joinGame() {
	let serverid = $('#serverid').val();
	let password = $('#password').val();
	let user = sessionStorage.getItem('username');

	$.ajax({
		url: '/create/',
		data: { 'serverid': serverid, 'pass': password, 'user': user },
		method: 'POST',
		success: function (result) {
			if (result) {
				alert('success');
				window.location.href = '/online.html';
			} else {
				alert('error please try again, maybe with a different serverid')
			}
		}
	});


}


setInterval(checkifOnline, 1);


function checkifOnline() {
	let check = sessionStorage.getItem('check');
	if (check == 't') {
		alert('pooo');
	}
}

















///////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////BACKEND MANCALA JAVASCRIPT/////////////////////////////////






var masterBoard = [];

var marbleBank;

var nextPossibleMove = 7;

var plyerMode;

var turnCheck = false;
var newTurn = true;
var player = 0;


function changeToPlayer1() {
	player = 1;
	turnCheck = true;
	newTurn = true;
}

function changeToPlayer2() {
	player = 2;
	turnCheck = true;
	newTurn = true;

}


function changeToPlayer2() {
	if(playerMode == 'AI'){
		player = 2;
		turnCheck = true;
		newTurn = true;

		var randomHole = Math.floor(Math.random() * (5 + 1) + 0);
		if(randomHole == 0){
			clickZero();
		}
		else if(randomHole == 1){
			clickOne();
		}
		else if(randomHole == 2){
			clickTwo();
		}
		else if(randomHole == 3){
			clickThree();
		}
		else if(randomHole == 4){
			clickFour();
		}
		else if(randomHole == 5){
			clickFive();
		}
		
		var startingNum = marbleBank;

		for(var i = 0; i < startingNum; i++){
			if(i == 0 ){
				var nextClick = parseInt(randomHole) + 1;
			}
			if(nextClick > 12){
				nextClick = 0;
			}
			if(nextClick == 0){
				clickZero();
			}
			else if(nextClick == 1){
				clickOne();
			}
			else if(nextClick == 2){
				clickTwo();
			}
			else if(nextClick == 3){
				clickThree();
			}
			else if(nextClick == 4){
				clickFour();
			}
			else if(nextClick == 5){
				clickFive();
			}
			else if(nextClick == 6){
				clickSix();
			}
			else if(nextClick == 7){
				clickSeven();
			}
			else if(nextClick == 8){
				clickEight();
			}
			else if(nextClick == 9){
				clickNine();
			}
			else if(nextClick == 10){
				clickTen();
			}
			else if(nextClick == 11){
				clickEleven();
			}
			else if(nextClick == 12){
				clickTwelve();
			}
			nextClick++;

		}
		
	}
	else{
		player = 2;
		turnCheck = true;
		newTurn = true;
	}
}

//check if one side also wins

function newGame() {
	var checkVal = $("input[name='GAMEMODE']:checked").val();
	console.log(checkVal + " the value of checking checked");
	if(checkVal != 'AI' && checkVal != '2player'){
		alert("Pick a game mode please. Either AI or 2player mode. AI would be you against an AI and 2 Players mode is between you and an actual person.");
	}
	else{
		if(checkVal != '2player'){
			playerMode = 'AI';
		}
		else{
			playerMode = '2p';
		}
		
		masterBoard = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
		marbleBank = 0;
		for (i = 0; i < 14; i++) {
			let idGet = "#table" + String(i);
			$(idGet).val(masterBoard[i]);
		}

		var result = '<svg height="40" width="40">';
		for (var i = 0; i < 4; i++) {
			var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
			var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

			result += '<circle cx="';
			result += x.toString();
			result += '" cy="';
			result += y.toString();
			var color = getRandomColor();
			result += '" r="4" stroke="black" stroke-width="1" fill="'
			result += color;
			result += '" />';
		}
		result += '</svg>';
		$('#circle0').html(result);
		$('#circle1').html(result);
		$('#circle2').html(result);
		$('#circle3').html(result);
		$('#circle4').html(result);
		$('#circle5').html(result);
		$('#circle7').html(result);
		$('#circle8').html(result);
		$('#circle9').html(result);
		$('#circle10').html(result);
		$('#circle11').html(result);
		$('#circle12').html(result);
		update('#table13', '#circle13', 0);
		update('#table6', '#circle6', 0);
	}
}

function didTheyWin() {
	var keepTrackOfP1Holes = 0;
	var keepTrackOfP2Holes = 0;

	var totalLeftOverP1 = 0;
	var totalLeftOverP2 = 0;

	for (var i = 0; i < 6; i++) {
		let idGet = "#table" + String(i);
		let isZero = parseInt($(idGet).val());
		if (isZero == 0) {
			keepTrackOfP2Holes++;
		}
		else {
			totalLeftOverP2 += isZero;
		}

	}

	for (var i = 7; i < 13; i++) {
		let idGet = "#table" + String(i);
		let isZero = parseInt($(idGet).val());
		if (isZero == 0) {
			keepTrackOfP1Holes++;
		}
		else {
			totalLeftOverP1 += isZero;

		}

	}
	if (keepTrackOfP1Holes == 6 && marbleBank == 0) {
		var player1Pot = parseInt($('#table13').val());
		var player2Pot = parseInt($('#table6').val());

		var totalPotP2 = player2Pot + totalLeftOverP2;
		update('#table6', '#circle6', totalPotP2);

		for (var i = 0; i < 6; i++) {
			let idGet = "#table" + String(i);
			let circleGet = "#circle" + String(i);
			update(idGet, circleGet, 0);

		}
		console.log(player1Pot + " total player1 score before player 1 holes should be empty");
		console.log(player2Pot + " total player2 score before 1");
		console.log(totalPotP2 + " total player2 score after 1");

		if (player1Pot > totalPotP2) {

			alert('PLAYER 1 WINS!');
		}
		else {
			alert('PLAYER 2 WINS!');
		}


	}

	else if (keepTrackOfP2Holes == 6 && marbleBank == 0) {

		var player1Pot = parseInt($('#table13').val());
		var player2Pot = parseInt($('#table6').val());

		var totalPotP1 = player1Pot + totalLeftOverP1;
		update('#table13', '#circle13', totalPotP1);

		for (var i = 7; i < 13; i++) {
			let idGet = "#table" + String(i);
			let circleGet = "#circle" + String(i);
			update(idGet, circleGet, 0);

		}

		console.log(player1Pot + " total player1 score before player 2 holes should be empty");
		console.log(player2Pot + " total player2 score before 2");
		console.log(totalPotP1 + " total player1 score after 2");


		if (totalPotP1 > player2Pot) {
			alert('PLAYER 1 WINS!');
		}
		else {

			alert('PLAYER 2 WINS!');
		}
	}

	updateWin();

}

//Recieved from online source 
function getRandomColor() {
	var characterSet = '0123456789ABCDEF';
	var randomColor = '#';
	for (var i = 0; i < 6; i++) {
		randomColor += characterSet[Math.floor(Math.random() * 16)];
	}
	return randomColor;
}

function update(tableNum, circleVal, currentVal) {
	var result = '<svg height="40" width="40" >';
	for (var i = 0; i < currentVal; i++) {
		var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
		var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

		result += '<circle cx="';
		result += x.toString();
		result += '" cy="';
		result += y.toString();
		var color = getRandomColor();
		result += '" r="4" stroke="black" stroke-width="1" fill="'
		result += color;
		result += '" />';
	}
	result += '</svg>';
	$(circleVal).html(result);
	$(tableNum).val(currentVal);

}

//Click seven is the function that handles the seven button
function clickSeven() {
	// turnCheck is when a player first starts out, if it is 1 then go into it
	//Player 1 is the first player, only they can play these rows
	if (player == 2 || turnCheck) {

		//NextPossible Move accounts if the last button was a 5 or  6 depending on player
		//Turn check must be true in order for a turn to be active, by clikcing the player button
		// new Turn is if the player is moving for the first time


		//Truth Table correct = (T, T) OR T
		if ((nextPossibleMove == 7 && turnCheck) || newTurn) {

			//Making sure the newTurn check can no longer be used to pick up from anywhere
			newTurn = false;

			//If the marblebank is zero for the intial pickup go into this code
			//first pickup
			if (marbleBank == 0) {

				//Change the html
				marbleBank += $("#table7").val();
				$('#table7').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle7').html('');

				//The only next possible move is 8.
				nextPossibleMove = 8;

				//If the marble bank is not zero, it means the player is depostiting marbles into a slot
			} else if (marbleBank != 0) {

				//Tank one from marblebank
				marbleBank -= 1;
				//Change html
				let current = $("#table7").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40">';
				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor((Math.random() * 20) + 10);
					var y = Math.floor((Math.random() * 20) + 10);
					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle7').html(result);
				$("#table7").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				//the only next possible move from here is 8.
				nextPossibleMove = 8;

				//Check to see if marbles is empty thus requring the person to switch players
				//If the marble bank is empty then go into turncheck = false, meaning the player 1 wont be allowed to 
				//Play due to it not having marbles
				//Player is equal to zero, player 2 must click the button
				//newTurn is now true as player 2 can pick up from anywhere
				if (marbleBank == 0) {
					var currentValue = $('#table7').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table5').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						console.log(typeof total13 + " hopefully a number!");
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table7').val(0);
						update('#table7', '#circle7', 0);

						$('#table5').val(0);
						update('#table5', '#circle5', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 1 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();
}



function clickEight() {

	if (player == 1 || turnCheck) {
		if ((nextPossibleMove == 8 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {

				marbleBank += $("#table8").val();
				$('#table8').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle8').html('');

				nextPossibleMove = 9;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table8").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';
				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle8').html(result);
				$("#table8").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 9;

				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table8').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table4').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table8').val(0);
						update('#table8', '#circle8', 0);

						$('#table4').val(0);
						update('#table4', '#circle4', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 1 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();
}


function clickNine() {

	if (player == 1 || turnCheck) {

		if ((nextPossibleMove == 9 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table9").val();
				$('#table9').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle9').html('');
				nextPossibleMove = 10;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table9").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';
				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle9').html(result);
				$("#table9").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 10;

				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table9').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table3').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table9').val(0);
						update('#table9', '#circle9', 0);

						$('#table3').val(0);
						update('#table3', '#circle3', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 1 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}


function clickTen() {

	if (player == 1 || turnCheck) {

		if ((nextPossibleMove == 10 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table10").val();
				$('#table10').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle10').html('');

				nextPossibleMove = 11;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table10").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';
				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle10').html(result);
				$("#table10").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 11;

				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table10').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table2').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table10').val(0);
						update('#table10', '#circle10', 0);

						$('#table2').val(0);
						update('#table2', '#circle2', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 1 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();
}


function clickEleven() {

	if (player == 1 || turnCheck) {

		if ((nextPossibleMove == 11 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table11").val();
				$('#table11').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle11').html('');

				nextPossibleMove = 12;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table11").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';
				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle11').html(result);
				$("#table11").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 12;
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table11').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table1').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table11').val(0);
						update('#table11', '#circle11', 0);

						$('#table1').val(0);
						update('#table1', '#circle1', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 1 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();
}

function clickTweleve() {

	if (player == 1 || turnCheck) {

		if ((nextPossibleMove == 12 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table12").val();
				$('#table12').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle12').html('');

				nextPossibleMove = 13;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table12").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';
				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle12').html(result);
				$("#table12").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				if (player == 1) {
					nextPossibleMove = 13;
				}
				else {
					nextPossibleMove = 0;
				}
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table12').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table0').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						console.log(typeof total13 + " hopefully a number!");
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table12').val(0);
						update('#table12', '#circle12', 0);

						$('#table0').val(0);
						update('#table0', '#circle0', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 1 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();
}

function clickThirteen() {

	if (player == 1) {

		if ((nextPossibleMove == 13 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table13").val();
				$('#table13').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 0;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table13").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="80" width="40" >';

				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (70 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle13').html(result);
				$("#table13").val(current + 1);

				nextPossibleMove = 0;


				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				//Check to see if marbles is empty thus requring the person to switch players
                /*
                if (marbleBank == 0) {
                    turnCheck = false;
                    player = 0;

                }
                */
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 1 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}

	didTheyWin();
}

/////////////////////Player 2/////////////////////////////

function clickZero() {
	if (player == 2 || turnCheck) {

		if ((nextPossibleMove == 0 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table0").val();
				$('#table0').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle0').html('');

				nextPossibleMove = 1;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table0").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';

				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';

				$('#circle0').html(result);
				$("#table0").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 1;
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table0').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table12').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						console.log(typeof total13 + " hopefully a number!");
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table0').val(0);
						update('#table0', '#circle0', 0);

						$('#table12').val(0);
						update('#table12', '#circle12', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 2 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}


function clickOne() {

	if (player == 2 || turnCheck) {

		if ((nextPossibleMove == 1 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table1").val();
				$('#table1').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle1').html('');

				nextPossibleMove = 2;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table1").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';

				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle1').html(result);
				$("#table1").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 2;
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table1').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table11').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;

						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table1').val(0);
						update('#table1', '#circle1', 0);

						$('#table11').val(0);
						update('#table11', '#circle11', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 2 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}


function clickTwo() {

	if (player == 2 || turnCheck) {

		if ((nextPossibleMove == 2 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table2").val();
				$('#table2').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle2').html('');

				nextPossibleMove = 3;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table2").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';

				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle2').html(result);
				$("#table2").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 3;
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table2').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table10').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;

						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table2').val(0);
						update('#table2', '#circle2', 0);

						$('#table10').val(0);
						update('#table10', '#circle10', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 2 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}



function clickThree() {

	if (player == 2 || turnCheck) {

		if ((nextPossibleMove == 3 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table3").val();
				$('#table3').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle3').html('');

				nextPossibleMove = 4;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table3").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';
				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle3').html(result);
				$("#table3").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 4;
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table3').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table9').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;

						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table3').val(0);
						update('#table3', '#circle3', 0);

						$('#table9').val(0);
						update('#table9', '#circle9', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 2 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}



function clickFour() {

	if (player == 2 || turnCheck) {

		if ((nextPossibleMove == 4 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table4").val();
				$('#table4').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle4').html('');

				nextPossibleMove = 5;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table4").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';

				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle4').html(result);
				$("#table4").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 5;
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table4').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table8').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;
						console.log(typeof total13 + " hopefully a number!");
						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table4').val(0);
						update('#table4', '#circle4', 0);

						$('#table8').val(0);
						update('#table8', '#circle8', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 2 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}


function clickFive() {

	if (player == 2 || turnCheck) {

		if ((nextPossibleMove == 5 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table5").val();
				$('#table5').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				$('#circle5').html('');

				nextPossibleMove = 6;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table5").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="40" width="40" >';

				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (30 - 10 + 1) + 10);

					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle5').html(result);
				$("#table5").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);
				if (player == 2) {
					nextPossibleMove = 6;
				}
				else {
					nextPossibleMove = 7;
				}
				//Check to see if marbles is empty thus requring the person to switch players
				if (marbleBank == 0) {
					var currentValue = $('#table5').val();

					if (currentValue == 1) {
						let oppositeSideVal = parseInt($('#table7').val());
						let currentPotP1 = parseInt($('#table13').val());
						let currentPotP2 = parseInt($('#table6').val());

						var total13 = currentPotP1 + oppositeSideVal + 1;
						var total6 = currentPotP2 + oppositeSideVal + 1;

						if (player == 1) {
							$('#table13').val(total13);
							update('#table13', '#circle13', total13);
						}
						else {
							$('#table6').val(total6);
							update('#table6', '#circle6', total6);

						}
						$('#table5').val(0);
						update('#table5', '#circle5', 0);

						$('#table7').val(0);
						update('#table7', '#circle7', 0);


					}
					turnCheck = false;
					player = 0;

				}
			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 2 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}



function clickSix() {

	if (player == 2) {

		if ((nextPossibleMove == 6 && turnCheck) || newTurn) {
			newTurn = false;
			if (marbleBank == 0) {
				marbleBank += $("#table6").val();
				$('#table6').val(0);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 7;

			} else if (marbleBank != 0) {
				marbleBank -= 1;
				let current = $("#table6").val();
				current = parseInt(current);
				var amountOfcircles = current + 1;
				var result = '<svg height="80" width="40" >';

				for (var i = 0; i < amountOfcircles; i++) {
					var x = Math.floor(Math.random() * (30 - 10 + 1) + 10);
					var y = Math.floor(Math.random() * (70 - 10 + 1) + 10);
					result += '<circle cx="';
					result += x.toString();
					result += '" cy="';
					result += y.toString();
					var color = getRandomColor();
					result += '" r="4" stroke="black" stroke-width="1" fill="'
					result += color;
					result += '" />';
				}
				result += '</svg>';
				$('#circle6').html(result);
				$("#table6").val(current + 1);
				$('#marblesBank').html('Marbles to use: ' + marbleBank);

				nextPossibleMove = 7;
				//Check to see if marbles is empty thus requring the person to switch players

			}

		} else {
			alert('Illegal Move!');
		}
	} else {
		alert('Only player 2 can use this side. Click the button "PLAYER 1" to indicate you are player 1.');
	}
	didTheyWin();

}


