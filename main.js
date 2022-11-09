const valueObj = {
    numbersA: [],
    numbersB: [],
    operation: null,
    result: [null],
    lastEntry: null,
}

function clearDisplay() {
    valueObj.numbersA = [];
    valueObj.numbersB = [];
    valueObj.operation = null;
    valueObj.result = [null];
    valueObj.lastEntry = null;
    hideHAL();
    display.textContent = '0';
}

const display = document.querySelector('#innerdisplay');

initializeDisplay();
onButtonClick();

// To format numbers to fit the display
let formatter = Intl.NumberFormat('en', {maximumSignificantDigits: 8});

//     // Listen for button presses so we can know when to change to operator/result/number

//     // Select the inner display element
//     // if number is pressed, add that number to the display
//     // if operator is pressed, add the operator to the end of the number
//     // if number is pressed after operator, show the new number and below that show the result
//     // if another operator is pressed, show the result of the last operation and showthe new operator
//     // if equals is pressed, add the final operation to the display


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
}

function onButtonClick() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const valueClicked = e.target;
            // update the display value with the value of the button clicked
            updateDisplay(valueClicked);
            // update the display with the newly changed display value
        }, false)
    })
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
        error.classList.remove('hidden');
    })

    const calc = document.querySelector('#calculator');
    calc.style.boxShadow = '0 0 40px 6px rgb(175, 0, 0)';
};

function hideHAL() {
    const error = document.querySelectorAll('.error');
    error.forEach((error) => {
        error.classList.add('hidden');
    })

    const calc = document.querySelector('#calculator');
    calc.style.boxShadow = '0 0 40px 6px rgb(0, 175, 0)';
}