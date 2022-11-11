//#region // GLOBAL CONST DECLARATIONS //

    // Object to track calculator values //
        // Numbers A and Numbers B will be calculated on - each array will be combined into one number before calculation
        // Operation tracks the current operator
        // Result stores the result (for additional calculations)
        // lastEntry tracks the previous value type
        // error tracks whether or not an error is currently being handled
const valueObj = {
    numbersA: [],
    numbersB: [],
    operation: null,
    result: [null],
    lastEntry: null,
    error: false,
}

    // DOM selection //
const display = document.querySelector('#innerdisplay');
const buttons = document.querySelectorAll('button');
    // Formatter for long numbers that go beyond the display size //
const formatter = Intl.NumberFormat('en', {maximumSignificantDigits: 8});
    // Maximum amount of entered numbers that can fit in the display
const MAX_DISPLAY_SIZE = 13;

//#endregion //


//#region // INITIALIZATION //

initializeDisplay(); // set initial display to 0
detectButtonClicks(); // initiate the event listeners on the buttons

//#endregion //


//#region // DISPLAY HANDLING //

function initializeDisplay() {
    display.textContent = '0';
}

function updateDisplay(valueClicked) {
    // Grab the actual value of the clicked button from the html
    const value = valueClicked.textContent;
    let update = false;

    if (valueClicked.id == 'clear') {    
        clearDisplay();
    } 
    else {
        // Call each operation, checking if there was an update at each step.
        // Done in this order so that '=' will not be considered an operation but will instead give result.
        // Pass in the button that was clicked and the value it represents 
        update = updateNumbers(valueClicked, value);
        if (update == false) {
            //result doesnt need the value because it will always be '='
            update = updateResult(valueClicked);
        }
        if (update == false) {
            update = updateOperator(valueClicked, value);
        }
    }

    // If the result of a calculation is 0, reset numbers A to empty so that an extra 0 is not printed to the display
    if (valueObj.result == '0') {
        valueObj.numbersA = [];
    }

    // Check for divide by zero error, clear out the normal display if there is an error
    // so that it does not overlap the error display
    if (valueObj.error == true) {
        display.textContent = '';
    }
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
        detectButtonClicks();
    }
    initializeDisplay();
}

//#endregion //


//#region // UPDATE VALUE FUNCTIONS //

function updateNumbers(valueClicked, value) {
    // Check if the value clicked is a number, if false then do not update
    const valueIsNumber = valueClicked.parentElement.id == 'numbers' && valueClicked.classList != 'symbol';
    if (!valueIsNumber) {return false;}
    // Check if the length of the numbers on the display fits in the display, if not then do not update
    if (valueObj.numbersB.length >= MAX_DISPLAY_SIZE || valueObj.numbersA.length >= MAX_DISPLAY_SIZE) {return false;}
    // Check if the last value clicked was result, if it was, then clear numbersA to allow new numbers
    if (valueObj.lastEntry == 'result') {
        valueObj.numbersA = [];
    }

    // Update numbers B if there are existing numbers B or if the last value was an operator
    if ((valueObj.lastEntry == 'operator' || valueObj.numbersB.length > 0)) {
        valueObj.lastEntry = 'number';
        valueObj.numbersB.push(value);
        display.textContent = valueObj.numbersB.join('');
        return true;
    }
    // Update numbers A if we are not updating numbers B
    else {
        valueObj.lastEntry = 'number';
        valueObj.numbersA.push(value);
        display.textContent = valueObj.numbersA.join('');
        return true;
    }
}

function updateOperator(valueClicked, value) {
    // Check if the value is a valid operation, if it is not, return false
    const valueIsValidOperation = (
                                valueClicked.parentElement.id == 'operators' && 
                                valueClicked.id != 'equals' && 
                                valueObj.lastEntry != 'operator'
                                );
    if (!valueIsValidOperation) {return false;}

    valueObj.lastEntry = 'operator'
    const operator = value; 
    // Check if there is a value in numbers B that we are operating on
    if (valueObj.numbersB.length > 0) {
        
        calculateResult();
        formatResult();
        
        // When we are in the middle of an operation/chaining operations without getting a result first by pressing =, 
        // then update the display with the result and the new operator
        // Example: A + B + will show result of A+B and will also show the new + operator
        display.textContent = valueObj.result + ' ' + operator;
    } else if (operator != '=') {
        // When we are starting a new operation, update the display to the operator (unless it is '=')
        // Example: A + (or result +) will show just the + (so this will also happen when you do A + B = result +)
        display.textContent = operator;
    }
    // Keep track of the current operation
    valueObj.operation = valueClicked.id
    return true;
}

function updateResult(valueClicked) {
    // When equals is clicked and numbers B has existing values, proceed with calculating result
    if (valueClicked.id == 'equals' && valueObj.numbersB.length > 0) {
        valueObj.lastEntry = 'result';

        calculateResult();
        formatResult();

        // Update the display with the calculated result        
        display.textContent = valueObj.result;
        return true;
    }
    return false;
}

//#endregion //


//#region // HELPER FUNCTIONS FOR RESULT/OPERATOR //

    // Helper function to format the result for the display
function formatResult(){
    // convert large number results to fit the display using formatter and exponential notation
    if (valueObj.result.toString().length > 11) {
        valueObj.result = Number(formatter.format(valueObj.result[0]).replace(/,/g, '')).toExponential();
    }
}

    // Helper function to calculate the result for the result and operator functions
function calculateResult() {
        // Convert numbers A and numbers B from arrays to strings
        const numbersA = valueObj.numbersA.join('');
        const numbersB = valueObj.numbersB.join('');

        // Operate on numbers A and numbers B (converted to Number type) with the current operator
        valueObj.result = [operate(valueObj.operation, +numbersA, +numbersB)];
        
        // Send the result to numbers A and clear out numbers B for future operations
        valueObj.numbersA = [valueObj.result];
        valueObj.numbersB = [];
}

//#endregion //


//#region // BUTTON HANDLING //

function detectButtonClicks() {
    buttons.forEach((button) => {
        if (button.classList != 'symbol disabled') {
            button.addEventListener('click', buttonHandler, false)
        }
    })
}

function buttonHandler(e) {
    const valueClicked = e.target;
    // update the display value with the value of the button clicked
    updateDisplay(valueClicked);
    // update the display with the newly changed display value
}
//#endregion //


//#region // CALCULATIONS //

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
    // Divide by Zero Error
    if (b == 0) {
        valueObj.error = true;
        showHAL();
        console.log("I think you know what the problem is just as well as I do.")
        return;
    }
    return parseFloat((a / b).toFixed(9));
}
//#endregion //


//#region // DIVIDE BY ZERO ERROR: //

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
        if (button.id != 'clear' && button.classList != 'symbol disabled'){
            button.style.color = 'rgb(255, 0, 0)';
            button.removeEventListener('click', buttonHandler);
        } else if (button.id == 'clear') {
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
        if (button.classList != 'symbol disabled') {
            button.style.transition = 'all .25s';
            button.style.color = 'rgb(0, 255, 0)';
            if (button.id == 'clear') {
                button.style.boxShadow = '';
            }
        }
    })
}

//#endregion //


//#region // UNUSED FUNCTIONS - Possible future upgrade //

// function power(a, b) {
// 	return a ** b;
// };

// function factorial(num) {
//     if (num === 0 || num === 1){
//         return 1;
//     }
//     return num * factorial(num - 1);
// };

//#endregion //
