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
      <el-form-item prop="classification" label="产品类型">
        <el-select v-model="queryForm.classification" placeholder="产品类型">
          <el-option label="无" :value="6"></el-option>
          <el-option
            v-for="(option, index) in productList"
            :key="index"
            :label="option.name"
            :value="option.classification"
          ></el-option>
        </el-select>
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
        <el-button type="success" @click="openAddDialog()">添加</el-button>
        <el-button
          type="warning"
          :disabled="btnStatus"
          @click="openEditDialog()"
          >修改</el-button
        >
        <el-button type="danger" :disabled="btnStatus" @click="openDelDialog()"
          >净值管理</el-button
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
      <el-table-column prop="series" label="产品系列">
        <template slot-scope="scope">
          <span v-if="scope.row.series == '0'">测试基金产品</span>
          <span v-else-if="scope.row.series == '1'">中金收益宝</span>
          <span v-else>安顺收益</span>
        </template>
      </el-table-column>
      <el-table-column prop="classification" label="二级分类">
        <template slot-scope="scope">
          <span v-if="scope.row.classification == '0'">对冲基金</span>
          <span v-else-if="scope.row.classification == '1'">其他基金</span>
          <span v-else-if="scope.row.classification == '2'">阳光私募</span>
          <span v-else>储蓄险</span>
        </template>
      </el-table-column>
      <el-table-column prop="mechanismName" label="机构名称"> </el-table-column>
      <el-table-column prop="openTime" label="开放时间"> </el-table-column>
      <el-table-column prop="currency" label="币种"> </el-table-column>
      <el-table-column prop="status" label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '0'">未通过</span>
          <span v-else>已通过</span>
        </template>
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
    <!-- 添加框 -->
    <el-dialog title="产品详情" :visible.sync="addFormVisible">
      <el-form ref="addform" :model="addform">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品系列" :label-width="'130px'" prop="series">
              <el-select
                v-model="addform.series"
                placeholder="series"
                style="width: 180px"
              >
                <el-option label="无" :value="10"></el-option>
                <el-option
                  v-for="(option, index) in seriesList"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
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
                v-model="addform.classification"
                placeholder="二级分类"
                style="width: 180px"
              >
                <el-option label="无" :value="9"></el-option>
                <el-option
                  v-for="(option, index) in productList"
                  :key="index"
                  :label="option.name"
                  :value="option.classification"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <!-- 产品名称 -->
            <el-form-item label="产品名称" :label-width="'130px'" prop="pname">
              <el-input
                v-model="addform.pname"
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
                v-model="addform.mechanismName"
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
                v-model="addform.yield"
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
              <el-select
                v-model="addform.currency"
                placeholder="请选择"
                style="width: 180px"
              >
                <el-option label="无" :value="CMY"></el-option>
                <el-option
                  v-for="(option, index) in currencyList"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
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
                v-model="addform.openTime"
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
                v-model="addform.cycle"
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
                v-model="addform.managementRate"
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
                v-model="addform.subscriptionRate"
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
                v-model="addform.amount"
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
                v-model="addform.method"
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
                v-model="addform.redemptionPeriod"
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
                v-model="addform.startingAmount"
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
                v-model="addform.redemptionFee"
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
                v-model="addform.lockPeriod"
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
                v-model="addform.reviewPerson"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div>
    </el-dialog>

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
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 净值管理框 -->
    <el-dialog title="净值管理" :visible.sync="increaseFormVisible">
      <el-form ref="increaseForm" :model="increaseForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品名称" :label-width="'130px'" prop="pname">
              <el-input
                v-model="increaseForm.pname"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="单位净值"
              :label-width="'120px'"
              prop="netWorth"
            >
              <el-input
                v-model="increaseForm.netWorth"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="净值基准日"
              :label-width="'130px'"
              prop="baseTime"
            >
              <el-date-picker
                v-model="increaseForm.baseTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="累计增长率"
              :label-width="'130px'"
              prop="growthRate"
            >
              <el-input
                v-model="increaseForm.growthRate"
                autocomplete="off"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="increaseFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="increaseSubmit()">确 定</el-button>
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
        classification: "",
        status: "",
      },
      tableData: [],
      pageInfo: {
        page: 1,
        pageSize: 10,
        totalNum: 0,
      },
      increaseFormVisible: false,
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
      addFormVisible: false,
      addform: {
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
      increaseForm: {
        pname: "",
        growthRate: "",
        netWorth: "",
        baseTime: "",
      },
    };
  },
  methods: {
    increaseSubmit() {
      this.increaseFormVisible = false;
      this.$axios
        .post(
          "/company/basic/addManage?basicId=" +
            this.currentRow.id +
            "&netWorth=" +
            this.increaseForm.netWorth +
            "&growthRate=" +
            this.increaseForm.growthRate +
            "&baseTime=" +
            this.increaseForm.baseTime
        )
        .then((respInfo) => {
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
    openAddDialog() {
      this.addFormVisible = true;
      this.$nextTick(function () {
        this.$refs.addform.resetFields();
      });
    },
    openDelDialog() {
      this.$nextTick(function () {
        this.$refs.increaseForm.resetFields();
      });
      this.increaseFormVisible = true;
      this.$axios
        .get("/company/basic/getBasicName?id=" + this.currentRow.id)
        .then((response) => {
          this.increaseForm.pname = response.data.data;
        });
    },
    openEditDialog() {
      this.editFormVisible = true;
      this.$axios
        .get("/company/basic/getBasicForEdit?id=" + this.currentRow.id)
        .then((response) => {
          console.log(this.currentRow.id);
          console.log(response.data.data);
          this.editform = response.data.data;
        });
    },
    editSubmit() {
      this.editFormVisible = false;
      console.log(this.editform);
      let params = this.$qs.stringify(this.editform);
      this.$axios.post("/company/basic/edit", params).then((respInfo) => {
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
      this.myQuery(queryParams);
    },
    myQuery(params) {
      this.$axios.post("/company/basic/query?" + params).then((response) => {
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
    //提交添加
    addSubmit() {
      this.addFormVisible = false;
      console.log(this.addform);
      let params = this.$qs.stringify(this.addform);
      this.$axios.post("/company/basic/addBasic", params).then((response) => {
        console.log(response);
        //展示操作结果
        if (response.data.code == 220) {
          this.$message.success(response.data.msg);
        } else if (response.data.code == 230) {
          this.$message.error(response.data.msg);
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
  },
  mounted() {
    this.myQuery("");
    this.getProductSelect();
    //this.getStatusSelect();
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