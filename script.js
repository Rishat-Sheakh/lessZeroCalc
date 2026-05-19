const display = document.getElementById('calculator-display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

const unitMultipliers = {
  'H': 100,
  'K': 1000,
  'L': 100000,
};

const formatDisplay = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const updateScreen = () => {
  display.textContent = expression || '0';
};

const expandUnits = (input) => {
  return input.replace(/(\d+(?:\.\d+)?)([HKL])/gi, (match, num, symbol) => {
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
  } else if (action === 'delete') {
    expression = expression.slice(0, -1);
  } else if (action === 'equals') {
    const result = evaluateExpression(expression);
    expression = result === 'Error' ? '' : String(result);
    display.textContent = result === 'Error' ? 'Error' : formatDisplay(expression);
    return;
  } else if (value) {
    if (expression === 'Error') {
      expression = value;
    } else {
      expression += value;
    }
  }

  updateScreen();
};

buttons.forEach((button) => {
  button.addEventListener('click', () => handleButton(button));
});

window.addEventListener('keydown', (event) => {
  const key = event.key;
  const allowedKeys = '0123456789+-*/.%()HhKkLl';

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
