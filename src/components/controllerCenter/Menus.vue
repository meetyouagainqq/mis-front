<template>
  <div>
    <el-form
      ref="queryFrom"
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
    >
      <el-form-item label="菜单名称" prop="menuname"
        ><!-- 加上prop属性 可以让form组件找到form item  -->
        <el-input
          v-model="queryForm.menuname"
          placeholder="menuname"
        ></el-input>
      </el-form-item>
      <el-form-item label="上级编号" prop="pid">
        <!-- <el-input v-model="queryForm.pid" placeholder="parentid"></el-input> -->

        <el-select v-model="queryForm.pid" placeholder="parentid">
          <!-- 
				 动态生成
				 /
				 写死	 
				 0
				 所有一级菜单
				 -->
          <el-option label="无" :value="0"></el-option>
          <el-option
            v-for="(option, index) in optionList"
            :key="index"
            :label="option.menuname"
            :value="option.mid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuerySubmit">查询</el-button>
        <el-button @click="resetForm()">重置</el-button>

        <el-button type="success" @click="openAddDialog()">添加</el-button>
        <el-button
          type="warning"
          :disabled="btnStatus"
          @click="openEditDialog()"
          >修改</el-button
        >
        <el-button type="danger" :disabled="btnStatus" @click="openDelDialog()"
          >删除</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="handleCurrentRowChange"
    >
      <el-table-column prop="mid" label="菜单编号" width="180">
      </el-table-column>
      <el-table-column prop="menuname" label="菜单名称"> </el-table-column>
      <el-table-column prop="pid" label="上级菜单编号"> </el-table-column>
      <el-table-column prop="pname" label="上级菜单名称"> </el-table-column>
      <el-table-column prop="url" label="访问地址"> </el-table-column>
      <el-table-column label="图标">
        <template v-slot="scope">
          <i :class="scope.row.glyphicon"></i
          ><el-tag type="success">{{ scope.row.glyphicon }}</el-tag>
        </template>
      </el-table-column>
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
      <el-form ref="addform" :model="addform">
        <el-form-item label="菜单编号" :label-width="'120px'" prop="mid">
          <el-input v-model="addform.mid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="'120px'" prop="menuname">
          <el-input v-model="addform.menuname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级编号" :label-width="'120px'" prop="pid">
          <!-- <el-input v-model="addform.pid" autocomplete="off"></el-input> -->
          <el-select v-model="addform.pid" placeholder="parentid">
            <el-option label="无" :value="0"></el-option>
            <el-option
              v-for="(option, index) in optionList"
              :key="index"
              :label="option.menuname"
              :value="option.mid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访问地址" :label-width="'120px'" prop="url">
          <el-input v-model="addform.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" :label-width="'120px'" prop="glyphicon">
          <el-input v-model="addform.glyphicon" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="editFormVisible">
      <el-form ref="editform" :model="editform">
        <el-form-item label="菜单编号" :label-width="'120px'" prop="mid">
          <el-input
            v-model="editform.mid"
            readonly
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="'120px'" prop="menuname">
          <el-input v-model="editform.menuname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级编号" :label-width="'120px'" prop="pid">
          <!-- <el-input v-model="editform.pid" autocomplete="off"></el-input> -->
          <el-select v-model="editform.pid" placeholder="parentid">
            <el-option label="无" :value="0"></el-option>
            <el-option
              v-for="(option, index) in optionList"
              :key="index"
              :label="option.menuname"
              :value="option.mid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访问地址" :label-width="'120px'" prop="url">
          <el-input v-model="editform.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" :label-width="'120px'" prop="glyphicon">
          <el-input v-model="editform.glyphicon" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        menuname: "",
        pid: "",
      },
      tableData: [],
      pageInfo: {
        page: 1,
        pageSize: 10,
        totalNum: 0,
      },
      optionList: [],
      addFormVisible: false,
      addform: {
        mid: "",
        menuname: "",
        pid: "",
        url: "",
        glyphicon: "",
      },
      currentRow: null,
      editFormVisible: false,
      editform: {
        mid: "",
        menuname: "",
        pid: "",
        url: "",
        glyphicon: "",
      },
      btnStatus: true,
    };
  },
  methods: {
    openDelDialog() {
      let currentRowMid = this.currentRow.mid;
      this.$confirm(
        `此操作将永久删除编号为 ${currentRowMid} 记录, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          console.log("执行删除方法");
          let params = "mid=" + currentRowMid;
          //添加修改 删除 处理反馈部分代码一样 合并起来
          this.myCUD("/menus/delete", params);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    openEditDialog() {
      this.editFormVisible = true;
      /* 
			  准备修改的数据
			   1.从页面直接取值
			  //对象复制方法
			  let newObj = JSON.parse(JSON.stringify(this.currentRow));	
			  console.log(this.currentRow);	
			  console.log(newObj);	
			  //this.editform = newObj;
			  
			  2.通过服务接口从后端取数据
			  
			  传入菜单编号  返回菜单完整信息
			  直接传的是引用  
			     引用的是tableData中的数组对象

			  */

      this.$axios
        .get("/menus/getMenuForEdit?mid=" + this.currentRow.mid)
        .then((respInfo) => {
          console.log(respInfo);
          this.editform = respInfo.data.data;
        });
    },
    editSubmit() {
      this.editFormVisible = false;
      console.log(this.editform);
      //得到要发送的参数
      let params = this.$qs.stringify(this.editform);
      console.log(params);

      //添加修改 删除 处理反馈部分代码一样 合并起来
      this.myCUD("/menus/edit", params);
    },
    handleCurrentRowChange(val) {
      console.log(val);
      this.currentRow = val;
      this.btnStatus = false;
    },
    openAddDialog() {
      this.addFormVisible = true;
      this.$nextTick(function () {
        this.$refs.addform.resetFields();
      });
    },
    addSubmit() {
      this.addFormVisible = false;
      //得到要发送的参数
      let params = this.$qs.stringify(this.addform);
      console.log(params);
      //添加修改 删除 处理反馈部分代码一样 合并起来
      this.myCUD("/menus/add", params);
    },
    resetForm() {
      this.$refs.queryFrom.resetFields();
    },
    onQuerySubmit() {
      console.log("查询数据");
      let queryParams = this.$qs.stringify(this.queryForm);
      console.log(queryParams);

      this.myQuery(queryParams);
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
      //调用查询方法
      this.myQuery(queryParams);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //改pageInfo对象中的值
      this.pageInfo.page = val;
      let queryParams =
        this.$qs.stringify(this.pageInfo) +
        "&" +
        this.$qs.stringify(this.queryForm);
      //调用查询方法
      this.myQuery(queryParams);
    },
    myQuery(params) {
      /* console.log("使用统一的查询方法 在不同情况下 使用不同的参数"); */
      this.$axios.get("/menus/query?" + params).then((respInfo) => {
        console.log(respInfo);

        /* 					//重新禁用按钮
					this.$nextTick(function(){
						this.btnStatus = true;
					}) */

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
    getMenuSelect() {
      this.$axios.get("/menus/getMenuSelect").then((respInfo) => {
        console.log(respInfo);
        if (respInfo.data.code == 240) {
          this.optionList = respInfo.data.data;
        } else if (respInfo.data.code == 290) {
          this.optionList = [];
        }
      });
    },
    myCUD(url, params) {
      this.$axios.post(url, params).then((respInfo) => {
        console.log(respInfo);
        //展示操作结果
        if (respInfo.data.code == 220) {
          this.$message.success(respInfo.data.msg);
        } else if (respInfo.data.code == 230) {
          this.$message.error(respInfo.data.msg);
        } else if (respInfo.data.code == 280) {
          this.$message.warning(respInfo.data.msg);
        }
        //刷新当前页面数据
        let queryParams =
          this.$qs.stringify(this.pageInfo) +
          "&" +
          this.$qs.stringify(this.queryForm);
        //调用查询方法
        this.myQuery(queryParams);
        this.getMenuSelect();
      });
    },
  },
  mounted() {
    //调用查询方法
    this.myQuery("");
    this.getMenuSelect();
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
.el-select {
  width: 100%;
}
</style>
