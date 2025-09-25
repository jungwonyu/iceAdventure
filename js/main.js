const ACT_ON = 'on';

let game;
let isPlayerDead = false;
let player;
let playerShake = 0;
let backgroundY = 0;
let backgroundImg;
let startButton;
let titleText;
let gameStarted = false;
let score = 0;
let scoreText;
let tryCount = 0;
let tryText;
let repairCount = 0;
let repairText;
let isPaused = false;
let pauseButton;
let distance = 0;
let distanceText;
let bossAppeared = false;
let gameOver = 0;
let quizData = [];
let gameOverCount = 0;
let level = 1;
let isTouching = false;

const alertBox = document.querySelector('.js-alert');
const quizBox = document.querySelector('.js-quizBox');
const quizContainer = document.querySelector('.js-quizContainer');
const restartBtn = document.querySelector('.js-restartBtn');
const requestBtn = document.querySelector('.js-requestBtn');
const endBtn = document.querySelector('.js-endBtn');
const counts = document.querySelectorAll('.js-count');

const question = document.querySelector('.js-question');
const answer = document.querySelector('.js-answer');
const submitBtn = document.querySelector('.js-submitBtn');

const wrongPopup = document.querySelector('.js-wrongPopup');
const userScore = document.querySelector('.js-score');

// ------------------------------------------------------------------------------------------ 기본 함수들
function preload() {
	// 배경
  this.load.image('startBackground', 'assets/images/start_background.png');
	this.load.image('background', 'assets/images/background.png');
	this.load.image('background2', 'assets/images/background2.png');
	this.load.image('background3', 'assets/images/background3.png');

  // 플레이어
  this.load.image('player', 'assets/images/player.png');
  this.load.image('playerCrash', 'assets/images/player_crash.png');
  this.load.image('playerProtection', 'assets/images/player_protection.png');
  this.load.image('playerDouble', 'assets/images/player_double.png');

  // 보상
  this.load.image('helper1', 'assets/images/helper1.png'); // 더블 부스터
  this.load.image('helper2', 'assets/images/helper2.png'); // 방패 부스터
  this.load.image('helper3', 'assets/images/helper3.png'); // 점수

  // 기타 아이템
  this.load.image('walkie', 'assets/images/walkie.png');
  this.load.image('repair', 'assets/images/repair.png');

  // 총알
  this.load.image('enemyBullet', 'assets/images/enemy_bullet.png');
  this.load.image('playerBullet', 'assets/images/player_bullet.png');

  // 적
  this.load.image('enemy1', 'assets/images/enemy1.png');
  this.load.image('enemy1Ice', 'assets/images/enemy1_ice.png');
  this.load.image('enemy2', 'assets/images/enemy2.png');
  this.load.spritesheet('enemy3', 'assets/images/enemy3.png', { frameWidth: 300, frameHeight: 340 });

  this.load.image('boss1', 'assets/images/boss1.png');
  this.load.image('boss2', 'assets/images/boss2.png');
  this.load.image('boss3', 'assets/images/boss3.png');
  this.load.image('boss4', 'assets/images/boss4.png');
  this.load.image('boss5', 'assets/images/boss5.png');

  // 버튼
  this.load.image('playButton', 'assets/images/btn_play.png');
  this.load.image('pauseButton', 'assets/images/btn_pause.png');
  this.load.image('soundButton', 'assets/images/btn_sound.png');
  this.load.image('muteButton', 'assets/images/btn_mute.png');

  // 사운드
  this.load.audio('bgm', 'assets/sounds/bgm.mp3');
  this.load.audio('bossBgm', 'assets/sounds/boss_bgm.mp3');
  this.load.audio('coinBgm', 'assets/sounds/coin_bgm.mp3');
  this.load.audio('nextBgm', 'assets/sounds/next_bgm.mp3');
  this.load.audio('buttonSound', 'assets/sounds/button.mp3');
  this.load.audio('coinSound', 'assets/sounds/coin.mp3');
  this.load.audio('hitSound', 'assets/sounds/hit.mp3');
  this.load.audio('explosionSound', 'assets/sounds/explosion.mp3');
  this.load.audio('enemyBulletSound', 'assets/sounds/enemy_bullet.mp3');
  this.load.audio('correctSound', 'assets/sounds/correct.mp3');
  this.load.audio('incorrectSound', 'assets/sounds/incorrect.mp3');
  this.load.audio('countdownSound', 'assets/sounds/countdown.mp3');
  this.load.audio('nextLevelSound', 'assets/sounds/next_level.mp3');

  // 퀴즈 데이터 로드
  fetch('data/quiz_data.json')
  .then(response => response.json())
  .then(data => {
    quizData = data; // 퀴즈 데이터 저장
  })
  .catch(error => {
    console.error('퀴즈 데이터 로드 실패:', error);
  });
}

