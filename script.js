document.addEventListener('DOMContentLoaded', () => {
  const landingPage = document.getElementById('landing-page');
  const gameContainer = document.getElementById('game-container');
  const startButton = document.getElementById('start-game');

  startButton.addEventListener('click', () => {
    landingPage.style.animation = 'fadeOut 1s ease-out forwards';
    setTimeout(() => {
      landingPage.style.display = 'none';
      gameContainer.style.display = 'block';
      gameContainer.style.animation = 'fadeIn 1s ease-out';
    }, 1000);
  });
});

class TicTacToe {
  constructor() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.gameMode = null;
    this.isGameOver = false;

    // DOM elements
    this.cells = document.querySelectorAll('.cell');
    this.statusText = document.getElementById('status-text');
    this.resetButton = document.getElementById('reset');
    this.aiModeButton = document.getElementById('ai-mode');
    this.twoPlayerButton = document.getElementById('two-player');
    
    // Initialize particles
    this.initParticles();

    // Event listeners
    this.cells.forEach(cell => {
      cell.addEventListener('click', () => this.handleCellClick(cell));
    });
    this.resetButton.addEventListener('click', () => this.resetGame());
    this.aiModeButton.addEventListener('click', () => this.setGameMode('AI'));
    this.twoPlayerButton.addEventListener('click', () => this.setGameMode('2P'));

    // Enhanced 3D effects
    this.setupBoardEffects();

    // Add background music
    this.backgroundMusic = document.getElementById('background-music');
    this.setupAudio();
  }

  initParticles() {
    const particlesContainer = document.querySelector('.particles');
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.width = Math.random() * 5 + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particlesContainer.appendChild(particle);
    }
  }

  setupBoardEffects() {
    const cube = document.querySelector('.cube');
    const board = document.querySelector('.board');

    // Add smoother floating animation
    let lastTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      const floatOffset = Math.sin(currentTime / 2000) * 5;
      const rotateOffset = Math.sin(currentTime / 3000) * 2;
      
      cube.style.transform = `rotateX(${25 + rotateOffset}deg) rotateY(${25 + rotateOffset}deg) translateZ(${floatOffset}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    // Smoother hover effect
    let currentX = 25;
    let currentY = 25;
    let targetX = 25;
    let targetY = 25;

    board.addEventListener('mousemove', (e) => {
      const rect = board.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      targetX = 25 + ((y - centerY) / 30);
      targetY = 25 + ((centerX - x) / 30);
    });

    board.addEventListener('mouseleave', () => {
      targetX = 25;
      targetY = 25;
    });

    // Smooth rotation animation
    const smoothRotation = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      
      cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg) translateZ(${Math.sin(Date.now() / 2000) * 5}px)`;
      requestAnimationFrame(smoothRotation);
    };
    smoothRotation();
  }

  setupAudio() {
    // Start music when user interacts with the game
    document.addEventListener('click', () => {
      if (this.backgroundMusic.paused) {
        this.backgroundMusic.play()
          .catch(error => console.log("Audio playback prevented:", error));
        this.backgroundMusic.volume = 0.3; // Set appropriate volume
      }
    }, { once: true });
  }

  setGameMode(mode) {
    this.gameMode = mode;
    this.resetGame();
    this.statusText.textContent = mode === 'AI' ? 
      'بازی با هوش مصنوعی - نوبت شما (X)' : 
      'بازی دو نفره - نوبت X';
    
    // Add celebration effect
    this.addCelebrationEffect();
    // Add sound effect for mode selection
    this.playEffect('mode-select');
  }

  addCelebrationEffect() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = `translate(-50%, -50%)`;
        particle.style.animation = `celebrate ${Math.random() * 1 + 0.5}s linear forwards`;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
      }, i * 100);
    }
  }

  handleCellClick(cell) {
    if (!this.gameMode) return;
    
    const index = cell.dataset.index;
    if (this.board[index] || this.isGameOver) return;

    this.makeMove(index);

    if (this.gameMode === 'AI' && !this.isGameOver) {
      setTimeout(() => this.makeAIMove(), 500);
    }
  }

  makeMove(index) {
    this.board[index] = this.currentPlayer;
    this.cells[index].classList.add(this.currentPlayer.toLowerCase());
    
    if (this.checkWinner()) {
      this.isGameOver = true;
      this.statusText.textContent = `بازیکن ${this.currentPlayer} برنده شد!`;
      this.celebrateWin();
      return;
    }

    if (this.board.every(cell => cell)) {
      this.isGameOver = true;
      this.statusText.textContent = 'بازی مساوی شد!';
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    if (!this.isGameOver) {
      this.statusText.textContent = this.gameMode === 'AI' ?
        (this.currentPlayer === 'X' ? 'نوبت شما (X)' : 'نوبت هوش مصنوعی (O)') :
        `نوبت ${this.currentPlayer}`;
    }
    // Add sound effect for moves
    this.playEffect(this.currentPlayer.toLowerCase());
  }

  celebrateWin() {
    const winningCells = this.getWinningCells();
    winningCells.forEach(index => {
      this.cells[index].style.animation = 'winner 2s ease-in-out infinite';
    });

    // Enhanced celebration effect with smoother animations
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#1E90FF'];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 15 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.animation = `celebrate ${Math.random() * 1 + 1.5}s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
        particle.style.boxShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2500);
      }, i * 100);
    }
    
    this.playEffect('win');
  }

  getWinningCells() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
      if (combination.every(index => this.board[index] === this.currentPlayer)) {
        return combination;
      }
    }
    return [];
  }

  makeAIMove() {
    const bestMove = this.minimax(this.board, 'O').index;
    this.makeMove(bestMove);
  }

  minimax(board, player) {
    const availableMoves = this.getAvailableMoves(board);
    
    if (this.checkWinningCombination(board, 'X')) {
      return { score: -10 };
    } else if (this.checkWinningCombination(board, 'O')) {
      return { score: 10 };
    } else if (availableMoves.length === 0) {
      return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableMoves.length; i++) {
      const move = {};
      move.index = availableMoves[i];
      board[availableMoves[i]] = player;

      if (player === 'O') {
        const result = this.minimax(board, 'X');
        move.score = result.score;
      } else {
        const result = this.minimax(board, 'O');
        move.score = result.score;
      }

      board[availableMoves[i]] = '';
      moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  getAvailableMoves(board) {
    return board.reduce((moves, cell, index) => {
      if (!cell) moves.push(index);
      return moves;
    }, []);
  }

  checkWinner() {
    return this.checkWinningCombination(this.board, this.currentPlayer);
  }

  checkWinningCombination(board, player) {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => {
      return combination.every(index => board[index] === player);
    });
  }

  resetGame() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.isGameOver = false;
    this.cells.forEach(cell => {
      cell.classList.remove('x', 'o');
      cell.style.animation = '';
    });
    if (this.gameMode) {
      this.statusText.textContent = this.gameMode === 'AI' ? 
        'بازی با هوش مصنوعی - نوبت شما (X)' : 
        'بازی دو نفره - نوبت X';
    }
  }

  playEffect(type) {
    const effects = {
      'mode-select': './sounds/mode-select.mp3',
      'x': './sounds/x-move.mp3',
      'o': './sounds/o-move.mp3',
      'win': './sounds/win.mp3'
    };

    if (effects[type]) {
      const audio = new Audio(effects[type]);
      audio.volume = 0.4;
      audio.play().catch(error => console.log("Audio playback prevented:", error));
    }
  }
}

// Initialize game
const game = new TicTacToe();