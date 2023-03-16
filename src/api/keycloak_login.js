import request from '@/utils/request_API';
import constants from '../utils/constants';

export function loginKeycloak(data) {
  return request({
    url: '/keycloak/getToken',
    method: constants.METHOD_POST,
    data: data,
    headers: {
      'Content-Type': constants.Application_Json,
      Accept: constants.Application_Json
    }
  });
}
