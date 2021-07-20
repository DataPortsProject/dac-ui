export default {
  route: {
    overview: 'Log'
  },
  navbar: {
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    title: 'DataPorts',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  'containerList': {
    'nameTableColumn': 'Name',
    'imageTableColumn': 'Image',
    'statusTableColumn': 'Status',
    'actionsTableColumn': 'Actions',
    'inspectAgent': 'Inspect',
    'viewLog': 'View log',
    'startAgent': 'Start',
    'stopAgent': 'Stop',
    'deleteAgent': 'Delete',
    'deleteAgentDialogTitle': 'Delete agent',
    'deleteAgentDialogQuestion': 'Are you sure you want to delete this agent?',
    'inspectingAgent': 'Inspecting agent',
    'containerStopped': 'Agent stopped successfully',
    'containerStarted': 'Agent started successfully',
    'containerDeleted': 'Agent deleted successfully',
    'logDownloaded': 'Agent log downloaded',
    'selectDate': 'Select a date',
    'logDate': 'Since...',
    'sinceBeginning': 'Since the beginning of the times'
  },
  'agentList': {
    'tableColumnName': 'Name',
    'tableColumnTag': 'Tag',
    'tableColumnType': 'Type',
    'tableColumnActions': 'Actions',
    'addImage': 'Import image from external repository',
    'downloadTemplate': 'Download template',
    'createInstance': 'Create agent',
    'deleteImage': 'Delete image',
    'startAgentDialogTitle': 'Create image',
    'deleteImageDialogTitle': 'Delete image',
    'deleteImageDialogQuestion': 'Are you sure you want to delete this image?',
    'addImageTitle': 'Add image',
    'createAgentDialogTitle': 'Create image',
    'selectDataSource': 'Select datasource',
    'typeAgent': 'Agent type',
    'Selectdatamodel': 'Select datamodel',
    'configuration': 'Configuration',
    'deletedImage': 'Image deleted successfully',
    'agentCreated': 'Agent created successfully',
    'executeAgent': 'Execute agent',
    'selectDatasource': 'Select datasource',
    'addImageDialogUrl': 'URL',
    'addImageDialogUser': 'User',
    'addImageDialogPass': 'Password',
    'addImageDialogNameImage': 'Select image',
    'privateRepository': 'Private repository',
    'connect': 'Connect',
    testAgent: 'Test On-demand Agent',
    forTestOnly: 'This option will be used to test on-demand type agents. This type of agents will be invoked from the Semantic Interoperability Component',
    callback_url_set: 'Callback URL set by default in the agent: ',
    publish_subscribeDescription: 'Agent to send the data to ORION',
    on_demandDescription: 'Agent that will send the data to a Callback URL',
    containerName_characteristics: 'The name of the container must be in lower case. No spaces or special characters. It can contain numbers.',
    downloadingTemplate: 'Downloading template',
    imageImported: 'imageImported'
  },
  'datasourceList': {
    'idTableColumn': 'Id',
    'datamodelsTableColumn': 'Datamodel',
    'actionsTableColumn': 'Actions',
    'inspectDatamodel': 'Inspect',
    'viewInspectDatamodel': 'Inspecting datasource',
    'viewAgents': 'View Agents'
  },
  'subscriptionList': {
    'idTableColumn': 'Id',
    'subjectTableColumn': 'Subject',
    'statusTableColumn': 'Status',
    'actionsTableColumn': 'Actions',
    'inspectSubscription': 'Inspect subscription',
    'viewInspectDatamodel': 'Inspecting  subscription'
  },
  'common': {
    'exportExcel': 'Export to excel',
    'close': 'Close',
    'delete': 'Delete',
    'accept': 'Accept',
    'cancel': 'Cancel',
    'success': 'Success',
    'error': 'Error',
    'required': 'required',
	  warning: 'Warning',
    'download': 'Download',
    'import': 'Import',
	  closeDialog: 'Are you sure to close this dialog?',
    ok: 'Ok',
    next: 'Next',
    previous: 'Previous'
  },
  'models': {
    'search': 'Search'
  },
  wizard: {
    datamodel_properties: 'Data Model properties',
    selected_properties: 'Selected properties',
    mandatoryProperties: 'These properties are mandatory: ',
    description_api_agentType: 'Connector / Agent whose data source will be an API',
    description_local_txt_file_agentType: 'Connector / Agent whose data source will be a local txt file',
    description_local_excel_file_agentType: 'Connector / Agent whose data source will be a local excel file'
  },
  overview: {
    notifications: 'Notifications',
    tableColumnType: 'Type',
    tableColumnMessage: 'Message',
    tableColumnCreated: 'Created',
    deleteNotification: 'Delete Notification',
    deleteNotificationDialogTitle: 'Delete Notification',
    'deleteNotificationDialogQuestion': 'Are you sure you want to delete this notification?',
    deletedNotification: 'Notification deleted successfully',
    deleteAllNotifications: 'Delete all notifications',
    deleteAllNotificationDialogTitle: 'Delete all notifications',
    deleteAllNotificationDialogQuestion: 'Are you sure you want to delete all the notifications?',
    deletedNotifications: 'Notifications deleted successfully',
    tableColumnContainerName: 'Container name',
    messageSended: 'Message Sended'
  }
}
