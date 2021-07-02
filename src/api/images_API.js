import request from '@/utils/request_API'
import constants from '../utils/constants';

export function getImages() {
  return request({
    url: '/images',
    method: constants.METHOD_GET
  })
}

export function getTemplate(id) {
	return request({
	  url: '/images/' + id + '/template',
	  method: constants.METHOD_GET
	})
}

export function getDataSource(id) {
	return request({
	  url: '/images/' + id + '/config_datasource',
	  method: constants.METHOD_GET
	})
}

export function deleteImageById(id) {
	return request({
	  url: '/images/' + id,
	  method: constants.METHOD_DELETE
	})
}

export function getImagesFromGitlab() {
  return request({
    url: '/images/getImagesFromExternalRepository',
    method: constants.METHOD_GET
  });
}

export function downloadImage(data) {
  return request({
    url: '/images/downloadImage',
    method: constants.METHOD_POST,
    data: data,
    headers: {
      'Content-Type': constants.Application_Json,
      Accept: constants.Application_Json
    }
  });
}
