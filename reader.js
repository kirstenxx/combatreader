
var $wpm = $('#combatreader_wpm');
var interval = 60000/$wpm.val();
var paused = false;
var $space = $('#combatreader_word');
var i = 0;
var zoom = 1;
var autosave = false;
var $words = $('#combatreader_words');
var local_combatreader = {};

function words_load() {
  words_set();
    word_show(0);
    word_update();
    combatreader_pause(true);
  }

/* TEXT SEPARATING */
function words_set() {
  words = $words.val().trim()
  .replace(/([-—])(\w)/g, '$1 $2')
  .replace(/[\r\n]/g, ' {linebreak} ')
  .replace(/[ \t]{2,}/g, ' ')
  .split(' ');
  for (var j = 1; j < words.length; j++) {
    words[j] = words[j].replace(/{linebreak}/g, '   ');
  }
}
/* ON EACH WORD */
function word_show(i) {
  $('#combatreader_progress').width(100*i/words.length+'%');
  var word = words[i];
  var stop = Math.round((word.length+1)*0.4)-1;
  $space.html('<div>'+word.slice(0,stop)+'</div><div>'+word[stop]+'</div><div>'+word.slice(stop+1)+'</div>');
}
function word_next() {
  i++;
  word_show(i);
}
function word_prev() {
  i--;
  word_show(i);
}

/* ITERATION FUNCTION */
function word_update() {
  combatreader = setInterval(function() {
    word_next();
    if (i+1 == words.length) {
      setTimeout(function() {
        $space.html('');
        combatreader_pause(true);
        i = 0;
        word_show(0);
      }, interval);
      clearInterval(combatreader);
    };
  }, interval);
}

/* PAUSING */
function combatreader_pause(ns) {
    if (!paused) {
    clearInterval(combatreader);
    paused = true;
    $('html').addClass('paused');
    if (autosave && !ns) {
      words_save();
    };
  }
}
function combatreader_play() {
  word_update();
  paused = false;
  $('html').removeClass('paused');
}
function combatreader_flip() {
  if (paused) {
    combatreader_play();
  } else {
    combatreader_pause();
  };
}

/* CHANGE THE SPEED */
function combatreader_speed() {
  interval = 60000/$('#combatreader_wpm').val();
  if (!paused) {
    clearInterval(combatreader);
    word_update();
  };
  $('#combatreader_save').removeClass('saved loaded');
}
function combatreader_faster() {
  $('#combatreader_wpm').val(parseInt($('#combatreader_wpm').val())+50);
  combatreader_speed();
}
function combatreader_slower() {
  if ($('#combatreader_wpm').val() >= 100) {
    $('#combatreader_wpm').val(parseInt($('#combatreader_wpm').val())-50);
  }
  combatreader_speed();
}

/* JOG FUNCTIONS */
function combatreader_back() {
  combatreader_pause();
  if (i >= 1) {
    word_prev();
  };
}
function combatreader_forward() {
  combatreader_pause();
  if (i < words.length) {
    word_next();
  };
}

/* WORDS FUNCTIONS */
function combatreader_refresh() {
  clearInterval(combatreader);
  words_set();
  i = 0;
  combatreader_pause();
  word_show(0);
};
function combatreader_select() {
  $words.select();
};
function combatreader_expand() {
  $('html').toggleClass('fullscreen');
}



/* CONTROLS */
$('#combatreader_wpm').on('input', function() {
  combatreader_speed();
});
$('.controls').on('click', 'a, label', function() {
  switch (this.id) {
    case 'combatreader_slower':
      combatreader_slower(); break;
    case 'combatreader_faster':
      combatreader_faster(); break;
    case 'combatreader_pause':
      combatreader_flip(); break;
    case 'combatreader_refresh':
      combatreader_refresh(); break;
    case 'combatreader_select':
      combatreader_select(); break;
    case 'combatreader_expand':
      combatreader_expand(); break;
  };
  return false;
});
$('.controls').on('mousedown', 'a', function() {
  switch (this.id) {
    case 'combatreader_back':
      combatreader_jog_back = setInterval(function() {
        combatreader_back();
      }, 100);
      break;
    case 'combatreader_forward':
      combatreader_jog_forward = setInterval(function() {
        combatreader_forward();
      }, 100);
      break;
  };
});
$('.controls').on('mouseup', 'a', function() {
  switch (this.id) {
    case 'combatreader_back':
      clearInterval(combatreader_jog_back); break;
    case 'combatreader_forward':
      clearInterval(combatreader_jog_forward); break;
  };
});

