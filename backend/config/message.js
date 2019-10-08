'use strict';

// 错误码统一编码，提示信息多语言
module.exports = () => {
    return {
        success: { code: 0, message: '成功' },
        loginFailed: { code: -1, message: '登录失败' },
        updateFailed: { code: -2, message: '更新失败'},
    }
};
