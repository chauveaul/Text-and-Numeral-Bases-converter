"use strict";

const inputAreaEl = document.querySelector(".input");
const outputAreaEl = document.querySelector(".output");

const originTypeEl = document.querySelector(".origin-type");
const convertTypeEl = document.querySelector(".convert-type");
const btnConvertEl = document.querySelector(".btn--convert");

let originTypeValue = "text";
let convertTypeValue = "binary";

//TODO: Refactor interchangeable number bases to objects with functions to access it by building a string

//Listening when the user wants to convert
btnConvertEl.addEventListener("click", function () {
  if (originTypeEl.value === "text") {
    if (convertTypeEl.value === "binary") textToBinary();
    if (convertTypeEl.value === "hexadecimal") textToHex();
    if (convertTypeEl.value === "octal") textToOctal();
    if (convertTypeEl.value === "decimal") textToDecimal();
  }
  if (originTypeEl.value === "binary") {
    if (convertTypeEl.value === "text") binaryToText();
    if (convertTypeEl.value === "hexadecimal") binaryToHex();
    if (convertTypeEl.value === "octal") binaryToOctal();
    if (convertTypeEl.value === "decimal") binaryToDecimal();
  }
  if (originTypeEl.value === "hexadecimal") {
    if (convertTypeEl.value === "text") hexToText();
    if (convertTypeEl.value === "binary") hexToBinary();
    if (convertTypeEl.value === "octal") hexToOctal();
    if (convertTypeEl.value === "decimal") hexToDecimal();
  }
  if (originTypeEl.value === "octal") {
    if (convertTypeEl.value === "text") octalToText();
    if (convertTypeEl.value === "binary") octalToBinary();
    if (convertTypeEl.value === "hexadecimal") octalToHex();
    if (convertTypeEl.value === "decimal") octalToDecimal();
  }
  if (originTypeEl.value === "decimal") {
    if (convertTypeEl.value === "text") decimalToText();
    if (convertTypeEl.value === "binary") decimalToBinary();
    if (convertTypeEl.value === "hexadecimal") decimalToHex();
    if (convertTypeEl.value === "octal") decimalToOctal();
  }
});

//Simple implementation to convert when clicking enter
inputAreaEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    btnConvertEl.click();
  }
});

//Simple check to avoid having both select on the same value (if one gets set to the same value, it will swap them)

originTypeEl.addEventListener("click", function () {
  originTypeValue = originTypeEl.value;
});

convertTypeEl.addEventListener("click", function () {
  convertTypeValue = convertTypeEl.value;
});

originTypeEl.onchange = function () {
  if (originTypeEl.value === convertTypeEl.value)
    convertTypeEl.value = originTypeValue;

  outputAreaEl.value = "";
  inputAreaEl.value = "";
};
convertTypeEl.onchange = function () {
  if (convertTypeEl.value === originTypeEl.value)
    originTypeEl.value = convertTypeValue;

  outputAreaEl.value = "";
  inputAreaEl.value = "";
};

function textToDecimal(source = inputAreaEl.value) {
  source = [...source];
  const result = [];
  for (const char of source) {
    result.push(char.charCodeAt(0));
  }
  outputAreaEl.value = result.join(" ");
  return result.join(" ");
}

function decimalToText(source = inputAreaEl.value) {
  source = source.split(" ");
  let result = "";
  for (const value of source) {
    result += String.fromCharCode(value);
  }

  outputAreaEl.value = result;
  return result;
}

function binaryToDecimal() {
  let source = inputAreaEl.value;
  source = binaryToText(source);
  source = textToDecimal(source);
  outputAreaEl.value = source;
}

function hexToDecimal() {
  let source = inputAreaEl.value;
  source = hexToText(source);
  source = textToDecimal(source);
  outputAreaEl.value = source;
}

function octalToDecimal() {
  let source = inputAreaEl.value;
  source = octalToText(source);
  source = textToDecimal(source);
  outputAreaEl.value = source;
}

function decimalToBinary() {
  let source = inputAreaEl.value;
  source = decimalToText(source);
  source = textToBinary(source);
  outputAreaEl.value = source;
}

function decimalToHex() {
  let source = inputAreaEl.value;
  source = decimalToText(source);
  source = textToHex(source);
  outputAreaEl.value = source;
}

function decimalToOctal() {
  let source = inputAreaEl.value;
  source = decimalToText(source);
  source = textToOctal(source);
  outputAreaEl.value = source;
}

function textToBinary(source = inputAreaEl.value.trim()) {
  source = source.split("");
  const binaryValues = [];

  for (const char of source) {
    //Storing the ascii value
    let charCode = char.charCodeAt(0);
    //Array to store the powers
    const powers = [];

    // calculating 2**n starting at n = 8 (closest to max ascii value which is 255)
    for (let i = 8; i >= 0; i--) {
      if (charCode === 0) break;
      if (2 ** i <= charCode) {
        //If we can fit 2 ** n in the ascii value, we will store that power for calculations later
        //and reduce the charCode variable to find the other powers. This will help us to find all powers
        //of 2 that, when added together, will give a sum equal to the ascii value
        powers.push(i);
        charCode -= 2 ** i;
        //Resetting the loop to make sure that we get all the powers
        i = 8;
        continue;
      }
    }

    let sum = 0;
    for (const value of powers) {
      sum += Number(decimalToByte(2, 2 ** value));
    }
    sum = String(sum).padStart(8, "0");
    binaryValues.push(sum);
  }

  outputAreaEl.value = binaryValues.join(" ");
  return binaryValues.join(" ");
}

