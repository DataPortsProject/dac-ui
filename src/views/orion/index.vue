<template>
  <div class="app-container" :style="bgc">
    <el-tabs type="border-card" dark slider-color="green" centered color="green">
      <el-tab-pane label="DATASOURCE">
        <DatasourceList />
      </el-tab-pane>
      <el-tab-pane label="SUBSCRIPTION">
        <SubscriptionList />
      </el-tab-pane>
    </el-tabs>
    <Footer />
  </div>
</template>

<script>
import DatasourceList from './component/datasourceList.vue';
import SubscriptionList from './component/subscriptionList.vue';
import Footer from '../footer/FooterComponent.vue';

export default {
  components: {
    DatasourceList,
    SubscriptionList,
    Footer
  },
  name: 'Orion',
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
