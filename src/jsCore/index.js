/**
  * jsCore中的代码
  * @date 2020-06-08
  * @author radeonwu
 */

console.log('start index.js');

import { emit, on, remove } from '../common/emitter';
import { nativeCommonCgi, nativeInvoke } from "../common/communicate";
import { getPlatform } from '../common/utils.js';

let callbackCount = 0;

const WeixinTimeline = {
  invoke(name, options, callback) {
    const callbackId = `wxtimeline_invoke${callbackCount++}`;
    // debug('WeixinTimeline.invoke:', name, options, callbackId);
    // 注册回调
    on(`callback:${callbackId}`, (res) => {
      if (typeof callback === 'function') {
        try {
          callback(res);
        } catch (err) {
          // error('Error WeixinTimeline.invoke callback:\n\n', formatErr(err));
        }
      }
    });
    // 调用客户端
    nativeInvoke({
      func: name,
      params: options,
      __msg_type: 'call',
      __callback_id: callbackId
    });
  },
  commonCgi(options, callback) {
    if (typeof options !== 'object' || options === null) {
      // error('WeixinTimeline.commonCgi options must be an object');
      return;
    }
    const callbackId = `wxtimeline_common_cgi${callbackCount++}`;
    // debug('WeixinTimeline.commonCgi:', callbackId);
    on(`callback:${callbackId}`, (res) => {
      if (typeof callback === 'function') {
        try {
          callback(res);
        } catch (err) {
          // error('Error WeixinTimeline.commonCgi callback:\n\n', formatErr(err));
        }
      }
    });
    nativeCommonCgi(callbackId, options);
  },
  // 客户端jsapi等回调
  _callback(callbackId, res) {
    // debug('native callback', callbackId, res);
    emit(`callback:${callbackId}`, res);
  },
  _dispatch(nativeEvent, res) {
    // debug('native event', nativeEvent, res);
    emit(`notify-listener:${nativeEvent}`, res);
  },
  /**
   * 客户端调用，用于注入数据
   */
  onReceiveData(callback) {
    // emit(`receive-data`, data);
    on('notify-listener:receive_data', (response) => {
      let res = response;
      if (getPlatform() === 'android') {
        res = JSON.parse(response);
      }
      if (typeof callback === 'function') {
        try {
          callback(res);
        } catch (err) {

        }
      }
    });
  },
};

export default WeixinTimeline;
