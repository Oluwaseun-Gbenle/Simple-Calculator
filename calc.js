var keys = {
    display: document.getElementsByClassName("display-up")[0],
    displayDown: document.getElementsByClassName("display-down")[0],
    displayInd: document.getElementsByClassName("display-indicate")[0],
    ac: document.getElementsByClassName("ac")[0],
    ce: document.getElementsByClassName("ce")[0],
    div: document.getElementsByClassName("div")[0],
    multiply: document.getElementsByClassName("multiply")[0],
    subtract: document.getElementsByClassName("subtract")[0],
    add: document.getElementsByClassName("add")[0],
    equals: document.getElementsByClassName("equals")[0],
    decimal: document.getElementsByClassName("decimal")[0],
    zero: document.getElementsByClassName("zero")[0],
    one: document.getElementsByClassName("one")[0],
    two: document.getElementsByClassName("two")[0],
    three: document.getElementsByClassName("three")[0],
    four: document.getElementsByClassName("four")[0],
    five: document.getElementsByClassName("five")[0],
    six: document.getElementsByClassName("six")[0],
    seven: document.getElementsByClassName("seven")[0],
    eight: document.getElementsByClassName("eight")[0],
    nine: document.getElementsByClassName("nine")[0]
  }
  //hundlers

for (var btn in keys) {
  if (btn === "display" || btn === "displayDown" || btn === "displayInd") continue;
  (function(button) {
    keys[button].addEventListener("click", function() {
      calculate(button);
    });

    if (button === "ac" || button === "ce" || button === "equals") {
      document.addEventListener("keyup", function(event) {
        if(button === getChar(event, true)){
          calculate(getChar(event,true))
        }
      });
    } else {
      document.addEventListener("keypress", function(event) {
        if (toStr(button) === getChar(event)) {
          calculate(getChar(event), true);
        }
      });
    }
  })(btn);
}

function getChar(event, add) {
  var keyMap = {
    13 : "equals",
    35 : "ce",
    46 : "ac"
  };
  
  if (add) {
    return keyMap[event.which];
  } else {
    if (event.which == null) {
      if (event.keyCode < 32) return "equals"
      return String.fromCharCode(event.keyCode)
    }

    if (event.which != 0 && event.charCode != 0) {
      if (event.which < 32) return "equals"
      return String.fromCharCode(event.which);
    }
  }

  return ""
}

function toStr(btn) {
  var btns = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    zero: "0",
    div: "/",
    multiply: "*",
    add: "+",
    subtract: "-",
    decimal: "."
  }
  if (btn === "ce") return ""
  return btns[btn];
}

function removeZero(str) {
  var result = str;

  var senseOperators = ["+", "-"]

  var decimalCond, firstZero, operZero;

  for (var i = 0; i < result.length - 1; i++) {

    decimalCond = (result[i + 1] !== ".");
    firstZero = (i === 0) && (result[i] === "0") && decimalCond;
    operZero = (senseOperators.indexOf(result[i - 1]) !== -1) && (result[i] === "0") && decimalCond;

    if (firstZero || operZero) {
      result = result.slice(0, i) + result.slice(i + 1);
      ++i;
    }
  }

  return result

}

function fixOper(str) {
  var result = str;
  var operators1 = ["*", "/"];
  var operators2 = ["+", "-"];
  var cond, optCond;

  for (var i = 0; i < result.length - 1; i++) {
    cond = operators1.indexOf(result[i]) !== -1 && operators1.indexOf(result[i + 1]) !== -1;

    if (cond) {
      result = result.slice(0, i) + result.slice(i + 1);
    }
  }

  for (i = 0; i < result.length - 1; i++) {
    cond = operators2.indexOf(result[i]) !== -1 && (result[i] === result[i + 1]);
    optCond = (result[i] === "-") && (result[i + 1] === "+");

    if (cond) {
      result = result.slice(0, i) + result.slice(i + 1);
    } else if (optCond) {
      result = result.slice(0, i + 1) + result.slice(i + 2)
    }
  }

  for (i = 0; i < result.length - 2; i++) {
    if (operators1.indexOf(result[i]) !== -1 && operators2.indexOf(result[i + 1]) !== -1 && operators1.indexOf(result[i + 2]) !== -1) {
      result = result.slice(0, i + 2) + result.slice(i + 3);
    }
  }

  for (i = 0; i < result.length - 1; i++) {
    if (operators2.indexOf(result[i]) !== -1 && operators1.indexOf(result[i + 1]) !== -1) {
      result = result.slice(0, i + 1) + result.slice(i + 2)
    }
  }

  if (operators1.indexOf(result[0]) !== -1) {
    result = "0";
  }
  return result;
}

function removeLast(str) {
  var operators = ["+", "-", "*", "/"],
    cond, result = str;
  if (str.length === 1) {
    return "0";
  } else {
    for (var i = result.length - 1; i > 0; i--) {
      if (operators.indexOf(result[i]) !== -1) {
        return result.slice(0, i);
      } else if (operators.indexOf(result[i - 1]) !== -1) {
        return result.slice(0, i);
      } else continue;
    }
  }
}

var max = {
  add: function() {
    if (!keys.displayInd.classList.toggle("max")) {
      keys.displayInd.classList.toggle("max");
    }
  },
  remove: function() {
    if (keys.displayInd.classList.toggle("max")) {
      keys.displayInd.classList.toggle("max");
    }
  }
}

function calculate(btn, isFromKey) {
  var operators = ["subtract", "add", "div", "multiply"];

  if (btn === "ac") {
    keys.display.innerText = "0";
    keys.displayDown.innerText = "0";
    max.remove();
    return;
  }

  if (btn === "ce") {
    var result = removeLast(keys.displayDown.innerText);
    if (!result) {
      keys.displayDown.innerText = "0";
    } else {
      keys.displayDown.innerText = result;
    }
    max.remove();
  }

  if (btn === "equals") {
    keys.displayDown.innerText = keys.display.innerText;
    max.remove();
    return;
  }

  var operations = keys.displayDown.innerText;

  if (operations.length < 32) {
    if (isFromKey) {
      operations += btn;
    } else {
      operations += toStr(btn);
    }
  } else {
    max.add();
  }

  operations = removeZero(operations);
  operations = fixOper(operations);
  keys.displayDown.innerText = operations;

  var calc = "" + eval(keys.display.innerText);
  if (operators.indexOf(btn) === -1) {
    calc = "" + eval(operations);
  }

  if (calc.length < 14) {
    if (!calc) {
      keys.display.innerText = "0";
    } else {
      keys.display.innerText = calc;
    }

  } else if (calc < 1) {
    keys.display.innerText = (+calc).toPrecision(7);
  } else {
    keys.display.innerText = (+calc).toPrecision(9);
  }

}

