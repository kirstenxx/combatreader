var isPlaying = true;
var hasPrePlayed = false;
var textToRead = "";
var wordsToRead = Array(),
	wordsRead = Array();
var startingWords = 0;
var loop = true;
var lastWord = "";
var lastWord2 = "";
var lastWord3 = "";
var lastWord4 = "";
var lastWord5 = "";
var hasPasted = false;

var numBgs = 9;
// $("head").append("<style> body, .behind-main { background-image: url('bg/" + (Math.floor(Math.random() * numBgs) + 1) + ".jpg'); } </style>");

function wordCount(s) {
	if(!s)
		return 0;
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s.split(' ').length;
}



function restart() {
	$(".reader, .wordsLeft, .percent, .secsLeft, .minsLeft").html("");
	textToRead = $("#textarea").val().replace(/( *)\n+( *)|( +)/g, " "); // replace all white space with a single space
	$(".sub-reader-hidden").html(textToRead);
	// if(loop == false)
	// 	$(".sub-reader-ads").html(adsHtml);

	wordsToRead = textToRead.split(" ");
	startingWords = wordsToRead.length;
	lastWord = lastWord2 = lastWord3 = lastWord4 = lastWord5 = "";
	hasPrePlayed = false;
}

function back15() {
	var wordsPushed = 0;
	lastWord5 = "";
	lastWord4 = "";
	lastWord3 = "";
	lastWord2 = "";
	lastWord = "";

	while(wordsPushed < 25 && wordsRead.length > 0) {
		var word = wordsRead.shift();
		wordsToRead.unshift(word);
		wordsPushed ++;
	}

	return;
	var place = 0;
	while(place < 5 && wordsRead.length > place) {
		lastWord5 = lastWord4;
		lastWord4 = lastWord3;
		lastWord3 = lastWord2;
		lastWord2 = lastWord;
		lastWord = wordsRead[place];
		place ++;
	}
}

function doStats() {
	var wordsLeft = wordsToRead.length;
	var percent = Math.floor(100 - wordsLeft / startingWords * 100);
	if(wordsLeft == 0)
		percent = 100;
	if(percent < 0)
		percent = 0;
	var timeLeft = wordsLeft / getSpeed();
	var minsLeft = Math.floor(timeLeft);
	var secsLeft = Math.ceil((timeLeft - minsLeft) * 60);
	if(secsLeft < 10)
		secsLeft = "0" + secsLeft;
	$(".wordsleft").html(wordsLeft);
	$(".percent").html(percent);
	$(".minsleft").html(minsLeft);
	$(".secsleft").html(secsLeft);
}

function play() {
	if(! isPlaying)
		return;

	if(!hasPrePlayed) {
		wordsToRead.unshift("*Start!");
		wordsToRead.unshift("*1");
		wordsToRead.unshift("*2");
		wordsToRead.unshift("*3");
		wordsToRead.unshift("*Ready?");
		hasPrePlayed = true;
	}

	var wordsLeft = wordsToRead.length;
	var word = "";
	if(wordsLeft == 0) {
		if(loop) {
			// restart();
			isPlaying = false;
		} else {
			word = "Done!";
			//$(".reader").html("Done!");
			isPlaying = false;
			//return;
		}

		doStats();
	}

	$(".play").hide();
	$(".pause").show();

	if(wordsLeft > 0)
		word = wordsToRead.shift();
	if(word == "") {
		play();
		return;
	}

	var prePlaying = false;
	if(word.charAt(0) == "*") {
		prePlaying = true;
		word = word.substr(1);
	}

	var additionalDelay = word.length / 6;

	var nextWord = wordsToRead.length > 0 ? wordsToRead[0] : "",
		nextWord2 = wordsToRead.length > 1 ? wordsToRead[1] : "",
		nextWord3 = wordsToRead.length > 2 ? wordsToRead[2] : "",
		nextWord4 = wordsToRead.length > 3 ? wordsToRead[3] : "",
		nextWord5 = wordsToRead.length > 4 ? wordsToRead[4] : "";

	var last = word.charAt(word.length - 1);
	if(last == "." || last == "!" || last == "?") {
		// wordsToRead.unshift(" ");
		additionalDelay += 1.5;
	}
	if(word.charAt(word.length - 1) == ",") {
		additionalDelay += 0.75;
	}

	var firstPart = lastWord5 + " " + lastWord4 + " " + lastWord3 + " " + lastWord2 + " " + lastWord;
	var secondPart = nextWord + " " + nextWord2 + " " + nextWord3 + " " + nextWord4 + " " + nextWord5;
	secondPart = secondPart.replace(/\*/g, "");

	if(word.length > 3) {
		firstPart += " <span class='current-word'>" + word.substr(0,3) + "</span>";
		secondPart = "<span class='current-word'>" + word.substr(3) + "</span> " + secondPart;
	} else {
		firstPart += " <span class='current-word'>" + word + "</span>";
		secondPart = "&nbsp;" + secondPart;
	}

	wordsRead.unshift(word);

	// $(".reader").html(firstPart + " <span class='current-word'>" + word + "</span> " + secondPart);
	// $(".reader").html("<table width='100%' cellpadding='0' cellspacing='0'> \
	// 					<td width='50%' class='reader-cell reader-cell-left'>" + firstPart +
	// 					"</td><td width='50%' class='reader-cell reader-cell-right'>" + secondPart + "</td></tr></table>");

	$(".reader").html("<div class='reader-cell reader-cell-left'>" + firstPart +
						"</div><div class='reader-cell reader-cell-right'>" + secondPart + "</div>");


	if(prePlaying)
		$(".current-word").addClass("pre-playing-word");

	lastWord5 = lastWord4;
	lastWord4 = lastWord3;
	lastWord3 = lastWord2;
	lastWord2 = lastWord;
	lastWord = word;

	var wpm = getSpeed();

	doStats();

	var secsDelay = 60 / wpm + additionalDelay * 30 / wpm;
	if(prePlaying) {
		secsDelay = 0.75;
	}
	setTimeout("play()", secsDelay * 1000 * 17 / 24);
}

