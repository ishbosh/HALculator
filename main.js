const valueObj = {
    numbersA: [],
    numbersB: [],
    operation: null,
    result: [null],
    lastEntry: null,
    error: false,
}

function clearDisplay() {
    valueObj.numbersA = [];
    valueObj.numbersB = [];
    valueObj.operation = null;
    valueObj.result = [null];
    valueObj.lastEntry = null;
    if (valueObj.error == true) {
        valueObj.error = false;
        hideHAL();
        onButtonClick();
    }
    display.textContent = '0';
}

const display = document.querySelector('#innerdisplay');
const buttons = document.querySelectorAll('button');

initializeDisplay();
onButtonClick();

let formatter = Intl.NumberFormat('en', {maximumSignificantDigits: 8});

function initializeDisplay() {
    display.textContent = '0';
}

function updateDisplay(valueClicked) {
    // Grab the actual value of the clicked button from the html
    const value = valueClicked.textContent;
    const valueIsNumber = valueClicked.parentElement.id == 'numbers' && valueClicked.classList != 'symbol';

    if (valueClicked.id == 'clear') {    
        clearDisplay();
    } 
    else if (valueIsNumber == true && 
        valueObj.numbersB.length < 13 &&
        (valueObj.lastEntry == 'operator' || valueObj.numbersB.length > 0)) {
        valueObj.lastEntry = 'number';
        valueObj.numbersB.push(value);
        display.textContent = valueObj.numbersB.join('');
    }
    else if (valueIsNumber == true && valueObj.numbersA.length < 13) {
        valueObj.lastEntry = 'number';
        valueObj.numbersA.push(value);
        display.textContent = valueObj.numbersA.join('');
    }
    else if (valueClicked.id == 'equals' && valueObj.numbersB.length > 0) {
        valueObj.lastEntry = 'result';

        const numbersA = valueObj.numbersA.join('');
        const numbersB = valueObj.numbersB.join('');
        valueObj.result = [operate(valueObj.operation, +numbersA, +numbersB)];
        
        valueObj.numbersA = [valueObj.result];
        valueObj.numbersB = [];

        // convert large numbers to fit the display
        if (valueObj.result.toString().length > 11) {
            valueObj.result = Number(formatter.format(valueObj.result[0]).replace(/,/g, '')).toExponential();
           }
        display.textContent = valueObj.result;
    }
    else if (valueClicked.parentElement.id == 'operators' && valueObj.lastEntry != 'operator' && valueClicked.id != 'equals') {
        valueObj.lastEntry = 'operator'
        const operator = value; // example: '+'
        if (valueObj.numbersB.length > 0) {
            const numbersA = valueObj.numbersA.join('');
            const numbersB = valueObj.numbersB.join('');
            valueObj.result = [operate(valueObj.operation, +numbersA, +numbersB)];
            // clear out numbersB for next number entry and assign it to numbersA
            valueObj.numbersA = [valueObj.result];
            valueObj.numbersB = [];
            // conver large numbers to fit the display
            if (valueObj.result.toString().length > 11) {
                valueObj.result = Number(formatter.format(valueObj.result[0]).replace(/,/g, '')).toExponential();
               }
            display.textContent = valueObj.result + ' ' + operator;
        } else if (operator != '=') {
            display.textContent = operator;
        }
        // store the last operation
        valueObj.operation = valueClicked.id // example: 'plus'

    }
    if (valueObj.result == '0') {
        valueObj.numbersA = [];
    }

    if (valueObj.error == true) {
        display.textContent = '';
    }
}

function onButtonClick() {
    buttons.forEach((button) => {
        button.addEventListener('click', buttonHandler, false)
    })
}

function buttonHandler(e) {
    const valueClicked = e.target;
    // update the display value with the value of the button clicked
    updateDisplay(valueClicked);
    // update the display with the newly changed display value
}

function operate(operator, a, b) {
    if (operator == 'plus') {
        return add(a, b);
    } else if (operator == 'minus') {
        return subtract(a, b);
    } else if (operator == 'times') {
        return multiply(a, b);
    } else if (operator == 'divide') {
        return divide(a, b);
    } else if (operator == 'power') {
        return power(a, b);
    } else if (operator == 'factorial') {
        return factorial(num);
    }
}

function add(a, b) {
	return parseFloat((a + b).toFixed(9));
};

function subtract(a, b) {
	return parseFloat((a - b).toFixed(9));
};

function multiply(a, b) {
	return parseFloat((a * b).toFixed(9));
};

function divide(a, b) {
    if (b == 0) {
        valueObj.error = true;
        showHAL();
        return;
    }
    return parseFloat((a / b).toFixed(9));

    // return Math.round((a / b + Number.EPSILON) * 10000) / 10000;
}

// function power(a, b) {
// 	return a ** b;
// };

// function factorial(num) {
//     if (num === 0 || num === 1){
//         return 1;
//     }
//     return num * factorial(num - 1);
// };


// DIVIDE BY ZERO ERROR: //
function showHAL() {
    const error = document.querySelectorAll('.error');
    error.forEach((error) => {
        error.style.transition = 'all 2.5s';
        error.classList.toggle('hidden');
    })

    const calc = document.querySelector('#calculator');
    calc.style.boxShadow = '0 0 40px 6px rgb(175, 0, 0)';

    buttons.forEach((button) => {
        button.style.transition ='color 2s';
        if (button.id != 'clear'){
            button.style.color = 'rgb(255, 0, 0)';
            button.removeEventListener('click', buttonHandler);
        } else {
            button.style.boxShadow = '0 0 8px 4px rgb(0, 175, 0)';
        }

    })
};

function hideHAL() {
    const error = document.querySelectorAll('.error');
    error.forEach((error) => {
        error.style.transition = 'all .25s';
        error.classList.toggle('hidden');
    })

    const calc = document.querySelector('#calculator');
    calc.style.boxShadow = '0 0 40px 6px rgb(0, 175, 0)';
    buttons.forEach((button) => {
        button.style.transition = 'all .25s';
        button.style.color = 'rgb(0, 255, 0)';
        if (button.id == 'clear') {
            button.style.removeProperty('boxShadow');
        }
    })
}