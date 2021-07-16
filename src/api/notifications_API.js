import request from '@/utils/request_API'
import constants from '../utils/constants'

export function getNotificationsList() {
  return request({
    url: '/notification',
    method: constants.METHOD_GET
  })
}

export function deleteNotificationById(id, data) {
  return request({
	  url: '/notification/' + id,
	  method: constants.METHOD_DELETE,
    data: data,
    headers: {
      'Content-Type': constants.Application_Json,
      Accept: constants.Application_Json
    }
  })
}

export function deleteNotifications() {
  return request({
	  url: '/notification/deleteAll',
	  method: constants.METHOD_DELETE
  })
}
