<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-input v-model="searchText" placeholder="Search" style="width: 200px" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="
                          margin-left: 10px;
                          border-color: #1890ff;
                          color: #1890ff;
                          background-color: rgb(240, 242, 245);
                        " icon="el-icon-search" @click="handleFilter">
        <span class="font-class">
          {{ $t("models.search") }}
        </span>
      </el-button>
      <el-button v-waves class="filter-item" style="
                          margin-left: 10px;
                          border-color: #1890ff;
                          color: #1890ff;
                          background-color: rgb(240, 242, 245);
                        " icon="el-icon-refresh" @click="getList" />
      <el-button class="filter-item" style="float: right" type="primary" @click="developAgent">
        <span class="font-class">
          {{ $t("agentList.downloadTemplate") }}
        </span>
      </el-button>

      <!-- <el-button
                  class="filter-item"
                  style="float: right"
                  type="primary"
                  icon="el-icon-plus"
                  @click="openImportImageDialog()"
                >
                  {{ $t("agentList.addImage") }}
                </el-button> -->

    </div>
    <el-row style="background: #fff; margin-bottom: 30px">
      <!-- IMAGE TABLE -->
      <el-table v-loading="listLoading" :data="filteredImagesByPagination" border fit style="width: 100%">
        <el-table-column :label="this.$t('agentList.tableColumnName')" align="center" :sortable="true" sort-by="name">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('agentList.tableColumnTag')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.tag }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('agentList.tableColumnType')" align="center">
          <template slot-scope="{ row }">
            <span>{{
              row.type === "on_demand"
              ? "ON DEMAND"
              : row.type === "publish-subscribe"
                ? "PUBLISH-SUBSCRIBE"
                : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('agentList.tableColumnActions')" align="center"
          class-name="small-padding fixed-width">
          <!-- v-if="row.type !== 'on_demand'" -->
          <template slot-scope="{ row }">
            <el-button v-if="row.type !== 'on_demand'" size="small" class="editBtn" @click="startAgent(row, false)">
              <i class="el-icon-edit">
                <span class="font-class">{{
                  $t("agentList.createInstance")
                }}</span>
              </i>
            </el-button>
            <el-button v-if="row.type == 'on_demand' && show_Test_On_Demand" size="small" class="testBtn"
              @click="startAgent(row, true)">
              <i class="el-icon-s-platform">
                {{ $t("agentList.testAgent") }}
              </i>
            </el-button>

            <span style="padding-left: 20px" />
            <el-button size="small" class="deleteBtn" @click="showDeleteDialog(row.Id)">
              <i class="el-icon-delete-solid">
                <span class="font-class">{{
                  $t("agentList.deleteImage")
                }}</span>
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredImagesBySearchTextLength > 0" :total="filteredImagesBySearchTextLength"
      :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- DIALOG TO START AN AGENT -->
    <el-dialog :visible.sync="startAgentDialog" :title="this.$t('agentList.startAgentDialogTitle')">
      <el-form ref="initialTemplate" :rules="rules" :model="initialTemplate" label-position="left" label-width="70px"
        style="margin-left: 50px">
        <div v-if="initialTemplate.env.length > 0">
          <!-- Nombre imagen -->
          <el-form-item v-if="initialTemplate.Image" :label-width="label_widthColumn" :label="initialTemplate.Image.name">
            <el-input v-model="initialTemplate.Image.value" disabled style="width: 80%" />
          </el-form-item>

          <!-- Nombre contenedor -->
          <el-form-item v-if="initialTemplate.ContainerName" :label-width="label_widthColumn"
            :label="initialTemplate.ContainerName.name" prop="ContainerName.value" :rules="{
              required: true,
              message: initialTemplate.ContainerName.name + requiredText,
              trigger: 'blur',
            }">
            <el-input v-model="initialTemplate.ContainerName.value"
              :placeholder="$t('agentList.containerName_characteristics')"
              :disabled="initialTemplate.ContainerName.disabled" style="width: 80%" />
            <!-- :rules="{ required: true, pattern: '/?[a-zA-Z0-9_-]+', message: 'No valid', trigger: 'blur' }" -->
          </el-form-item>
          <div v-for="(item, indexTemplate) in initialTemplate.env" :key="indexTemplate">
            <div v-if="item.type === 'string' && item.name === 'CALLBACK_URL'">
              <el-form-item :label-width="label_widthColumn" :label="item.name" :prop="'env.' + indexTemplate + '.value'"
                :rules="{
                  required: true,
                  message: item.name + requiredText,
                  trigger: 'blur',
                }">
                <el-input v-model="initialTemplate.env[indexTemplate].value" :disabled="item.disabled"
                  style="width: 80%" />
                <div v-if="isOnDemand" class="requiredProperties">
                  {{ callback_url_set }}
                </div>
              </el-form-item>
            </div>

            <div v-if="item.type === 'string' && item.name != 'CALLBACK_URL'">
              <el-form-item v-if="item.required" :label-width="label_widthColumn" :label="item.name"
                :prop="'env.' + indexTemplate + '.value'" :rules="{
                  required: true,
                  message: item.name + requiredText,
                  trigger: 'blur',
                }">
                <el-input v-model="initialTemplate.env[indexTemplate].value" :disabled="item.disabled"
                  style="width: 80%" />
              </el-form-item>
              <el-form-item v-else :label-width="label_widthColumn" :label="item.name"
                :prop="'env.' + indexTemplate + '.value'">
                <el-input v-model="initialTemplate.env[indexTemplate].value" :disabled="item.disabled"
                  style="width: 80%" />
              </el-form-item>
            </div>
            <div v-if="item.type === 'number'">
              <el-form-item v-if="item.required" :label-width="label_widthColumn" :label="item.name"
                :prop="'env.' + indexTemplate + '.value'" :rules="{
                  required: true,
                  message: item.name + requiredText,
                  trigger: 'blur',
                }">
                <el-input-number v-model.number="initialTemplate.env[indexTemplate].value" :min="1" style="width: 80%" />
              </el-form-item>
            </div>
            <div v-if="item.type === 'agent_type' || item.type === 'time_unit'">
              <el-form-item v-if="item.required" :label-width="label_widthColumn" :label="item.name"
                :prop="'env.' + indexTemplate + '.value'" :rules="{
                  required: true,
                  message: item.name + requiredText,
                  trigger: 'change',
                }">
                <el-select v-if="item.type === 'agent_type'" v-model="initialTemplate.env[indexTemplate].value"
                  placeholder="Choose an option" style="width: 80%">
                  <el-option v-for="register in AgentTypes" :key="register.value" :label="register.label"
                    :value="register.value" />
                </el-select>
                <el-select v-if="item.type === 'time_unit'" v-model="initialTemplate.env[indexTemplate].value"
                  placeholder="Choose an option" style="width: 80%">
                  <el-option v-for="register in TimeUnit" :key="register.value" :label="register.label"
                    :value="register.value" />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div v-if="isOnDemand" class="requiredProperties">
            {{ $t("agentList.forTestOnly") }}
          </div>
        </div>
        <div v-else class="noParameters">
          {{ $t("agentList.noParameters") }}

          <!--{{ addDefaultValues() }}-->

          <!-- Nombre imagen -->
          <el-form-item v-if="initialTemplate.Image" :label-width="label_widthColumn" :label="initialTemplate.Image.name">
            <el-input v-model="initialTemplate.Image.value" disabled style="width: 80%" />
          </el-form-item>

          <!-- Nombre contenedor -->
          <el-form-item v-if="initialTemplate.ContainerName" :label-width="label_widthColumn"
            :label="initialTemplate.ContainerName.name" prop="ContainerName.value" :rules="{
              required: true,
              message: initialTemplate.ContainerName.name + requiredText,
              trigger: 'blur',
            }">
            <el-input v-model="initialTemplate.ContainerName.value"
              :placeholder="$t('agentList.containerName_characteristics')"
              :disabled="initialTemplate.ContainerName.disabled" style="width: 80%" />
            <!-- :rules="{ required: true, pattern: '/?[a-zA-Z0-9_-]+', message: 'No valid', trigger: 'blur' }" -->
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeAgentDialog()">
          {{ $t("common.cancel") }}
        </el-button>
        <el-button type="success" @click="runAgent('initialTemplate')">
          {{ $t("common.accept") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- TODO: DIALOG TO ADD A NEW IMAGE -->
    <!-- <el-dialog
                :title="$t('agentList.addImageTitle')"
                :visible.sync="importImageDialog"
                width="60%"
                hide-overlay
                transition="dialog-bottom-transition"
                @close="closeImportImageDialog()"
              >
                <el-form
                  ref="dataImageForm"
                  :rules="getImportImageRules"
                  :model="dataImageForm"
                  label-position="left"
                  label-width="70px"
                  style="margin-left: 50px"
                >
                  <el-row align="center">
                    -- URL del repositorio
                    <el-form-item
                      :label-width="label_widthColumn"
                      :label="$t('agentList.addImageDialogUrl')"
                      prop="url"
                    >
                      <el-input
                        ref="url"
                        v-model="dataImageForm.url"
                        style="width: 100%"
                      />
                    </el-form-item>
                    <el-form-item
                      :label-width="label_widthColumn"
                      :label="$t('agentList.addImageDialogProjectId')"
                      prop="projectId"
                    >
                      <el-input
                        ref="projectId"
                        v-model="dataImageForm.projectId"
                        style="width: 100%"
                      />
                    </el-form-item>
                    <el-form-item
                      :label-width="label_widthColumn"
                      :label="$t('agentList.addImageDialogRepositoryUrl')"
                      prop="repositoryUrl"
                    >
                      <el-input
                        ref="repositoryUrl"
                        v-model="dataImageForm.repositoryUrl"
                        style="width: 100%"
                      />
                    </el-form-item>
                    <el-form-item
                      :label-width="label_widthColumn"
                      :label="$t('agentList.addImageDialogUser')"
                      prop="user"
                    >
                      <el-input
                        ref="user"
                        v-model="dataImageForm.user"
                        style="width: 100%"
                      />
                    </el-form-item>
                    <el-form-item
                      :label-width="label_widthColumn"
                      :label="$t('agentList.addImageDialogAccessToken')"
                      prop="accessToken"
                    >
                      <el-input
                        ref="accessToken"
                        v-model="dataImageForm.accessToken"
                        style="width: 100%"
                        type="password"
                      />
                    </el-form-item>

                    -- Boton para traerse las imagenes
                    <el-button
                      :disabled="
                        !dataImageForm.url ||
                        !dataImageForm.user ||
                        !dataImageForm.accessToken ||
                        !dataImageForm.repositoryUrl ||
                        !dataImageForm.projectId
                      "
                      type="success"
                      style="float: right"
                      @click="getImagesAvailable()"
                    >
                      {{ $t("agentList.connect") }}
                    </el-button>
                    <br />
                    <br />
                    <br />
                    -- Imagenes disponibles
                    <el-form-item
                      v-if="dataImageForm.imagesAvailable.length > 0"
                      :label-width="label_widthColumn"
                      :label="$t('agentList.addImageDialogNameImage')"
                      prop="imageName"
                    >
                      -- :disabled="dataImageForm.imagesAvailable.length > 0"
                      <el-select
                        v-model="dataImageForm.imageSelected"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="image in dataImageForm.imagesAvailable"
                          :key="image.id"
                          :label="image.name"
                          :value="image.location"
                        />
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="danger"
                    :disabled="downloading"
                    :loading="downloading"
                    @click="closeImportImageDialog()"
                  >
                    {{ $t("common.cancel") }}
                  </el-button>
                  <el-button
                    :disabled="
                      !dataImageForm.imageSelected ||
                      dataImageForm.imageSelected === '' ||
                      downloading
                    "
                    type="success"
                    :loading="downloading"
                    @click="importImage()"
                  >
                    {{ $t("common.import") }}
                  </el-button>
                </div>
              </el-dialog> -->

    <!-- DIALOG TO DEVELOP / CREATE AN AGENT (WIZARD) -->
    <el-dialog :title="dialogTitleCreateAgent" :visible.sync="dialogFormCreateAgentVisible" @close="handleClose_Wizard">
      <el-container>
        <el-header height="100px">
          <el-steps :active="activeStepWizard" finish-status="success" :align-center="true" style="margin-top: 20px">
            <el-step :title="$t('agentList.selectDatasource')" />
            <el-step :title="$t('agentList.typeAgent')" />
            <el-step :title="$t('agentList.Selectdatamodel')" />
            <el-step :title="$t('agentList.configuration')" />
          </el-steps>
        </el-header>

        <el-main>
          <el-row v-if="activeStepWizard == 0">
            <el-col :span="24">
              <el-row :gutter="20">
                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="(selectDataSource = 'agent-api'), (idTypeAgent = 2)">
                    <el-card header="API CALLER " :class="{
                      'selected-card': selectDataSource == 'agent-api',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_api_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                      <el-tag size="mini" :color="'#f44336'" effect="light" class="el-tag-white">
                        O - D
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="
                    (selectDataSource = 'agent-local-txt'), (idTypeAgent = 1)
                  ">
                    <el-card header="LOCAL TXT FILE" :class="{
                      'selected-card': selectDataSource == 'agent-local-txt',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_local_txt_file_agentType") }}
                      <el-tag size="mini" :color="'#f44336'" effect="light" class="el-tag-white">
                        O - D
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="
                    (selectDataSource = 'agent-local-excel'),
                    (idTypeAgent = 2)
                  ">
                    <el-card header="LOCAL EXCEL FILE" :class="{
                      'selected-card':
                        selectDataSource == 'agent-local-excel',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_local_excel_file_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                      <el-tag size="mini" :color="'#f44336'" effect="light" class="el-tag-white">
                        O - D
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="
                    (selectDataSource = 'agent-mqtt-listener'),
                    (idTypeAgent = 0)
                  ">
                    <el-card header="MQTT LISTENER" :class="{
                      'selected-card':
                        selectDataSource == 'agent-mqtt-listener',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_mqtt_listener_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="
                    (selectDataSource = 'agent-api-listener'),
                    (idTypeAgent = 0)
                  ">
                    <el-card header="API LISTENER" :class="{
                      'selected-card':
                        selectDataSource == 'agent-api-listener',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_api_listener_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="
                    (selectDataSource = 'agent-rabbitMQ-listener'),
                    (idTypeAgent = 0)
                  ">
                    <el-card header="RABBITMQ LISTENER" :class="{
                      'selected-card':
                        selectDataSource == 'agent-rabbitMQ-listener',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_rabbitMQ_listener_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="
                    (selectDataSource = 'agent-management'), (idTypeAgent = 0)
                  ">
                    <el-card header="Posidonia Management" :class="{
                      'selected-card': selectDataSource == 'agent-management',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_posmgt_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="
                    (selectDataSource = 'agent-operations'), (idTypeAgent = 0)
                  ">
                    <el-card header="Posidonia Operations" :class="{
                      'selected-card': selectDataSource == 'agent-operations',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_posops_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8" style="margin-bottom: 5px">
                  <div @click="(selectDataSource = 'agent-pcs'), (idTypeAgent = 0)">
                    <el-card header="Posidonia PCS" :class="{
                      'selected-card': selectDataSource == 'agent-pcs',
                    }" shadow="hover" center>
                      {{ $t("wizard.description_pospcs_agentType") }}
                      <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
                        P / S
                      </el-tag>
                    </el-card>
                  </div>
                </el-col>

                <!--<el-col :span="8">
                            <div @click="selectDataSource = 'agent-ftp'">
                              <el-card
                                header="FTP"
                                :class="{
                                  'selected-card': selectDataSource == 'agent-ftp'
                                }"
                                shadow="hover"
                                center
                              >
                                Connector / Agent whose data source will be files hosted
                                on a FTP
                              </el-card>
                            </div>
                          </el-col>-->
                <!--<el-col :span="8">
                            <div @click="selectDataSource = 'agent-file'">
                              <el-card
                                header="CSV File"
                                :class="{
                                  'selected-card': selectDataSource == 'agent-file'
                                }"
                                shadow="hover"
                                center
                              >
                                Connector / Agent whose data source will be a csv file
                              </el-card>
                            </div>
                          </el-col>-->
              </el-row>
            </el-col>
            <el-tag size="mini" :color="'#8BC34A'" effect="light" class="el-tag-white">
              P / S: Publish / Subscribe
            </el-tag>
            <el-tag size="mini" :color="'#f44336'" effect="light" class="el-tag-white">
              O - D: On-Demand
            </el-tag>
          </el-row>
          <el-row v-if="activeStepWizard == 1">
            <el-row :gutter="20">
              <el-col v-if="idTypeAgent == 0 || idTypeAgent == 2" :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeAgent = 'publish-subscribe'">
                  <el-card header="Subscription" shadow="always" :class="{
                    'selected-card': selectTypeAgent == 'publish-subscribe',
                  }">
                    {{ $t("agentList.publish_subscribeDescription") }}
                  </el-card>
                </div>
              </el-col>
              <el-col v-if="idTypeAgent == 1 || idTypeAgent == 2" :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeAgent = 'on-demand'">
                  <el-card header="On Demand" shadow="always"
                    :class="{ 'selected-card': selectTypeAgent == 'on-demand' }">
                    {{ $t("agentList.on_demandDescription") }}
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </el-row>

          <el-row v-if="activeStepWizard == 2">
            <el-row :gutter="20">
              <div v-if="dataModelsList.length > 0">
                <div v-for="(item, indexList) in dataModelsList" :key="indexList">
                  <el-col :xs="24" :sm="12" :lg="8">
                    <div @click="checkDataModelProperties(item)">
                      <el-card :header="item.name" shadow="always" :class="{
                        'selected-card': selectDataModel == item.link,
                      }">
                        {{ item.description }}
                      </el-card>
                    </div>
                  </el-col>
                </div>
              </div>
            </el-row>
          </el-row>

          <el-row v-if="activeStepWizard == 3">
            <!--Different forms to complete the configuration according the
                      datasource choosen and the type of agent-->
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form ref="templateForm" class="formulario" label-position="left" label-width="380px">
                  <el-form-builder ref="builder" :model="formValues" :config="
                    getFormPythonTemplate(selectDataSource, selectTypeAgent)
                  " label-width="190px" @input="dataChanged" />
                </el-form>
                <!-- start new change -->
                <div class="components-container">
                  <div class="editor-container">
                    <dnd-list :used-fields="emptyList" :available-fields="availableList"
                      :used-list-title="$t('wizard.selected_properties')"
                      :available-list-title="$t('wizard.datamodel_properties')" />
                  </div>
                </div>
                <!-- end new change -->
                <div v-if="requiredProperties.length > 0" style="display: none" class="requiredProperties">
                  {{ mandatoryProperties }}
                </div>
              </el-col>
            </el-row>
          </el-row>
        </el-main>
      </el-container>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="activeStepWizard < 1" @click="activeStepWizard--">
          {{ $t("common.previous") }}
        </el-button>
        <el-button v-if="activeStepWizard < 3" type="primary" :disabled="
          (activeStepWizard == 0 && !selectDataSource) ||
          (activeStepWizard == 1 && !selectTypeAgent) ||
          (activeStepWizard == 2 && !selectDataModel)
        " @click="obtainDataModel_Properties()">
          <!-- @click="activeStepWizard++" -->
          {{ $t("common.next") }}
        </el-button>
        <el-button v-else type="primary" :disabled="hasError" @click="createAgentTemplate()">
          {{ $t("common.download") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- DIALOG TO DELETE AN IMAGE -->
    <el-dialog :visible.sync="deleteDialog" width="20%" :title="this.$t('agentList.deleteImageDialogTitle')">
      <div>
        <span style="padding: 10px">
          {{ $t("agentList.deleteImageDialogQuestion") }}
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteImage()">
          {{ $t("common.delete") }}
        </el-button>
        <el-button type="success" @click="hideDeleteDialog()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- DIALOG PROGRESS BAR -->
    <el-dialog :visible.sync="progressDialog" width="40%" :title="this.$t('agentList.downloadingTemplate')">
      <el-progress :percentage="percentage" :color="customColors" />
    </el-dialog>
    <!-- END PROGRESS BAR -->
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on
import {
  getImages,
  getTemplate,
  deleteImageById,
  getDataSource, getImagesFromGitlab, downloadImage
} from "@/api/images_API";
import { createORIONEntities, getORIONEntitiesByType } from "@/api/orion_API";
import { createAgent } from "@/api/agents_API";
import { OnDemandAgent } from "@/api/onDemand";

import dataportsConstants from "@/utils/constants";
import {
  buildAgentImage,
  buildAgentContainer,
} from "@/utils/build_ORION_entities";

import {
  getAllPythonTemplates,
  getZIPTemplate,
} from "@/api/pythonTemplate_API";

import { getAllDataModels, getJsonSchema } from "@/api/dataModel";


const fs = require("fs");
const download = require("downloadjs");

import DndList from "@/components/DndList";

export default {
  name: "AgentList",
  components: { Pagination, DndList },
  directives: { waves },
  data() {
    return {
      bgc: {
        backgroundColor: "rgb(240,242,245)",
        height: "100%",
        width: "100%",
      },
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
      },
      listLoading: true,
      searchText: "",
      list: [],
      total: 0,
      startAgentDialog: false,
      dialogTitleCreateAgent: "",
      dialogFormCreateAgentVisible: false,
      activeStepWizard: 0,
      selectDataSource: null,
      selectTypeAgent: null,
      selectDataModel: null,
      initialTemplate: {
        env: [],
      },
      label_widthColumn: "150px",
      requiredText: "",
      rules: {},
      AgentTypes: dataportsConstants.agentType,
      TimeUnit: dataportsConstants.timeUnit,
      dialogAddImage_Visible: false,
      dataImageForm: {
        imageName: "",
        url: "",
        user: "",
        accessToken: "",
        projectId: "",
        privateRepository: false,
        imagesAvailable: [],
        imageSelected: "",
      },
      deleteDialog: false,
      imageToDelete: "",
      imageID: null,
      // Form builder --> Download Template
      formValues: null,
      formConfig: null,
      hasError: false,
      importImageDialog: false,
      // DndList
      emptyList: [],
      availableList: [],
      dataModelsList: [],
      isPrivateRepository_dataModel: false,
      requiredProperties: [],
      mandatoryProperties: "",
      jsonSchema: "",
      dataSourceSerialized: "",
      projectName_dataModel: "",
      dataModelType: "",
      selectedTemplate: null,
      downloading: false,
      isOnDemand: false,
      callback_url_set: "",
      progressDialog: false,
      percentage: 20,
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      random_ID: "",
      externalImage: false,
      idTypeAgent: null,
      show_Test_On_Demand: false,
    };
  },
  computed: {
    filteredImagesByPagination() {
      const page = this.listQuery.page;
      const limit = this.listQuery.limit;

      if (Math.ceil(this.filteredImagesBySearchTextLength / limit) >= page) {
        return this.filteredImagesBySearchText.slice(
          (page - 1) * limit,
          page * limit
        );
      } else {
        return this.filteredImagesBySearchText.slice(0, limit);
      }
    },
    filteredImagesBySearchText() {
      return this.list.filter((img) =>
        img.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    checkContainerName() {
      const containerName = this.initialTemplate.ContainerName.value;
      return containerName && (containerName !== "" || containerName !== " ")
        ? ""
        : `AGENT NAME ${this.requiredText}`;
    },

    filteredImagesBySearchTextLength() {
      return this.filteredImagesBySearchText.length;
    },
    getImportImageRules() {
      return {
        imageName: [
          {
            required: true,
            message: this.$t("common.required"),
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: this.$t("common.required"),
            trigger: "blur",
          },
        ],
        projectId: [
          {
            required: true,
            message: this.$t("common.required"),
            trigger: "blur",
          },
        ],
        accessToken: [
          {
            required: true,
            message: this.$t("common.required"),
            trigger: "blur",
          },
        ],
        user: [
          {
            required: true,
            message: this.$t("common.required"),
            trigger: "blur",
          },
        ],
        repositoryUrl: [
          {
            required: true,
            message: this.$t("common.required"),
            trigger: "blur",
          },
        ],
      };
    },
    // PROGRESS BAR
  },
  watch: {
    lang() {
      this.commonTranslation();
    },
  },

  mounted() {
    this.getList();
  },

  created() {
    this.getList();
    this.commonTranslation();
    this.getPythonTemplates();
    this.getDataModels();
  },

  methods: {
    commonTranslation() {
      this.requiredText = " " + this.$t("common.required");
    },

    addDefaultValues() {
      console.log("Estoy en addDefaultValues ");
      const env = [
        {
          disabled: false,
          name: "TIME_INTERVAL",
          required: true,
          type: "number",
          value: 0,
        },
        {
          disabled: false,
          name: "TIME_UNIT",
          required: true,
          type: "time_unit",
          value: "No Units",
        },
      ];

      this.initialTemplate.env = env;
    },

    addImage() {
      this.dialogAddImage_Visible = true;
      this.$nextTick(() => {
        this.$refs["dataImageForm"].clearValidate();
        this.$refs.imageName.focus(); // Put focus over the first input control
      });
    },

    showDeleteDialog(id) {
      this.deleteDialog = true;
      this.imageToDelete = id;
    },

    hideDeleteDialog() {
      this.deleteDialog = false;
      this.imageToDelete = "";
    },

    pullImage(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // pull the image from the docker registry
          console.log("Hago un pull de la imagen");

          // Oculto el modal
          this.dialogAddImage_Visible = false;

          // Debe comprobarse que se ha hecho el pull de forma correcta.

          // Recover ID of the image
          var id =
            "sha256:2a81e166f9c3b4255d86df325e01ec04bf3599ddbd49d9767d21dd48e8df3b2b";
          // call createEntities_To_ORION --> Insert AgentImage y DataSource
          this.createEntities_To_ORION(id, dataportsConstants.ON_DEMAND);
        }
      });
    },

    async createEntities_To_ORION(id, containerID, imageType) {
      let data;

      console.log("CREATE ENTITIES TO ORION");
      console.log(id);
      console.log(containerID);
      console.log(imageType);

      await getDataSource(id).then((response) => {
        data = response.message;
      });

      // this allows multiple datasources in defined in the same image
      const dataSourceObject = JSON.parse(data.dataSource)
      const dataSourceID = dataSourceObject.id;

      // Check image type!!
      // Si es on_demand
      if (imageType === dataportsConstants.ON_DEMAND) {
        // build entity AgentImage
        let entityAgentImage = buildAgentImage(
          data.Id,
          data.image,
          dataSourceID
        );
        // Send the entity AgentImage to ORION
        await createORIONEntities(entityAgentImage).then((response) => {
          console.log(response);
        });

        // Check if DataSource exists
        await getORIONEntitiesByType(dataportsConstants.DATA_SOURCE).then(
          (response) => {
            if (response.status === dataportsConstants.OK) {
              // He podido recuperar las datasources registradas en ORION
              // Voy a ver si la DataSource de mi AgentImage esta ya registrada o no
              let existDataSource = false;
              response.message.forEach((input) => {
                if (input.id === dataSourceID) {
                  existDataSource = true;
                }
              });
              if (!existDataSource) {
                // Insert DataSource
                createORIONEntities(dataSourceObject).then((response) => {
                  console.log(response);
                });
              }
            }
          }
        );
      } else if (imageType === dataportsConstants.PUBLISH_SUBSCRIBE) {
        // Si es pub-sub
        // Si no es ON DEMAND será PUBLISH - SUBSCRIBE
        // build entity AgentContainer
        console.log("Soy publish - subscribe");

        let entityAgentContainer = buildAgentContainer(
          data.Id,
          data.image,
          dataSourceID,
          containerID
        );
        console.log(entityAgentContainer);
        // Send the entity AgentContainer to ORION
        await createORIONEntities(entityAgentContainer).then((response) => {
          console.log("CREATE ENTITY TO ORION");
          console.log(response);
        });
        // Check if DataSource exists
        await getORIONEntitiesByType(dataportsConstants.DATA_SOURCE).then(
          (response) => {
            if (response.status === dataportsConstants.OK) {
              // He podido recuperar las datasources registradas en ORION
              // Voy a ver si la DataSource de mi AgentImage esta ya registrada o no
              let existDataSource = false;
              response.message.forEach((input) => {
                if (input.id === dataSourceID) {
                  existDataSource = true;
                }
              });
              if (!existDataSource) {
                // Insert DataSource
                createORIONEntities(dataSourceObject).then((response) => {
                  console.log(response);
                });
              }
            }
          });
      }
    },

    getList() {
      this.listLoading = true;
      getImages().then((response) => {
        console.log("IMAGES ->", response);
        this.list = response.message;
        this.total = this.list.length;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    getDataModels() {
      getAllDataModels().then((response) => {
        this.dataModelsList = response.message;
      });
    },

    handleFilter() { },

    runAgent(formName) {
      // Valido los campos obligatorios
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // FIXME: De momento hay un boton de refresco en el listado de agente
          // porque no se actualiza la lista, lo suyo sería lanzar algun evento que refresque
          // ese listado o algo por el estilo
          this.initialTemplate.ContainerName.value =
            this.initialTemplate.ContainerName.value.replace(/\s+/g, "");

          const agent = this.constructAgentObject(this.initialTemplate);

          if (this.isOnDemand) {
            // On-demand
            let envVariable = agent.Env[0];
            let itemEnvVariable = envVariable.split("=");
            let on_demandObject = {
              name: agent.ContainerName,
              image: agent.Image,
              environment: [
                {
                  key: itemEnvVariable[0],
                  value: itemEnvVariable[0],
                },
              ],
            };
            OnDemandAgent(on_demandObject).then(
              (_response) => {
                this.startAgentDialog = false;
                this.$notify({
                  title: this.$t("common.success"),
                  message: this.$t("agentList.agentCreated"),
                  type: "success",
                  duration: 2000,
                });
              },
              (error) => {
                this.startAgentDialog = false;
                this.$notify({
                  title: this.$t("common.error"),
                  message: error,
                  type: "error",
                  duration: 2000,
                });
              }
            );
          } else {
            // Publish Subscribe
            console.log("Voy a crear el agente");
            console.log(agent);
            createAgent(agent).then(
              (response) => {
                this.startAgentDialog = false;
                this.$notify({
                  title: this.$t("common.success"),
                  message: this.$t("agentList.agentCreated"),
                  type: "success",
                  duration: 2000,
                });
              },
              (error) => {
                this.startAgentDialog = false;
                this.$notify({
                  title: this.$t("common.error"),
                  message: error,
                  type: "error",
                  duration: 2000,
                });
              }
            );
          }
        } else {
          this.$notify({
            title: this.$t("common.error"),
            message: this.$t("common.reviewMandatoryFields"),
            type: "error",
            duration: 2000,
          });
        }
      });
    },

    constructAgentObject(data) {
      let agent = {
        ContainerName: data.ContainerName.value,
        Hostname: "",
        Domainname: "",
        User: "",
        Image: data.Image.value,
        Env: [],
      };

      data.env.forEach((e) => {
        const key = e.name;
        const value = e.value;
        agent.Env.push(`${key}=${value}`);
      });

      return agent;
    },

    buildCreatingAgent(template) {
      // var initialTemplate = []
      const environmentalVariables = {
        Image: {},
        ContainerName: {},
        env: [],
      };

      const imageName = {
        name: "IMAGE NAME",
        type: "string",
        value: template.image,
        required: false,
        disabled: true,
        variable: "image",
      };
      environmentalVariables.Image = imageName;

      const containerName = {
        name: "AGENT NAME",
        type: "string",
        value: "",
        required: true,
        disabled: false,
        variable: "name",
      };
      environmentalVariables.ContainerName = containerName;

      template.environment.forEach((input) => {
        const itemInput = JSON.parse(JSON.stringify(input));

        if (itemInput.key !== "RANDOM_ID") {
          // console.log(itemInput)
          let type = "";
          switch (itemInput.key) {
            case "TIME_INTERVAL":
              type = "number";
              break;
            case "AGENT_TYPE":
              type = "agent_type";
              break;
            case "TIME_UNIT":
              type = "time_unit";
              break;
            default:
              type = "string";
              break;
          }
          const itemOption = {
            name: itemInput.key,
            type: type,
            value: itemInput.value,
            required: true,
            disabled: false,
          };
          environmentalVariables.env.push(itemOption);
        }
      });

      // initialTemplate.push(environmentalVariables)
      this.initialTemplate = environmentalVariables;
      // console.log(this.initialTemplate)
    },

    deleteImage() {
      deleteImageById(this.imageToDelete)
        .then((response) => {
          this.getList();
          this.$notify({
            title: this.$t("common.success"),
            message: this.$t("agentList.deletedImage"),
            type: "success",
            duration: 2000,
          });
          this.imageToDelete = "";
          this.deleteDialog = false;
        })
        .catch((error) => {
          this.$notify({
            title: this.$t("common.error"),
            message: error,
            type: "error",
            duration: 2000,
          });
          this.imageToDelete = false;
          this.deleteDialog = false;
        });
    },

    startAgent(row, isOnDemand_Image) {
      this.imageID = row.Id;

      if (row.name.includes("external")) {
        this.externalImage = true;
      }
      if (isOnDemand_Image) {
        this.isOnDemand = true;
      } else {
        this.isOnDemand = false;
      }
      console.log("Is on Demand", this.isOnDemand);
      getTemplate(row.Id).then((response) => {
        // console.log('TEMPLATES')
        // console.log(response.message)
        const enviro = response.message.environment;
        enviro.forEach((prop) => {
          if (prop.key === "RANDOM_ID") {
            this.random_ID = prop.value;
          }
        });
        // console.log(this.random_ID)
        if (this.isOnDemand) {
          const environment = response.message.environment;
          environment.forEach((prop) => {
            if (prop.key === "CALLBACK_URL") {
              // console.log(prop.value)
              this.callback_url = prop.value;
              this.callback_url_set =
                this.$t("agentList.callback_url_set") + prop.value;
            }
          });
        }
        this.buildCreatingAgent(response.message);
        this.startAgentDialog = true;
      });
    },

    closeAgentDialog() {
      this.imageID = null;
      this.startAgentDialog = false;
    },

    developAgent() {
      // method to create a template for the agent, a dockerFile and a readme.txt file with the help of a Wizard
      this.dialogTitleCreateAgent = this.$t("agentList.createAgentDialogTitle");
      this.dialogFormCreateAgentVisible = true;
    },

    createAgentTemplate() {
      this.formValues.constants = this.selectedTemplate.constants; // this.formConfig[0].constants
      this.formValues.dockerFile = this.selectedTemplate.dockerFile;
      this.formValues.script = this.selectedTemplate.script;
      this.formValues.fieldsUsed_DataModel = this.emptyList;
      this.formValues.dataSourceSerialized = this.dataSourceSerialized;


      this.formValues.dataModelType = this.dataModelType;

      this.formValues.jsonSchema = this.jsonSchema;

      this.formValues.isPrivateRepository_dataModel =
        this.isPrivateRepository_dataModel;
      if (this.isPrivateRepository_dataModel) {
        // Privado
        const data = {
          projectName: this.projectName_dataModel,
          link: this.selectDataModel,
        };
        this.formValues.dataForPrivateRepository = data;
        this.formValues.urlPublicDataModel = "";
      } else {
        //Publico
        this.formValues.dataForPrivateRepository = "";
        this.formValues.urlPublicDataModel = this.selectDataModel;
      }

      this.percentage = 0;
      this.progressDialog = true;
      this.load();

      getZIPTemplate(this.formValues).then((response) => {
        this.percentage = 50;
        console.log("Returning zip with the templates!!");
        const fileName = `${Date.now()}.zip`;
        this.percentage = 80;
        download(response, fileName, "application/zip");
        this.percentage = 100;
        this.sleep(1500).then(() => {
          // Oculto el Wizard
          this.dialogFormCreateAgentVisible = false;
          this.resetWizard();
          this.progressDialog = false;
        });
      });
    },
    resetWizard() {
      this.activeStepWizard = 0;
      this.selectDataSource = "";
      this.selectTypeAgent = "";
      this.selectDataModel = "";
      this.emptyList = [];
      this.formValues = null;
    },
    // Before closing Wizard popup
    handleClose_Wizard(done) {
      this.resetWizard();
    },

    // Devuelve el template almacenado por source y type. Habra que agregar en el futuro el campo Data Model.
    getFormPythonTemplate(source, type) {
      this.selectedTemplate = [];
      for (let i = 0; i < this.formConfig.length; i++) {
        if (
          this.formConfig[i].source === source &&
          this.formConfig[i].type === type
        ) {
          this.selectedTemplate = this.formConfig[i];
          return this.formConfig[i].template;
        }
      }
    },
    // Recupero todas las templates almacenadas en MongoDB
    getPythonTemplates() {
      getAllPythonTemplates().then((response) => {
        this.formConfig = response.message;
        console.log("List Python templates");
        console.log(response.message);
      });
    },
    // valido los datos del ultimo paso del Wizard. Se validan en función de la template
    dataChanged(data) {
      this.formValues = data;
      if (this.$refs["builder"]) {
        this.$refs["builder"].$children[0].validate((valid) => {
          if (valid) {
            this.hasError = false;
          } else {
            this.hasError = true;
          }
        });
      }
    },
    // TODO: IMPORT NEW IMAGES
    openImportImageDialog() {
      /* getImagesFromGitlab().then(
        response => {
          this.dataImageForm.imagesAvailable = response.message;
          console.log(this.dataImageForm.imagesAvailable);
        },
        error => {
          console.log(error);
        }
      ); */
      this.importImageDialog = true;
    },

    closeImportImageDialog() {
      this.importImageDialog = false;
      this.dataImageForm = {
        imageName: "",
        url: "",
        user: "",
        accessToken: "",
        projectId: "",
        privateRepository: false,
        imagesAvailable: [],
        imageSelected: "",
      };
    },

    getImagesAvailable() {
      const body = {
        url: this.dataImageForm.url,
        user: this.dataImageForm.user,
        accessToken: this.dataImageForm.accessToken,
        projectId: this.dataImageForm.projectId,
        repositoryUrl: this.dataImageForm.repositoryUrl,
      };

      console.log("TESTINGGG --->", body);

      getImagesFromGitlab(body).then(
        (response) => {
          this.dataImageForm.imagesAvailable = response.message;
          console.log(this.dataImageForm.imagesAvailable);
        },
        (error) => {
          console.log(error);
        }
      );
    },

    async importImage() {
      this.downloading = true;
      console.log(this.dataImageForm.imageSelected);
      const body = {
        path: this.dataImageForm.imageSelected,
        repositoryUrl: this.dataImageForm.repositoryUrl,
        user: this.dataImageForm.user,
        accessToken: this.dataImageForm.accessToken,
      };

      await downloadImage(body).then(
        (response) => {
          console.log(response);
          this.downloading = false;
          this.getList();
          this.closeImportImageDialog();
          this.$notify({
            title: this.$t("common.success"),
            message: this.$t("agentList.imageImported"),
            type: "success",
            duration: 2000,
          });
        },
        (error) => {
          console.log(error);
          this.downloading = false;
          this.closeImportImageDialog();
          this.$notify({
            title: this.$t("common.error"),
            message: error,
            type: "error",
            duration: 2000,
          });
        }
      );
    },

    // Methods for DndList
    obtainDataModel_Properties() {
      if (this.activeStepWizard < 3) {
        this.activeStepWizard++;
      }

      if (this.activeStepWizard === 3) {
        // Vacio la lista de campos disponibles
        this.availableList = [];
        this.mandatoryProperties = "";
        this.jsonSchema = "";
        this.dataSourceSerialized = "";

        if (this.isPrivateRepository_dataModel) {
          console.log("PRIVATE REPOSITORY");
          // Personal access token: D3-5YV3H1Zk7heVsnzX7

          const data = {
            projectName: this.projectName_dataModel,
            link: this.selectDataModel,
          };

          getJsonSchema(data).then((response) => {
            this.jsonSchema = response.message;
            const properties = this.jsonSchema.allOf[this.jsonSchema.allOf.length - 1].properties;
            // console.log(properties)

            const items = [];

            for (const prop in properties) {
              // console.log(prop)
              const val = properties[prop];

              items.push({
                id: prop,
                name: val.type,
              });
            }

            this.availableList = items;
            this.build_region_requiredProperties(this.jsonSchema.required);
            this.dataSourceSerialized = this.buildDataSourceObject(
              items,
              false
            );
            // console.log(this.dataSourceSerialized)
          });
        } else {
          console.log("PUBLIC REPOSITORY");
          const url = this.selectDataModel;
          const settings = { method: "Get" };

          fetch(url, settings)
            .then((res) => res.json())
            .then((json) => {
              // console.log(json)
              this.jsonSchema = json;

              const items = this.jsonSchema.allOf.length;
              // console.log(items)
              const properties = this.jsonSchema.allOf[items - 1];

              // console.log(properties)
              this.availableList = this.obtainProperties_Schema(properties);
              this.build_region_requiredProperties(this.jsonSchema.required);
              this.dataSourceSerialized = this.buildDataSourceObject(
                properties,
                true
              );
              // console.log(this.dataSourceSerialized)
            });
        }
      }
    },

    recoverType_publicRepository(properties) {
      let type = "";
      for (const i in properties) {
        const val = properties[i];

        for (const j in val) {
          const sub_key = j;
          const sub_val = val[j];

          if (sub_key === "type") {
            type = sub_val.enum.toString();
          }
        }
      }
      return type;
    },

    buildDataSourceObject(properties, publicRepository) {
      console.log("build data source");
      let type = "";
      const values = {};
      if (publicRepository) {
        console.log("PUBLIC");
        type = this.recoverType_publicRepository(properties);

        this.availableList.forEach((prop) => {
          if (prop.id !== "type" && prop.name.type !== undefined) {
            values[prop.id] = prop.name.type;
          }
        });
        values["type"] = type;
      } else {
        // console.log(properties)
        console.log("PRIVATE");
        const splitted = [];
        splitted = this.selectDataModel.split("/");
        type = splitted[0];

        this.availableList.forEach((prop) => {
          if (prop.id !== "type") {
            values[prop.id] = prop.name;
          }
        });
        values["type"] = type;
      }
      this.dataModelType = type;

      return {
        id: "urn:ngsi-ld:DataSource:" + type,
        type: "DataSource",
        attributes: {},
        dataProvided: {
          type: "StructuredValue",
          value: values,
          metadata: {},
        },
        description: {
          type: "Text",
          value: type + " data source",
          metadata: {},
        },
        onChain: {
          type: "Boolean",
          value: false,
          metadata: {},
        },
        dataModels: {
          type: "Text",
          value: this.selectDataModel,
          metadata: {},
        },
      };
    },

    build_region_requiredProperties(requiredProperties) {
      this.requiredProperties = requiredProperties;

      let elements = "";
      this.requiredProperties.forEach((prop) => {
        if (elements === "") {
          elements = prop;
        } else {
          elements = elements + ", " + prop;
        }
      });
      // console.log(items)
      this.mandatoryProperties =
        this.$t("wizard.mandatoryProperties") + elements;
    },

    checkDataModelProperties(item) {
      this.selectDataModel = item.link;
      this.isPrivateRepository_dataModel = item.privateRepository;
      this.projectName_dataModel = item.projectName;
    },

    obtainProperties_Schema(schema) {
      const properties = [];
      for (const i in schema) {
        const val = schema[i];

        for (const j in val) {
          const sub_key = j;
          const sub_val = val[j];


          properties.push({
            id: sub_key,
            name: sub_val,
          });
        }
      }
      return properties;
    },
    // PROGRESS BAR
    load() {
      setTimeout(() => {
        this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      }, 0.5 * 750);
    },
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
  },
};
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

.el-tag-white {
  color: white;
}

.noParameters {
  font-weight: bold;
  text-align: center;
  white-space: pre;
}
</style>
