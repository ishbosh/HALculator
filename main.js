const displayValue = {
    numbers: [],
    operator: null,
    result: null,
}

function clearDisplay() {
    displayValue.numbers = [];
    displayValue.operator = null;
    displayValue.result = null;
    updateDisplay(); // may need to revisit this line once function is completed
}

function updateDisplay() {
    // Select the inner display element
    // if number is pressed, add that number to the display
    // if operator is pressed, add the operator to the end of the number
    // if number is pressed after operator, show the new number and below that show the result
    // if another operator is pressed, show the result of the last operation and showthe new operator
    // if equals is pressed, add the final operation to the display
    const display = document.querySelector('#innerdisplay');

}

function updateDisplayValue() {
    const button = getButtonPressed();
    
    if (button.id == 'clear') {    
        clearDisplay();
    } 
    else if (button.parentElement.classList == 'numbers' && button.classList != 'symbol') {
        displayValue.numbers.push(+button.textContent);
    }
}

function getButtonPressed() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            return e.target;
        }, false)
    })
}

function operate(operator, a, b) {
    if (operator == 'add') {
        return add(a, b);
    } else if (operator == 'subtract') {
        return subtract(a, b);
    } else if (operator == 'multiply') {
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
	return a + b;
};

function subtract(a, b) {
	return a - b;
};

function multiply(a, b) {
	return a * b;
};

function divide(a, b) {
    if (b == 0) {
        showHAL();
        return;
    }
    return a / b;
}

function power(a, b) {
	return a ** b;
};

function factorial(num) {
    if (num === 0 || num === 1){
        return 1;
    }
    return num * factorial(num - 1);
};


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