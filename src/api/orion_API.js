import request from '@/utils/request_API';
import constants from '../utils/constants';

export function getORIONEntitiesByType(type) {
  return request({
    url: 'orion/' + type + '/entitiesByType',
    method: constants.METHOD_GET
  });
}

export function getORIONSubscriptions() {
  return request({
    url: 'orion/getSubscriptions',
    method: constants.METHOD_GET
  });
}

export function createORION_Subscription(entity) {
  return request({
    url: 'orion/createSubscriptions',
    method: constants.METHOD_POST,
    data: entity,
    headers: {
      'Content-Type': constants.Application_Json,
      Accept: constants.Application_Json
    }
  });
}

export function createORIONEntities(entity) {
  return request({
    url: 'orion/createEntity',
    method: constants.METHOD_POST,
    data: entity,
    headers: {
      'Content-Type': constants.Application_Json,
      Accept: constants.Application_Json
    }
  });
}

export function deleteORIONEntities(ID) {
  return request({
    url: 'orion/' + ID,
    method: constants.METHOD_DELETE
  });
}

export function deleteSubscriptionById(ID) {
  return request({
    url: 'orion/subscription/' + ID,
    method: constants.METHOD_DELETE
  });
}

export function checkORIONDatasource(entityType, datasourceId) {
  return request({
    url: `orion/checkDatasource?entityType=${entityType}&datasourceId=${datasourceId}`,
    method: constants.METHOD_GET
  });
}

export function checkORIONAgentsAsociated(dataSourceId, agentType) {
  return request({
    url: `orion/getAgentsAsociated?dataSourceId=${dataSourceId}&agentType=${agentType}`,
    method: constants.METHOD_GET
  });
}
