const GREY = "hsl(0, 0%, 85%)";
const BLUE = "hsl(238, 56%, 64%)";
const NUM = {0:7,1:8,2:9,4:4,5:5,6:6,8:1,9:2,10:3,12:0};
const SYMBOL = {3:"÷",7:"×",11:"−",13:".",14:"=",15:"+"};
const JS_SYMBOL = ["/","*","-","+","."];
const CALCULATOR = document.querySelector(".Calculator");
const BUTTONS = document.querySelector(".Buttons");
const AC = document.querySelector(".AC");
const CE = document.querySelector(".CE");
const pupil = document.querySelectorAll(".eyeballs");
const DISPLAY = document.createElement("div");

let calculation = "";
let symbolPoint = false;

const eyeballs = document.querySelector(".eyeballs");
const rekt = eyeballs.getBoundingClientRect();
const anchorX = rekt.left + rekt.width / 2;
const anchorY = rekt.top + rekt.height / 2;

document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const angleDeg = angle(mouseX, mouseY, anchorX, anchorY);

    pupil.forEach(eye => {
        eye.style.transform = `rotate(${(90 + angleDeg) * 1}deg)`;
    })
});

function angle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    const deg = rad * 180 / Math.PI;
    return deg;

}

DISPLAY.setAttribute("class", "Display");
DISPLAY.textContent = "0";
CALCULATOR.appendChild(DISPLAY);

AC.addEventListener("click", filterEvent);
CE.addEventListener("click", filterEvent);
window.addEventListener("keydown", keyboardInput);

for (let i = 0; i < 16; ++i) {
    const btn = document.createElement("button");
    btn.addEventListener("click", filterEvent);
    btn.addEventListener("keydown", (keyboardInput));
    BUTTONS.appendChild(btn);
    if (NUM.hasOwnProperty(i)) btn.textContent = NUM[i];
    if (SYMBOL.hasOwnProperty(i)) {
        btn.textContent = SYMBOL[i];
        btn.setAttribute("class", "Symbol");
        btn.setAttribute("style", `background-color:${GREY}`);
        if (btn.textContent == "=") btn.setAttribute("style", `background-color:${BLUE}; color:white`);
    }
}

function filterEvent(e) {
    buttonPress(e.target.textContent, e.target.className);
    console.log(e.target);
};

function buttonPress(button, buttonClass) {
    console.log("symbol is: " +buttonClass);
    if (buttonClass == "Symbol") {
        symbolButton(button);
        return;
    }
    if (buttonClass == "AC" || buttonClass == "CE") {
        clearButton(button);
        return;
    }
    if (DISPLAY.textContent == "0") {
        DISPLAY.textContent = button;
    } else {
        DISPLAY.textContent += button;
    }
}

function symbolButton(symbol) {
    const lastChar = DISPLAY.textContent.slice(-1);
    if (symbol == "=") {
        DISPLAY.textContent = calculate(DISPLAY.textContent);
        return;
    }
    if (symbol == ".") {
        if (symbolPoint == false) {
            if (!parseInt(lastChar) && lastChar != 0) DISPLAY.textContent += 0;
            DISPLAY.textContent += symbol;
            symbolPoint = true;
            return;
        } else {
            return;
        }
    }
    if (!Object.values(SYMBOL).includes(lastChar) || lastChar == ".") {
        if (lastChar == ".") DISPLAY.textContent += 0;
        DISPLAY.textContent += symbol;
        symbolPoint = false;
    }
};

function clearButton(button) {
    if (button == "AC") {
        symbolPoint = false;
        DISPLAY.textContent = 0;
    } else if (button == "CE") {
        if (DISPLAY.textContent.length == 1) {
            DISPLAY.textContent = 0;
        } else {
        DISPLAY.textContent = DISPLAY.textContent.slice(0, -1);
        }
    }
};

function keyboardInput(e) {
    if (e.key >= 0 && e.key <= 9) {
        buttonPress(e.key, "");
    } else if (JS_SYMBOL.includes(e.key)){
        buttonPress(e.key, "Symbol");
    } else if (e.key == "Enter") {
        buttonPress("=", "Symbol");
    } else if (e.key == "Backspace") {
        buttonPress("CE", "CE");
    } else if (e.key == "Escape") {
        buttonPress("AC", "AC");
    } else {
        return;
    }
};

function checkSymbol(symbol) {
    return JS_SYMBOL.indexOf(symbol)
}

function evaluate(num1, num2, symbol) {
    if (symbol == "/"){
      ans = num1 / num2;
    } else if (symbol == "*") {
      ans = num1 * num2;
    } else if (symbol == "+") {
      ans = 1*num1 + 1*num2;
    } else if (symbol == "-") {
      ans = num1 - num2;
    }
    return ans;
}

function calculate(input) {
    if (DISPLAY.textContent == "0") return 0;
    for (let i = 0; i < 3; ++i) input = input.replaceAll(Object.values(SYMBOL)[i], JS_SYMBOL[i]);

    let num = input.split(/[-+/*]/);
    let symbol = input.replace(/[0123456789.]/g, "").split('');

    if (symbol == null) return DISPLAY.textContent;
    
    for (let i = 0; i < symbol.length; ++i) {
      if (checkSymbol(symbol[i]) > 1) {
        continue;
      } else {
        num[i+1] = evaluate(num[i], num[i+1], symbol[i]);
        symbol[i] = "";
        num[i] = "";
      }
    }
    
    num = num.filter(Number);
    symbol = symbol.filter(x => x != '');
    
    for (let i = 0; i < symbol.length; ++i) {
        num[i+1] = evaluate(num[i], num[i+1], symbol[i]);
        num[i] = "";
    }
    symbol = null;

    return num[num.length - 1];
}