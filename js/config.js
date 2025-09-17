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
