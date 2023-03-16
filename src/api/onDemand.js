import request from '@/utils/request_API';
import constants from '../utils/constants';

export function OnDemandAgent(data) {
  return request({
    url: '/on_demand',
    method: constants.METHOD_POST,
    data: data,
    headers: {
      'Content-Type': constants.Application_Json,
      Accept: constants.Application_Json
    }
  });
}
