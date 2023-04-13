<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  data() {
    return {
      flag: 1,
      gap_time: 0,
      beforeUnload_time: 0,

      showRouter: true
    };
  },
  methods: {
    beforeunloadHandler(e) {
      this._beforeUnload_time = new Date().getTime()
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },

    logout() {
      this.flag = 0;
      const data = window.sessionStorage.getItem("username");
      window.sessionStorage.clear();
      this.$axios({
        method: "POST",
        url: "/api/logout/",
        data: data,
      }).then((response) => {
        console.log(response.data);
      });
      this.$router.push("/login");
    },
    reload (){
      this.showRouter = false
      this.$nextTick(()=>{
        this.showRouter = true
      })
    }
  },



  mounted() {
    // 监听浏览器关闭
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
}
</script>

<style>

</style>
