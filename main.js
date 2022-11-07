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
    if (b == 0) return "ERROR: DIVIDE BY ZERO - INITIATE SELF DESTRUCT SEQUENCE";
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