function create() {
  this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
  this.bossBgm = this.sound.add('bossBgm', { loop: true, volume: 0.5 });
  this.coinBgm = this.sound.add('coinBgm', { loop: true, volume: 0.5 });
  this.nextBgm = this.sound.add('nextBgm', { volume: 0.5 });
  this.buttonSound = this.sound.add('buttonSound');
  this.coinSound = this.sound.add('coinSound');
  this.hitSound = this.sound.add('hitSound');
  this.explosionSound = this.sound.add('explosionSound');
  this.enemyBulletSound = this.sound.add('enemyBulletSound');
  this.correctSound = this.sound.add('correctSound');
  this.incorrectSound = this.sound.add('incorrectSound');
  this.countdownSound = this.sound.add('countdownSound');
  this.nextLevelSound = this.sound.add('nextLevelSound');

  const sounds = [this.bgm, this.bossBgm, this.coinBgm, this.nextBgm, this.buttonSound, this.coinSound, 
    this.hitSound, this.explosionSound, this.enemyBulletSound, this.correctSound, this.incorrectSound, this.countdownSound, this.nextLevelSound];

  // 첫화면 배경 추가
  backgroundImg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'startBackground')
    .setOrigin(0.5)
    .setDisplaySize(this.scale.width, this.scale.height)
    .setDepth(0);

  // 첫 시작 화면(타이틀)
  titleText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, 'Ice Adventure', {
    fontFamily: 'PFStardustS',
    fontSize: '48px',
    fontStyle: 'bold',
    fill: '#9c782bff',
    stroke: '#ffffff',
    strokeThickness: 10
  }).setOrigin(0.5).setDepth(1);

  // 버튼 텍스트 추가
  startButton = this.add.text(this.scale.width / 2, this.scale.height / 2, '시작 하기', {
    fontFamily: 'PFStardustS',
    fontSize: '26px',
    fontStyle: 'bold',
    fill: '#ffbb00ff',
    stroke: '#ffffff',
    strokeThickness: 10
  }).setOrigin(0.5).setDepth(2);

  // 게임 방법 버튼 추가
  howToButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, '게임 방법', {
    fontFamily: 'PFStardustS',
    fontSize: '26px',
    fontStyle: 'bold',
    fill: '#ff7010ff',
    stroke: '#ffffff',
    strokeThickness: 10
  }).setOrigin(0.5).setDepth(2);

  // 오른쪽 하단 버튼들
  muteButton = this.add.image(this.scale.width - 20, this.scale.height - 20, 'muteButton').setVisible(true).setScale(0.5).setDepth(2);
  soundButton = this.add.image(this.scale.width - 20, this.scale.height - 20, 'soundButton').setVisible(false).setScale(0.5).setDepth(2);

  //------------------------------------------------------------------------------------------- 실행
  this.bgm && this.bgm.play();

  // 버튼 클릭 이벤트
  startButton.setInteractive({ useHandCursor: true });
  startButton.on('pointerdown', () => {
    howToButton.destroy();
    this.buttonSound && this.buttonSound.play();
    startGame.call(this);
  });

  howToButton.setInteractive({ useHandCursor: true });
  howToButton.on('pointerdown', () => {
    this.buttonSound && this.buttonSound.play();
    showHowToPopup.call(this);
  });

  muteButton.setInteractive({ useHandCursor: true });
  muteButton.on('pointerdown', () => {
    muteButton.setVisible(false);
    soundButton.setVisible(true);
    this.buttonSound && this.buttonSound.play();
    sounds.forEach(sound => {
      if (sound) sound.setVolume(0);
    });
  });

  soundButton.setInteractive({ useHandCursor: true });
  soundButton.on('pointerdown', () => {
    soundButton.setVisible(false);
    muteButton.setVisible(true);
    this.buttonSound && this.buttonSound.play();
    sounds.forEach(sound => {
      const isBgm = (sound === this.bgm || sound === this.bossBgm || sound === this.coinBgm || sound === this.nextBgm);
      if (sound) sound.setVolume(isBgm ? 0.5 : 1);
    });
  });
}

