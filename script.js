"use strict";

const inputAreaEl = document.querySelector(".input");
const outputAreaEl = document.querySelector(".output");

const originTypeEl = document.querySelector(".origin-type");
const convertTypeEl = document.querySelector(".convert-type");
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
          if (value.charCodeAt(1) === i) decimalValue += 9 + (70 - i);
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

//Listening when the user wants to convert
btnConvertEl.addEventListener("click", function () {
  //Checking for all possible combinations and calling the proper function/method
  if (originTypeEl.value === "text") {
    if (convertTypeEl.value === "binary") conversionFuncs.textToBinary();
    if (convertTypeEl.value === "hexadecimal") conversionFuncs.textToHex();
    if (convertTypeEl.value === "octal") conversionFuncs.textToOctal();
    if (convertTypeEl.value === "decimal") conversionFuncs.textToDecimal();
  }
  if (originTypeEl.value === "binary") {
    if (convertTypeEl.value === "text") conversionFuncs.binaryToText();
    if (convertTypeEl.value === "hexadecimal")
      conversionBetweenNumeralBases("binary", "hex");
    if (convertTypeEl.value === "octal")
      conversionBetweenNumeralBases("binary", "octal");
    if (convertTypeEl.value === "decimal")
      conversionBetweenNumeralBases("binary", "decimal");
  }
  if (originTypeEl.value === "hexadecimal") {
    if (convertTypeEl.value === "text") conversionFuncs.hexToText();
    if (convertTypeEl.value === "binary")
      conversionBetweenNumeralBases("hex", "binary");
    if (convertTypeEl.value === "octal")
      conversionBetweenNumeralBases("hex", "octal");
    if (convertTypeEl.value === "decimal")
      conversionBetweenNumeralBases("hex", "decimal");
  }
  if (originTypeEl.value === "octal") {
    if (convertTypeEl.value === "text") conversionFuncs.octalToText();
    if (convertTypeEl.value === "binary")
      conversionBetweenNumeralBases("octal", "binary");
    if (convertTypeEl.value === "hexadecimal")
      conversionBetweenNumeralBases("octal", "hex");
    if (convertTypeEl.value === "decimal")
      conversionBetweenNumeralBases("octal", "decimal");
  }
  if (originTypeEl.value === "decimal") {
    if (convertTypeEl.value === "text") conversionFuncs.decimalToText();
    if (convertTypeEl.value === "binary")
      conversionBetweenNumeralBases("decimal", "binary");
    if (convertTypeEl.value === "hexadecimal")
      conversionBetweenNumeralBases("decimal", "hex");
    if (convertTypeEl.value === "octal")
      conversionBetweenNumeralBases("decimal", "octal");
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
