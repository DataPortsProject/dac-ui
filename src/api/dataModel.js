import request from '@/utils/request_API'
import constants from '../utils/constants'

export function getAllDataModels() {
  return request({
    url: '/dataModel',
    method: constants.METHOD_GET
  })
}

export function getJsonSchema(data) {
  return request({
    url: '/dataModel/getSchema',
    method: constants.METHOD_POST,
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
}
