const config = {
  type: Phaser.AUTO,
  width: 375,
  height: 667,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 568,
    },
    max: {
      width: 414,
      height: 896,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    },
  },
  scene: {
    preload: function () {
      preload.call(this);
    },
    create: function () {
      create.call(this);
    },
    update: function (time) {
      update.call(this, time);
    },
  },
};

// bossHit은 4의 배수로 설정하기
const levelConfig = {
  1: { bossDistance: 1500, bulletCount: 3, speed: 1, bossHit: 20 },
  2: { bossDistance: 4000, bulletCount: 4, speed: 1.8, bossHit: 28 },
  3: { bossDistance: 8000, bulletCount: 5, speed: 2.4, bossHit: 44 },
  4: { bossDistance: 12000, bulletCount: 5, speed: 2.8, bossHit: 60 },
  5: { bossDistance: 16000, bulletCount: 6, speed: 3.2, bossHit: 76 },
  6: { bossDistance: 20000, bulletCount: 6, speed: 3.6, bossHit: 92 },
  7: { bossDistance: 24000, bulletCount: 7, speed: 4, bossHit: 108 },
  8: { bossDistance: 28000, bulletCount: 7, speed: 4.4, bossHit: 124 },
  9: { bossDistance: 32000, bulletCount: 8, speed: 4.8, bossHit: 140 },
  10: { bossDistance: 40000, bulletCount: 8, speed: 5.2, bossHit: 156 }
};