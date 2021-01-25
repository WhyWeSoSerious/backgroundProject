<template>
  <div>
    <el-form :model="skuForm" label-width="100px">
      <el-form-item label="SPU 名称"> {{ spu.spuName }} </el-form-item>

      <el-form-item label="SKU 名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU 名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          v-model="skuForm.price"
          placeholder="SKU 价格"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuForm.weight"
          placeholder="SKU 重量"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          v-model="skuForm.skuDesc"
          placeholder="SKU 规格描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            v-for="(spuSaleAttr, index) in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-select
              v-model="spuSaleAttr.spuAttrIdValueId"
              placeholder="请选择"
            >
              <el-option
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                v-for="(
                  spuSaleAttrValue, index
                ) in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          :data="spuImageList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault === '0'"
                @click="setDefault(row)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  //todo 定义
  data() {
    return {
      skuForm: {
        tmId: "",
        category3Id: "",
        price: "",
        weight: "",
        skuName: "",
        skuDesc: "",
        skuDefaultImg: "",

        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: [],
       
      },
       spu: {},
        attrList: [],
        spuSaleAttrList: [],
        spuImageList: [], //用来展示所有的图片列表
        checkedImageList: [],
    };
  },
  methods: {
    //todo create
    async initAddSkuFormData(row, category1Id, category2Id) {
      this.spu = row;
       const promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      );
       const promise2 = this.$API.sku.getSpuSaleAttrList(row.id);
        const promise3 = this.$API.sku.getSpuImageList(row.id);
         const result = await Promise.all([promise1, promise2, promise3]);
      this.attrList = result[0].data;
      this.spuSaleAttrList = result[1].data;
      let spuImageList = result[2].data;
        spuImageList.forEach(item => item.isDefault = '0')
      this.spuImageList = spuImageList
    },
     handleSelectionChange(val) {
      // console.log(val)
      this.checkedImageList = val //收集图片列表到选中的图片数组当中，不是我们原始展示的数组
    },
     setDefault(row){
      //排它设置默认图片
      this.spuImageList.forEach(item => item.isDefault = '0')
      row.isDefault = '1'
      //一旦设置完默认图片，赶紧把默认图片的路径收集到位
      this.skuForm.skuDefaultImg = row.imgUrl
    }
  },
};
</script>