<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column label="序号" align="center" type="index" width="80">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        //todo 插槽     //todo index就是遍历品牌的下表
        <template slot-scope="{ row, $index }">
          
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
    
      <el-form :model="tmForm" :rules="rules" ref="tmForm" style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    //todo 表单验证
    let validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("长度必须是2到10之间"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      //todo 控制对话框显示
      dialogFormVisible: false,
      //todo 收集表单对象
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //todo 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },

          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [
          { required: true, message: "请选择上传图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    //todo 发请求获取品牌列表以及分页器翻页的回调
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    //todo 上传成功的回调
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    //todo 上传前的验证
    beforeAvatarUpload(file) {
      const typeArr = ["image/jpeg", "image/png"];
      const isJPGOrPNG = typeArr.indexOf(file.type) !== -1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式或者PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNG && isLt2M;
    },
    //todo 添加点击弹窗
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //todo 点击修改弹窗
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      this.tmForm = {
        ...row,
      };
    },
    //todo 点击确定发送
    addOrUpdate() {
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          let trademark = this.tmForm;
          try {
            const result = await this.$API.trademark.addOrUpdate(trademark);

            this.$message.success(
              trademark.id ? "修改品牌成功" : "添加品牌成功"
            );
            this.dialogFormVisible = false;
            this.getTrademarkList(trademark.id ? this.page : 1);
          } catch (error) {
            this.$message.success(
              trademark.id ? "修改品牌失败" : "添加品牌失败"
            );
          }
        } else {
          console.log("校验失败不提交");
          return false;
        }
      });
    },
    //todo 点击删除
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$API.trademark.delete(row.id);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            this.$message.error("删除品牌失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //todo  处理修改每页数量的回调函数
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
  },
};
</script>

<style  scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
