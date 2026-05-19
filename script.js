const display = document.getElementById('calculator-display');
const toggleFormatButton = document.getElementById('toggle-format');
const buttons = document.querySelectorAll('.btn');

let expression = '';
let lastResult = '';
let isResult = false;
let displayMode = 'smart';

const unitMultipliers = {
  'H': 100,
  'K': 1000,
  'L': 100000,
  'M': 1000000,
};

const formatDisplay = (value) => {
  const stringValue = String(value);
  const [integer, fraction] = stringValue.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fraction ? `${formattedInteger}.${fraction}` : formattedInteger;
};

const formatSmartNumber = (num) => {
  const sign = num < 0 ? '-' : '';
  let absValue = Math.abs(num);

  if (!Number.isFinite(absValue)) return 'Error';
  if (absValue < 1000) {
    const valueString = absValue === Math.floor(absValue)
      ? String(absValue)
      : String(Number(absValue.toFixed(6)).toString().replace(/(?:\.0+|(.+?)0+)$/, '$1'));
    return sign + formatDisplay(valueString);
  }

  const parts = [];
  const mCount = Math.floor(absValue / 1000000);
  if (mCount > 0) {
    parts.push(`${mCount}M`);
    absValue %= 1000000;
  }

  const lCount = Math.floor(absValue / 100000);
  if (lCount > 0) {
    parts.push(`${lCount}L`);
    absValue %= 100000;
  }

  const kCount = Math.floor(absValue / 1000);
  if (kCount > 0) {
    parts.push(`${kCount}K`);
    absValue %= 1000;
  }

  if (absValue > 0) {
    parts.push(String(absValue));
  }

  return sign + parts.join(' ');
};

const updateScreen = () => {
  if (isResult && lastResult) {
    const numeric = Number(lastResult);
    display.textContent = displayMode === 'smart'
      ? formatSmartNumber(numeric)
      : formatDisplay(lastResult);
    return;
  }

  display.textContent = expression || '0';
};

const toggleDisplayMode = () => {
  if (!isResult || !lastResult) return;
  displayMode = displayMode === 'smart' ? 'raw' : 'smart';
  toggleFormatButton.textContent = displayMode === 'smart' ? 'Show digits' : 'Show units';
  updateScreen();
};

const expandUnits = (input) => {
  return input.replace(/(\d+(?:\.\d+)?)([HKLM])/gi, (match, num, symbol) => {
    const multiplier = unitMultipliers[symbol.toUpperCase()] || 1;
    return String(Number(num) * multiplier);
  });
};

const cleanExpression = (input) => {
  return input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/--/g, '+');
};

const evaluateExpression = (input) => {
  const expanded = expandUnits(cleanExpression(input));
  if (!expanded.trim()) return '';

  try {
    const safe = Function(`"use strict"; return (${expanded})`);
    const result = safe();
    if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
      return 'Error';
    }
    return Number.isFinite(result) ? result : 'Error';
  } catch (err) {
    return 'Error';
  }
};

const handleButton = (button) => {
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'clear') {
    expression = '';
    lastResult = '';
    isResult = false;
    displayMode = 'smart';
    toggleFormatButton.textContent = 'Show digits';
  } else if (action === 'delete') {
    expression = expression.slice(0, -1);
  } else if (action === 'equals') {
    const result = evaluateExpression(expression);
    if (result === 'Error') {
      expression = '';
      lastResult = '';
      isResult = false;
      display.textContent = 'Error';
      return;
    }

    lastResult = String(result);
    expression = lastResult;
    isResult = true;
    displayMode = 'smart';
    toggleFormatButton.textContent = 'Show digits';
    display.textContent = formatSmartNumber(result);
    return;
  } else if (value) {
    if (expression === 'Error') {
      expression = value;
      isResult = false;
    } else if (isResult) {
      const operators = ['+', '-', '*', '/', '%'];
      if (operators.includes(value)) {
        expression = expression + value;
      } else {
        expression = value;
      }
      isResult = false;
      lastResult = '';
      displayMode = 'smart';
      toggleFormatButton.textContent = 'Show digits';
    } else {
      expression += value;
    }
  }

  updateScreen();
};

buttons.forEach((button) => {
  button.addEventListener('click', () => handleButton(button));
});

if (toggleFormatButton) {
  toggleFormatButton.addEventListener('click', toggleDisplayMode);
}

window.addEventListener('keydown', (event) => {
  const key = event.key;
  const allowedKeys = '0123456789+-*/.%()HhKkLlMm';

  if (key === 'Enter') {
    event.preventDefault();
    handleButton({dataset: {action: 'equals'}});
    return;
  }

  if (key === 'Backspace') {
    event.preventDefault();
    handleButton({dataset: {action: 'delete'}});
    return;
  }

  if (key === 'Escape') {
    event.preventDefault();
    handleButton({dataset: {action: 'clear'}});
    return;
  }

  if (allowedKeys.includes(key)) {
    event.preventDefault();
    handleButton({dataset: {value: key.toUpperCase()}});
  }
});

updateScreen();
