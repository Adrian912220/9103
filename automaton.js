'use strict'; // <-- see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

// initialize the ECA with a rule set and row length
const ruleSet = { 
  '111': 0, 
  '110': 1, 
  '101': 1, 
  '100': 0, 
  '011': 1, 
  '010': 1, 
  '001': 1, 
  '000': 0 };
  
const numRows = 15;
const eca = []; 

// Create cells and add them to the automaton
for (let i = 0; i < numRows; i++) {
  // create an array of zeros with i+1 elements and add it to eca
  eca.push(Array(i+1).fill(0));

  // create a new div element and set its class to 'row'
  const row = document.createElement('div');
  row.setAttribute('class', 'row');

  // create i+1 div elements and set their class to 'cell', then append them to the row element
  for (let j = 0; j <= i; j++) {
    const cell = document.createElement('div');
    cell.setAttribute('class', 'cell');
    row.appendChild(cell);
  }

  // append the row element to the automaton element
  const automaton = document.getElementById('automaton');
  automaton.appendChild(row);
}

// Initialise Tone.js
let started = false;
function startAudio() {
  if (!started) {
    Tone.start();
    started = true;
  }
}

document.addEventListener('mousedown', startAudio);

const synth = new Tone.Synth().toMaster();
const notes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'];

// Update the automaton and play notes for each generation
let currentRow = 0;
let currentClick = 0; // to keep track of current button click
const button = document.getElementById('generate-button');

//fill color 
function updateAutomaton() {
  if (currentRow === numRows) return;

  const row = eca[currentRow];
  const cells = document.getElementsByClassName('row')[currentRow].getElementsByClassName('cell');

  for (let i = 0; i <= currentRow; i++) {
    if (currentRow <= currentClick) {
      cells[i].style.backgroundColor = 'purple';
      row[i] = 1; // set the corresponding eca cell value to 1
    } else {
      cells[i].style.backgroundColor = 'white';
      row[i] = 0; // set the corresponding eca cell value to 0
    }

    if (row[i]) {
      const note = notes[Math.floor(Math.random() * notes.length)];
      synth.triggerAttackRelease(note, '16n');
    }
  }

  currentRow++;
  setTimeout(updateAutomaton, 100);
}

//to click if clicked and updates the ECA 
button.addEventListener('click', () => {
  currentClick++;
  currentRow = 0;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j <= i; j++) {
      if (i === 0 && currentClick === 1) {
        eca[i][j] = 0.5; // Start with a single active cell in the first row on the first click
      } else {
        eca[i][j] = 0; // set all other eca cell values to 0
      }
    }
  }
  updateAutomaton();
});
