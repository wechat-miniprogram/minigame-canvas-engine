/**
 * 废弃
 */
// export default class AudioPlayer {
//   constructor() {
//     this.id = null;
//     this.mediaToolKit = null;
//     this._createPromise = new Promise((resolve, reject) => {
//       this.getMediaToolKit().audioCreate({}, (res) => {
//         if (res.errCode === 0) {
//           this.id = res.containerId;
//           resolve();
//         } else {
//           reject(res);
//         }
//       })
//     })
//   }
//   getMediaToolKit() {
//     if (!this.mediaToolKit) {
//       this.mediaToolKit = process.env.PLATFORM === 'ios' 
//         ? __weixincanvasrender.MediaToolKit 
//         : NativeGlobal.MediaToolKit;
//     }
//     return this.mediaToolKit;
//   }
//   start() {
//     return this._createPromise.then(() => {
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().audioStart({
//           containerId: this.id
//         }, function (res) {
//           if (res.errCode === 0) {
//             resolve(res);
//           } else {
//             reject(res);
//           }
//         });
//       })
//     })
//   }
//   addAudioSource(source) {
//     return this._createPromise.then(() => {
//       return new Promise((resolve, reject) => {
//         console.log('MediaToolKit.audioAddTask: ' + JSON.stringify({containerId: this.id, taskId: source.id}))
//         this.getMediaToolKit().audioAddTask({
//           containerId: this.id,
//           taskId: source.id
//         }, function (res) {
//           console.log('MediaToolKit.audioAddTask res: ' + JSON.stringify(res))
//           if (res.errCode === 0) {
//             resolve(res);
//           } else {
//             reject(res);
//           }
//         });
//       })
//     })
//   }
//   removeAudioSource(source) {
//     return this._createPromise.then(() => {
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().audioDelTask({
//           containerId: this.id,
//           taskId: source.id
//         }, function (res) {
//           if (res.errCode === 0) {
//             resolve(res);
//           } else {
//             reject(res);
//           }
//         });
//       })
//     })
//   }
//   updateVolume(audioVolume) {
//     return this._createPromise.then(() => {
//       console.log('MediaToolKit audioUpdate');
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().audioUpdate({
//           containerId: this.id,
//           audioVolume,
//           audioMute: audioVolume === 0
//         }, function (res) {
//           console.log('MediaToolKit audioUpdate res', JSON.stringify(res));
//           if (res.errCode === 0) {
//             resolve(res);
//           } else {
//             reject(res);
//           }
//         })
//       })
//     })
//   }
//   stop() {
//     return this._createPromise.then(() => {
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().audioStop({
//           containerId: this.id
//         }, function (res) {
//           console.log('MediaToolKit audioStop res', JSON.stringify(res));
//           if (res.errCode === 0) {
//             resolve(res);
//           } else {
//             reject(res);
//           }
//         });
//       });
//     });
//   }
//   remove() {
//     return this._createPromise.then(() => {
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().audioRemove({
//           containerId: this.id
//         }, function (res) {
//           if (res.errCode === 0) {
//             resolve(res);
//           } else {
//             reject(res);
//           }
//         });
//       })
//     })
//   }
// }
