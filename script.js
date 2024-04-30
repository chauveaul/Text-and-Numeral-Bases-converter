"use strict";

const inputAreaEl = document.querySelector(".input");
const outputAreaEl = document.querySelector(".output");

const fromTextEl = document.querySelector(".input--text");
const fromBinaryEl = document.querySelector(".input--binary");
const fromHexEl = document.querySelector(".input--hex");
const fromOctalEl = document.querySelector(".input--octal");
const fromDecimalEl = document.querySelector(".input--decimal");

const toBinaryEl = document.querySelector(".output--binary");
const toTextEl = document.querySelector(".output--text");
const toHexEl = document.querySelector(".output--hex");
const toOctalEl = document.querySelector(".output--octal");
const toDecimalEl = document.querySelector(".output--decimal");

const btnConvertEl = document.querySelector(".btn--convert");

let originTypeValue = "text";
let convertTypeValue = "binary";

//Using an object to store these functions to be able to access them using strings for changing between
//different Numeral Bases
const conversionFuncs = {
  textToBinary: function (source = inputAreaEl.value.trim()) {
    source = source.split("");
    const binaryValues = [];

    for (const char of source) {
      //Storing the ascii value
      let charCode = char.charCodeAt(0);
      //Array to store the powers
      const powers = [];
      //Calculating 2**n starting at n = 8 (closest to max ascii value which is 255)
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
      //Adding the necessary amount of 0 to get the the correct length
      sum = String(sum).padStart(8, "0");
      binaryValues.push(sum);
    }

    outputAreaEl.value = binaryValues.join(" ");
    return binaryValues.join(" ");
  },
  binaryToText: function (source = inputAreaEl.value.trim()) {
    //TODO: add check for non-binary chars
    source = source.split(" ");
    let result = "";

    for (const char of source) {
      let decimalValue = 0;
      const binaryValues = [];

      //Doing the same operation as binaryToText but backwards.
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
  },
  textToHex: function (source = inputAreaEl.value.trim()) {
    source = source.split("");
    const hexValues = [];

    for (const char of source) {
      let charCode = char.charCodeAt(0);

      hexValues.push(decimalToByte(6, charCode));
    }

    outputAreaEl.value = hexValues.join(" ");
    return hexValues.join(" ");
  },
  hexToText: function (source = inputAreaEl.value.trim()) {
    source = source.split(" ");
    const chars = [];
    for (const value of source) {
      let decimalValue = 0;
      decimalValue += Number(value[0]) * 16;
      //Adding to the decimal value. If current character is a letter, check the difference between
      //i and ascii char code of "A"
      if (value.charCodeAt(1) >= 65 && value.charCodeAt(1) <= 70) {
        for (let i = 65; i <= 70; i++) {
          if (value.charCodeAt(1) === i) {
            decimalValue += 10 + (i - 65);
          }
        }
      } else {
        decimalValue += Number(value[1]);
      }
      chars.push(String.fromCharCode(decimalValue));
    }

    outputAreaEl.value = chars.join("");
    return chars.join("");
  },
  textToOctal: function (source = inputAreaEl.value.trim()) {
    source = source.split("");
    const octalValues = [];

    for (const char of source) {
      let charCode = char.charCodeAt(0);
      octalValues.push(decimalToByte(8, charCode));
    }

    outputAreaEl.value = octalValues.join(" ");
    return octalValues.join(" ");
  },
  octalToText: function (source = inputAreaEl.value.trim()) {
    source = source.split(" ");
    const result = [];

    for (const value of source) {
      let charCode = 0;
      let index = 0;
      for (let i = value.length - 1; i >= 0; i--) {
        charCode += value[index] * 8 ** i;
        index++;
      }
      result.push(String.fromCharCode(charCode));
    }

    outputAreaEl.value = result.join("");
    return result.join("");
  },
  textToDecimal: function (source = inputAreaEl.value.trim()) {
    source = [...source];
    const result = [];
    for (const char of source) {
      result.push(char.charCodeAt(0));
    }
    outputAreaEl.value = result.join(" ");
    return result.join(" ");
  },
  decimalToText: function (source = inputAreaEl.value.trim()) {
    source = source.split(" ");
    let result = "";
    for (const value of source) {
      result += String.fromCharCode(value);
    }

    outputAreaEl.value = result;
    return result;
  },
};

//Adding input types event listeners
fromTextEl.addEventListener("click", function () {
  removeSelectedInput();
  fromTextEl.classList.add("selected");
  if (convertTypeValue === "text") {
    convertTypeValue = originTypeValue;
    changeConvertType();
  }
  originTypeValue = "text";
});

fromBinaryEl.addEventListener("click", function () {
  removeSelectedInput();
  fromBinaryEl.classList.add("selected");
  if (convertTypeValue === "binary") {
    convertTypeValue = originTypeValue;
    changeConvertType();
  }
  originTypeValue = "binary";
});

fromHexEl.addEventListener("click", function () {
  removeSelectedInput();
  fromHexEl.classList.add("selected");
  if (convertTypeValue === "hex") {
    convertTypeValue = originTypeValue;
    changeConvertType();
  }
  originTypeValue = "hex";
});

fromOctalEl.addEventListener("click", function () {
  removeSelectedInput();
  fromOctalEl.classList.add("selected");
  if (convertTypeValue === "octal") {
    convertTypeValue = originTypeValue;
    changeConvertType();
  }
  originTypeValue = "octal";
});

fromDecimalEl.addEventListener("click", function () {
  removeSelectedInput();
  fromDecimalEl.classList.add("selected");
  if (convertTypeValue === "decimal") {
    convertTypeValue = originTypeValue;
    changeConvertType();
  }
  originTypeValue = "decimal";
});

//Adding output types event listeners
toTextEl.addEventListener("click", function () {
  removeSelectedOutput();
  toTextEl.classList.add("selected");
  if (originTypeValue === "text") {
    originTypeValue = convertTypeValue;
    changeOriginType();
  }
  convertTypeValue = "text";
});

toBinaryEl.addEventListener("click", function () {
  removeSelectedOutput();
  toBinaryEl.classList.add("selected");
  if (originTypeValue === "binary") {
    originTypeValue = convertTypeValue;
    changeOriginType();
  }
  convertTypeValue = "binary";
});

toHexEl.addEventListener("click", function () {
  removeSelectedOutput();
  toHexEl.classList.add("selected");
  if (originTypeValue === "hex") {
    originTypeValue = convertTypeValue;
    changeOriginType();
  }
  convertTypeValue = "hex";
});

toOctalEl.addEventListener("click", function () {
  removeSelectedOutput();
  toOctalEl.classList.add("selected");
  if (originTypeValue === "octal") {
    originTypeValue = convertTypeValue;
    changeOriginType();
  }
  convertTypeValue = "octal";
});

toDecimalEl.addEventListener("click", function () {
  removeSelectedOutput();
  toDecimalEl.classList.add("selected");
  if (originTypeValue === "decimal") {
    originTypeValue = convertTypeValue;
    changeOriginType();
  }
  convertTypeValue = "decimal";
});

function changeOriginType() {
  removeSelectedInput();
  switch (originTypeValue) {
    case "text":
      fromTextEl.classList.add("selected");
      break;
    case "binary":
      fromBinaryEl.classList.add("selected");
      break;
    case "hex":
      fromHexEl.classList.add("selected");
      break;
    case "octal":
      fromOctalEl.classList.add("selected");
      break;
    case "decimal":
      fromDecimalEl.classList.add("selected");
      break;
  }
}

function changeConvertType() {
  removeSelectedOutput();
  switch (convertTypeValue) {
    case "text":
      toTextEl.classList.add("selected");
      break;
    case "binary":
      toBinaryEl.classList.add("selected");
      break;
    case "hex":
      toHexEl.classList.add("selected");
      break;
    case "octal":
      toOctalEl.classList.add("selected");
      break;
    case "decimal":
      toDecimalEl.classList.add("selected");
      break;
  }
}

function removeSelectedInput() {
  fromTextEl.classList.remove("selected");
  fromBinaryEl.classList.remove("selected");
  fromHexEl.classList.remove("selected");
  fromOctalEl.classList.remove("selected");
  fromDecimalEl.classList.remove("selected");
}

function removeSelectedOutput() {
  toTextEl.classList.remove("selected");
  toBinaryEl.classList.remove("selected");
  toHexEl.classList.remove("selected");
  toOctalEl.classList.remove("selected");
  toDecimalEl.classList.remove("selected");
}

//Listening when the user wants to convert
btnConvertEl.addEventListener("click", function () {
  if (inputAreaEl.value === "") outputAreaEl.value = "";
  else {
    if (fromTextEl.classList.contains("selected")) {
      if (toBinaryEl.classList.contains("selected"))
        conversionFuncs.textToBinary();
      if (toHexEl.classList.contains("selected")) conversionFuncs.textToHex();
      if (toOctalEl.classList.contains("selected"))
        conversionFuncs.textToOctal();
      if (toDecimalEl.classList.contains("selected"))
        conversionFuncs.textToDecimal();
    }
    if (fromBinaryEl.classList.contains("selected")) {
      if (toTextEl.classList.contains("selected"))
        conversionFuncs.binaryToText();
      if (toHexEl.classList.contains("selected"))
        conversionBetweenNumeralBases("binary", "hex");
      if (toOctalEl.classList.contains("selected"))
        conversionBetweenNumeralBases("binary", "octal");
      if (toDecimalEl.classList.contains("selected"))
        conversionBetweenNumeralBases("binary", "decimal");
    }
    if (fromHexEl.classList.contains("selected")) {
      if (toTextEl.classList.contains("selected")) conversionFuncs.hexToText();
      if (toBinaryEl.classList.contains("selected"))
        conversionBetweenNumeralBases("hex", "binary");
      if (toOctalEl.classList.contains("selected"))
        conversionBetweenNumeralBases("hex", "octal");
      if (toDecimalEl.classList.contains("selected"))
        conversionBetweenNumeralBases("hex", "decimal");
    }
    if (fromOctalEl.classList.contains("selected")) {
      if (toTextEl.classList.contains("selected"))
        conversionFuncs.octalToText();
      if (toBinaryEl.classList.contains("selected"))
        conversionBetweenNumeralBases("octal", "binary");
      if (toHexEl.classList.contains("selected"))
        conversionBetweenNumeralBases("octal", "hex");
      if (toDecimalEl.classList.contains("selected"))
        conversionBetweenNumeralBases("octal", "decimal");
    }
    if (fromDecimalEl.classList.contains("selected")) {
      if (toTextEl.classList.contains("selected"))
        conversionFuncs.decimalToText();
      if (toBinaryEl.classList.contains("selected"))
        conversionBetweenNumeralBases("decimal", "binary");
      if (toHexEl.classList.contains("selected"))
        conversionBetweenNumeralBases("decimal", "hex");
      if (toOctalEl.classList.contains("selected"))
        conversionBetweenNumeralBases("decimal", "octal");
    }
  }
});

//Simple implementation to convert when clicking enter
inputAreaEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    btnConvertEl.click();
  }
});

//Conversion between two types of numeral bases. I figure which operation to do based on
//origin type and converted type and then use the strings I built to access to appropriate
//functions in the object.
//Ex. (binary, hex) --> firstOperation = "binaryToText", secondOperation = "textToHex"
//     ^        ^
//     origin   type to convert to
function conversionBetweenNumeralBases(origin, convert) {
  let source = inputAreaEl.value;

  //Transforming the orgin to text
  let firstOperation = origin.toLowerCase() + "ToText";
  //Trasforming from text to converted type
  let secondOperation =
    "textTo" +
    convert.charAt(0).toUpperCase() +
    convert.substring(1).toLowerCase();

  source = conversionFuncs[firstOperation](source);
  source = conversionFuncs[secondOperation](source);
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
      //Adding to the result based on the difference of ascii char code between i and "A"
      if (i >= 10) {
        result += String.fromCharCode(65 + (i - 10));
      } else result += i;
      value -= 16 * i;
      break;
    }
    //Adding to the result based on the difference of ascii char code between value and "A"
    if (value >= 10) {
      result += String.fromCharCode(65 + (value - 10));
    } else result += value;
  }
  return result;
}
