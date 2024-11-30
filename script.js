// Get the chessboard element from the DOM by its ID
const chessBoard = document.getElementById('chess-board');

// Initialize a variable to store the currently selected piece for drag-and-drop or click-move
let selectedPiece = null;

// Initialize an array to keep track of highlighted squares for move feedback
let highlightedSquares = [];

// Define the initial state of the chessboard (position of pieces)
const boardState = [
  ['b-r', 'b-n', 'b-b', 'b-q', 'b-k', 'b-b', 'b-n', 'b-r'], // Black pieces
  ['b-p', 'b-p', 'b-p', 'b-p', 'b-p', 'b-p', 'b-p', 'b-p'], // Black pawns
  ['', '', '', '', '', '', '', ''], // Empty row
  ['', '', '', '', '', '', '', ''], // Empty row
  ['', '', '', '', '', '', '', ''], // Empty row
  ['', '', '', '', '', '', '', ''], // Empty row
  ['w-p', 'w-p', 'w-p', 'w-p', 'w-p', 'w-p', 'w-p', 'w-p'], // White pawns
  ['w-r', 'w-n', 'w-b', 'w-q', 'w-k', 'w-b', 'w-n', 'w-r'], // White pieces
];

// Map to associate piece identifiers with their image paths
const pieceMap = {
  'w-r': '/assets/White/w-rook.svg',   // White rook
  'w-n': '/assets/White/w-knight.svg', // White knight
  'w-b': '/assets/White/w-bishop.svg', // White bishop
  'w-q': '/assets/White/w-queen.svg',  // White queen
  'w-k': '/assets/White/w-king.svg',   // White king
  'w-p': '/assets/White/w-pawn.svg',   // White pawn
  'b-r': '/assets/Black/b-rook.svg',   // Black rook
  'b-n': '/assets/Black/b-knight.svg', // Black knight
  'b-b': '/assets/Black/b-bishop.svg', // Black bishop
  'b-q': '/assets/Black/b-queen.svg',  // Black queen
  'b-k': '/assets/Black/b-king.svg',   // Black king
  'b-p': '/assets/Black/b-pawn.svg',   // Black pawn
};

// Function to create the chessboard dynamically
function createBoard() {
  // Clear any existing board content
  chessBoard.innerHTML = '';

  // Loop through each row (8 rows)
  for (let i = 0; i < 8; i++) {
    // Loop through each column (8 columns)
    for (let j = 0; j < 8; j++) {
      // Create a square (div element) for each cell in the grid
      const square = document.createElement('div');
      square.classList.add('square'); // Add the "square" class
      // Alternate colors for the squares (white or black)
      square.classList.add((i + j) % 2 === 0 ? 'w-board' : 'b-board');
      square.dataset.row = i; // Store the row index in a data attribute
      square.dataset.col = j; // Store the column index in a data attribute

      // Get the piece on this square
      const piece = boardState[i][j];
      if (piece) {
        // If there is a piece, create an image element for it
        const pieceElement = document.createElement('img');
        pieceElement.classList.add('piece'); // Add the "piece" class
        pieceElement.src = pieceMap[piece]; // Set the image source from pieceMap
        pieceElement.alt = piece; // Set alt text as the piece identifier
        pieceElement.dataset.row = i; // Store row index in data attribute
        pieceElement.dataset.col = j; // Store column index in data attribute
        pieceElement.draggable = true; // Make the piece draggable

        // Append the piece to the square
        square.appendChild(pieceElement);
      }

      // Append the square to the chessboard
      chessBoard.appendChild(square);
    }
  }
}

// Function to move a piece to a target square
function movePiece(targetRow, targetCol) {
  if (!selectedPiece) return; // If no piece is selected, do nothing

  const { row, col, pieceElement } = selectedPiece;

  // Update the board state (move the piece in the array)
  boardState[targetRow][targetCol] = boardState[row][col];
  boardState[row][col] = '';

  // Find the target square in the DOM and move the piece there
  const targetSquare = chessBoard.querySelector(
    `.square[data-row='${targetRow}'][data-col='${targetCol}']`
  );
  targetSquare.appendChild(pieceElement);

  // Reset selection and clear highlights
  clearHighlights();
  selectedPiece = null;
}

// Function to clear highlights from the squares
function clearHighlights() {
  highlightedSquares.forEach((square) => {
    square.classList.remove('highlighted'); // Remove "highlighted" class
  });
  highlightedSquares = []; // Clear the highlightedSquares array
}

// Function to handle clicks on the squares
function handleSquareClick(event) {
  const square = event.target.closest('.square'); // Find the clicked square
  if (!square) return; // If no square is clicked, do nothing

  const targetRow = parseInt(square.dataset.row); // Get the target row
  const targetCol = parseInt(square.dataset.col); // Get the target column

  if (selectedPiece) {
    // If a piece is selected, attempt to move it to the clicked square
    movePiece(targetRow, targetCol);
  } else {
    // If no piece is selected, select the piece on the clicked square
    const pieceElement = square.querySelector('.piece');
    if (pieceElement) {
      selectedPiece = {
        row: targetRow,
        col: targetCol,
        pieceElement,
      };

      // Highlight the selected square
      clearHighlights();
      square.classList.add('highlighted');
      highlightedSquares.push(square);
    }
  }
}

// Function to handle the start of a drag event
function handleDragStart(event) {
  const pieceElement = event.target; // Get the piece being dragged
  selectedPiece = {
    row: parseInt(pieceElement.dataset.row), // Store row index
    col: parseInt(pieceElement.dataset.col), // Store column index
    pieceElement,
  };
}

// Function to allow the piece to be dropped by preventing the default action
function handleDragOver(event) {
  event.preventDefault();
}

// Function to handle the drop event (when a piece is dropped onto a square)
function handleDrop(event) {
  event.preventDefault(); // Prevent default drop behavior
  const square = event.target.closest('.square'); // Find the target square
  if (!square) return; // If no square is found, do nothing

  const targetRow = parseInt(square.dataset.row); // Get the target row
  const targetCol = parseInt(square.dataset.col); // Get the target column

  // Move the piece to the target square
  movePiece(targetRow, targetCol);
}

// Attach event listeners to the chessboard
chessBoard.addEventListener('dragstart', handleDragStart); // Handle piece drag start
chessBoard.addEventListener('dragover', handleDragOver); // Handle piece drag over
chessBoard.addEventListener('drop', handleDrop); // Handle piece drop
chessBoard.addEventListener('click', handleSquareClick); // Handle square click

// Initialize the chessboard when the page loads
createBoard();
