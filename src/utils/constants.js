// Define the constants needs for DataPorts
export default {
  // base URL of our API
  baseURL_DAM_API: 'http://localhost:3000',
  // base URL of our API for Linux deployment
  // baseURL_DAM_API: 'http://dataports.prodevelop.es:3000',
  // base URL API for on_demand endpoint
  baseURL_API_ON_DEMAND: 'http://localhost:3000/on_demand',
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
}
