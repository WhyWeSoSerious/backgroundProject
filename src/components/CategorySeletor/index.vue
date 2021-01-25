<template>
  <div>
          <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="changeCategory1">
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="changeCategory2">
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="changeCategory3">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
export default {
  name: "",
  //todo 存储
  data() {
    return {
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  //todo 初始化
  mounted() {
    this.getCategory1List();
  },
  methods: {
    //todo 发送获取
    async getCategory1List() {
      const result = await this.$API.category.getCategory1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    //todo 根据1获取2
    async changeCategory1(category1Id) {
      //todo 清空
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.category2List = [];
      this.category3List = [];

      this.$emit("changeCategory", { categoryId: category1Id, level: 1 });

      const result = await this.$API.category.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    //todo 根据2获取3
    async changeCategory2(category2Id) {
      this.cForm.category3Id = "";
      this.category3List = [];

      this.$emit("changeCategory", { categoryId: category2Id, level: 2 });

      const result = await this.$API.category.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
    //todo 传递到attr
     changeCategory3(category3Id){
      this.$emit('changeCategory',{categoryId:category3Id,level:3})
    } 
    
  },
};
</script>

<style scoped>
</style>
