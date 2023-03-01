/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

let optionalStartChar = (text) => {
  return startChar(text, {optional: true});
}

let startChar = (text, {optional=false}={}) => {
  var failed = false;
  if(optional) {
    if(text !== "" && /^[0-9]+/.test(text)) {
      failed = true;
    }
  }else if(/^[0-9]+/.test(text)) {
    failed = true;
  }
  if(failed) {
    return "Field cannot start with a number. Start with letter or underscore."
  }
}

let optionalInvalidChar = (text) => {
  return invalidChar(text, {optional: true});
}

let invalidChar = (text, {optional=false}={}) => {
  var failed = false;
  if(optional) {
    if(text !== "" && !/^[a-zA-Z0-9_]+$/.test(text)) {
      failed = true;
    }
  }else if(!/^[a-zA-Z0-9_]+$/.test(text)) {
    failed = true;
  }
  if(failed) {
    return "Invalid characters. Please only use letters, numbers, or underscores."
  }
}

let nanValue = (value) => {
  if (isNaN(Number(value))) {
    return "Must be a number."
  }
}

let negValue = (value) => {
  if (Number(value) < 0) {
    return "Must be non-negative."
  }
}

// function (text) {
//   if(this.parent.model && this.parent.model.collection){
//     var isDuplicate = this.parent.model.collection.some(function (m) { return m.name === text && this.parent.model !== m;
//     }, this);
//     if (isDuplicate) {
//       return "No duplicate entries."
//     }
//   }
// },

module.exports = {
  invalidChar: invalidChar,
  optionalInvalidChar: optionalInvalidChar,
  optionalNameTests: [optionalStartChar, optionalInvalidChar],
  optionalStartChar: optionalStartChar,
  nameTests: [startChar, invalidChar],
  nanValue: nanValue,
  negValue: negValue,
  startChar: startChar,
  intTest: nanValue,
  valueTests: [nanValue, negValue]
}