async function update() {
  if (!gameStarted || isPaused) return;

  if (this.helpers) { 
    this.helpers.children.iterate(helper => {
      if (helper && helper.active && (helper.texture.key === 'helper1' || helper.texture.key === 'helper2')) { 
        helper.x += Math.sin(Date.now() / 500 + helper.y / 100) * 0.5;
        helper.y += 2 * levelConfig[level].speed;
      }
    });
  }

  let boss = null;
  if (this.enemies) { 
    this.enemies.children.iterate(enemy => {
      if (enemy && enemy.active && enemy.enemyType === 'enemy3' && !enemy.isHit) { // enemy3 좌우 진동 이동
        const newX = enemy.x + Math.sin(Date.now() / 600 + enemy.y / 100) * 1.5;
        // 화면 경계 체크 (enemy 크기 고려)
        const enemyHalfWidth = enemy.width * enemy.scaleX * 0.5;
        if (newX >= enemyHalfWidth && newX <= this.scale.width - enemyHalfWidth) {
          enemy.x = newX;
        }
      }
      // 보스 객체 찾기
      if (enemy && enemy.active && enemy.enemyType === 'boss1') {
        boss = enemy;
      }
    });
  }

  if (scoreText) scoreText.setText(score);
  if (distanceText) { // 보스가 없을 때만 distance 증가
    let bossExists = false;
    if (this.enemies) {
      this.enemies.children.iterate(enemy => {
        if (enemy && enemy.active && enemy.enemyType === 'boss1') bossExists = true;
      });
    }
    if (!bossExists) distance += 1;
    distanceText.setText(`${ Math.floor(distance / 10) } m`);

    // 보스 등장 
    if (distance >= levelConfig[level].bossDistance && !bossAppeared) {
      if (muteButton.visible) {
        this.bgm && this.bgm.stop();
        this.bossBgm && this.bossBgm.play();
      }
      bossAppeared = true;
      const boss = this.enemies.create(this.scale.width / 2, -100, 'boss1');
      boss.enemyType = 'boss1';
      boss.setVelocityY(60);
      boss.setScale(0.4);
      boss.body.setSize(boss.width * 0.6, boss.height * 0.6);
      boss.hitCount = 0;

      // 0.5초 후에 기존 적들 제거
      await new Promise(resolve => setTimeout(resolve, 500));
      let toRemove = [];
      this.enemies.children.iterate(enemy => (enemy && (enemy.enemyType !== 'boss1')) && toRemove.push(enemy));
      toRemove.forEach(enemy => {
        this.tweens.add({
          targets: enemy,
          alpha: 0,
          scale: 0,
          duration: 400,
          onComplete: () => {
            if (enemy && enemy.body) enemy.disableBody(true, true);
          }
        });
      });
    }
  }

  // 배경 스크롤 (보스 등장 시 멈춤)
  if (!boss) {
    backgroundImg.tilePositionY -= 5 * levelConfig[level].speed;
  }

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

  this.input.on('pointerdown', pointer => {
    if (!gameStarted || isPaused || isPlayerDead) return;
    isTouching = true;
    window.lastTouchX = pointer.x;
  });

  this.input.on('pointerup', pointer => {
    isTouching = false;
    window.lastTouchX = null;
  });

  this.input.on('pointermove', pointer => {
    if (!gameStarted || isPaused || isPlayerDead) return;
    if (isTouching && window.lastTouchX !== null) {
      const dx = pointer.x - window.lastTouchX;
      player.x += dx;
      playerShake = 3;
      window.lastTouchX = pointer.x;
    }
  });

  // 보스 좌우 이동 및 y축 고정 (가운데 기준)
  if (boss) {
    const bossTargetY = 150;
    const centerX = this.scale.width / 2;
    // 내려오면서 동시에 좌우 이동
    boss.x = centerX + Math.sin(Date.now() / 1200) * 120;
    if (boss.y < bossTargetY) {
      boss.setVelocityY(60);
    } else {
      boss.y = bossTargetY;
      boss.setVelocityY(0);
    }
  }

  // 플레이어 흔들림 효과 적용
  if (playerShake > 0) {
    player.y += Math.sin(Date.now() / 40) * 2;
  } else {
    player.y = this.scale.height - 80;
  }
  // 실드 오버레이 위치 동기화
  if (player && player.shieldOverlay) {
    player.shieldOverlay.x = player.x;
    player.shieldOverlay.y = player.y;
  }
}

// ------------------------------------------------------------------------------------------ 추가 함수들
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
    fill: '#ffbb00ff',
    stroke: '#222',
    strokeThickness: 6,
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(12);

  closeBtn.on('pointerdown', () => {
    popupBg.destroy();
    popupText.destroy();
    closeBtn.destroy();
    this.buttonSound.play();
  });
}

let enemy1SpawnEvent, enemy2SpawnEvent, enemy3SpawnEvent;

