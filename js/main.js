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

// ------------------------------------------------------------------------------------------ 기본 함수들
function preload() {
	// 배경
  this.load.image('startBackground', 'assets/images/start_background.png');
	this.load.image('background', 'assets/images/background.png');

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
    fill: '#fff',
    stroke: '#222',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(2);

  // 오른쪽 하단 버튼들
  muteButton = this.add.image(this.scale.width - 20, this.scale.height - 20, 'muteButton').setVisible(true).setScale(0.5).setDepth(2);
  soundButton = this.add.image(this.scale.width - 20, this.scale.height - 20, 'soundButton').setVisible(false).setScale(0.5).setDepth(2);

  //------------------------------------------------------------------------------------------- 실행
  this.bgm.play();

  // 버튼 클릭 이벤트
  startButton.setInteractive({ useHandCursor: true });
  startButton.on('pointerdown', () => {
    howToButton.destroy();
    this.buttonSound.play();
    startGame.call(this);
  });

  howToButton.setInteractive({ useHandCursor: true });
  howToButton.on('pointerdown', () => {
    this.buttonSound.play();
    showHowToPopup.call(this);
  });

  muteButton.setInteractive({ useHandCursor: true });
  muteButton.on('pointerdown', () => {
    muteButton.setVisible(false);
    soundButton.setVisible(true);
    this.buttonSound.play();
    if (this.bgm) this.bgm.setVolume(0);
    if (this.bossBgm) this.bossBgm.setVolume(0);
    if (this.coinSound) this.coinSound.setVolume(0);
    if (this.hitSound) this.hitSound.setVolume(0);
    if (this.explosionSound) this.explosionSound.setVolume(0);
  });

  soundButton.setInteractive({ useHandCursor: true });
  soundButton.on('pointerdown', () => {
    soundButton.setVisible(false);
    muteButton.setVisible(true);
    this.buttonSound.play();
    if (this.bgm) this.bgm.setVolume(0.5);
    if (this.bossBgm) this.bossBgm.setVolume(0.5);
    if (this.coinSound) this.coinSound.setVolume(1);
    if (this.hitSound) this.hitSound.setVolume(1);
    if (this.explosionSound) this.explosionSound.setVolume(1);
  });
}

