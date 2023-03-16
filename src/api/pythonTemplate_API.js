import request from '@/utils/request_API';
import constants from '../utils/constants';

export function getAllPythonTemplates() {
  return request({
    url: '/pythonTemplate',
    method: constants.METHOD_GET
  });
}

export function getZIPTemplate(templateFeatures) {
  return request({
    url: '/pythonTemplate/getZIPTemplate',
    method: constants.METHOD_POST,
    data: templateFeatures,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    responseType: 'arraybuffer'
  });
}
