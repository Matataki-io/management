'use strict';
const { isArray } = require('lodash');

module.exports = {
  /**
 * 数据格式化 [ [{}], [{}], [{}] ] ===> [ {} ]
 * @param arr 需要处理的数组
 */
  transformForOneArray(arr) {
    if (isArray(arr[0])) {
      return [].concat(...arr);
    }
    return arr;
  },
};
