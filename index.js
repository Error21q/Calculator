const calculate = (s) => {
    console.log("Input Expression ==> " + s);

    if (!s || s.length === 0) return null;

    // Remove spaces
    s = s.replace(/\s/g, '');

    let st = []; // Stack to store numbers
    let n = ''; // String to hold the current number (to support decimals)
    let sign = '+'; // Default sign

    for (let i = 0; i < s.length; i++) {
        const c = s[i];

        // Build the number string (supports decimals)
        if (!isNaN(c) || c === '.') {
            n += c;
        }

        // Process on encountering an operator or end of string
        if (isNaN(c) || i === s.length - 1) {
            if (n) {
                const num = parseFloat(n); // Convert current input to float
                if (isNaN(num)) throw new Error("Invalid number format");

                if (sign === '-') st.push(-num);
                else if (sign === '+') st.push(num);
                else if (sign === 'x') st.push(st.pop() * num);
                else if (sign === '/') st.push(st.pop() / num);
            }

            sign = c; // Update the sign
            n = '';   // Reset current number string
        }
    }

    // Calculate final result
    const result = st.reduce((a, b) => a + b, 0);
    console.log("Final Result ==> " + result);

    // Return result rounded to fix floating-point precision issues
    return parseFloat(result.toFixed(10)).toString().replace(/\.?0+$/, '');
};

// DOM Manipulation for Calculator UI
const resultElement = document.getElementById('lr');
const buttons = document.querySelectorAll('.btnbox');
let currentInput = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;

        if (buttonText === 'DEL') {
            // Remove last character
            currentInput = currentInput.slice(0, -1);
        } else if (buttonText === 'RESET') {
            // Reset input
            currentInput = '0';
        } else if (buttonText === '=') {
            // Calculate result
            try {
                currentInput = calculate(currentInput).toString();
            } catch (error) {
                console.error(error);
                currentInput = 'Error';
            }
        } else {
            // Prevent consecutive decimals
            if (buttonText === '.' && currentInput.slice(-1) === '.') return;

            // Avoid leading zero issues
            if (currentInput === '0' && buttonText !== '.') {
                currentInput = buttonText;
            } else {
                currentInput += buttonText;
            }
        }

        // Update result display
        resultElement.textContent = currentInput;

        // Opacity styling for empty input
        if (currentInput === '' || currentInput === '0') {
            resultElement.style.opacity = '0.5';
        } else {
            resultElement.style.opacity = '1';
        }
    });
});
