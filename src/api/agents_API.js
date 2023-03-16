import request from '@/utils/request_API';
import constants from '../utils/constants';

export function getAgents() {
  return request({
    url: '/agents/ngsiagent',
    method: constants.METHOD_GET
  });
}

export function inspectAgentById(id) {
  return request({
    url: '/agents/ngsiagent/' + id + '/inspect',
    method: constants.METHOD_GET
  });
}

export function createAgent(data) {
  return request({
    url: '/agents/ngsiagent',
    method: constants.METHOD_POST,
    data: data,
    headers: {
      'Content-Type': constants.Application_Json,
      Accept: constants.Application_Json
    }
  });
}

export function stopAgent(id) {
  return request({
    url: `/agents/ngsiagent/${id}/stop`,
    method: constants.METHOD_PATCH,
    timeout: 15000
  });
}

export function startAgent(id) {
  return request({
    url: `/agents/ngsiagent/${id}/start`,
    method: constants.METHOD_PATCH
  });
}

export function deleteAgent(id) {
  return request({
    url: `/agents/ngsiagent/${id}`,
    method: constants.METHOD_DELETE
  });
}

export function getLog(id, since) {
  return request({
    url: `/agents/ngsiagent/${id}/log?since=${since}`,
    method: constants.METHOD_GET
  });
}
