// Define the constants needs for DataPorts
const baseUrl = ((window.location.host || '').split(':') || [])[0] || 'localhost';
export default {
  // Use this setup if no KrakenD proxy used
  //baseURL_DAM_API: `http://${baseUrl}:3000`,
  //baseURL_API_ON_DEMAND: `http://${baseUrl}:3000/on_demand`,
  // Use this stup if KrakenD configured
  baseURL_DAM_API: `https://${baseUrl}:9000/dac`,
  baseURL_API_ON_DEMAND: `https://${baseUrl}:9000/dac/on_demand`,
  // methods petition API
  METHOD_GET: 'GET',
  METHOD_POST: 'POST',
  METHOD_PUT: 'PUT',
  METHOD_DELETE: 'DELETE',
  METHOD_PATCH: 'PATCH',
  // attributes for petitionS
  Application_Json: 'application/json',
  Fiware_Service: 'metadata',
  // Constants for the different categories
  IMAGE: 'image',
  CONTAINER: 'container',
  ON_DEMAND: 'on_demand',
  PUBLISH_SUBSCRIBE: 'publish-subscribe',
  AGENT_IMAGE: 'AgentImage',
  AGENT_CONTAINER: 'AgentContainer',
  DATA_SOURCE: 'DataSource',
  agentType: [
    { label: 'On demand', value: 'ON_DEMAND' },
    { label: 'Publish / Suscribe', value: 'PUBLISH_SUSCRIBE' }
  ],
  timeUnit: [
    { label: 'Seconds', value: 'SECONDS' },
    { label: 'Minutes', value: 'MINUTES' },
    { label: 'Hours', value: 'HOURS' },
    { label: 'Days', value: 'DAYS' }
  ],
  // Results petitions
  OK: 'OK',
  // Type of message for Modal Dialog
  SUCCESS_MESSAGE_TYPE: 'success',
  WARNING_MESSAGE_TYPE: 'warning',
  ERROR_MESSAGE_TYPE: 'error'
};