/* KEY EVENTS */
function button_flash(btn, time) {
  var $btn = $('.controls a.'+btn);
  $btn.addClass('active');
  if (typeof(time) === 'undefined') time = 100;
  setTimeout(function() {
    $btn.removeClass('active');
  }, time);
}
$(document).on('keyup', function(e) {
  if (e.target.tagName.toLowerCase() != 'body') {
    return;
  };
  switch (e.keyCode) {
    case 32:
      combatreader_flip(); button_flash('pause'); break;
    case 37:
      combatreader_back(); button_flash('back'); break;
    case 38:
      combatreader_faster(); button_flash('faster'); break;
    case 39:
      combatreader_forward(); button_flash('forward'); break;
    case 40:
      combatreader_slower(); button_flash('slower'); break;
  };
});
$(document).on('keydown', function(e) {
  if (e.target.tagName.toLowerCase() != 'body') {
    return;
  };
  switch (e.keyCode) {
    case 37:
      combatreader_back(); button_flash('back'); break;
    case 39:
      combatreader_forward(); button_flash('forward'); break;
  };
});



/* INITIATE */
words_load();
$('.read1').click(function() {
  $('.demo-words').replaceWith( '<textarea class="demo-words" id="combatreader_words">Laboris ex consequat in ad ea nostrud ullamco ex ea exercitation laboris exercitation veniam cupidatat excepteur. Ex amet est anim incididunt adipisicing magna irure occaecat amet ex amet ut dolore eu do id sunt. Aute ut laboris anim exercitation laboris ad exercitation est. Eiusmod nulla culpa culpa irure elit incididunt non exercitation. Labore fugiat aliquip veniam velit ex Lorem est fugiat in.</textarea>' );
})
$('.read2').click(function() {
  $('.demo-words').replaceWith( '<textarea class="demo-words" id="combatreader_words">Laborum amet consectetur velit duis tempor cillum amet nisi commodo ad cupidatat incididunt minim occaecat aliquip id sit. Ex voluptate irure Lorem mollit deserunt occaecat est. Commodo ex reprehenderit ad duis anim fugiat dolore occaecat Lorem veniam cillum reprehenderit. Minim consectetur magna irure non sit occaecat duis officia enim minim excepteur minim ad aliqua consectetur. Sit sint adipisicing amet qui ad nisi Lorem deserunt nulla. Velit exercitation cillum id id excepteur irure occaecat aute dolore Lorem adipisicing est incididunt esse.</textarea>' );
})
$('.read3').click(function() {
  $('.demo-words').replaceWith( '<textarea class="demo-words" id="combatreader_words">Pariatur exercitation exercitation adipisicing excepteur et amet elit consectetur consectetur culpa adipisicing ipsum. Mollit ipsum proident aliqua tempor ex et non duis eiusmod velit in anim sunt duis dolore eu irure. Occaecat eiusmod reprehenderit eu labore laboris ut pariatur proident pariatur ea. Labore adipisicing ipsum excepteur labore do quis proident aliquip ea ad exercitation aliquip veniam sint aliquip cillum. Commodo sint aliquip velit aliqua cillum anim magna nostrud occaecat ut sunt ex consequat eu culpa non id. Anim reprehenderit exercitation laboris eiusmod id ad commodo reprehenderit eu ipsum duis ipsum laboris sint est. Cillum officia exercitation nisi non proident nulla incididunt excepteur ipsum veniam amet elit eiusmod duis quis reprehenderit sunt.</textarea>' );
})
$('.read4').click(function() {
  $('.demo-words').replaceWith( '<textarea class="demo-words" id="combatreader_words">Culpa excepteur minim eu aute ad Lorem ad dolor. Eu deserunt aliqua laborum dolor nisi veniam laborum occaecat et cupidatat sit ex cupidatat minim Lorem esse enim. Esse do cupidatat duis elit labore elit dolor do eiusmod esse mollit laborum qui ipsum aute dolore.</textarea>' );
})
