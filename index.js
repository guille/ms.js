/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) return parse(val);
  if (type === 'number' && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) return;
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|seconds?|secs?|s|minutes?|mins?|ms?|hours?|hrs?|h|days?|dy|d|weeks?|wks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years', 'year', 'yrs', 'yr', 'y':
      return n * y;
    case 'weeks', 'week', 'wks', 'wk', 'w':
      return n * w;
    case 'days', 'day', 'dy', 'd':
      return n * d;
    case 'hours', 'hour', 'hrs', 'hr', 'h':
      return n * h;
    case 'minutes', 'minute', 'mins', 'min', 'm':
      return n * m;
    case 'seconds', 'second', 'secs', 'sec', 's':
      return n * s;
    case 'milliseconds', 'millisecond', 'msecs', 'msec', 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) return Math.round(ms / d) + 'd';
  if (msAbs >= h) return Math.round(ms / h) + 'h';
  if (msAbs >= m) return Math.round(ms / m) + 'm';
  if (msAbs >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) return plural(ms, msAbs, d, 'day');
  if (msAbs >= h) return plural(ms, msAbs, h, 'hour');
  if (msAbs >= m) return plural(ms, msAbs, m, 'minute');
  if (msAbs >= s) return plural(ms, msAbs, s, 'second');
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}