function initEnemySpawns() {
  // 기존 이벤트 제거
  if (enemy1SpawnEvent) enemy1SpawnEvent.remove();
  if (enemy2SpawnEvent) enemy2SpawnEvent.remove();
  if (enemy3SpawnEvent) enemy3SpawnEvent.remove();

  // enemy1 생성
  enemy1SpawnEvent = this.time.addEvent({
    delay: Math.max(1500 / (level * 0.5), 200),
    callback: () => {
      if (!gameStarted || isPaused || isPlayerDead || bossAppeared) return;
      const x = Phaser.Math.Between(20, this.scale.width - 20);
      const enemy = this.enemies.create(x, -50, 'enemy1');
      enemy.enemyType = 'enemy1';
      enemy.setVelocityY(100 * levelConfig[level].speed);
      enemy.setScale(0.15);
      enemy.body.setSize(enemy.width * 0.6, enemy.height * 0.6);
      enemy.hitCount = 0;
    },
    loop: true
  });

  // enemy2 생성
  enemy2SpawnEvent = this.time.addEvent({
    delay: Math.max(2000 / (level * 0.5), 300),
    callback: () => {
      if (!gameStarted || isPaused || isPlayerDead || bossAppeared) return;
      const x = Phaser.Math.Between(20, this.scale.width - 20);
      const enemy = this.enemies.create(x, -50, 'enemy2');
      enemy.enemyType = 'enemy2';
      enemy.setVelocityY(100 * levelConfig[level].speed);
      enemy.setScale(0.15);
      enemy.body.setSize(enemy.width * 0.6, enemy.height * 0.6);
      enemy.hitCount = 0;
    },
    loop: true
  });

  // enemy3 생성
  this.anims.create({
    key: 'fly',
    frames: this.anims.generateFrameNumbers('enemy3', { start: 0, end: 2 }),
    frameRate: 5,
    repeat: -1
  });
  enemy3SpawnEvent = this.time.addEvent({
    delay: Math.max(3000 / (level * 0.5), 500),
    callback: () => {
      if (!gameStarted || isPaused || isPlayerDead || bossAppeared) return;
      const x = Phaser.Math.Between(20, this.scale.width - 20);
      const enemy = this.enemies.create(x, -50, 'enemy3');
      enemy.enemyType = 'enemy3';
      enemy.setVelocityY(80 * levelConfig[level].speed);
      enemy.setScale(0.2);
      enemy.body.setSize(enemy.width * 0.6, enemy.height * 0.6);
      enemy.hitCount = 0;
      enemy.isHit = false;
      enemy.play('fly');
    },
    loop: true
  });
}

function initGameUI() {
  // 점수
  score = 0;
  const scoreDim = this.add.graphics().setDepth(19);
  scoreDim.fillStyle(0xffffff, 0.6);
  scoreDim.fillRoundedRect(6, 8, 120, 32, 10);
  this.add.image(40, 25, 'helper3').setScale(0.13).setDepth(20);
  scoreText = this.add.text(70, 13, '0', {
    fontFamily: 'PFStardustS',
    fontSize: '24px',
    fontStyle: 'bold',
    fill: '#222',
    stroke: '#fff',
    strokeThickness: 4
  }).setOrigin(0, 0).setDepth(20);

  // 거리
  distance = 0;
  const distanceDim = this.add.graphics().setDepth(19);
  distanceDim.fillStyle(0xffffff, 0.6);
  distanceDim.fillRoundedRect(6, 48, 120, 32, 10);
  distanceText = this.add.text(70, 53, '0 m', {
    fontFamily: 'PFStardustS',
    fontSize: '24px',
    fontStyle: 'bold',
    fill: '#222',
    stroke: '#fff',
    strokeThickness: 4
  }).setOrigin(0.5, 0).setDepth(20);

  // 무전기(시도 횟수)
  tryCount = 3;
  const tryDim = this.add.graphics().setDepth(19);
  tryDim.fillStyle(0xffffff, 0.6);
  tryDim.fillRoundedRect(6, this.scale.height - 35, 70, 32, 10);
  this.add.image(20, this.scale.height - 20, 'walkie').setScale(0.3).setDepth(20);
  tryText = this.add.text(35, this.scale.height - 25, tryCount, {
    fontFamily: 'PFStardustS',
    fontSize: '24px',
    fontStyle: 'bold',
    fill: '#222',
    stroke: '#fff',
    strokeThickness: 4
  }).setOrigin(0, 0).setDepth(20);

  // 수리공구
  repairCount = 0;
  const repairDim = this.add.graphics().setDepth(19);
  repairDim.fillStyle(0xffffff, 0.6);
  repairDim.fillRoundedRect(80, this.scale.height - 35, 70, 32, 10);
  this.add.image(100, this.scale.height - 20, 'repair').setScale(0.3).setDepth(20);
  repairText = this.add.text(120, this.scale.height - 25, repairCount, {
    fontFamily: 'PFStardustS',
    fontSize: '24px',
    fontStyle: 'bold',
    fill: '#222',
    stroke: '#fff',
    strokeThickness: 4
  }).setOrigin(0, 0).setDepth(20);
}