function binaryToText(source = inputAreaEl.value) {
  //TODO: add check for non-binary chars
  source = source.split(" ");
  let result = "";

  for (const char of source) {
    let decimalValue = 0;
    const binaryValues = [];

    for (let i = 0; i < 8; i++) {
      if (Number(char[i]) === 0) continue;
      const currentBinary = "1".padEnd(8 - i, "0");
      binaryValues.push(currentBinary);
    }

    for (const value of binaryValues) {
      decimalValue += 2 ** (value.length - 1);
    }
    result += String.fromCharCode(decimalValue);
  }

  outputAreaEl.value = result;
  return result;
}

function textToHex(source = inputAreaEl.value) {
  source = source.split("");
  const hexValues = [];

  for (const char of source) {
    let charCode = char.charCodeAt(0);

    hexValues.push(decimalToByte(6, charCode));
  }

  outputAreaEl.value = hexValues.join(" ");
  return hexValues.join(" ");
}

function binaryToHex() {
  let source = inputAreaEl.value;
  source = binaryToText(source);
  source = textToHex(source);
  outputAreaEl.value = source;
}

function hexToText(source = inputAreaEl.value) {
  source = source.split(" ");
  const chars = [];
  for (const value of source) {
    let decimalValue = 0;
    decimalValue += Number(value[0]) * 16;
    switch (value[1]) {
      //Can easily refactor with difference between ascii code and reflect that on decimal value
      case "A":
        decimalValue += 10;
        break;
      case "B":
        decimalValue += 11;
        break;
      case "C":
        decimalValue += 12;
        break;
      case "D":
        decimalValue += 13;
        break;
      case "E":
        decimalValue += 14;
        break;
      case "F":
        decimalValue += 15;
        break;
      default:
        decimalValue += Number(value[1]);
        break;
    }
    chars.push(String.fromCharCode(decimalValue));
  }

  outputAreaEl.value = chars.join("");
  return chars.join("");
}

function hexToBinary() {
  let source = inputAreaEl.value;
  source = hexToText(source);
  source = textToBinary(source);
  outputAreaEl.value = source;
}

function textToOctal(source = inputAreaEl.value) {
  source = source.split("");
  const octalValues = [];

  for (const char of source) {
    let charCode = char.charCodeAt(0);
    octalValues.push(decimalToByte(8, charCode));
  }

  outputAreaEl.value = octalValues.join(" ");
  return octalValues.join(" ");
}

function octalToText(source = inputAreaEl.value) {
  source = source.split(" ");
  const result = [];

  for (const value of source) {
    let charCode = 0;
    let index = 0;
    for (let i = value.length - 1; i >= 0; i--) {
      charCode += value[index] * 8 ** i;
      console.log(`Value at position ${index}: ${value[index] * 8 ** i}`);
      index++;
    }
    console.log(`Char code: ${charCode}`);
    result.push(String.fromCharCode(charCode));
  }

  outputAreaEl.value = result.join("");
  return result.join("");
}

function binaryToOctal() {
  let source = inputAreaEl.value;
  source = binaryToText(source);
  source = textToOctal(source);
  outputAreaEl.value = source;
}

function hexToOctal() {
  let source = inputAreaEl.value;
  source = hexToText(source);
  source = textToOctal(source);
  outputAreaEl.value = source;
}

function octalToBinary() {
  let source = inputAreaEl.value;
  source = octalToText(source);
  source = textToBinary(source);
  outputAreaEl.value = source;
}

function octalToHex() {
  let source = inputAreaEl.value;
  source = octalToText(source);
  source = textToHex(source);
  outputAreaEl.value = source;
}

function decimalToByte(base, value) {
  let result = "";
  //Binary conversion and octal conversion
  if (base === 2 || base === 8) {
    while (value / base >= 1) {
      result = (value % base) + result;
      value = Math.trunc(value / base);
    }
    result = (value % base) + result;
  }
  //Hex conversion
  else if (base === 6) {
    for (let i = 15; i > 0; i--) {
      if (i * 16 > value) continue;
      switch (i) {
        case 10:
          result += "A";
          break;
        case 11:
          result += "B";
          break;
        case 12:
          result += "C";
          break;
        case 13:
          result += "D";
          break;
        case 14:
          result += "E";
          break;
        case 15:
          result += "F";
          break;
        //If i is a single digit
        default:
          result += i;
      }
      value -= 16 * i;
      break;
    }
    switch (value) {
      case 10:
        result += "A";
        break;
      case 11:
        result += "B";
        break;
      case 12:
        result += "C";
        break;
      case 13:
        result += "D";
        break;
      case 14:
        result += "E";
        break;
      case 15:
        result += "F";
        break;
      default:
        result += value;
    }
  }
  return result;
}
