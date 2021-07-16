import request from '@/utils/request_API'
import constants from '../utils/constants'

export function getInfoList() {
  return request({
    url: '/info',
    method: constants.METHOD_GET
  })
}

export function deleteInfoByRandom_Id(id) {
  return request({
	  url: '/info/' + id,
	  method: constants.METHOD_DELETE
  })
}

export function getInfoByRandom_Id(id) {
  return request({
	  url: '/info/' + id,
	  method: constants.METHOD_GET
  })
}

export function createInfoRegister(data) {
  return request({
    url: '/info',
    method: constants.METHOD_POST,
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
}
