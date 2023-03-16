import dataportsConstants from '../utils/constants';

export function buildAgentImage(imageID, imageName, dataSourceID) {
  return {
    id: 'urn:ngsi-ld:AgentImage:' + imageID,
    type: dataportsConstants.AGENT_IMAGE,
    name: {
      type: 'Text',
      value: imageName
    },
    agentType: {
      type: 'Text',
      value: dataportsConstants.ON_DEMAND
    },
    accessURL: {
      type: 'Text',
      value: dataportsConstants.baseURL_API_ON_DEMAND
    },
    refDataSource: {
      type: 'Relationship',
      value: dataSourceID
    }
  };
}

export function buildAgentContainer(
  _imageID,
  imageName,
  dataSourceID,
  containerID
) {
  return {
    id: 'urn:ngsi-ld:AgentContainer:' + containerID,
    type: dataportsConstants.AGENT_CONTAINER,
    name: {
      type: 'Text',
      value: imageName
    },
    agentType: {
      type: 'Text',
      value: dataportsConstants.PUBLISH_SUBSCRIBE
    },
    refDataSource: {
      type: 'Relationship',
      value: dataSourceID
    }
  };
}
