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

//     // Listen for button presses so we can know when to change to operator/result/number

//     // Select the inner display element
//     // if number is pressed, add that number to the display
//     // if operator is pressed, add the operator to the end of the number
//     // if number is pressed after operator, show the new number and below that show the result
//     // if another operator is pressed, show the result of the last operation and showthe new operator
//     // if equals is pressed, add the final operation to the display


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