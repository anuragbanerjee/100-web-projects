counter = 0;
over = false;
checked = []
answers = new Array();
answers[0] = [0, 1, 2];
answers[1] = [3, 4, 5];
answers[2] = [6, 7, 8];
answers[3] = [0, 3, 6];
answers[4] = [1, 4, 7];
answers[5] = [2, 5, 8];
answers[6] = [0, 4, 8];
answers[7] = [2, 4, 6];
scores = {};
scores["X"] = 0;
scores["O"] = 0;
scores["XO"] = 0;
turn = "X"

function id(selector){
	return document.getElementById(selector);
	document.getElementsByClassName(selector);
	document.getElementsByTagName(selector);
}

function makeEditable(){
	input =  prompt("Name?");
	(input != null && input != "") ? this.innerHTML = input : null;
}

function togglesettingsdialog(){
	dialog = id("settingsdialog")
	if(dialog.style.display == "none"){
		dialog.style.display = "inline";
	}
	else{
		dialog.style.display = "none"
	}
}

function review(){
	for(i = 0; i < answers.length; i++){
		x = boxes[answers[i][0]].innerHTML + boxes[answers[i][1]].innerHTML + boxes[answers[i][2]].innerHTML
		if(x == "XXX" || x == "OOO"){
			for (j = 0; j < 3; j++){
				boxes[answers[i][j]].style.backgroundColor = "red";
				boxes[answers[i][j]].style.color = "white";
				boxes[answers[i][j]].style.borderColor= "red";
			}
			scores[x[0]]++
			if(x[0] == "X"){winner = xname.innerHTML; window.turn = "O"}
			else{winner = oname	.innerHTML;window.turn = "O"}
			alert("Game Over. " + winner + " won.");
			id("xscore").innerHTML = scores.X;
			id("oscore").innerHTML = scores.O;
			over = true
			clear();
			break;
		}
	}
}

function clear(){
		counter = 0;
		over = false;
	for(i = 0; checked.length; i++){
		box = checked[i]
		box.innerHTML =  "";
		box.style.backgroundColor = "white";
		box.style.borderColor = "lightgray";
		box.style.borderRadius = "lightgray";
		box.style.color = "black";
	}
}

function switchTurns(){
	if(window.turn == "X"){window.turn = "O"}
	else{window.turn = "X"};
}

function change(){
	if(this.innerHTML != "X" && this.innerHTML != "O"){
	this.innerHTML = window.turn;
	this.innerHTML == "X" ? this.style.color = "green" : this.style.color = "red"
	switchTurns()
	checked.push(this);
    review();
	counter += 1;
	if(counter == 9){
		alert("Game over. It's a tie.");
		over = true;
		scores["XO"] += 1
		id("xoscore").innerHTML = scores.XO;
		clear();
	}
}
}

function init(){
	xname = id("xname");
	oname = id("oname");
	xname.addEventListener("click", makeEditable);
	oname.addEventListener("click", makeEditable);
	id("settingsbutton").addEventListener("click", togglesettingsdialog);
	boxes = document.getElementsByTagName("td");
	for(i = 0; i < boxes.length; i++){ 
		boxes[i].addEventListener("click", change);
}
}

window.addEventListener("load", init, false);