async function update() {
  if (!gameStarted || isPaused) return;

  if (this.helpers) { 
    this.helpers.children.iterate(helper => {
      if (helper && helper.active && (helper.texture.key === 'helper1' || helper.texture.key === 'helper2')) { 
        helper.x += Math.sin(Date.now() / 500 + helper.y / 100) * 0.5;
        helper.y += 2;
      }
    });
  }

  let boss = null;
  if (this.enemies) { 
    this.enemies.children.iterate(enemy => {
      if (enemy && enemy.active && enemy.enemyType === 'enemy3' && !enemy.isHit) { // enemy3 좌우 진동 이동
        enemy.x += Math.sin(Date.now() / 600 + enemy.y / 100) * 0.8;
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

    // 보스 등장 (한 번만 등장)
    if (distance === 1000 && !bossAppeared) {
      if (this.bossBgm && muteButton.visible) {
        this.bgm.stop();
        this.bossBgm.play();
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
      const toRemove = [];
      this.enemies.children.iterate(enemy => (enemy && enemy.active && (enemy.enemyType !== 'boss1')) && toRemove.push(enemy));
      toRemove.forEach(enemy => {
        this.tweens.add({
          targets: enemy,
          alpha: 0,
          scale: 0,
          duration: 400,
          onComplete: () => enemy.disableBody(true, true)
        });
      });
    }
  }

  // 배경 스크롤 (보스 등장 시 멈춤)
  if (!boss) {
    backgroundImg.tilePositionY -= 2;
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
    fill: '#ffd600',
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

function initEnemySpawns() {
  // enemy1 생성
  this.time.addEvent({
    delay: 2000,
    callback: () => {
      if (!gameStarted || isPaused || isPlayerDead || bossAppeared) return;
      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const enemy = this.enemies.create(x, -50, 'enemy1');
      enemy.enemyType = 'enemy1';
      enemy.setVelocityY(100);
      enemy.setScale(0.15);
      enemy.body.setSize(enemy.width * 0.6, enemy.height * 0.6);
      enemy.hitCount = 0;
    },
    loop: true
  });

  // enemy2 생성
  this.time.addEvent({
    delay: 3000,
    callback: () => {
      if (!gameStarted || isPaused || isPlayerDead || bossAppeared) return;
      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const enemy = this.enemies.create(x, -50, 'enemy2');
      enemy.enemyType = 'enemy2';
      enemy.setVelocityY(100);
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
  this.time.addEvent({
    delay: 5000,
    callback: () => {
      if (!gameStarted || isPaused || isPlayerDead || bossAppeared) return;
      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const enemy = this.enemies.create(x, -50, 'enemy3');
      enemy.enemyType = 'enemy3';
      enemy.setVelocityY(80);
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
    fontSize: '26px',
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
    fontSize: '26px',
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
      playerObj.setTexture('playerProtection');
      playerObj.isProtected = true;
    }

    // helper3인 경우 (점수 획득)
    if (helperObj.texture && helperObj.texture.key === 'helper3') {
      score += 10;
      const plusText = this.add.text(playerObj.x + 30, playerObj.y - 20, '+10', { // 트럭 옆으로 +10 텍스트 띄우기
        fontFamily: 'PFStardustS',
        fontSize: '20px',
        fontStyle: 'bold',
        fill: '#ff0',
        stroke: '#222',
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
  }, null, this);

  // player vs enemy
  this.physics.add.overlap(player, this.enemies, (playerObj, enemy) => {
    if (playerObj.isProtected) { // 방패가 있을 때
      enemy.destroy();
      playerObj.setTexture('player');
      playerObj.isProtected = false;
    } else if (!isPlayerDead) {
      playerObj.setTexture('playerCrash');
      gameStarted = false;
      this.bgm.stop();
      this.enemies.setVelocityY(0);
      this.helpers.setVelocityY(0);

      tryCount--;
      if (tryText) tryText.setText(tryCount);
      isPlayerDead = true;

      // html에 있는 js-quizBox 보여주기
      const quizBox = document.querySelector('.js-quizBox');
      quizBox.classList.add('on');
      // 캔버스에는 disable 클래스 추가
      const gameCanvas = document.querySelector('canvas');
      gameCanvas.classList.add('disabled');
    }

  }, null, this);

  // player bullet vs enemy
  this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => {
    bullet.destroy();
    this.hitSound.play();

    if (!enemy.hitCount) enemy.hitCount = 0;
    enemy.hitCount++;
    
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
      else if (enemy.hitCount === 5) {
        enemy.setTexture('boss3');
      }
      // 5대 맞으면 boss4로 변경
      else if (enemy.hitCount === 15) {
        enemy.setTexture('boss4');
      }
      // 7대 맞으면 boss5로 변경
      else if (enemy.hitCount === 20) {
        enemy.setTexture('boss5');
        if (this.explosionSound && muteButton.visible) {
          this.explosionSound.play();
        }
        // 0.5초 후에
        this.time.delayedCall(500, () => {
          // 폭발 이펙트 후 제거
          this.tweens.add({
            targets: enemy,
            alpha: 0,
            scale: 0,
            duration: 400,
            onComplete: () => {
              enemy.destroy();
              if (this.bossBgm && muteButton.visible) {
                this.bossBgm.stop();
                this.coinBgm.play();
              }

              for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 5; col++) {
                  const offsetX = (col - 2) * 40;
                  const offsetY = (row - 4) * 40;
                  const helper = this.helpers.create(this.scale.width / 2 + offsetX, enemy.y + offsetY, 'helper3');
                  helper.setScale(0.13);
                  helper.setVelocityY(100);
                }
              }

              this.time.delayedCall(7000, () => {
                // 게임 정지
                gameStarted = false;
                console.log("넥스트~레벨~");
                this.coinBgm.stop();
                this.nextBgm.play();
                // bossAppeared = false;
              });
            }
          });
        });
      }
    }
  }, null, this);

  // enemy bullet vs player
  this.physics.add.overlap(player, this.bossBullets, (playerObj, bullet) => {
    bullet.destroy();
    // 플레이어가 보호막 없으면 죽음 처리
    if (!playerObj.isProtected && !isPlayerDead) {
      playerObj.setTexture('playerCrash');
      gameStarted = false;
      this.bgm.stop();
      this.bossBgm.stop();
      this.enemies.setVelocityY(0);
      this.helpers.setVelocityY(0);
      tryCount--;
      if (tryText) tryText.setText(tryCount);
      isPlayerDead = true;
    } else if (playerObj.isProtected) {
      playerObj.setTexture('player');
      playerObj.isProtected = false;
    }
  }, null, this);
}

function initPlayerShooting() {
  this.playerBullets = this.physics.add.group(); // 플레이어 총알 그룹
  this.time.addEvent({ // 플레이어가 총알 발사
    delay: 200, 
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
    delay: 4000,
    callback: () => {
      // 보스가 등장 중일 때만 발사
      const boss = this.enemies.getChildren().find(e => e.enemyType === 'boss1' && e.active);
      if (boss && player && bossAppeared && gameStarted && !isPaused && !isPlayerDead) {
        // 플레이어 방향 벡터 계산
        const bulletPatterns = [
          () => {
            for (let i = 0; i < 3; i++) {
              const bullet = this.bossBullets.create(boss.x, boss.y + 40, 'enemyBullet');
              bullet.setScale(0.2);
              bullet.setVelocity((i - 1) * 50, 220); // -50, 0, 50
              bullet.setDepth(10);
              bullet.body.setSize(bullet.width * 0.7, bullet.height * 0.7);
            }
          }
        ];

        const patternIndex = Phaser.Math.Between(0, bulletPatterns.length - 1);
        bulletPatterns[patternIndex]();
        this.enemyBulletSound.play();
      }
    },
    loop: true
  });
}

function startGame() {
  this.helpers = this.physics.add.group();
  this.enemies = this.physics.add.group();
  gameStarted = true;

  // 게임 시작/정지
  pauseButton = this.add.image(this.scale.width - 20, 20, 'pauseButton').setVisible(true).setScale(0.5).setDepth(2);
  playButton = this.add.image(this.scale.width - 20, 20, 'playButton').setVisible(false).setScale(0.5).setDepth(2);

  pauseButton.setInteractive({ useHandCursor: true });
  pauseButton.on('pointerdown', () => {
    isPaused = true;
    this.buttonSound.play();
    pauseButton.setVisible(false);
    playButton.setVisible(true);
    this.bgm.pause();
    this.bossBgm.pause();
    this.enemies.setVelocityY(0);
    this.helpers.setVelocityY(0);
  });

  playButton.setInteractive({ useHandCursor: true });
  playButton.on('pointerdown', () => {
    isPaused = false;
    this.buttonSound.play();
    playButton.setVisible(false);
    pauseButton.setVisible(true);
    if (muteButton.visible) {
      this.bgm.resume();
      this.bossBgm.resume();
    }
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
}

// ------------------------------------------------------------------------------------------ 게임 실행
window.onload = () => 	game = new Phaser.Game(config);