function getSpeed() {
	var s = $("#wpm").val(), speed = 0;
	if(s == "")
		speed = 250;
	else
		speed = parseInt(s);

	if(speed < 50)
		return 50;

	return speed;
}

function upSpeed() {
	$("#wpm").val("" + (getSpeed() + 50));
}


function downSpeed() {
	$("#wpm").val("" + (getSpeed() - 50));
}

$(document).ready(function() {
	restart();
	play();

	$(".pause").click(function() {
		isPlaying = false;
		$(".play").show();
		$(".pause").hide();
	})

	$(".play").click(function() {
		if(!isPlaying) {
			isPlaying = true;
			play();
		}
	});

	$(".up-speed").click(function() {
		upSpeed();
	});

	$(".down-speed").click(function() {
		downSpeed();
	});

	$(".back15").click(function() {
		back15();
	});

	$(".restart").click(function() {
		restart();
	});

	$(".load-url").click(function() {
		var url = $("#url-input").val();
		if(url.substr(0,4) != "http")
			url = "http://" + url;
		$("#loading").show();

		var strict = 0;
		if($("#strict_radio").is(":checked"))
			strict = 1;
		$.post("load.php", {url : url}, function(id) {
			window.hash = "" + id;
			$.post("retrieve.php", {id : id, strict : strict}, function(ans) {
				$(".url-preview").show();
				$(".url-preview-text").html(ans);
				$("#loading").hide();
				$("#textarea").val(ans);
			});
		});
	});

	$(".load-url-done, .paste-done").click(function() {
		$(".ads").show();
		$.fancybox.close();
		restart();
		if(!isPlaying)
			play();
	});

	$(".show-paste").click(function() {
		if(!hasPasted)
			$("#textarea").val("");
		hasPasted = true;
	})

	// $("#textarea").click(function() {
	// 	isPlaying = false;
	// 	$(".restart").click();
	// 	loop = false;
	// });

	$("#textarea").change(function() {
		// isPlaying = false;
		// $(".restart").click();
		loop = false;
	});

	$('.read1').click(function() {
		var textArea = document.getElementById('textarea');
		textArea.innerHTML = "Laboris ex consequat in ad ea nostrud ullamco ex ea exercitation laboris exercitation veniam cupidatat excepteur. Ex amet est anim incididunt adipisicing magna irure occaecat amet ex amet ut dolore eu do id sunt. Aute ut laboris anim exercitation laboris ad exercitation est. Eiusmod nulla culpa culpa irure elit incididunt non exercitation. Labore fugiat aliquip veniam velit ex Lorem est fugiat in."
		restart();
		if(!isPlaying)
			play();
	})
	$('.read2').click(function() {
		var textArea = document.getElementById('textarea');
		textArea.innerHTML = "Laborum amet consectetur velit duis tempor cillum amet nisi commodo ad cupidatat incididunt minim occaecat aliquip id sit. Ex voluptate irure Lorem mollit deserunt occaecat est. Commodo ex reprehenderit ad duis anim fugiat dolore occaecat Lorem veniam cillum reprehenderit. Minim consectetur magna irure non sit occaecat duis officia enim minim excepteur minim ad aliqua consectetur. Sit sint adipisicing amet qui ad nisi Lorem deserunt nulla. Velit exercitation cillum id id excepteur irure occaecat aute dolore Lorem adipisicing est incididunt esse";
		restart();
		if(!isPlaying)
			play();
	})
	$('.read3').click(function() {
		var textArea = document.getElementById('textarea');
		textArea.innerHTML = "Pariatur exercitation exercitation adipisicing excepteur et amet elit consectetur consectetur culpa adipisicing ipsum. Mollit ipsum proident aliqua tempor ex et non duis eiusmod velit in anim sunt duis dolore eu irure. Occaecat eiusmod reprehenderit eu labore laboris ut pariatur proident pariatur ea. Labore adipisicing ipsum excepteur labore do quis proident aliquip ea ad exercitation aliquip veniam sint aliquip cillum. Commodo sint aliquip velit aliqua cillum anim magna nostrud occaecat ut sunt ex consequat eu culpa non id. Anim reprehenderit exercitation laboris eiusmod id ad commodo reprehenderit eu ipsum duis ipsum laboris sint est. Cillum officia exercitation nisi non proident nulla incididunt excepteur ipsum veniam amet elit eiusmod duis quis reprehenderit sunt.";
		restart();
		if(!isPlaying)
			play();
	})
	$('.read4').click(function() {
		var textArea = document.getElementById('textarea');
		textArea.innerHTML = "Culpa excepteur minim eu aute ad Lorem ad dolor. Eu deserunt aliqua laborum dolor nisi veniam laborum occaecat et cupidatat sit ex cupidatat minim Lorem esse enim. Esse do cupidatat duis elit labore elit dolor do eiusmod esse mollit laborum qui ipsum aute dolore.";
		restart();
		if(!isPlaying)
			play();
	})

	$(".fancybox").fancybox();
});
