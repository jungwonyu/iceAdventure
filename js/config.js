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
      debug: true
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

const levelConfig = {
  1: { bossDistance: 3000, bulletCount: 3, bossHit: 20, enemy3Count: 1, walkieCount: 1 },
  2: { bossDistance: 6000, bulletCount: 4, bossHit: 25, enemy3Count: 1, walkieCount: 3 },
  3: { bossDistance: 9000, bulletCount: 5, bossHit: 30, enemy3Count: 1, walkieCount: 5 },
  4: { bossDistance: 12000, bulletCount: 5, bossHit: 35, enemy3Count: 2, walkieCount: 7 },
  5: { bossDistance: 15000, bulletCount: 6, bossHit: 40, enemy3Count: 2, walkieCount: 9 },
  6: { bossDistance: 18000, bulletCount: 6, bossHit: 45, enemy3Count: 2, walkieCount: 11 },
  7: { bossDistance: 21000, bulletCount: 7, bossHit: 50, enemy3Count: 3, walkieCount: 13 },
  8: { bossDistance: 24000, bulletCount: 7, bossHit: 55, enemy3Count: 3, walkieCount: 15 },
  9: { bossDistance: 27000, bulletCount: 8, bossHit: 60, enemy3Count: 3, walkieCount: 17 },
  10: { bossDistance: 30000, bulletCount: 8, bossHit: 65, enemy3Count: 3, walkieCount: 19 }
};