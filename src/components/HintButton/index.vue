<template>
 <el-tooltip :content="title" placement="top-start">
    <el-button v-bind="$attrs" v-on="$listeners"/>
  </el-tooltip>
</template>

<script>
export default {
  name: '',
   props:['title'],
}
</script>

<style scoped>

</style>
