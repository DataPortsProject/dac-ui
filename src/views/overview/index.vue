<template>
  <div class="app-container" :style="bgc">
    <div id="results">
      <!--inicio section-->
      <section class="content">

      </section>
    <!--fin section-->
    </div>

  </div>
</template>

<script>

export default {
  name: 'Overview',
  props: {},
  data() {
    return {
        bgc: {
            backgroundColor: 'rgb(240,242,245)',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            position: 'absolute'
        }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
