jQuery(function($) {
  "use strict";

  // default base price
  var BASE_PRICE = 55.73;

  // current price (fetched below from current.json)
  var CURRENT = 0;

  // path to JSON data
  var DATA_URL = './current.json';

  /**
   * Convert asking price to percentage of base price.
   *
   * Used to convert the current asking price to a percentage in the
   * ajax request at the bottom of this file.
   */
  function to_percent(ask) {
    return Math.round((ask - BASE_PRICE) / BASE_PRICE * 10000) / 100.0;
  }

  /**
   * Get the current time as milliseconds since the epoch.
   *
   * Used to find the current frame in tick() below.
   */
  function now() {
    return (new Date()).getTime();
  }

  /**
   * Convert sprite sheet position to rectangle.
   *
   * Used to generate FRAMES below.
   */
  function to_rect(pos) {
    return {
      x: 14 + 26 * pos.x,
      y: 13 + 31 * pos.y,
      w: 24,
      h: 29,
    };
  }

  /**
   * Convert frame parameters to hash of CSS directives.
   *
   * Used to generate FRAMES below.
   */
  function to_css(rect) {
    return {
      width: rect.w + 'px',
      height: rect.h + 'px',
      'background-position': [rect.x, rect.y].map(function(v) {
        return (-v) + 'px';
      }).join(' '),
    };
  }

  /**
   * Frame list.
   *
   * Note: map of time and rate to CSS.
   */
  var FRAMES = [{
    // hurt0-c
    time: { min: 0, max: 250 },
    rate: { min: -5, max: 5 },
    pos:  { x: 1, y: 0 },
  }, {
    // hurt0-r
    time: { min: 250, max: 500 },
    rate: { min: -5, max: 5 },
    pos:  { x: 2, y: 0 },
  }, {
    // hurt0-c
    time: { min: 500, max: 750 },
    rate: { min: -5, max: 5 },
    pos:  { x: 1, y: 0 },
  }, {
    // hurt0-l
    time: { min: 750, max: 1000 },
    rate: { min: -5, max: 5 },
    pos:  { x: 0, y: 0 },
  }, {
    // hurt1-c
    time: { min: 0, max: 250 },
    rate: { min: -15, max: -5 },
    pos:  { x: 1, y: 1 },
  }, {
    // hurt1-r
    time: { min: 250, max: 500 },
    rate: { min: -15, max: -5 },
    pos:  { x: 2, y: 1 },
  }, {
    // hurt1-c
    time: { min: 500, max: 750 },
    rate: { min: -15, max: -5 },
    pos:  { x: 1, y: 1 },
  }, {
    // hurt1-l
    time: { min: 750, max: 1000 },
    rate: { min: -15, max: -5 },
    pos:  { x: 0, y: 1 },
  }, {
    // hurt2-c
    time: { min: 0, max: 250 },
    rate: { min: -30, max: -15 },
    pos:  { x: 1, y: 2 },
  }, {
    // hurt2-r
    time: { min: 250, max: 500 },
    rate: { min: -30, max: -15 },
    pos:  { x: 2, y: 2 },
  }, {
    // hurt2-c
    time: { min: 500, max: 750 },
    rate: { min: -30, max: -15 },
    pos:  { x: 1, y: 2 },
  }, {
    // hurt2-l
    time: { min: 750, max: 1000 },
    rate: { min: -30, max: -15 },
    pos:  { x: 0, y: 2 },
  }, {
    // hurt3-c
    time: { min: 0, max: 250 },
    rate: { min: -50, max: -30 },
    rect: { x: 14 + 26 * 1, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt3-r
    time: { min: 250, max: 500 },
    rate: { min: -50, max: -30 },
    rect: { x: 14 + 26 * 2, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt3-c
    time: { min: 500, max: 750 },
    rate: { min: -50, max: -30 },
    rect: { x: 14 + 26 * 1, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt3-l
    time: { min: 750, max: 1000 },
    rate: { min: -50, max: -30 },
    rect: { x: 14 + 26 * 0, y: 14 + 31 * 3, w: 24, h: 29 },
  }, {
    // hurt4-c
    time: { min: 0, max: 250 },
    rate: { min: -75, max: -50 },
    rect: { x: 14 + 26 * 1, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // hurt4-r
    time: { min: 250, max: 500 },
    rate: { min: -75, max: -50 },
    rect: { x: 14 + 26 * 2, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // hurt4-c
    time: { min: 500, max: 750 },
    rate: { min: -75, max: -50 },
    rect: { x: 14 + 26 * 1, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // hurt4-l
    time: { min: 750, max: 1000 },
    rate: { min: -75, max: -50 },
    rect: { x: 14 + 26 * 0, y: 16 + 31 * 4, w: 24, h: 29 },
  }, {
    // dead
    time: { min: 0, max: 1001 },
    rate: { min: -10000, max: -75 },
    rect: { x: 14, y: 335, w: 24, h: 31 },
  }, {
    // invincible
    time: { min: 0, max: 1001 },
    rate: { min: 5, max: 10000 },
    rect: { x: 40, y: 335, w: 24, h: 29 },
  }].map(function(row) {
    return {
      time: row.time,
      rate: row.rate,
      css: to_css(row.rect ? row.rect : to_rect(row.pos)),
    };
  });

  /**
   * get current frame based on time and rate.
   */
  function get_frame(time, rate) {
    // time, modulo 1000
    var tm = time % 1000;

    return FRAMES.find(function(row) {
      return (
        (tm >= row.time.min) && (tm < row.time.max) &&
        (rate >= row.rate.min) && (rate < row.rate.max)
      );
    }) || FRAMES[0];
  }

  /**
   * update animation.
   */
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
    $('#rate').val((val == 'current') ? CURRENT : val);

    // stop event
    return false;
  });

  // set base price
  $('#base').text(BASE_PRICE);

  $('#help-toggle').click(function() {
    // toggle help visibility
    $('#help').toggleClass('hidden');

    // update text
    var text = $('#help').hasClass('hidden') ? 'Show Help' : 'Hide Help';
    $(this).text(text);

    // stop event
    return false;
  });

  // fetch current price as percent and populate #rate
  fetch(DATA_URL).then(function(r) {
    return r.json();
  }).then(function(r) {
    // cache current price
    CURRENT = to_percent(r.ask);

    // update field
    $('#rate').val(CURRENT);
  });
});
