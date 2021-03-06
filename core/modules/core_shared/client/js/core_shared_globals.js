"use strict";


/*------------------------------------------------ Polyfills */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

/*------------------------------------------------ Globals */

// provide socket.io and the OL map scope outside of Angular scope
var socket = io();
var Map={};
Map.layers={};

/*------------------------------------------------ Helpers */

/**
 * Check if a value is in an array
 * @param {string | bolean | object | array} value - needle
 * @param {array} array - haystack
 * @returns {bolean}
 * @extends CORE
 * */
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