function initCollisions () {
  // player vs helper
  this.physics.add.overlap(player, this.helpers, (playerObj, helperObj) => {
    if (isPaused) return;
    helperObj.destroy();
    this.coinSound.play();

    // helper1인 경우
    if (helperObj.texture && helperObj.texture.key === 'helper1') {
      // 20초간 player_bullet 두 배
      playerObj.setTexture('playerDouble');
      playerObj.isDouble = true;

      this.time.delayedCall(20000, () => {
        playerObj.setTexture('player');
        playerObj.isDouble = false;
      });
    }

    // helper2인 경우 (방패)
    if (helperObj.texture && helperObj.texture.key === 'helper2') {
      playerObj.isProtected = true;
      // 기존 실드가 있으면 제거
      if (playerObj.shieldOverlay) {
        playerObj.shieldOverlay.destroy();
        playerObj.shieldOverlay = null;
      }
      const shield = this.add.graphics();
      shield.fillStyle(0x66ccff, 0.4); // 하늘색, 반투명
      shield.fillCircle(0, 0, playerObj.width * 0.1); 
      shield.setDepth(25);
      shield.x = playerObj.x;
      shield.y = playerObj.y;
      playerObj.shieldOverlay = shield;
    }

    // helper3인 경우 (점수 획득)
    if (helperObj.texture && helperObj.texture.key === 'helper3') {
      score += 10;
      const plusText = this.add.text(playerObj.x + 30, playerObj.y - 20, '+10', { // 트럭 옆으로 +10 텍스트 띄우기
        fontFamily: 'PFStardustS',
        fontSize: '20px',
        fontStyle: 'bold',
        fill: '#ffbb00ff',
        stroke: '#ffffffff',
        strokeThickness: 4
      }).setOrigin(0.5).setDepth(15);
      this.tweens.add({
        targets: plusText,
        y: plusText.y - 30,
        alpha: 0,
        duration: 800,
        ease: 'Power1',
        onComplete: () => plusText.destroy()
      });
    }

    // walkie인 경우 (시도 횟수 증가)
    if (helperObj.texture && helperObj.texture.key === 'walkie') {
      tryCount++;
      tryText.setText(tryCount);
    }
  }, null, this);

  // player bullet vs enemy
  this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => {
    if (isPaused) return;
    bullet.destroy();
    this.hitSound.play();

    if (!enemy.hitCount) enemy.hitCount = 0;
    enemy.hitCount++;

    // 맞은 hitCount를 boss 옆에 잠시 표시
    const hitText = this.add.text(enemy.x, enemy.y - 30, `Hit ${enemy.hitCount}`, {
      fontFamily: 'PFStardustS',
      fontSize: '20px',
      fontStyle: 'bold',
      fill: 'rgba(255, 0, 0, 1)',
      stroke: '#ffffffff',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(15);
    this.tweens.add({
      targets: hitText,
      y: hitText.y - 20,
      alpha: 0,
      duration: 800,
      ease: 'Power1',
      onComplete: () => hitText.destroy()
    });
    
    if (enemy.enemyType === 'enemy1') { // 선인장
      if (enemy.hitCount === 1) {
        enemy.setTexture('enemy1Ice');
      } else {
        const helper = this.helpers.create(enemy.x, enemy.y, 'helper3');
        helper.setScale(0.13);
        helper.setVelocityY(100);
        enemy.destroy();
      }
    } else if (enemy.enemyType === 'enemy2') { // 바위
      if (enemy.hitCount === 1) {
        enemy.setScale(0.15);
      } else if (enemy.hitCount === 2) {
        enemy.setScale(0.12);
      } else {
        const helper = this.helpers.create(enemy.x, enemy.y, 'helper3');
        helper.setScale(0.13);
        helper.setVelocityY(100);
        enemy.destroy();
      }
    } else if (enemy.enemyType === 'enemy3') { // 방울뱀
      if (enemy.hitCount === 1) {
        enemy.isHit = true;
      } else {
        const helperType = Phaser.Math.Between(1, 3) === 1 ? 'helper1' : 'helper2';
        const helper = this.helpers.create(enemy.x, enemy.y, helperType);
        helper.setScale(0.6);
        enemy.destroy();
      }
    } else if (enemy.enemyType === 'boss1') { // 보스
      // 보스가 1대 맞으면 boss2로 변경
      if (enemy.hitCount === 1) {
        enemy.setTexture('boss2');
      }
      // 3대 맞으면 boss3로 변경
      else if (enemy.hitCount === levelConfig[level].bossHit / 4) {
        enemy.setTexture('boss3');
      }
      // 5대 맞으면 boss4로 변경
      else if (enemy.hitCount === levelConfig[level].bossHit / 2) {
        enemy.setTexture('boss4');
      }
      // 7대 맞으면 boss5로 변경
      else if (enemy.hitCount === levelConfig[level].bossHit) {
        enemy.setTexture('boss5');
        if (this.explosionSound && muteButton.visible) {
          this.explosionSound.play();
        }
        // 0.5초 후에
        this.time.delayedCall(500, () => {
          // 폭발 이펙트 후 제거
          if (!bossAppeared || isPlayerDead) return;
          this.tweens.add({
            targets: enemy,
            alpha: 0,
            scale: 0,
            duration: 400,
            onComplete: () => {
              enemy.destroy();
              this.bossBullets.clear(true, true);
              this.bgm && this.bgm.stop();
              this.bossBgm && this.bossBgm.stop();
              this.coinBgm && this.coinBgm.play();

              for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 5; col++) {
                  if (row === 4 && col === 2) continue;
                  const offsetX = (col - 2) * 40;
                  const offsetY = (row - 4) * 40;
                  const helper = this.helpers.create(this.scale.width / 2 + offsetX, enemy.y + offsetY, 'helper3');
                  helper.setScale(0.13);
                  helper.setVelocityY(100);
                }
              }

              // 가운데에 walkie 추가
              const walkie = this.helpers.create(this.scale.width / 2, enemy.y, 'walkie');
              walkie.setScale(0.3);
              walkie.setVelocityY(100);

              this.time.delayedCall(7000, () => {
                // 게임 정지
                gameStarted = false;
                this.coinBgm && this.coinBgm.stop();
                this.nextBgm && this.nextBgm.play();
              
                // 현재 점수 화면 가운데 표시
                const scoreDisplay = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, `점수: ${score}`, {
                  fontFamily: 'PFStardustS',
                  fontSize: '36px',
                  fontStyle: 'bold',
                  fill: '#ffbb00ff',
                  align: 'center',
                  stroke: '#ffffff',
                  strokeThickness: 6
                });
                scoreDisplay.setOrigin(0.5);

                // 레벨 표시
                const levelDisplay = this.add.text(this.scale.width / 2, this.scale.height / 2 + 10, `레벨 ${level} 완료!`, {
                  fontFamily: 'PFStardustS',
                  fontSize: '30px',
                  fontStyle: 'bold',
                  fill: '#ffbb00ff',
                  align: 'center',
                  stroke: '#ffffff',
                  strokeThickness: 6
                });
                levelDisplay.setOrigin(0.5);

                setTimeout(async () => {
                  // 레벨업
                  level++;
                  // 게임 재시작
                  // 배경 변경(임시)
                  const bgKey = level % 3 === 1 ? 'background' : (level % 3 === 2 ? 'background2' : 'background3');
                  backgroundImg.setTexture(bgKey);
                  backgroundImg.tilePositionY = 0;
                  gameStarted = true;
                  bossAppeared = false;
                  scoreDisplay.destroy();
                  levelDisplay.destroy();
                  this.coinBgm && this.coinBgm.stop();
                  this.nextLevelSound && this.nextLevelSound.play();
                  await new Promise(resolve => setTimeout(resolve, 500));
                  this.bgm && this.bgm.play();
                  // 적 생성 이벤트 재등록
                  initEnemySpawns.call(this);
                }, 5000);
              });
            }
          });
        });
      }
    }
  }, null, this);

  // player vs enemy
  this.physics.add.overlap(player, this.enemies, (playerObj, enemy) => {
    if (isPlayerDead || isPaused) return;
    enemy.destroy();

    if (playerObj.isProtected) {
      playerObj.isProtected = false;
      // 실드 오버레이 제거
      if (playerObj.shieldOverlay) {
        playerObj.shieldOverlay.destroy();
        playerObj.shieldOverlay = null;
      }
    } else {
      this.physics.pause();
      playerObj.setTexture('playerCrash');
      gameStarted = false;
      isPlayerDead = true;
      gameOverCount++;
      counts.forEach((count) => count.textContent = gameOverCount);

      if (tryCount < gameOverCount) {
        requestBtn.disabled = true;
      }

      this.bossBgm && this.bossBgm.pause();
      this.bgm && this.bgm.pause();
      quizBox.classList.add(ACT_ON);
      this.sys.canvas.classList.add('disabled');
      alertBox.setAttribute('data-type', 'crash');

      // 2초 후에 js-alert 보여주기
      setTimeout(() => {
        quizBox.classList.remove(ACT_ON);
        alertBox.classList.add(ACT_ON);
      }, 2000);
    }
  }, null, this);

  // enemy bullet vs player
  this.physics.add.overlap(player, this.bossBullets, (playerObj, bullet) => {
    if (isPaused) return;
    bullet.destroy();
    
    if (playerObj.isProtected) {
      playerObj.isProtected = false;
      // 실드 오버레이 제거
      if (playerObj.shieldOverlay) {
        playerObj.shieldOverlay.destroy();
        playerObj.shieldOverlay = null;
      }
    } else {
      this.physics.pause();
      playerObj.setTexture('playerCrash');
      gameStarted = false;
      isPlayerDead = true;

      gameOverCount++;
      counts.forEach((count) => count.textContent = gameOverCount);

      if (tryCount < gameOverCount) {
        requestBtn.disabled = true;
      }

      this.bossBgm && this.bossBgm.pause();
      this.bgm && this.bgm.pause();
      quizBox.classList.add(ACT_ON);
      this.sys.canvas.classList.add('disabled');
      alertBox.setAttribute('data-type', 'crash');

      // 2초 후에 js-alert 보여주기
      setTimeout(() => {
        quizBox.classList.remove(ACT_ON);
        alertBox.classList.add(ACT_ON);
      }, 2000);
    }
  }, null, this);
}

