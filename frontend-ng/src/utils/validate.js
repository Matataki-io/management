/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor']
  return true
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isNull(v) {
  return v === '' || v === null || v === undefined || JSON.stringify(v) === '{}' || JSON.stringify(v) === '[]'
}

