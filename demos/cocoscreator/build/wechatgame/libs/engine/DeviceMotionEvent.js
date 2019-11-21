
const inputManager = _cc.inputManager;
let isInit = false;

Object.assign(inputManager, {
    setAccelerometerEnabled (isEnable) {
        let scheduler = cc.director.getScheduler();
        scheduler.enableForTarget(this);
        if (isEnable) {
            this._registerAccelerometerEvent();
            scheduler.scheduleUpdate(this);
        }
        else {
            this._unregisterAccelerometerEvent();
            scheduler.unscheduleUpdate(this);
        }
    },

    // No need to adapt
    // setAccelerometerInterval (interval) {  },

    _registerAccelerometerEvent () {
        this._accelCurTime = 0;   
        if (!isInit) {
            isInit = true;
            let self = this;
            this._acceleration = new cc.Acceleration();

            wx.onAccelerometerChange && wx.onAccelerometerChange(function (res) {
                let x = res.x;
                let y = res.y;
            
                let systemInfo = wx.getSystemInfoSync();
                let windowWidth = systemInfo.windowWidth;
                let windowHeight = systemInfo.windowHeight;
                if (windowHeight < windowWidth) {
                    // Landscape orientation

                    // For left landscape
                    // x = y;
                    // y = -x;

                    // For right landscape
                    // x = -y;
                    // y = x;

                    // We suggest to use right landscape by default
                    let tmp = x;
                    x = -y;
                    y = tmp;
                }
                
                self._acceleration.x = x;
                self._acceleration.y = y;
                self._acceleration.z = res.z;
            });
        }
        else {
            wx.startAccelerometer && wx.startAccelerometer({
                fail: function (err) {
                    cc.error('register Accelerometer failed ! err: ' + err);
                },
                success: function () {},
                complete: function () {},
            });
        }
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;  
        wx.stopAccelerometer && wx.stopAccelerometer({
            fail: function (err) {
                cc.error('unregister Accelerometer failed ! err: ' + err);
            },
            success: function () {},
            complete: function () {},
        });
    },
});
