<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-input
        v-model="searchText"
        placeholder="Search"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        style="
          margin-left: 10px;
          border-color: #1890ff;
          color: #1890ff;
          backgroundcolor: rgb(240, 242, 245);
        "
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("models.search") }}
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        style="
          margin-left: 10px;
          border-color: #1890ff;
          color: #1890ff;
          backgroundcolor: rgb(240, 242, 245);
        "
        icon="el-icon-refresh"
        @click="getList"
      />
    </div>
    <el-row style="background: #fff; margin-bottom: 30px">
      <!-- CONTAINER TABLE -->
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="filteredContainersByPagination"
        border
        fit
        style="width: 100%"
      >
        <el-table-column
          :label="getNameTableColumn"
          align="center"
          :sortable="true"
          sort-by="name"
          :min-width="25"
        >
          <template slot-scope="{ row }">
            <span>{{ row.Names[0].toString() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="getImageTableColumn"
          align="center"
          :min-width="20"
        >
          <template slot-scope="{ row }">
            <span>{{ row.Image }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="getStatusTableColumn"
          align="center"
          :min-width="20"
        >
          <template slot-scope="{ row }">
            <span>{{ row.Status }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :min-width="35"
          :label="getActionsTableColumn"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <!-- Inspect agent -->
            <el-button
              size="small"
              class="editBtn"
              :disabled="disableButtons"
              @click="inspectAgent(row)"
            >
              <i class="el-icon-edit">{{ $t("containerList.inspectAgent") }}</i>
            </el-button>

            <!-- Recover log -->
            <span style="padding-left: 10px" />
            <el-button
              size="small"
              class="viewLogBtn"
              :disabled="disableButtons"
              @click="openAgentLogDialog(row.Names[0].toString(), row.Id)"
            >
              <i class="el-icon-view"> {{ $t("containerList.viewLog") }} </i>
            </el-button>

            <!-- Stop agent -->
            <span style="padding-left: 20px" />
            <el-button
              v-if="row.StatusCode === 'up'"
              size="small"
              class="stopBtn"
              :disabled="disableButtons"
              @click="stopAgent(row.Id, 'stopped')"
            >
              <i class="el-icon-video-pause">{{
                $t("containerList.stopAgent")
              }}</i>
            </el-button>

            <!-- Start agent -->
            <span style="padding-left: 10px" />
            <el-button
              v-if="row.StatusCode === 'exited'"
              size="small"
              class="stopBtn"
              :disabled="disableButtons"
              @click="startAgent(row.Id)"
            >
              <i class="el-icon-video-play">{{
                $t("containerList.startAgent")
              }}</i>
            </el-button>

            <!-- Delete agent -->
            <span style="padding-left: 10px" />
            <el-button
              size="small"
              class="deleteBtn"
              :disabled="disableButtons || row.StatusCode !== 'exited'"
              @click="showDeleteDialog(row.Id, row.ImageID)"
            >
              <i class="el-icon-delete-solid">{{
                $t("containerList.deleteAgent")
              }}</i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination
      v-show="filteredContainersBySearchTextLength > 0"
      :total="filteredContainersBySearchTextLength"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- DIALOG TO SHOW THE JSON METADATA -->
    <el-dialog
      :visible.sync="viewMetaDataDialog"
      width="80%"
      :title="$t('containerList.inspectingAgent')"
    >
      <el-tabs
        v-model="mainTab"
        dark
        slider-color="green"
        centered
        color="green"
        @tab-click="refreshJsonEditor++"
      >
        <el-tab-pane label="Agent" name="metadataContent">
          <el-card class="box-card">
            <json-editor ref="jsonMetadata" v-model="metadataContent" />
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          :key="refreshJsonEditor"
          label="Datamodel"
          name="datamodelContent"
        >
          <el-card class="box-card">
            <json-editor ref="jsonDatamodel" v-model="dataModelContent" />
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="closeMetadataDialog()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- DIALOG TO DELETE AGENT -->
    <el-dialog
      :visible.sync="deleteDialog"
      width="20%"
      :title="getDeleteAgentDialogTitle"
    >
      <div>
        <span style="padding: 10px;">{{
          $t("containerList.deleteAgentDialogQuestion")
        }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteAgent()">
          {{ $t("common.delete") }}
        </el-button>
        <el-button type="success" @click="hideDeleteDialog()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- DIALOG TO SHOW AGENT LOG -->
    <el-dialog
      :visible.sync="logDialog"
      width="50%"
      :title="$t('containerList.selectDate')"
      @close="closeAgentLogDialog()"
    >
      <el-row>
        <div style="padding: 20px">
          <el-date-picker
            v-model="logDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('containerList.logDate')"
            :disabled="noDate"
          />
        </div>
        <div style="padding: 20px">
          <el-checkbox
            v-model="noDate"
          >
            {{ this.$t('containerList.sinceBeginning') }}
          </el-checkbox>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAgentLogDialog()">
          {{ $t("common.close") }}
        </el-button>
        <el-button type="success" @click="recoverAgentLog()">
          {{ $t("common.download") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on
import JsonEditor from '@/components/JsonEditor'
import {
  getAgents,
  inspectAgentById,
  stopAgent,
  startAgent,
  deleteAgent,
  getLog
} from '@/api/agents_API'
import { getImages, getDataSource } from '@/api/images_API'
import {
  deleteORIONEntities,
  getData,
  checkORIONDatasource
} from '@/api/orion_API'

/* Sin usar de momento*/
/* import dataportsConstants from '@/utils/constants'; */

export default {
  name: 'ContainerList',
  components: { JsonEditor, Pagination },
  directives: { waves },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%'
      },
      listQuery: {
        categorySelected: '',
        page: 1,
        limit: 5,
        id: undefined
      },
      listLoading: true,
      searchText: '',
      list: [],
      total: 0,
      metadataContent: null,
      dataModelContent: null,
      viewMetaDataDialog: false,
      requiredText: '',
      containerStatus: '',
      tableKey: 0,
      agentToDelete: '',
      imageID: '',
      deleteDialog: false,
      disableButtons: false,
      refreshJsonEditor: 0,
      mainTab: 'metadataContent',

      agentLog: '',
      logDialog: false,
      agentLogName: '',
      agentLogId: null,
      noDate: true,
      logDate: ''
    }
  },
  computed: {

    filteredContainersByPagination() {
      const page = this.listQuery.page
      const limit = this.listQuery.limit

      if (
        Math.ceil(this.filteredContainersBySearchTextLength / limit) >= page
      ) {
        return this.filteredContainersBySearchText.slice(
          (page - 1) * limit,
          page * limit
        )
      } else {
        return this.filteredContainersBySearchText.slice(0, limit)
      }
    },

    filteredContainersBySearchText() {
      return this.list.filter(img =>
        img.Names[0]
          .toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      )
    },

    filteredContainersBySearchTextLength() {
      return this.filteredContainersBySearchText.length
    },

    getDeleteAgentDialogTitle() {
      return this.$t('containerList.deleteAgentDialogTitle')
    },

    getNameTableColumn() {
      return this.$t('containerList.nameTableColumn')
    },

    getImageTableColumn() {
      return this.$t('containerList.imageTableColumn')
    },

    getStatusTableColumn() {
      return this.$t('containerList.statusTableColumn')
    },

    getActionsTableColumn() {
      return this.$t('containerList.actionsTableColumn')
    }
  },

  watch: {
    lang() {
      this.commonTranslation()
    }
  },

  created() {
    this.getList()
    this.commonTranslation()
  },

  methods: {
    commonTranslation() {
      this.requiredText = ' required'
    },

    async getList() {
      this.listQuery.categorySelected = this.category
      this.listLoading = true
      await getAgents().then(response => {
        const agents = []
        response.message.forEach(e => {
          if (e.AgentType !== 'on_demand' && e.AgentType !== '') {
            agents.push(e)
          }
        })
        this.list = agents
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    showDeleteDialog(id, imageID) {
      this.deleteDialog = true
      this.agentToDelete = id
      this.imageID = imageID
    },

    hideDeleteDialog() {
      this.deleteDialog = false
      this.agentToDelete = ''
      this.imageID = ''
    },

    handleFilter() {},

    /* Inspeccionar agente */
    async inspectAgent(row) {
      this.metadataContent = ''
      this.dataModelContent = ''
      const _this = this
      const metadataContent = await inspectAgentById(row.Id).then(response => {
        _this.metadataContent = response.message
      })

      const dataModelContent = await getDataSource(row.ImageID).then(
        response => {
          _this.dataModelContent = JSON.parse(response.message.dataSource)
        }
      )

      // this.viewMetadataContent(metadataContent);
      // this.viewDataModelContent(dataModelContent);

      this.viewMetaDataDialog = true
    },

    viewMetadataContent(metadata) {
      this.metadataContent = metadata
    },

    viewDataModelContent(datamodel) {
      const obj = JSON.parse(datamodel)
      this.dataModelContent = obj
    },

    closeMetadataDialog() {
      this.mainTab = 'metadataContent'
      this.viewMetaDataDialog = false
    },

    closeAgentLogDialog() {
      this.logDialog = false
      this.agentLogName = ''
      this.agentLogId = null
      this.noDate = true
      this.logDate = ''
    },

    openAgentLogDialog(agentName, agentId) {
      this.logDialog = true
      this.agentLogName = agentName
      this.agentLogId = agentId
    },

    /* Descargar el log del agente */
    async recoverAgentLog() {
      this.disableButtons = true
      this.listLoading = true

      const since = !this.noDate && this.logDate !== '' ? (this.logDate.getTime() / 1000).toFixed(0) : ''
      console.log('UNIX TIMESTAMP', since)

      await getLog(this.agentLogId, since).then(
        response => {
          this.downloadTxt(`${this.agentLogName}-log`, response.message)
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('containerList.logDownloaded'),
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
        },
        error => {
          this.$notify({
            title: this.$t('common.error'),
            message: error,
            type: 'error',
            duration: 2000
          })
          this.listLoading = false
        }
      )
      this.disableButtons = false
    },

    downloadTxt(filename, text) {
      var element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
      )
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },

    /* Parar el agente */
    async stopAgent(agentId) {
      this.disableButtons = true
      this.listLoading = true
      await stopAgent(agentId).then(
        response => {
          this.tableKey++
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('containerList.containerStopped'),
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
          this.getList()
        },
        error => {
          this.tableKey++
          this.$notify({
            title: this.$t('common.error'),
            message: error,
            type: 'error',
            duration: 2000
          })
          this.listLoading = false
        }
      )
      this.disableButtons = false
    },

    /* Arrancar agente */
    async startAgent(agentId) {
      this.disableButtons = true
      this.listLoading = true
      await startAgent(agentId).then(
        response => {
          this.tableKey++
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('containerList.containerStarted'),
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
          this.getList()
        },
        error => {
          this.tableKey++
          this.$notify({
            title: this.$t('common.error'),
            message: error,
            type: 'error',
            duration: 2000
          })
          this.listLoading = false
        }
      )
      this.disableButtons = false
    },

    /* Borrar agente */
    deleteAgent() {
      deleteAgent(this.agentToDelete).then(
        async response => {
          // Una vez el agente se ha borrado hay que actualizar las entidades en ORION. Hay que borrar su entidad AgentContainer.
          // El id de las entidades siempre son iguales. Al ser un agente pub-sub es de tipo AgentContainer +  id_imagen

          var agentContainerToRemove =
            'urn:ngsi-ld:AgentContainer:' + this.imageID
          // Borramos la entidad AgentContainer
          await deleteORIONEntities(agentContainerToRemove).then(response =>
            console.log(response)
          )

          // Una vez borradas ambas entidades se vacia la property imageID
          this.tableKey++
          this.imageID = ''
          this.deleteDialog = false
          this.agentToDelete = ''
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('containerList.containerDeleted'),
            type: 'success',
            duration: 2000
          })
          this.getList()
        },
        error => {
          this.tableKey++
          this.$notify({
            title: this.$t('common.error'),
            message: error,
            type: 'error',
            duration: 2000
          })
          this.deleteDialog = false
          this.agentToDelete = ''
          this.imageID = ''
        }
      )
    },

    createAgent() {}
  }
}

</script>

<style lang="scss" scoped>
.viewBtn {
  color: #fff;
  background-color: #9da408;
  border-color: #9da408;
}
.editBtn {
  background-color: #e8f4ff;
  border-color: #d1e9ff;
  color: #1890ff;
}
.stopBtn {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
.deleteBtn {
  color: #fff;
  background-color: #ff4949;
  border-color: #ff4949;
}
.viewLogBtn {
  color: #fff;
  background-color: #409167;
  border-color: #409167;
}
.selected-card {
  border: 1px solid #0dea4c;
}
.el-card {
  min-height: 150px;
}
</style>
