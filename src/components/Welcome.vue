<template>
  <div>
    <div class="home">
    <el-button style="margin-left: 120px" @click="toTask1">标注任务管理</el-button>
    <el-button @click="toProcess">病理图像标注</el-button>
    <el-button @click="toTask2">数据标注</el-button>
    <el-button @click="toProcess" style="margin-left: 120px">跨域数据对齐</el-button>
    <el-button @click="toFK">真菌性角膜炎标注预测</el-button>
    <el-button @click="toMulti">多眼病分类标注预测</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    toFK(){

      this.$router.push("/toFK")
    },
    toProcess(){
      this.$router.push("/mark4")
    },
    toMulti(){

      location.href="http://10.206.32.104:5001"
    },
    toTask1(){
      if(this.identity==1)
      this.$router.push("/task1")
      else
        this.$router.push("/task2")
    },
    toTask2(){

      this.$router.push("/select")
    },
  },
  mounted() {
    this.identity = window.sessionStorage.getItem("identity");
  }
};
</script>

<style>


.home .el-button {
  width:  400px;
  height: 100px;
  margin-left: 20px;
  margin-top: 25px;
}
</style>