function initPlayerShooting() {
  this.playerBullets = this.physics.add.group(); // 플레이어 총알 그룹
  this.time.addEvent({ // 플레이어가 총알 발사
    delay: 300, 
    callback: () => {
      if (!gameStarted || isPaused || isPlayerDead) return;
      if (player.isDouble) { // 두발 발사
        const bullet1 = this.playerBullets.create(player.x - 10, player.y - 20, 'playerBullet');
        const bullet2 = this.playerBullets.create(player.x + 10, player.y - 20, 'playerBullet');
        bullet1.body.setSize(bullet1.width * 0.5, bullet1.height * 0.5);
        bullet2.body.setSize(bullet2.width * 0.5, bullet2.height * 0.5);
        bullet1.setVelocityY(-300);
        bullet1.setScale(0.08);
        bullet2.setVelocityY(-300);
        bullet2.setScale(0.08);
      } else { // 한발만 발사
        const bullet = this.playerBullets.create(player.x, player.y - 20, 'playerBullet');
        bullet.setVelocityY(-300);
        bullet.setScale(0.08);
        bullet.body.setSize(bullet.width * 0.5, bullet.height * 0.5);
      }
    },
    loop: true
  });
}

function initBossShooting() {
  this.bossBullets = this.physics.add.group(); // 보스 총알 그룹

  this.time.addEvent({ // 보스가 총알 발사
    delay: 5000,
    callback: () => {
      // 보스가 등장 중일 때만 발사
      const boss = this.enemies.getChildren().find(e => e.enemyType === 'boss1' && e.active);
      if (boss && player && bossAppeared && gameStarted && !isPaused && !isPlayerDead) {
        // 플레이어 방향 벡터 계산
        const bulletPatterns = [
          () => {
            for (let i = 0; i < levelConfig[level].bulletCount; i++) {
              const bullet = this.bossBullets.create(boss.x, boss.y + 40, 'enemyBullet');
              bullet.setScale(0.2);
              bullet.setVelocity((i - 1) * 50, 220);
              bullet.setDepth(10);
              bullet.body.setSize(bullet.width * 0.7, bullet.height * 0.7);
            }
          }
        ];

        const patternIndex = Phaser.Math.Between(0, bulletPatterns.length - 1);
        bulletPatterns[patternIndex]();
        this.enemyBulletSound && this.enemyBulletSound.play();
      }
    },
    loop: true
  });
}

