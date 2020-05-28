'use strict';

// 错误码统一编码，提示信息多语言
module.exports = () => {
  return {
    success: { code: 0, message: '成功' },
    loginFailed: { code: -1, message: '登录失败' },
    regFailedUsername: { code: 114514, message: '注册失败，有重复的用户名' },
    botSendMsgFailed: { code: -1, message: '机器人发送消息失败' },
    updateFailed: { code: -2, message: '更新失败' },
    ipfsCatchFailed: { code: -3, message: 'IPFS获取失败' },
  };
};
