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
        :data="filteredSubscriptionsByPagination"
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
          :label="getSubjectTableColumn"
          align="center"
          :min-width="30"
        >
          <template slot-scope="{ row }">
            <span>{{ row.subject.entities[0].id ? row.subject.entities[0].id : row.subject.entities[0].type ? row.subject.entities[0].type : row.subject.entities[0].idPattern ? row.subject.entities[0].idPattern : row.subject.entities[0].typePattern ? row.subject.entities[0].typePattern : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="getStatusTableColumn"
          align="center"
          :min-width="30"
        >
          <template slot-scope="{ row }">
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :min-width="40"
          :label="getActionsTableColumn"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <!-- Inspect agent -->
            <el-button
              size="small"
              class="editBtn"
              @click="inspectSubscription(row)"
              :disabled="disableButtons"
            >
              <i class="el-icon-edit">{{
                $t("subscriptionList.inspectSubscription")
              }}</i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination
      v-show="filteredSubscriptionsBySearchTextLength > 0"
      :total="filteredSubscriptionsBySearchTextLength"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- DIALOG TO SHOW THE JSON METADATA -->
    <el-dialog
      :visible.sync="viewSubscriptionsDetailsDialog"
      width="80%"
      :title="$t('subscriptionList.viewInspectDatamodel')"
    >
      <el-card class="box-card">
        <json-editor ref="jsonMetadata" v-model="subscriptionDetails" />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="closeInspectSubscription()">
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
import { getORIONSubscriptions } from "@/api/orion_API";

/* Sin usar de momento*/
/* import dataportsConstants from '@/utils/constants'; */

export default {
  name: "SubscriptionList",
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
      listLoading: true,
      searchText: "",
      list: [],
      total: 0,
      viewSubscriptionsDetailsDialog: false,
      subscriptionDetails: null,
      requiredText: "",
      tableKey: 0,
      disableButtons: false
    };
  },
  computed: {
    metadataInformation() {
      return metadata;
    },

    filteredSubscriptionsByPagination() {
      const page = this.listQuery.page;
      const limit = this.listQuery.limit;

      if (
        Math.ceil(this.filteredSubscriptionsBySearchTextLength / limit) >= page
      ) {
        return this.filteredDatasourceBySearchText.slice(
          (page - 1) * limit,
          page * limit
        );
      } else {
        return this.filteredDatasourceBySearchText.slice(0, limit);
      }
    },

    filteredDatasourceBySearchText() {
      return this.list.filter(dataSource =>
        dataSource.id
          .toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    },

    filteredSubscriptionsBySearchTextLength() {
      return this.filteredDatasourceBySearchText.length;
    },

    getSubjectColumnVale(data) {
      return data.id ? data.id : data.type ? data.type : data.idPattern ? data.idPattern : data.typePattern ? data.typePattern : '';
    },

    getIdTableColumn() {
      return this.$t("subscriptionList.idTableColumn");
    },

    getSubjectTableColumn() {
      return this.$t("subscriptionList.subjectTableColumn");
    },

    getStatusTableColumn() {
      return this.$t("subscriptionList.statusTableColumn");
    },

    getActionsTableColumn() {
      return this.$t("subscriptionList.actionsTableColumn");
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

      await getORIONSubscriptions().then(response => {
        this.list = response.message;
        console.log("SUBSCRIPTIONS", this.list);
        this.total = this.list.length;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    handleFilter() {},

    /* Inspeccionar agente */
    async inspectSubscription(row) {
      this.subscriptionDetails = row;

      this.viewSubscriptionsDetailsDialog = true;
    },

    closeInspectSubscription() {
      this.subscriptionDetails = '';
      this.viewSubscriptionsDetailsDialog = false;
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
