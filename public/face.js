jQuery(function($) {
  "use strict";

  var BASE_PRICE = 55.73;
  var CURRENT = 10;
  var DATA_URL = './current.json';

  function to_percent(ask) {
    return Math.round((ask - BASE_PRICE) / BASE_PRICE * 10000) / 100.0;
  }

  /**
   * get the current time, in milliseconds since the epoch.
   */
  function now() {
    return (new Date()).getTime();
  }

  function to_rect(pos) {
    return {
      x: 14 + 26 * pos.x,
      y: 13 + 31 * pos.y,
      w: 24,
      h: 29,
    };
  }

  function to_css(rect) {
    return {
      width: rect.w + 'px',
      height: rect.h + 'px',
      'background-position': [rect.x, rect.y].map(function(v) {
        return (-v) + 'px';
      }).join(' '),
    };
  }

  var FRAMES = [{
    // hurt0-c
    time: { min: 0, max: 250 },
    rate: { min: -0.5, max: 1 },
    pos:  { x: 1, y: 0 },
  }, {
    // hurt0-r
    time: { min: 250, max: 500 },
    rate: { min: -0.5, max: 1 },
    pos:  { x: 2, y: 0 },
  }, {
    // hurt0-c
    time: { min: 500, max: 750 },
    rate: { min: -0.5, max: 1 },
    pos:  { x: 1, y: 0 },
  }, {
    // hurt0-l
    time: { min: 750, max: 1000 },
    rate: { min: -0.5, max: 1 },
    pos:  { x: 0, y: 0 },
  }, {
    // hurt1-c
    time: { min: 0, max: 250 },
    rate: { min: -2, max: -0.5 },
    pos:  { x: 1, y: 1 },
  }, {
    // hurt1-r
    time: { min: 250, max: 500 },
    rate: { min: -2, max: -0.5 },
    pos:  { x: 2, y: 1 },
  }, {
    // hurt1-c
    time: { min: 500, max: 750 },
    rate: { min: -2, max: -0.5 },
    pos:  { x: 1, y: 1 },
  }, {
    // hurt1-l
    time: { min: 750, max: 1000 },
    rate: { min: -2, max: -0.5 },
    pos:  { x: 0, y: 1 },
  }, {
    // hurt2-c
    time: { min: 0, max: 250 },
    rate: { min: -3, max: -2 },
    pos:  { x: 1, y: 2 },
  }, {
    // hurt2-r
    time: { min: 250, max: 500 },
    rate: { min: -3, max: -2 },
    pos:  { x: 2, y: 2 },
  }, {
    // hurt2-c
    time: { min: 500, max: 750 },
    rate: { min: -3, max: -2 },
    pos:  { x: 1, y: 2 },
  }, {
    // hurt2-l
    time: { min: 750, max: 1000 },
    rate: { min: -3, max: -2 },
    pos:  { x: 0, y: 2 },
  }, {
    // hurt3-c
    time: { min: 0, max: 250 },
    rate: { min: -4, max: -3 },
    rect: { x: 14 + 26 * 1, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt3-r
    time: { min: 250, max: 500 },
    rate: { min: -4, max: -3 },
    rect: { x: 14 + 26 * 2, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt3-c
    time: { min: 500, max: 750 },
    rate: { min: -4, max: -3 },
    rect: { x: 14 + 26 * 1, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt3-l
    time: { min: 750, max: 1000 },
    rate: { min: -4, max: -3 },
    rect: { x: 14 + 26 * 0, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt4-c
    time: { min: 0, max: 250 },
    rate: { min: -5, max: -4 },
    rect: { x: 14 + 26 * 1, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // hurt4-r
    time: { min: 250, max: 500 },
    rate: { min: -5, max: -4 },
    rect: { x: 14 + 26 * 2, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // hurt4-c
    time: { min: 500, max: 750 },
    rate: { min: -5, max: -4 },
    rect: { x: 14 + 26 * 1, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // hurt4-l
    time: { min: 750, max: 1000 },
    rate: { min: -5, max: -4 },
    rect: { x: 14 + 26 * 0, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // dead
    time: { min: 0, max: 1001 },
    rate: { min: -10000, max: -5 },
    rect: { x: 14, y: 335, w: 24, h: 31 },
  }, {
    // invincible
    time: { min: 0, max: 1001 },
    rate: { min: 1, max: 10000 },
    rect: { x: 40, y: 335, w: 24, h: 29 },
  }].map(function(row) {
    return {
      time: row.time,
      rate: row.rate,
      css: to_css(row.rect ? row.rect : to_rect(row.pos)),
    };
  });

  function get_frame(time, rate) {
    // time, modulo 1000
    var tm = time % 1000;

    var frames = FRAMES.filter(function(row) {
      return (
        (tm >= row.time.min) && (tm < row.time.max) &&
        (rate >= row.rate.min) && (rate < row.rate.max)
      );
    });

    return ((frames.length > 0) ? frames[0] : FRAMES[0]);
  }

  // 14x13, 24x29

  function tick() {
    var time = now(),
        rate = +$('#rate').val(),
        frame = get_frame(time, rate);
    // console.log({time: time % 1000, rect: rect});

    // update #face
    $('#face').css(frame.css);
  }

  setInterval(tick, 250);
  $('#rate').keyup(tick).focus();

  $('.set-rate').click(function() {
    var val = $(this).data('val');

    // set value
    $('#rate').val((val == 'current') ? current : val);

    // stop event
    return false;
  });

  $.ajax({
    method: 'GET',
    url: DATA_URL,
    dataType: 'json',
  }).fail(function(r) {
    alert("Couldn't fetch current data.");
  }).done(function(r) {
    CURRENT = to_percent(r.ask);
    $('#rate').val(CURRENT);
  });
});

