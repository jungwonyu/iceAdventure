
let game;
let player;
let playerShake = 0;
let backgroundY = 0;
let backgroundImg;
let startButton;
let titleText;
let gameStarted = false;
let score = 0;
let scoreText;
let isPaused = false;
let pauseButton;

function preload() {
	this.load.image('startBackground', 'assets/images/startBackground.png');
	this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/player.png');

  this.load.image('candy', 'assets/images/candy.png');

  // 버튼
  this.load.image('playButton', 'assets/images/btn_play.png');
  this.load.image('pauseButton', 'assets/images/btn_pause.png');
  this.load.image('soundButton', 'assets/images/btn_sound.png');
  this.load.image('muteButton', 'assets/images/btn_mute.png');

  // 사운드
  this.load.audio('bgm', 'assets/sounds/bgm.mp3');
}

function create() {
  // 배경음악 재생
  this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
  this.bgm.play();

  // 첫화면 배경 추가
  backgroundImg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'startBackground')
    .setOrigin(0.5)
    .setDisplaySize(this.scale.width, this.scale.height)
    .setDepth(0);

  // 첫 시작 화면(타이틀)
  titleText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, '아이스의 모험', {
    fontFamily: 'PFStardustS',
    fontSize: '48px',
    fill: '#fff',
    stroke: '#222',
    strokeThickness: 6
  }).setOrigin(0.5).setDepth(1);

  // 버튼 텍스트 추가
  startButton = this.add.text(this.scale.width / 2, this.scale.height / 2, '시작 하기', {
    fontFamily: 'PFStardustS',
    fontSize: '26px',
    fontStyle: 'bold',
    fill: '#ff0',
    stroke: '#222',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(2);

  // 게임 방법 버튼 추가
  howToButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, '게임 방법', {
    fontFamily: 'PFStardustS',
    fontSize: '26px',
    fontStyle: 'bold',
    fill: '#0ff',
    stroke: '#222',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(2);

  // 오른쪽 하단 버튼들
  muteButton = this.add.image(this.scale.width - 40, this.scale.height - 40, 'muteButton').setVisible(true).setScale(0.5).setDepth(2);
  soundButton = this.add.image(this.scale.width - 40, this.scale.height - 40, 'soundButton').setVisible(false).setScale(0.5).setDepth(2);

  //------------------------------------------------------------------------------------------- 실행
  this.bgm.play();

  // 버튼 클릭 이벤트
  startButton.setInteractive({ useHandCursor: true });
  startButton.on('pointerdown', () => {
    howToButton.destroy();
    startGame.call(this);
  });

  howToButton.setInteractive({ useHandCursor: true });
  howToButton.on('pointerdown', () => {
    showHowToPopup.call(this);
  });

  muteButton.setInteractive({ useHandCursor: true });
  muteButton.on('pointerdown', () => {
    muteButton.setVisible(false);
    soundButton.setVisible(true);
    this.bgm.pause();
  });

  soundButton.setInteractive({ useHandCursor: true });
  soundButton.on('pointerdown', () => {
    soundButton.setVisible(false);
    muteButton.setVisible(true);
    this.bgm.resume();
  });
}

// 게임 방법 팝업
function showHowToPopup() {
  // 팝업 배경
  const popupBg = this.add.graphics().setDepth(10);
  popupBg.fillStyle(0x222222, 0.95);
  popupBg.fillRoundedRect(this.scale.width/2-150, this.scale.height/2-180, 300, 320, 30);

  // 팝업 텍스트
  const popupText = this.add.text(this.scale.width/2, this.scale.height/2-80,
    '게임 방법\n\n←→: 이동\n\n장애물을 없애면\n사탕이 나타나요.\n\n트럭을 좌우로 \n움직일 수 있어요.', {
      fontFamily: 'PFStardustS',
      fontSize: '22px',
      fill: '#fff',
      align: 'center',
      stroke: '#444',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(11);

  // 닫기 버튼
  const closeBtn = this.add.text(this.scale.width/2, this.scale.height/2+110, '닫기', {
    fontFamily: 'PFStardustS',
    fontSize: '24px',
    fill: '#ffd600',
    stroke: '#222',
    strokeThickness: 6,
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(12);

  closeBtn.on('pointerdown', () => {
    popupBg.destroy();
    popupText.destroy();
    closeBtn.destroy();
  });
}

function startGame() {
  // 게임 시작/정지
  pauseButton = this.add.image(this.scale.width - 40, 40, 'pauseButton').setVisible(true).setScale(0.5).setDepth(2);
  playButton = this.add.image(this.scale.width - 40, 40, 'playButton').setVisible(false).setScale(0.5).setDepth(2);

  pauseButton.setInteractive({ useHandCursor: true });
  pauseButton.on('pointerdown', () => {
    isPaused = true;
    pauseButton.setVisible(false);
    playButton.setVisible(true);
    this.bgm.pause();
  });

  playButton.setInteractive({ useHandCursor: true });
  playButton.on('pointerdown', () => {
    isPaused = false;
    playButton.setVisible(false);
    pauseButton.setVisible(true);
    if (muteButton.visible) this.bgm.resume();
  });

  // 타이틀과 버튼 제거
  titleText.destroy();
  startButton.destroy();
  gameStarted = true;
  backgroundImg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);  // 배경 추가
  player = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 80, 'player'); // 플레이어 추가
  player.setCollideWorldBounds(true);
  player.setScale(0.25);
  player.body.setSize(player.width * 0.5, player.height * 0.5);

  // 점수 표시 뒤에 dim 추가
  const scoreDim = this.add.graphics().setDepth(19);
  scoreDim.fillStyle(0xffffff, 0.6);
  scoreDim.fillRoundedRect(20, 20, 120, 32, 10);

  // 점수 표시 추가
  score = 0;
  this.add.image(55, 38, 'candy').setScale(0.15).setDepth(20);
  scoreText = this.add.text(100, 25, '0', {
    fontFamily: 'PFStardustS',
    fontSize: '28px',
    fontStyle: 'bold',
    fill: '#222',
    stroke: '#fff',
    strokeThickness: 4
  }).setOrigin(0, 0).setDepth(20);
  
  // 키 입력
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // 예시: 점수 증가 (실제 게임 로직에 맞게 score++ 위치 조정)
  // score++;
  if (scoreText) scoreText.setText(score);
  if (!gameStarted || isPaused) return;
  // 배경 스크롤
  backgroundImg.tilePositionY -= 2;
  // 플레이어 이동
  if (this.cursors.left.isDown) {
    player.x -= 5;
    playerShake = 3;
  } else if (this.cursors.right.isDown) {
    player.x += 5;
    playerShake = 3;
  } else {
    playerShake = Math.max(playerShake - 1, 0);
  }

  // 흔들림 효과 적용
  if (playerShake > 0) {
    player.y += Math.sin(Date.now() / 40) * 2;
  } else {
    player.y = this.scale.height - 80;
  }
}

window.onload = function () {
	game = new Phaser.Game(config);
};
