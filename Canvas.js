class Canvas {
  #board;
  #boardCtx;
  #overlay;
  #overlayCtx;
  size;

  constructor(board, overlay, size = 4) {
    this.#board = board;
    this.#boardCtx = board.getContext("2d");
    this.#overlay = overlay;
    this.#overlayCtx = overlay.getContext("2d");
    this.size = size;
  }

  clearBoard() {  
    this.#boardCtx.clearRect(0, 0, this.#board.width, this.#board.height);
  }

  #clearOverlay() {
    this.#overlayCtx.clearRect(0, 0, this.#overlay.width, this.#overlay.height);
  }

  #drawQueens(positions) {
    for (let i = 0; i < positions.length; i++) {
      const queenPosition = positions[i];

      const column = queenPosition % this.size;
      const row = Math.floor(queenPosition / this.size);

      this.#drawQueen(column, row);
    }
  }

  #drawQueen(row, column) {
    const cellSize = this.#board.width / this.size;
    const color = this.#isBlackCell(row, column) ? "#fff" : "#000";

    const centerX = (column * cellSize) + Math.floor(cellSize / 2);
    const centerY = (row * cellSize) + Math.floor(cellSize / 2);

    // The scaling factor for different parts of the queen
    const baseRadius = cellSize * 0.3; // Queen's base
    const bodyRadius = cellSize * 0.2; // Queen's body
    const headRadius = cellSize * 0.1; // Queen's head
    const crownRadius = cellSize * 0.04; // Queen's crown

    // Base of the queen - Larger outer circle
    this.#drawCircle(centerX, centerY, baseRadius, color);

    // Middle of the queen - Medium circle
    this.#drawCircle(centerX, centerY, bodyRadius, "#333");

    // Head of the queen - Smaller circle
    this.#drawCircle(centerX, centerY, headRadius, "#666");

    // Crown of the queen - Smaller circles around the head
    const offset = baseRadius - cellSize * 0.1; // How far from the center the crown should be

    // 8 crown circles around the queen's head
    this.#drawCircle(centerX - offset * 0.95, centerY, crownRadius, color); // Left crown
    this.#drawCircle(centerX + offset * 0.95, centerY, crownRadius, color); // Right crown
    this.#drawCircle(centerX, centerY - offset * 0.95, crownRadius, color); // Top crown
    this.#drawCircle(centerX, centerY + offset * 0.95, crownRadius, color); // Bottom crown
    this.#drawCircle( centerX - offset * 0.65, centerY - offset * 0.75, crownRadius, color); // Top-left crown
    this.#drawCircle( centerX + offset * 0.65, centerY - offset * 0.75, crownRadius, color); // Top-right crown
    this.#drawCircle( centerX - offset * 0.65, centerY + offset * 0.75, crownRadius, color); // Bottom-left crown
    this.#drawCircle( centerX + offset * 0.65, centerY + offset * 0.75, crownRadius, color); // Bottom-right crown
  }
  
  #drawCircle(x, y, radius, color) {
    this.#overlayCtx.beginPath();
    this.#overlayCtx.arc(x, y, radius, 0, Math.PI * 2);
    this.#overlayCtx.fillStyle = color;
    this.#overlayCtx.strokeStyle = color;
    this.#overlayCtx.fill();
    this.#overlayCtx.stroke();
  }

  #isBlackCell(row, column) {
    return row % 2 === 0 && column % 2 === 0 || row % 2 === 1 && column % 2 === 1;
  }
  
  renderBoard() {
    const cellSize = this.#board.width / this.size;

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.#isBlackCell(row, column)) {
          this.#boardCtx.fillRect(column * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  renderQueens(positions = []) {
    this.#clearOverlay();
    this.#drawQueens(positions);
  }
}

export { Canvas };