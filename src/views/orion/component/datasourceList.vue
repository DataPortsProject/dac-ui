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
        :key="pubSubAgentsTableKey"
        v-loading="listLoading"
        :data="filteredDatasourceByPagination"
        border
        fit
        style="width: 100%"
      >
        <el-table-column
          :label="getIdTableColumn"
          align="center"
          :sortable="true"
          sort-by="name"
          :min-width="30"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id.toString() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="getDatamodelsTableColumn"
          align="center"
          :min-width="50"
        >
          <template slot-scope="{ row }">
            <span
              ><a :href="row.dataModels.value.value" target="_blank">{{
                row.dataModels.value
              }}</a></span
            >
          </template>
        </el-table-column>

        <el-table-column
          :min-width="20"
          :label="getActionsTableColumn"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <!-- Inspect agent -->
            <el-button
              size="small"
              class="editBtn"
              @click="inspectDatamodel(row)"
              :disabled="disableButtons"
            >
              <i class="el-icon-edit">{{
                $t("datasourceList.inspectDatamodel")
              }}</i>
            </el-button>
            <el-button
              size="small"
              class="editBtn"
              @click="viewAgentsAsociated(row)"
              :disabled="disableButtons"
            >
              <i class="el-icon-s-promotion">{{
                $t("datasourceList.viewAgents")
              }}</i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination
      v-show="filteredDatasourceBySearchTextLength > 0"
      :total="filteredDatasourceBySearchTextLength"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- DIALOG TO SHOW THE JSON METADATA -->
    <el-dialog
      :visible.sync="viewDatamodelDetailsDialog"
      width="80%"
      :title="$t('datasourceList.viewInspectDatamodel')"
    >
      <el-card class="box-card">
        <json-editor ref="jsonMetadata" v-model="datamodelDetails" />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="closeInspectDatamodel()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- DIALOG TO SHOW AGENTS ASOCIATED TO A DATAMODEL -->
    <el-dialog
      :visible.sync="viewAgentsDialog"
      width="80%"
      title="Agents associated"
    >
      <el-tabs
        dark
        slider-color="green"
        centered
        color="green"
        v-model="mainTab"
        @tab-click="refreshAgentsTable++"
      >
        <el-tab-pane label="PUBLISH-SUBSCRIBE" name="pubsubTab">
          <el-card class="box-card">
            <div class="filter-container">
              <el-input
                v-model="pubsubSearchText"
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
                @click="getPubSubAgents"
              />
            </div>
            <el-row style="background: #fff; margin-bottom: 30px">
              <!-- TABLE AGENTS PUB-SUB -->
              <el-table
                :key="pubSubAgentsTableKey"
                v-loading="pubSubAgentsLoading"
                :data="filteredPubSubAgentsByPagination"
                border
                fit
                style="width: 100%"
              >
                <el-table-column
                  label="Datasource"
                  align="center"
                  :sortable="true"
                  sort-by="name"
                  :min-width="30"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.refDataSource }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Type" align="center" :min-width="50">
                  <template slot-scope="{ row }">
                    <span>{{ row.agentType }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Name" align="center" :min-width="50">
                  <template slot-scope="{ row }">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-card>
        </el-tab-pane>
        <!-- ON DEMAND TABLE -->
        <el-tab-pane
          label="ON DEMAND"
          name="ondemandTab"
          :key="refreshAgentsTable"
        >
          <el-card class="box-card">
            <div class="filter-container">
              <el-input
                v-model="ondemandSearchText"
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
                @click="getOnDemandAgents"
              />
            </div>
            <el-row style="background: #fff; margin-bottom: 30px">
              <!-- TABLE AGENTS PUB-SUB -->
              <el-table
                :key="onDemandAgentsTableKey"
                v-loading="onDemandAgentsLoading"
                :data="filteredOnDemandAgentsByPagination"
                border
                fit
                style="width: 100%"
              >
                <el-table-column
                  label="Datasource"
                  align="center"
                  :sortable="true"
                  sort-by="name"
                  :min-width="30"
                >
                  <template slot-scope="{ row }">
                    <span>{{ row.refDataSource }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Type" align="center" :min-width="50">
                  <template slot-scope="{ row }">
                    <span>{{ row.agentType }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Name" align="center" :min-width="50">
                  <template slot-scope="{ row }">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="closeAgentsAsociated()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on
import JsonEditor from "@/components/JsonEditor";
import { getORIONEntitiesByType, checkORIONAgentsAsociated } from "@/api/orion_API";

/* Sin usar de momento*/
/* import dataportsConstants from '@/utils/constants'; */

export default {
  name: "DatasourceList",
  components: { JsonEditor, Pagination },
  directives: { waves },
  data() {
    return {
      bgc: {
        backgroundColor: "rgb(240,242,245)",
        height: "100%",
        width: "100%"
      },
      listQuery: {
        categorySelected: "",
        page: 1,
        limit: 5,
        id: undefined
      },
      pubsubQuery: {
        categorySelected: "",
        page: 1,
        limit: 5,
        id: undefined
      },
      ondemandQuery: {
        categorySelected: "",
        page: 1,
        limit: 5,
        id: undefined
      },
      listLoading: true,
      pubSubAgentsLoading: true,
      onDemandAgentsLoading: true,
      searchText: "",
      pubsubSearchText: "",
      ondemandSearchText: "",
      list: [],
      pubsubList: [],
      ondemandList: [],
      total: 0,
      pubsubAgentsTotal: 0,
      ondemandAgentsTotal: 0,
      viewDatamodelDetailsDialog: false,
      viewAgentsDialog: false,
      datamodelDetails: null,
      requiredText: "",
      tableKey: 0,
      pubSubAgentsTableKey: 0,
      onDemandAgentsTableKey: 0,
      refreshAgentsTable: 0,
      disableButtons: false,
      mainTab: "pubsubTab",
      datasourceId: ''
    };
  },
  computed: {
    metadataInformation() {
      return metadata;
    },
    // TABLA DATASOURCE
    filteredDatasourceByPagination() {
      const page = this.listQuery.page;
      const limit = this.listQuery.limit;

      if (
        Math.ceil(this.filteredDatasourceBySearchTextLength / limit) >= page
      ) {
        return this.filteredDatasourceBySearchText.slice(
          (page - 1) * limit,
          page * limit
        );
      } else {
        return this.filteredDatasourceBySearchText.slice(0, limit);
      }
    },

    filteredDatasourceBySearchTextLength() {
      return this.filteredDatasourceBySearchText.length;
    },

    filteredDatasourceBySearchText() {
      return this.list.filter(dataSource =>
        dataSource.id
          .toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    },

    // TABLA PUBSUB
    filteredPubSubAgentsByPagination() {
      const page = this.pubsubQuery.page;
      const limit = this.pubsubQuery.limit;

      if (
        Math.ceil(this.filteredPubSubAgentBySearchTextLength / limit) >= page
      ) {
        return this.filteredPubSubAgentBySearchText.slice(
          (page - 1) * limit,
          page * limit
        );
      } else {
        return this.filteredPubSubAgentBySearchText.slice(0, limit);
      }
    },

    filteredPubSubAgentBySearchText() {
      return this.pubsubList.filter(pubSubAgent =>
        pubSubAgent.id
          .toString()
          .toLowerCase()
          .includes(this.pubsubSearchText.toLowerCase())
      );
    },

    filteredPubSubAgentBySearchTextLength() {
      return this.filteredPubSubAgentBySearchText.length;
    },

    // TABLA ON_DEMAND
    filteredOnDemandAgentsByPagination() {
      const page = this.ondemandQuery.page;
      const limit = this.ondemandQuery.limit;

      if (
        Math.ceil(this.filteredOnDemandAgentBySearchTextLength / limit) >= page
      ) {
        return this.filteredOnDemandAgentBySearchText.slice(
          (page - 1) * limit,
          page * limit
        );
      } else {
        return this.filteredOnDemandAgentBySearchText.slice(0, limit);
      }
    },

    filteredOnDemandAgentBySearchText() {
      return this.ondemandList.filter(onDemandAgent =>
        onDemandAgent.id
          .toString()
          .toLowerCase()
          .includes(this.ondemandSearchText.toLowerCase())
      );
    },

    filteredOnDemandAgentBySearchTextLength() {
      return this.filteredOnDemandAgentBySearchText.length;
    },

    getIdTableColumn() {
      return this.$t("datasourceList.idTableColumn");
    },

    getDatamodelsTableColumn() {
      return this.$t("datasourceList.datamodelsTableColumn");
    },

    getActionsTableColumn() {
      return this.$t("datasourceList.actionsTableColumn");
    }
  },

  watch: {
    lang() {
      this.commonTranslation();
    }
  },

  created() {
    this.getList();
    this.commonTranslation();
  },

  methods: {
    commonTranslation() {
      this.requiredText = " required";
    },

    async getList() {
      this.listQuery.categorySelected = this.category;
      this.listLoading = true;

      await getORIONEntitiesByType("DataSource").then(response => {
        this.list = response.message;
        console.log("ORION ENTITIES", this.list);
        this.total = this.list.length;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    async getPubSubAgents() {
      this.pubsubQuery.categorySelected = this.category;
      this.pubSubAgentsLoading = true;

      await checkORIONAgentsAsociated(this.datasourceId, 'AgentContainer').then(response => {
        this.pubsubList = response.message;
        console.log("PUB SUB AGENTS", this.pubsubList);
        this.pubsubAgentsTotal = this.pubsubList.length;
        setTimeout(() => {
          this.pubSubAgentsLoading = false;
        }, 1.5 * 1000);
      });
    },

    async getOnDemandAgents() {
      this.ondemandQuery.categorySelected = this.category;
      this.onDemandAgentsLoading = true;

      await checkORIONAgentsAsociated(this.datasourceId, 'AgentImage').then(response => {
        this.ondemandList = response.message;
        console.log("ON DEMAND AGENTS", this.ondemandList);
        this.ondemandAgentsTotal = this.ondemandList.length;
        setTimeout(() => {
          this.onDemandAgentsLoading = false;
        }, 1.5 * 1000);
      });
    },

    handleFilter() {},

    /* Inspeccionar agente */
    async inspectDatamodel(row) {
      this.datamodelDetails = row;
      this.viewDatamodelDetailsDialog = true;
    },

    closeInspectDatamodel() {
      this.datamodelDetails = "";
      this.viewDatamodelDetailsDialog = false;
    },

    async viewAgentsAsociated(row) {
      this.datasourceId = row.id;
      console.log(this.datasourceId)
      await this.getPubSubAgents();
      await this.getOnDemandAgents();
      this.viewAgentsDialog = true;
    },

    closeAgentsAsociated() {
      this.mainTab = "pubsubTab";
      this.datasourceId = '';
      this.viewAgentsDialog = false;
    }
  }
};
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
