<template>
  <div>
    <el-form
      ref="queryFrom"
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
    >
      <el-form-item label="用户编号" prop="uid">
        <el-input v-model="queryForm.uid" placeholder="uid"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryForm.username"
          placeholder="username"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户状态" prop="isvalid">
        <el-select v-model="queryForm.isvalid" placeholder="isvalid">
          <el-option label="离职" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
          <el-option label="休假" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuerySubmit">查询</el-button>
        <el-button @click="resetForm()">重置</el-button>

        <el-button type="success" @click="addDialogOpen()">添加</el-button>
        <el-button
          type="warning"
          :disabled="btnStatus"
          @click="editDialogOpen()"
          >修改</el-button
        >
        <el-button type="danger" :disabled="btnStatus" @click="openDelDialog()"
          >删除</el-button
        >
        <el-button
          type="primary"
          :disabled="btnStatus"
          @click="openAuthDialog()"
          >授权</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="handleCurrentRowChange"
    >
      <el-table-column prop="uid" label="用户编号"> </el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>

      <!-- 
			 "headImg": "http://localhost:8080/img/鐢佃剳.jpg",
			 "isvalid": 1,
			 "loginTime": "2020-07-16 14:26:32",
			 "regTime": "2016-07-22 10:03:52",
			 "roleId": -1,
			 "uid": 7,
			 "username": "admin"
			  
			  
			  -->

      <el-table-column prop="roleId" label="用户角色">
        <template v-slot="scope">
          <div v-if="scope.row.roleId == 1">管理员</div>
          <div v-else-if="scope.row.roleId == 2">普通用户</div>
          <div v-else>其他用户</div>
        </template>
      </el-table-column>
      <el-table-column prop="isvalid" label="用户状态">
        <template v-slot="scope">
          <div v-if="scope.row.isvalid == 0">
            <el-tag type="danger">离职</el-tag>
          </div>
          <div v-else-if="scope.row.isvalid == 1">
            <el-tag type="success">正常</el-tag>
          </div>
          <div v-else>
            <el-tag type="info">休假</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="regTime" label="注册时间"> </el-table-column>
      <el-table-column prop="loginTime" label="最后登录时间"> </el-table-column>
      <el-table-column prop="headImg" label="头像">
        <template v-slot="scope">
          <img :src="scope.row.headImg" class="myimg" />
        </template>
      </el-table-column>
      <!-- 			  <el-table-column
				label="图标">
				<template v-slot="scope">
					
					<i :class="scope.row.glyphicon"></i><el-tag type="success">{{scope.row.glyphicon}}</el-tag>
				</template>
				
				
			  </el-table-column> -->
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.page"
      :page-sizes="[3, 5, 10]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.totalNum"
    >
    </el-pagination>

    <el-dialog title="添加" :visible.sync="addFormVisible">
      <!-- 
			 username:'',
			 isvalid:'',
			 roleId:'',
			 regTime:'',
			 remark:'',
			 headImg:''
			 -->
      <el-form ref="addform" :model="addform">
        <el-form-item label="用户名" :label-width="'120px'" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="'120px'" prop="isvalid">
          <el-select v-model="addform.isvalid" placeholder="isvalid">
            <el-option label="离职" :value="0"></el-option>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="休假" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="'120px'" prop="roleId">
          <!-- <el-input v-model="addform.pid" autocomplete="off"></el-input> -->
          <el-select v-model="addform.roleId" placeholder="roleId">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="普通用户" :value="2"></el-option>
            <el-option label="其他用户" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间" :label-width="'120px'" prop="regTime">
          <!-- <el-input v-model="addform.regTime" autocomplete="off"></el-input> -->
          <el-date-picker
            v-model="addform.regTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" :label-width="'120px'" prop="remark">
          <el-input v-model="addform.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像地址" :label-width="'120px'" prop="headImg">
          <!-- <el-input v-model="addform.headImg" autocomplete="off"></el-input> -->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="myUpload"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addform.headImg" :src="addform.headImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="editFormVisible">
      <!-- 
			 username:'',
			 isvalid:'',
			 roleId:'',
			 regTime:'',
			 remark:'',
			 headImg:''
			 -->
      <el-form ref="editform" :model="editform">
        <el-form-item label="用户编号" :label-width="'120px'" prop="uid">
          <el-input
            v-model="editform.uid"
            readonly
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="'120px'" prop="username">
          <el-input v-model="editform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="'120px'" prop="isvalid">
          <el-select v-model="editform.isvalid" placeholder="isvalid">
            <el-option label="离职" :value="0"></el-option>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="休假" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="'120px'" prop="roleId">
          <!-- <el-input v-model="editform.pid" autocomplete="off"></el-input> -->
          <el-select v-model="editform.roleId" placeholder="roleId">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="普通用户" :value="2"></el-option>
            <el-option label="其他用户" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间" :label-width="'120px'" prop="regTime">
          <!-- <el-input v-model="editform.regTime" autocomplete="off"></el-input> -->
          <el-date-picker
            v-model="editform.regTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" :label-width="'120px'" prop="remark">
          <el-input v-model="editform.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像地址" :label-width="'120px'" prop="headImg">
          <!-- <el-input v-model="editform.headImg" autocomplete="off"></el-input> -->

          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="myUpload2"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="editform.headImg"
              :src="editform.headImg"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="授权" :visible.sync="authFormVisible">
      <el-tree
        ref="mytree"
        :data="treedata"
        show-checkbox
        node-key="mid"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
      >
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="authFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="authSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        uid: "",
        username: "",
        isvalid: "",
      },
      tableData: [],
      pageInfo: {
        page: 1,
        pageSize: 5,
        totalNum: 88,
      },
      addFormVisible: false,
      addform: {
        username: "",
        isvalid: "",
        roleId: "",
        regTime: "",
        remark: "",
        headImg: "",
      },
      currentRow: null,
      editFormVisible: false,
      editform: {
        uid: "",
        username: "",
        isvalid: "",
        roleId: "",
        regTime: "",
        remark: "",
        headImg: "",
      },
      authFormVisible: false,
      treedata: [],
      checkedKeys: [],
      defaultProps: {
        children: "subMenu",
        label: "menuname",
      },
      btnStatus: true,
    };
  },
  methods: {
    myUpload(val) {
      console.log(val);
      let myfile = val.file;

      let myForm = new FormData();
      myForm.append("myfile", myfile);

      this.$axios
        .post("/users/upload", myForm, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((respInfo) => {
          console.log(respInfo);
          this.addform.headImg = respInfo.data.data;
        });
    },
    myUpload2() {
      console.log(val);
      let myfile = val.file;

      let myForm = new FormData();
      myForm.append("myfile", myfile);

      this.$axios
        .post("/users/upload", myForm, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((respInfo) => {
          console.log(respInfo);
          this.editform.headImg = respInfo.data.data;
        });
    },
    authSubmit() {
      this.authFormVisible = false;
      console.log(this.$refs.mytree.getCheckedKeys());
      let authIdStr = this.$refs.mytree.getCheckedKeys().join(",");
      console.log(authIdStr);

      let params = `userAuthId=${authIdStr}&uid=${this.currentRow.uid}`;
      this.$axios.post("/users/editUserAuthList", params).then((respInfo) => {
        console.log(respInfo);

        //展示操作结果
        if (respInfo.data.code == 220) {
          this.$message.success(respInfo.data.msg);
        } else if (respInfo.data.code == 230) {
          this.$message.error(respInfo.data.msg);
        }
        //刷新当前页面数据
        let queryParams =
          this.$qs.stringify(this.pageInfo) +
          "&" +
          this.$qs.stringify(this.queryForm);
        //调用查询方法
        this.myQuery(queryParams);
      });
    },
    openAuthDialog() {
      this.authFormVisible = true;
      this.$axios
        .post("/users/getAuthMenuList?uid=" + this.currentRow.uid)
        .then((respInfo) => {
          console.log(respInfo);

          //展示操作结果
          if (respInfo.data.code == 240) {
            this.treedata = respInfo.data.data.authMenuList;
            //把id列表 转成集合 给默认选中赋值
            console.log(respInfo.data.data.userAuthId);
            if (typeof respInfo.data.data.userAuthId == "undefined") {
              this.checkedKeys = [];
            } else {
              this.checkedKeys = respInfo.data.data.userAuthId.split(",");
            }
          }
        });
    },
    openDelDialog() {
      let currentRowUid = this.currentRow.uid;
      this.$confirm(
        `此操作将永久删除编号为 ${currentRowUid} 记录, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          console.log("执行删除方法");
          let params = "uid=" + currentRowUid;
          //添加修改 删除 处理反馈部分代码一样 合并起来
          this.$axios.post("/users/delete", params).then((respInfo) => {
            console.log(respInfo);

            //展示操作结果
            if (respInfo.data.code == 220) {
              this.$message.success(respInfo.data.msg);
            } else if (respInfo.data.code == 230) {
              this.$message.error(respInfo.data.msg);
            }
            //刷新当前页面数据
            let queryParams =
              this.$qs.stringify(this.pageInfo) +
              "&" +
              this.$qs.stringify(this.queryForm);
            //调用查询方法
            this.myQuery(queryParams);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editSubmit() {
      this.editFormVisible = false;
      console.log(this.editform);
      let params = this.$qs.stringify(this.editform);
      this.$axios.post("/users/edit", params).then((respInfo) => {
        console.log(respInfo);

        //展示操作结果
        if (respInfo.data.code == 220) {
          this.$message.success(respInfo.data.msg);
        } else if (respInfo.data.code == 230) {
          this.$message.error(respInfo.data.msg);
        }
        //刷新当前页面数据
        let queryParams =
          this.$qs.stringify(this.pageInfo) +
          "&" +
          this.$qs.stringify(this.queryForm);
        //调用查询方法
        this.myQuery(queryParams);
      });
    },
    editDialogOpen() {
      this.editFormVisible = true;
      this.$axios
        .get("/users/getUserForEdit?uid=" + this.currentRow.uid)
        .then((respInfo) => {
          console.log(respInfo);
          this.editform = respInfo.data.data;
        });
    },

    handleCurrentRowChange(val) {
      this.currentRow = val;
      console.log(this.currentRow);
      this.btnStatus = false;
    },
    addSubmit() {
      this.addFormVisible = false;
      console.log(this.addform);
      let params = this.$qs.stringify(this.addform);
      this.$axios.post("/users/add", params).then((respInfo) => {
        console.log(respInfo);
        //展示操作结果
        if (respInfo.data.code == 220) {
          this.$message.success(respInfo.data.msg);
        } else if (respInfo.data.code == 230) {
          this.$message.error(respInfo.data.msg);
        }
        //刷新当前页面数据
        let queryParams =
          this.$qs.stringify(this.pageInfo) +
          "&" +
          this.$qs.stringify(this.queryForm);
        //调用查询方法
        this.myQuery(queryParams);
      });
    },
    addDialogOpen() {
      this.addFormVisible = true;
      this.$nextTick(function () {
        this.$refs.addform.resetFields();
      });
    },

    onQuerySubmit() {
      console.log("提交");

      let queryParams = this.$qs.stringify(this.queryForm);

      this.myQuery(queryParams);
    },
    resetForm() {
      this.$refs.queryFrom.resetFields();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      //改pageInfo对象中的值
      this.pageInfo.page = 1;
      this.pageInfo.pageSize = val;

      let queryParams =
        this.$qs.stringify(this.pageInfo) +
        "&" +
        this.$qs.stringify(this.queryForm);

      this.myQuery(queryParams);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageInfo.page = val;
      let queryParams =
        this.$qs.stringify(this.pageInfo) +
        "&" +
        this.$qs.stringify(this.queryForm);

      this.myQuery(queryParams);
    },
    myQuery(params) {
      this.$axios.get("/users/query?" + params).then((respInfo) => {
        if (respInfo.data.code == 240) {
          this.tableData = respInfo.data.data;
          this.pageInfo = respInfo.data.pageInfo;
        } else if (respInfo.data.code == 290) {
          this.tableData = [];
          this.pageInfo.totalNum = 0;
          this.pageInfo.page = 1;
        }
      });
    },
  },
  mounted() {
    this.myQuery("");
  },
  watch: {
    /* 
	  		  vue的watch  机制 可以监控数据的改变
	  		  
	  		  配合watch机制 找到更新数据的时机 在这里加入自己的代码
	  		  
	  		  */
    tableData(newValue, oldValue) {
      console.log(newValue);
      console.log(oldValue);

      //table刷新的时机
      this.$nextTick(function () {
        this.btnStatus = true;
      });
    },
  },
};
</script>

<style>
.myimg {
  width: 100px;
  height: 100px;
}
div.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

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
