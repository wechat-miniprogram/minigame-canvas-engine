/**
 * 废弃
 */
// import Emitter from 'tiny-emitter';
// import AudioPlayer from './audioPlayer.android';

// let globalAudio = null;

// export default class VideoDecoder extends Emitter {
//   constructor() {
//     super();
//     this.id = null;
//     this.width = 0;
//     this.height = 0;
//     this.buffer = null;
//     this.audioPlayer = globalAudio || (globalAudio = new AudioPlayer());
//     this.mediaToolKit = null;
//     this._createPromise = new Promise((resolve, reject) => {
//       this.getMediaToolKit().playerCreate({}, (res) => {
//         console.log('MediaToolKit.playerCreate, res', JSON.stringify(res));
//         console.info('MediaToolKit.playerCreate, res', JSON.stringify(res));

//         if (res.errCode !== 0) {
//           reject(res);
//           return;
//         }

//         this.id = res.containerId;
//         resolve();
//       });
//     });
//     this.bindEvents();
//   }
//   getMediaToolKit() {
//     if (!this.mediaToolKit) {
//       this.mediaToolKit = process.env.PLATFORM === 'ios' ? __weixincanvasrender.MediaToolKit 
//        : NativeGlobal.MediaToolKit;
//     }
//     return this.mediaToolKit;
//   }
//   bindEvents() {
//     this.getMediaToolKit().addEventListener('onPlayerPlayEnd', () => {
//       this.emit('ended')
//     })
//   }
//   start(option = {}) {
//     return this._createPromise.then(() => {
//       return this.audioPlayer.start().catch(() => void 0)
//     }).then(() => {
//       return new Promise((resolve, reject) => {
//         const params = {
//           containerId: this.id,
//           filePath: option.source,
//           cachePath: option.cachePath || '',
//           mode: typeof option.mode !== 'undefined' ? option.mode : 0,
//           videoFormat: option.videoFormat || 55,
//           startStamp: option.startStamp || 0
//         }
//         console.log('MediaToolKit.playerStart, params', JSON.stringify(params))
//         this.getMediaToolKit().playerStart(params, (res) => {
//           console.log('MediaToolKit.playerStart, res', JSON.stringify(res));
//           console.info('MediaToolKit.playerStart, res', JSON.stringify(res));

//           if (res.errCode !== 0) {
//             reject(res);
//             return;
//           }
    
//           const video = res.video;
//           this.width = video.width;
//           this.height = video.height;
//           this.buffer = new ArrayBuffer(this.width * this.height * 4);
//           resolve(video);
//           this.emit('start', video);
//         });
//       })
//     })
//   }
//   stop() {
//     return this._createPromise.then(() => {
//       return this.audioPlayer.stop().catch(() => void 0)
//     }).then(() => {
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().playerStop({
//           containerId: this.id
//         }, (res) => {
//           console.log('MediaToolKit.playerStop, res', JSON.stringify(res));
//           console.info('MediaToolKit.playerStop, res', JSON.stringify(res));
//           if (res.errCode !== 0) {
//             reject(res);
//             return;
//           }
//           resolve();
//           this.emit('stop');
//         });
//       })
//     })
//   }
//   wait(wait) {
//     return this._createPromise.then(() => {
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().playerWait({
//           containerId: this.id,
//           wait
//         }, (res) => {
//           console.log('MediaToolKit.playerWait, res', JSON.stringify(res));
//           console.info('MediaToolKit.playerWait, res', JSON.stringify(res));
//           if (res.errCode !== 0) {
//             reject(res);
//             return;
//           }
//           resolve();
//         });
//       })
//     })
//   }
//   remove() {
//     return this._createPromise.then(() => {
//       return this.removeAudioSource().catch(() => void 0)
//     }).then(() => {
//       return new Promise((resolve, reject) => {
//         this.getMediaToolKit().playerRemove({
//           containerId: this.id
//         }, (res) => {
//           if (res.errCode !== 0) {
//             reject(res);
//             return;
//           }
//           resolve();
//         });
//       })
//     })
//   }
//   addAudioSource() {
//     return this._createPromise.then(() => {
//       return this.audioPlayer.addAudioSource({ id: this.id })
//     })
//   }
//   removeAudioSource() {
//     return this._createPromise.then(() => {
//       return this.audioPlayer.removeAudioSource({ id: this.id })
//     })
//   }
//   getFrameData() {
//     let buffer;
//     let pts;
//     let pkPts;
//     let dts;
//     let pkDts;

//     this.getMediaToolKit().playerGetFrame({
//       containerId: this.id,
//       buffer: this.buffer
//     }, (res) => {
//       // console.log('MediaToolKit.playerGetFrame, res', JSON.stringify(res));

//       if (res.got) {
//         buffer = this.buffer;
//       }

//       pts = res.pts;
//       pkPts = res.pk_pts;
//       dts = res.dts;
//       pkDts = res.pk_dts;
//     });

//     return buffer ? {
//       width: this.width,
//       height: this.height,
//       data: buffer,
//       pts: pts,
//       pkPts: pkPts,
//       dts: dts,
//       pkDts: pkDts
//     } : null;
//   }
//   updateVolume(volume) {
//     return this.audioPlayer.updateVolume(volume)
//   }
// }
