let should = require('should');
let imageManager = require('../../src/common/imageManager').default;
const testImg = 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg'

describe('common', function() {
  describe('imageManager.js', function() {
    it('should not return img if not exist', function() {
      should(imageManager.getRes('no_exist_url')).be.undefined();
    });

    it('should return img if exist', function(done) {
      const img = imageManager.loadImage(testImg, (img, fromCache) => {
        should(imageManager.getRes(testImg)).not.be.undefined();
        done();
      })
    });

    it('should clear imageManager successful', function(done) {
      const img = imageManager.loadImage(testImg, (img, fromCache) => {
        imageManager.clear();
        should(imageManager.getRes(testImg)).be.undefined();
        done();
      })
    });

    it('should not loadImage if src is undefined', function() {
      const img = imageManager.loadImage()

      should(img).be.null();
    });

    it('should loadImage successful', function(done) {
      const img = imageManager.loadImage(testImg, (img, fromCache) => {
        img.should.not.be.undefined();
        done();
      })
    });

    it('if load the same img, it should use the cache first', function() {
      imageManager.clear();
      const img1 = imageManager.loadImage(testImg)
      const img2 = imageManager.loadImage(testImg)

      should.deepEqual(img1, img2);
    });
  });
})


