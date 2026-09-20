<template>
  <div class="iframe_container" style="height: calc(100vh - 50px); width: 100%">
    <iframe
      ref="myIframe"
      class="cmdb_iframe"
      :src="url"
      frameborder="0"
      scrolling="auto"
      allowfullscreen="true"
      v-if="url"
    ></iframe>
    <div v-else class="none">
      <a-empty />
    </div>
  </div>
</template>
<script>
export default {
  name: 'iframe',
  data() {
    return {
      url: sessionStorage.getItem('iframe_url'),
    }
  },
  created() {},

  methods: {},
}
</script>
<style scoped>
.cmdb_iframe {
  height: 100%;
  width: 100%;
}
.none {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
