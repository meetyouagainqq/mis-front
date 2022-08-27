<template>
	<div>

		<el-form  ref="queryFrom" :inline="true" :model="queryForm" class="demo-form-inline">
			<el-form-item label="系列名称" prop="sname">
				<el-input v-model="queryForm.sname" placeholder="产品名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onQuerySubmit()">查询</el-button>
				<el-button type="success" @click="openAddDialog()">添加</el-button>
				<el-button type="warning" :disabled="btnStatus" @click="openEditDialog()">修改</el-button>
				<el-button type="danger" :disabled="btnStatus" @click="openremittanceDialog()">汇款信息</el-button>
			</el-form-item>
		</el-form>

			<el-table :data="tableData" style="width: 100%" 
			highlight-current-row
			@current-change="handleCurrentRowChange">
				<el-table-column prop="sid" label="产品系列id">
				</el-table-column>
				<el-table-column prop="sname" label="产品中文名">
				</el-table-column>
				<el-table-column prop="sename" label="产品英文名">
				</el-table-column>
				<el-table-column prop="remittance" label="汇款信息概括">
				</el-table-column>
			</el-table>


			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageInfo.page" :page-sizes="[3, 5, 10]" :page-size="pageInfo.pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalNum">
			</el-pagination>

			<el-dialog title="添加" :visible.sync="addFormVisible">
				<el-form  ref="addform" :model="addform">
					<el-form-item label="产品渠道" :label-width="'120px'">
						<el-select v-model="addform.qudao" placeholder="请选择">
							<el-option label="香港资管" :value="0"></el-option>
							<el-option label="尚马资管" :value="1"></el-option>
							<!-- <el-option v-for="(option,index) in optionList"
							 :key="index" 
							 :label="option.menuname" 
							 :value="option.mid" ></el-option> -->
						</el-select>
					</el-form-item>
					</el-form-item>
					<el-form-item label="产品分类" :label-width="'120px'">
						<el-select v-model="addform.fenlei" placeholder="请选择">
							<el-option label="对冲基金" :value="0"></el-option>
							<el-option label="阳光私募" :value="1"></el-option>
							<el-option label="尚马基金" :value="2"></el-option>
							<!-- <el-option v-for="(option,index) in optionList" :key="index" :label="option.menuname" :value="option.mid" ></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="中文名称" :label-width="'120px'">
						<!-- <el-input v-model="addform.pid" autocomplete="off"></el-input> -->
						<el-input v-model="addform.sname" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="英文名称" :label-width="'120px'">
						<el-input v-model="addform.sename" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addSubmit()">确 定</el-button>
				</div>
			</el-dialog>
			
			
			
			<el-dialog title="修改" :visible.sync="editFormVisible">
				<el-form  ref="editform" :model="editform">
					<el-form-item label="产品系列ID" :label-width="'120px'">
						<!-- <el-input v-model="addform.pid" autocomplete="off"></el-input> -->
						<el-input v-model="editform.sid" readonly autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="产品中文名" :label-width="'120px'">
						<el-input v-model="editform.sname" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="产品英文名" :label-width="'120px'">
						<!-- <el-input v-model="addform.pid" autocomplete="off"></el-input> -->
						<el-input v-model="editform.sename" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="汇款信息概略" :label-width="'120px'">
						<el-input v-model="editform.remittance" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="editSubmit()">确 定</el-button>
				</div>
			</el-dialog>


					


			<el-dialog title="汇款信息" :visible.sync="editRemittanceFormVisible">
				<el-form ref="editRemittanceForm" :model="editRemittanceForm">
					<el-form-item label="收款银行名称" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.bankName" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="银行SWIFT码" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.bankSwift" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="BANK CODE" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.bankCode" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="CNAPS编号" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.cnapsNumber" autocomplete="off"></el-input>
					</el-form-item>
					
					
				
						<!-- <el-form-item label="收款银行地区" :label-width="'120px'">
							<el-select v-model="prov" @change="changeCity()">
								<option disabled value="">-----请选择-----</option>
								<option v-for="prov in provList" 
								:value="prov.code">{{prov.name}}</option>
							</el-select> 
						</el-form-item>
						
						<el-form-item label="收款银行城市" :label-width="'120px'">
							<el-select v-model="city" @change="changeArea()">
								<option disabled value="">-----请选择-----</option>		
								<option v-for="city in cityList" :value="city.code">{{city.name}}</option>
							</el-select>
						</el-form-item> -->
						
					<el-form-item label="收款银行地区" :label-width="'120px'">
						<el-select v-model="Area.areaId" placeholder="请选择">
							<el-option label="无" :value="0"></el-option>
							<el-option v-for="(option,index) in optionList"
							 :key="index" 
							 :label="option.areaName" 
							 :value="option.areaId" ></el-option> 
						</el-select>
					</el-form-item>
					
					<el-form-item label="收款银行地区" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.bankArea" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="收款银行城市" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.bankCity" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="收款人户名" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.payeeName" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="收款人账号" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.payeeAccount" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="收款人地址" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.payeeAddress" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="资管机构" :label-width="'120px'">
						<el-input v-model="editRemittanceForm.InformationOrganization" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editRemittanceFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="RemittanceSubmit()">确 定</el-button>
				</div>
			</el-dialog>

		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				provList:[{name: '北京市',code: '110000'},
						  {name: '天津市',code: '120000'}],
				prov:"",
				cityList:[],
				city:"",
				
				
				optionList:[],
				Area:{
					areaId:'',
					areaName:'',
				},
				btnStatus:true,
				queryForm:{
					sname: '',
				},
				tableData: [],
				pageInfo: {
					page: 1,
					pageSize: 10,
					totalNum: 99,
					// "pageInfo": {
					//        "page": 1,
					//        "pageSize": 10,
					//        "totalNum": 8
				},
				addFormVisible: false,
				addform: {
					qudao: '',
					fenlei: '',
					sname: '',
					sename: '',
				},
				currentRow:null,
				editFormVisible:false,
				editform: {
					sid: '',
					sname: '',
					sename: '',
					remittance: '',
				},
				editRemittanceFormVisible: false,
				// currentRow: null,
				editRemittanceForm: {
					sid: '',
					sname: '',
					sename: '',
					remittance: '',
					bankName: '',
					bankSwift: '',
					bankCode: '',
					cnapsNumber: '',
					bankArea: '',
					bankCity: '',
					payeeName: '',
					payeeAccount: '',
					payeeAddress: '',
					InformationOrganization: '',

				},
			}
		},
		methods: {
			changeCity() {
					console.log(this.prov);
					// //把选项指向到请选择
					// this.city = "";
					// //改省的时候 县区直接清空
					// this.areaList = [];
					// this.area = "";
			
					this.$axios.get("/series/getAreaById?parentId=" + this.areaId)
						.then(respInfo => {
							console.log(respInfo);
							this.optionList = respInfo.data.data;
							console.log(this.optionList)
						})
				},
			openremittanceDialog() {
				this.editRemittanceFormVisible = true;
				this.editRemittanceForm = this.currentRow;
				
				this.$axios.get("/series/getSeriesForEdit?sid="+this.currentRow.sid)
				.then(respInfo=>{
						console.log(respInfo);
						this.editRemittanceForm = respInfo.data.data;
						
				})
			},
			
			RemittanceSubmit() {
				this.editRemittanceFormVisible = false;
				console.log(this.editRemittanceForm);
				// //得到要发送的参数
				let params = this.$qs.stringify(this.editRemittanceForm);
				console.log(params);

				//添加修改 删除 处理反馈机构
				this.myCUD("/series/addEditRemittance", params)
			
			},
			handleCurrentRowChange(val){
				console.log(val)
				this.currentRow = val;
				this.btnStatus = false;
			},
			openEditDialog(){
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
			   this.$axios.get("/series/getSeriesForEdit?sid="+this.currentRow.sid)
			   .then(respInfo=>{
			   		console.log(respInfo);
			   		this.editform = respInfo.data.data;
			   })
   
			},
			editSubmit(){
				this.editFormVisible = false;
				console.log(this.editform);
				//得到要发送的参数
				let params = this.$qs.stringify(this.editform) ;
				console.log(params);
				
				//添加修改 删除 处理反馈部分代码一样 合并起来
				this.myCUD("/series/editMenuSeries",params);
			},
			
			openAddDialog(){
				 this.addFormVisible = true;
				this.$nextTick(function(){
				this.$refs.addform.resetFields();
				 })
			},
			addSubmit() {
				this.addFormVisible = false;
				//得到要发送的参数
				let params = this.$qs.stringify(this.addform);
				console.log(params);

				//添加修改 删除 处理反馈机构
				this.myCUD("/series/add", params)
			},
			// resetForm(){
			// 	this.$refs.queryFrom.resetFields();
			// },
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
				this.$axios.get("/series/getSeriesSelect?"+params)
					.then(respInfo => {
						console.log(respInfo);			
						if (respInfo.data.code == 240) {
							this.tableData = respInfo.data.data;
							this.pageInfo = respInfo.data.pageInfo;
						} else if (respInfo.data.code == 290) {
							this.tableData = [];
							this.pageInfo.totalNum = 0;
							this.pageInfo.page = 1;
						}
					})
			},
			getSeriesSelect() {
			  this.$axios.get("/series/getSeriesSelect")
			  .then((respInfo) => {
			    console.log(respInfo);
			    if (respInfo.data.code == 240) {
			      this.optionList = respInfo.data.data;
			    } else if (respInfo.data.code == 290) {
			      this.optionList = [];
			    }
			  });
			},
			myCUD(url, params) {
				this.$axios.post(url, params)
					.then(respInfo => {
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
						let queryParams = this.$qs.stringify(this.pageInfo) + "&" + this.$qs.stringify(this.queryForm);
						//调用查询方法
						this.myQuery(queryParams);
						this.getSeriesSelect();
						this.changeCity();
						
						
					
					})
			}
		
		},
		mounted() {
			// // 省市级联 页面加载结束后 执行代码
			// console.log(areaData);
			// this.provList = areaData;
			this.changeCity();
			this.myQuery("");
			this.getSeriesSelect();
		},
		watch: {
				  /* 
				  vue的watch  机制 可以监控数据的改变
				  
				  配合watch机制 找到更新数据的时机 在这里加入自己的代码
				  
				  */
			tableData(newValue, oldValue) {
				// console.log(newValue);
				// 	console.log(oldValue);
					
					//table刷新的时机
					this.$nextTick(function(){
						this.btnStatus = true;
					})
					
					
			}
		},
	}
</script>

<style>
	.el-main {
		background-color: #e9eef3;
		color: #333;
		text-align: center;
		line-height: 0px;
	}
</style>