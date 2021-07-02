<template>
  <div>
    <div class="app-container" :style="bgc">
      <el-tabs type="border-card" dark slider-color="green" centered color="green">
        <el-tab-pane label="IMAGES">
          <AgentList />
        </el-tab-pane>
        <el-tab-pane label="INSTANCES">
          <ContainerList />
        </el-tab-pane>
      </el-tabs>
      <Footer />
    </div>
  </div>
</template>

<script>
import AgentList from './component/agentList.vue'
import ContainerList from './component/containerList.vue'
import Footer from '../footer/FooterComponent.vue'
export default {
  components: {
    AgentList,
    ContainerList,
    Footer
  },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      list: null
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
