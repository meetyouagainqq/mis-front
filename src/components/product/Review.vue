<template>
  <div>
    <el-form
      ref="queryFrom"
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
    >
      <el-form-item prop="pname" label="产品名称">
        <el-input v-model="queryForm.pname" placeholder="产品名称"></el-input>
      </el-form-item>
      <!-- 审核状态 -->
      <el-form-item prop="status" label="审核状态">
        <el-select v-model="queryForm.status" placeholder="审核状态">
          <el-option label="无" :value="3"></el-option>
          <el-option
            v-for="(option, index) in statusList"
            :key="index"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onQuerySubmit()">查询</el-button>
        <el-button
          type="primary"
          :disabled="btnStatus"
          @click="openEditDialog()"
          >操作</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 展示数据 -->

    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="handleCurrentRowChange"
    >
      <el-table-column prop="pname" label="产品名称" width="180">
      </el-table-column>
      <el-table-column prop="classification" label="业务类型">
        <template slot-scope="scope">
          <span v-if="scope.row.classification == '0'">对冲基金</span>
          <span v-else-if="scope.row.classification == '1'">其他基金</span>
          <span v-else-if="scope.row.classification == '2'">阳光私募</span>
          <span v-else>储蓄险</span>
        </template>
      </el-table-column>
      <el-table-column prop="createPerson" label="创建人"> </el-table-column>
      <el-table-column prop="createTime" label="首次创建时间">
      </el-table-column>
      <el-table-column prop="updateTime" label="最近修改时间">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    <!-- 修改框 -->
    <el-dialog title="修改产品" :visible.sync="editFormVisible">
      <el-form ref="editform" :model="editform">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品系列" :label-width="'130px'" prop="series">
              <el-select
                v-model="editform.series"
                placeholder="series"
                style="width: 180px"
              >
                <el-option label="测试产品" :value="0"></el-option>
                <el-option label="中金收益宝" :value="1"></el-option>
                <el-option label="安顺收益" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 二级分类 -->
            <el-form-item
              label="二级分类"
              :label-width="'130px'"
              prop="classification"
            >
              <el-select
                v-model="editform.classification"
                placeholder="二级分类"
                style="width: 180px"
              >
                <el-option label="对冲基金" :value="0"></el-option>
                <el-option label="其他基金" :value="1"></el-option>
                <el-option label="阳光私募" :value="2"></el-option>
                <el-option label="储蓄险" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <!-- 产品名称 -->
            <el-form-item label="产品名称" :label-width="'130px'" prop="pname">
              <el-input
                v-model="editform.pname"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 机构名称 -->
            <el-form-item
              label="管理机构"
              :label-width="'130px'"
              prop="mechanismName"
            >
              <el-input
                v-model="editform.mechanismName"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row>
          <el-col :span="8">
            <!-- 年化收益率 -->
            <el-form-item
              label="年化收益率"
              :label-width="'130px'"
              prop="yield"
            >
              <el-input
                v-model="editform.yield"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 机构名称 -->
            <el-form-item
              label="货币类型"
              :label-width="'130px'"
              prop="currency"
            >
              <el-input
                v-model="editform.currency"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row>
          <el-col :span="8">
            <!--开放日期 -->
            <el-form-item
              label="注册时间"
              :label-width="'120px'"
              prop="openTime"
            >
              <el-date-picker
                v-model="editform.openTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 认证周期 -->
            <el-form-item label="认证周期" :label-width="'130px'" prop="cycle">
              <el-input
                v-model="editform.cycle"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row>
          <el-col :span="8">
            <!--开放日期 -->
            <el-form-item
              label="基金管理费率"
              :label-width="'120px'"
              prop="managementRate"
            >
              <el-input
                v-model="editform.managementRate"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 认购费率 -->
            <el-form-item
              label="认购费率"
              :label-width="'130px'"
              prop="subscriptionRate"
            >
              <el-input
                v-model="editform.subscriptionRate"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第六行 -->
        <el-row>
          <el-col :span="8">
            <!--起投金额 -->
            <el-form-item label="起投金额" :label-width="'120px'" prop="amount">
              <el-input
                v-model="editform.amount"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 认购费收取方式 -->
            <el-form-item
              label="认购费收取方式"
              :label-width="'130px'"
              prop="method"
            >
              <el-input
                v-model="editform.method"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第七行 -->
        <el-row>
          <el-col :span="8">
            <!--赎回周期 -->
            <el-form-item
              label="赎回周期"
              :label-width="'120px'"
              prop="redemptionPeriod"
            >
              <el-input
                v-model="editform.redemptionPeriod"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 赎回起始金额 -->
            <el-form-item
              label="赎回起始金额"
              :label-width="'130px'"
              prop="startingAmount"
            >
              <el-input
                v-model="editform.startingAmount"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第八行 -->
        <el-row>
          <el-col :span="8">
            <!--赎回费 -->
            <el-form-item
              label="赎回费"
              :label-width="'120px'"
              prop="redemptionFee"
            >
              <el-input
                v-model="editform.redemptionFee"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 锁定期(封闭期) -->
            <el-form-item
              label="锁定期(封闭期)"
              :label-width="'130px'"
              prop="lockPeriod"
            >
              <el-input
                v-model="editform.lockPeriod"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 最后一行 -->
        <el-row>
          <el-col :span="8">
            <!--审核人 -->
            <el-form-item
              label="审核人"
              :label-width="'120px'"
              prop="reviewPerson"
            >
              <el-input
                v-model="editform.reviewPerson"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">关闭</el-button>
        <el-button type="primary" plain @click="rollback()">驳回</el-button>
        <el-button type="primary" @click="editSubmit()">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        pname: "",
        status: "",
      },
      tableData: [],
      pageInfo: {
        page: 1,
        pageSize: 10,
        totalNum: 0,
      },
      productList: [],
      statusList: [
        {
          value: "1",
          label: "已通过",
        },
        {
          value: "0",
          label: "未通过",
        },
      ],
      seriesList: [
        {
          value: "0",
          label: "测试产品",
        },
        {
          value: "1",
          label: "中金收益宝 ",
        },
        {
          value: "2",
          label: "安顺收益 ",
        },
      ],
      currencyList: [
        {
          value: "CNY",
          label: "CNY",
        },
        {
          value: "USD",
          label: "USD",
        },
      ],
      currentRow: null,
      editFormVisible: false,
      editform: {
        series: "",
        classification: "",
        pname: "",
        mechanismName: "",
        yield: "",
        currency: "",
        openTime: "",
        cycle: "",
        managementRate: "",
        subscriptionRate: "",
        amount: 0.0,
        redemptionPeriod: "",
        startingAmount: 0.0,
        redemptionFee: 0.0,
        lockPeriod: "",
        reviewPerson: "",
        method: "",
      },
      btnStatus: true,
    };
  },
  methods: {
    //审核通过
    editSubmit() {
      this.$axios
        .post("/company/review/reviewStatus?id=" + this.currentRow.id)
        .then((response) => {
          if (response.data.code == 530) {
            this.$message.success(response.data.msg);
          } else if (response.data.code == 540) {
            this.$message.error(response.data.msg);
          }
        });
      this.editFormVisible = false;
    },
    rollback() {
      this.$axios
        .post("/company/review/rollBackStatus?id=" + this.currentRow.id)
        .then((response) => {
          if (response.data.code == 490) {
            this.$message.success(response.data.msg);
          } else if (response.data.code == 520) {
            this.$message.error(response.data.msg);
          }
        });
      this.editFormVisible = false;
    },
    openEditDialog() {
      this.editFormVisible = true;
      this.$nextTick(function () {
        this.$refs.editform.resetFields();
      });
      this.$axios
        .get("/company/review/getReviewForEdit?id=" + this.currentRow.id)
        .then((response) => {
          console.log(this.currentRow.id);
          console.log(response.data.data);
          this.editform = response.data.data;
        });
    },
    
    //得到产品类型option
    getProductSelect() {
      this.$axios.get("/company/basic/getProductSelect").then((response) => {
        console.log(response.data.data);
        if (response.data.code == 240) {
          this.productList = response.data.data;
        } else if (response.data.code == 290) {
          this.productList = [];
        }
      });
    },
    handleCurrentRowChange(val) {
      console.log(val);
      this.currentRow = val;
      this.btnStatus = false;
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
    //提交进行条件查询
    onQuerySubmit() {
      console.log("查询数据");
      let queryParams = this.$qs.stringify(this.queryForm);
      console.log(queryParams);

      this.myQuery(queryParams);
    },
    myQuery(params) {
      this.$axios.post("/company/review/query?" + params).then((response) => {
        console.log(response.data.data);
        if (response.data.code == 240) {
          this.tableData = response.data.data;
          this.pageInfo = response.data.pageInfo;
        } else if (response.data.code == 290) {
          this.tableData = [];
          this.pageInfo.totalNum = 0;
          this.pageInfo.page = 1;
        }
      });
    },
  },
  mounted() {
    this.myQuery("");
    this.getProductSelect();
  },
  watch: {
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
</style>