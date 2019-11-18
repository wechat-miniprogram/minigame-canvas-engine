let should = require('should');
let sinon  = require('sinon');
require('should-sinon');

let Util   = require('../../src/common/util.js');

describe('common', function() {
    describe('util.js', function() {
        describe('throttle', function() {
            it('should call throttle func once', function() {
                let cb = sinon.spy();

                let throttleCb = Util.throttle(cb, 16);

                throttleCb();
                throttleCb();

                cb.should.be.calledOnce();
            });

            it('should use threshhold default to 250', function(done) {
                let cb = sinon.spy();

                let throttleCb = Util.throttle(cb);

                throttleCb();

                setTimeout(() => {
                    throttleCb();
                    cb.should.be.calledOnce();
                    done();
                }, 17);
            });

            it('should call throttle func twice after threshhold', function(done) {
                let cb = sinon.spy();

                let throttleCb = Util.throttle(cb, 16);

                throttleCb();

                setTimeout(() => {
                    throttleCb();
                    cb.should.be.calledTwice();
                    done();
                }, 16);
            });
        });

        describe('isClick', () => {
            it('should return false if touch message not fulfil requirements', () =>{
                Util.isClick({}).should.be.false();
                Util.isClick({touchstart:{}}).should.be.false();
                Util.isClick({touchend:{}}).should.be.false();
                Util.isClick({touchstart:{}, touchend: {}}).should.be.false();
            });

            it('should return true', () =>{
                Util.isClick({
                    touchstart: {
                        timeStamp: 1,
                        pageX: 0,
                        pageY: 0,
                    },
                    touchend: {
                        timeStamp: 2,
                        pageX: 25,
                        pageY: 25,
                    },
                }).should.be.true();
            });
        });

        describe('createCanvas', () => {
            it('should create canvas element successfully', () => {
                Util.createCanvas().nodeName.should.be.eql('CANVAS');
            });
        });

        describe('createImage', () => {
            it('should create image element successfully', () => {
                Util.createImage().nodeName.should.be.eql('IMG');
            });
        });

        describe('getDpr', () => {
            it('should get devicePixelRatio correctly', () => {
                Util.getDpr().should.be.eql(window.devicePixelRatio);
            });
        });
    });
});

