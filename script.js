"use strict";

const inputAreaEl = document.querySelector(".input");
const outputAreaEl = document.querySelector(".output");

const originTypeEl = document.querySelector(".origin-type");
const convertTypeEl = document.querySelector(".convert-type");
const btnConvertEl = document.querySelector(".btn--convert");

//To start off with the logic
function textToBinary() {
  const str = inputAreaEl.value.trim().split("");
  const binaryValues = [];

  for (const char of str) {
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
}

function decimalToByte(base, value) {
  let result = "";
  while (value / base >= 1) {
    result = (value % base) + result;
    value /= base;
  }
  result = (value % base) + result;
  return result.padStart(8, "0");
}

btnConvertEl.addEventListener("click", textToBinary);

// function convertFromString(base, str) {
//   if (originTypeEl.value === "text") console.log("idk had to print smt");
// }
// function convertToString(base) {}
