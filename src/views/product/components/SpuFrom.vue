<template>
  <div>
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          v-model="spuForm.description"
          placeholder="SPU描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- 
          :file-list="spuImageList"指定要展示的是哪个图片数组，收集也是收集在这个数组当中
          【{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}】你的图片必须有这两个字段，但是我们没有
        -->
        <!-- action="/dev-api/admin/product/fileUpload"和上传品牌接口是一样的 -->
        <!-- :on-remove="handleRemove"删除成功的回调，里面收集图片列表 -->
        <!-- :on-success="handleSuccess"上传成功的回调，里面也得收集图片列表 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="spuSaleAttrIdName"
          :placeholder="
            unUsedSpuSaleAttrList.length > 0
              ? `还有${unUsedSpuSaleAttrList.length}未选择`
              : '没有啦！！！'
          "
        >
          <el-option
            :label="unUsedSpuSaleAttr.name"
            :value="`${unUsedSpuSaleAttr.id}:${unUsedSpuSaleAttr.name}`"
            v-for="(unUsedSpuSaleAttr, index) in unUsedSpuSaleAttrList"
            :key="unUsedSpuSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!spuSaleAttrIdName"
          >添加销售属性</el-button
        >
        <el-table
          :data="spuForm.spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!--   -->
              <el-tag
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <!-- row.inputVisible是代表是否是编辑模式，我们这次是把这个值定义在属性身上
              之前我们的平台属性是把这个值定义在属性值身上
              因为现在我们每个属性当中所有的属性值都不能有自己的编辑模式和查看模式，而是每个属性有一个
              之前我们是每个属性值都有自己的编辑模式和查看模式 -->
              <!-- row.inputValue代表输入input后，输入的数据收集到哪里，我们先把收集的数据保存到当前属性身上
              后面失去焦点或者回车的时候，再从当前这个属性身上去拿 -->

              <!--   -->
              <!--   -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                placeholder="名称"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>

              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <!-- @click="spuForm.spuSaleAttrList.splice($index,1)" -->
            <template slot-scope="{ row, $index }">
              <!-- <el-popconfirm :title="`确定要删除${row.saleAttrName}吗？`" @onConfirm="spuForm.spuSaleAttrList.splice($index,1)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm> -->
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="spuForm.spuSaleAttrList.splice($index,1)"
              ></HintButton>
              <!-- <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="spuForm.spuSaleAttrList.splice($index,1)"
              ></el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
 
  data() {
    return {
      spuForm: {
       
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: "",

        spuImageList: [
         
        ],
        spuSaleAttrList: [
         
        ],
      },

      spuImageList: [],
      trademarkList: [], 
      baseSaleAttrList: [], 

      spuSaleAttrIdName: "", 

     
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
   
    handleRemove(file, fileList) {
      
      this.spuImageList = fileList;
    },
   
    handleSuccess(response, file, fileList) {
     
      this.spuImageList = fileList;
    },
   
    handlePictureCardPreview(file) {
      
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

   
    async initUpdateSpuFormData(spu) {
     
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 200) {
        this.spuForm = result.data;
      }
      
      const imgResult = await this.$API.sku.getSpuImageList(spu.id);
      if (imgResult.code === 200) {
        let spuImageList = imgResult.data;
        
        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });

        this.spuImageList = spuImageList;
      }
      
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
     
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
   
    async initAddSpuFormData() {
      
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
     
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
  
    addSaleAttr() {
    
      let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(":");
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuForm.spuSaleAttrList.push(obj);

      this.spuSaleAttrIdName = ""; 
    },
  
    showInput(row) {
 
      this.$set(row, "inputVisible", true);
   
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
  
    handleInputConfirm(row) {
     
      let saleAttrValueName = row.inputValue;

   
      if (saleAttrValueName.trim() === "") {
        row.inputValue = "";
        return;
      }

     

      let isRepeat = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName === saleAttrValueName
      );
      if (isRepeat) {
        this.$message.info("输入的属性值名称不能重复");
        row.inputValue = "";
        return;
      }

     
      let obj = {
        saleAttrValueName,
      };

   
      row.spuSaleAttrValueList.push(obj);

     
      row.inputValue = "";

    
      row.inputVisible = false;
    },
  },
  computed: {
  
    unUsedSpuSaleAttrList() {
     
      return this.baseSaleAttrList.filter((baseSaleAttr) =>
      
        this.spuForm.spuSaleAttrList.every(
          (spuSaleAttr) => baseSaleAttr.name !== spuSaleAttr.saleAttrName
        )
      );
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

