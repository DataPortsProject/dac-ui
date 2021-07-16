<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-input
        v-model="searchText"
        placeholder="Search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);"
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
      <el-button
        class="filter-item"
        style="float:right;"
        type="primary"
        @click="showDeleteAllNotifications"
      >
        {{ $t("overview.deleteAllNotifications") }}
      </el-button>
    </div>
    <el-row style="background:#fff;margin-bottom:30px;">
      <!-- NOTIFICATIONS TABLE -->
      <el-table
        v-loading="listLoading"
        :data="filteredImagesByPagination"
        border
        fit
        style="width: 100%"
      >

        <el-table-column
          :label="this.$t('overview.tableColumnContainerName')"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.$t('overview.tableColumnType')"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.$t('overview.tableColumnMessage')"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.message }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.$t('overview.tableColumnCreated')"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.$t('agentList.tableColumnActions')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button
              size="small"
              class="deleteBtn"
              @click="showDeleteNotificationDialog(row._id)"
            >
              <i class="el-icon-delete-solid">
                {{ $t("overview.deleteNotification") }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination
      v-show="filteredImagesBySearchTextLength > 0"
      :total="filteredImagesBySearchTextLength"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- DIALOG TO DELETE A NOTIFICATION -->
    <el-dialog
      :visible.sync="deleteNotificationDialog"
      width="20%"
      :title="this.$t('overview.deleteNotificationDialogTitle')"
    >
      <div>
        <span style="padding: 10px;">
          {{ $t('overview.deleteNotificationDialogQuestion') }}
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteNotification()">
          {{ $t("common.delete") }}
        </el-button>
        <el-button type="success" @click="hideDeleteNotificationDialog()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- DIALOG TO DELETE ALL NOTIFICATIONS -->
    <el-dialog
      :visible.sync="deleteAllNotificationDialog"
      width="20%"
      :title="this.$t('overview.deleteAllNotificationDialogTitle')"
    >
      <div>
        <span style="padding: 10px;">
          {{ $t('overview.deleteAllNotificationDialogQuestion') }}
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteAllNotifications()">
          {{ $t("common.delete") }}
        </el-button>
        <el-button type="success" @click="hideDeleteAllNotifications()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on

import { getNotificationsList, deleteNotificationById } from '@/api/notifications_API'

// import dataportsConstants from '@/utils/constants'

export default {
  name: 'NotificationList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%'
      },
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined
      },
      listLoading: true,
      searchText: '',
      list: [],
      total: 0,
      requiredText: '',
      deleteNotificationDialog: false,
      notificationToDelete: '',
      deleteAllNotificationDialog: false
    }
  },
  computed: {
    filteredImagesByPagination() {
      const page = this.listQuery.page
      const limit = this.listQuery.limit

      if (Math.ceil(this.filteredImagesBySearchTextLength / limit) >= page) {
        return this.filteredImagesBySearchText.slice(
          (page - 1) * limit,
          page * limit
        )
      } else {
        return this.filteredImagesBySearchText.slice(0, limit)
      }
    },
    filteredImagesBySearchText() {
      // return this.list.filter(img => img.RepoTags[0].toLowerCase().includes(this.searchText.toLowerCase()))
      return this.list.filter(notif =>
        notif.type.toLowerCase().includes(this.searchText.toLowerCase())
      )
    },

    filteredImagesBySearchTextLength() {
      return this.filteredImagesBySearchText.length
    }

  },
  watch: {
    lang() {
      this.commonTranslation()
    }
  },

  mounted() {
    this.getList()
  },

  created() {
    this.getList()
    this.commonTranslation()
  },

  methods: {

    commonTranslation() {
      this.requiredText = ' ' + this.$t('common.required')
    },

    getList() {
      this.listLoading = true
      getNotificationsList().then(response => {
        console.log('NOTIFICATIONS ->', response)
        this.list = response.message
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    handleFilter() {},

    formatDate(data) {
      // console.log(data)
      // var d = new Date(data).toUTCString()
      // console.log(d)
      var date = new Date(data).toISOString().split('T')[0]
      var time = new Date(data).toISOString().split('T')[1]
      time = time.split('.')[0]

      return date + ' ' + time
    },

    showDeleteNotificationDialog(id) {
      console.log(id)
      this.deleteNotificationDialog = true
      this.notificationToDelete = id
    },

    showDeleteAllNotifications() {
      this.deleteAllNotificationDialog = true
    },

    hideDeleteAllNotifications() {
      this.deleteAllNotificationDialog = false
    },

    deleteAllNotifications() {
      var data = {
        all: true
      }
      deleteNotificationById('1', data)
        .then(response => {
          this.getList()
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('overview.deletedNotifications'),
            type: 'success',
            duration: 2000
          })
          this.deleteAllNotificationDialog = false
        })
        .catch(error => {
          this.$notify({
            title: this.$t('common.error'),
            message: error,
            type: 'error',
            duration: 2000
          })
          this.deleteAllNotificationDialog = false
        })
    },

    deleteNotification() {
      var data = {
        all: false
      }
      deleteNotificationById(this.notificationToDelete, data)
        .then(response => {
          this.getList()
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('overview.deletedNotification'),
            type: 'success',
            duration: 2000
          })
          this.notificationToDelete = ''
          this.deleteNotificationDialog = false
        })
        .catch(error => {
          this.$notify({
            title: this.$t('common.error'),
            message: error,
            type: 'error',
            duration: 2000
          })
          this.notificationToDelete = ''
          this.deleteNotificationDialog = false
        })
    },

    hideDeleteNotificationDialog() {
      this.deleteNotificationDialog = false
      this.notificationToDelete = ''
    }

  }
}
</script>

<style lang="scss" scoped>
.testBtn {
  color: #fff;
  background-color: #409167;
  border-color: #409167;
}
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
.requiredProperties {
  color: red;
  padding-bottom: 20px;
}
</style>