function startGame() {
  console.log("게임 시작!");

  this.helpers = this.physics.add.group();
  this.enemies = this.physics.add.group();
  gameStarted = true;

  // 게임 시작/정지
  pauseButton = this.add.image(this.scale.width - 20, 20, 'pauseButton').setVisible(true).setScale(0.5).setDepth(2);
  playButton = this.add.image(this.scale.width - 20, 20, 'playButton').setVisible(false).setScale(0.5).setDepth(2);

  pauseButton.setInteractive({ useHandCursor: true });
  pauseButton.on('pointerdown', () => {
    isPaused = true;
    this.buttonSound && this.buttonSound.play();
    pauseButton.setVisible(false);
    playButton.setVisible(true);
    this.bgm && this.bgm.pause();
    this.bossBgm && this.bossBgm.pause();
    this.enemies.setVelocityY(0);
    this.helpers.setVelocityY(0);
  });

  playButton.setInteractive({ useHandCursor: true });
  playButton.on('pointerdown', () => {
    isPaused = false;
    this.buttonSound && this.buttonSound.play();
    playButton.setVisible(false);
    pauseButton.setVisible(true);
    this.bgm && this.bgm.resume();
    this.bossBgm && this.bossBgm.resume();
    this.enemies.setVelocityY(100);
    this.helpers.setVelocityY(100);
  });

  // 타이틀과 버튼 제거
  titleText.destroy();
  startButton.destroy();
  backgroundImg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);  // 배경 추가

  // ------------------------------------------------------------------------------------------ 플레이어 생성
  player = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 80, 'player'); // 플레이어 추가
  player.setCollideWorldBounds(true);
  player.setScale(0.2);
  player.body.setSize(player.width * 0.5, player.height * 0.8);

  // ------------------------------------------------------------------------------------------ 초기화 함수들
  initPlayerShooting.call(this); // 플레이어 총알 초기화
  initBossShooting.call(this); // 보스 총알 초기화
  initEnemySpawns.call(this); // 적 생성 초기화
  initCollisions.call(this); // 충돌 처리 초기화
  initGameUI.call(this); // 부가요소 초기화
  this.cursors = this.input.keyboard.createCursorKeys(); // 키 입력
  // 모바일 감지
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// ------------------------------------------------------------------------------------------ 게임 실행
window.onload = () => {
  game = new Phaser.Game(config);

  endBtn.addEventListener('click', () => { // 끝내기 버튼
    alertBox.classList.remove(ACT_ON);
    wrongPopup.classList.add(ACT_ON);
    userScore.textContent = score;
    if (game && game.scene && game.scene.scenes[0] && game.scene.scenes[0].buttonSound) {
      game.scene.scenes[0].buttonSound.play();
    }
  });

  restartBtn.addEventListener('click', () => { // 처음으로 버튼
    document.querySelector('canvas').classList.remove('disabled');
    wrongPopup.classList.remove(ACT_ON);
    if (game && game.scene && game.scene.scenes[0] && game.scene.scenes[0].buttonSound) {
      game.scene.scenes[0].buttonSound.play();
    }
    game.scene.scenes[0].scene.restart();
    gameStarted = false;
    isPlayerDead = false;
    bossAppeared = false;
    tryCount = 3;
    if (tryText) tryText.setText(tryCount);
    repairCount = 0;
    if (repairText) repairText.setText(repairCount);
    score = 0;
    distance = 0;
    gameOverCount = 0;
    level = 1;
    counts.forEach(count => count.textContent = repairCount);
    requestBtn.disabled = false;
  });

  requestBtn.addEventListener('click', () => { // 요청 버튼
    alertBox.classList.remove(ACT_ON);
    if (game && game.scene && game.scene.scenes[0] && game.scene.scenes[0].buttonSound) {
      game.scene.scenes[0].buttonSound.play();
    }
    quizContainer.classList.add(ACT_ON);
    answer.value = '';

    repairCount++;
    if (repairText) repairText.setText(repairCount);

    tryCount -= gameOverCount;
    if (tryCount <= 0) {
      tryCount = 0;
      requestBtn.disabled = true;
    }
    if (tryText) tryText.setText(tryCount);

    const randomNum = Phaser.Math.Between(0, quizData.length - 1);
    const randomQuiz = quizData[randomNum];
    question.textContent = randomQuiz.question;
    answer.setAttribute('data-answer', randomQuiz.answer);
  });

  submitBtn.addEventListener('click', async () => { // 제출 버튼
    const userAnswer = answer.value.trim();
    const correctAnswer = answer.getAttribute('data-answer');

    if (userAnswer === '') return; // 빈 값일 때는 무시

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) { // 정답일 때, 이어하기
      if (game && game.scene && game.scene.scenes[0] && game.scene.scenes[0].correctSound) {
        game.scene.scenes[0].correctSound.play();
      }
      quizContainer.classList.remove(ACT_ON);
      document.querySelector('canvas').classList.remove('disabled');
      await new Promise(resolve => setTimeout(resolve, 1000)); // 약간의 딜레이 (정답 사운드 때문)

      // 3초 카운트 다운 
      let countdown = 3;
      if (game && game.scene && game.scene.scenes[0] && game.scene.scenes[0].add && game.scene.scenes[0].scale) {
        const countdownText = game.scene.scenes[0].add.text(game.scene.scenes[0].scale.width / 2, game.scene.scenes[0].scale.height / 2, countdown, {
          fontFamily: 'PFStardustS',
          fontSize: '72px',
          fontStyle: 'bold',
          fill: '#ff0',
          stroke: '#ffffff',
          strokeThickness: 6
        }).setOrigin(0.5).setDepth(30);
        if (game.scene.scenes[0].countdownSound) {
          game.scene.scenes[0].countdownSound.play();
        }
        const countdownInterval = setInterval(() => {
          countdown--;
          if (countdown > 0) {
            countdownText.setText(countdown);
          } else {
            clearInterval(countdownInterval);
            countdownText.destroy();
            // 화면에 있는 적들과 아이템들 제거
            // game.scene.scenes[0].enemies.clear(true, true);
            // game.scene.scenes[0].helpers.clear(true, true);
            game.scene.scenes[0].physics.resume();

            gameStarted = true;
            player.setTexture('player');
            if (muteButton.visible) {
              bossAppeared ? game.scene.scenes[0].bossBgm.resume() : game.scene.scenes[0].bgm.resume();
            }
            setTimeout(() => isPlayerDead = false, 500);
          }
        }, 1000);
      }
    } else { // 오답일 때, 게임 오버
      game.scene.scenes[0].incorrectSound && game.scene.scenes[0].incorrectSound.play();
      gameOverCount++;
      counts.forEach((count) => count.textContent = gameOverCount);
      quizContainer.classList.remove(ACT_ON);
      alertBox.setAttribute('data-type', 'wrong');
      alertBox.classList.add(ACT_ON);
    }
  });
};