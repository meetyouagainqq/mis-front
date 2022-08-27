<template>
	<div>
		<div id="">
			<el-form :inline="true" class="demo-form-inline">
				<el-input v-model="queryPname" placeholder="请输入系列名称" style="width: 300px"></el-input>
				<el-button type="primary" @click="selectByName(queryPname)">查询</el-button>
				<el-button type="primary" @click="openAddDialog()">添加</el-button>
				<el-button type="warning" @click="openEditDialog()">修改</el-button>
				<el-button type="primary" @click="openGLDialog()">关联申购</el-button>
			</el-form>
		</div>

		<el-dialog title="添加" :visible.sync="addFormVisible">
			<!--添加的弹出框-->
			<el-form ref="addtableData" :model="addtableData" label-width="120px" class="demo-ruleForm">
				<el-form-item label="推荐产品" prop="pname">
					<!--推荐产品的下拉列表-->
					<el-select v-model="addtableData.pname" placeholder="产品列表">
						<el-option v-for="(option, index) in optionList" :key="index" :label="option.pname"
							:value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="推荐度" prop="finer">
					<el-select v-model="addtableData.finer" placeholder="推荐度">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否投顾端可见" prop="">
					<el-radio v-model="addtableData.visible" label="1">是</el-radio>
					<el-radio v-model="addtableData.visible" label="0">否</el-radio>
				</el-form-item>
				<el-form-item label="是否首发" prop="">
					<el-radio v-model="addtableData.issue" label="1">是</el-radio>
					<el-radio v-model="addtableData.issue" label="0">否</el-radio>
				</el-form-item>
				<el-form-item label="线上申购开启" prop="">
					<el-radio v-model="addtableData.subscribe" label="1">是</el-radio>
					<el-radio v-model="addtableData.subscribe" label="0">否</el-radio>
				</el-form-item>
				<el-form-item label="推荐理由" prop="">
					<el-input v-model="addtableData.explain" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSubmit()">确 定</el-button>
			</div>
		</el-dialog>


		<el-dialog title="修改" :visible.sync="editFormVisible">
			<!--修改的弹出框-->
			<el-form ref="editTableData" :model="editTableData" label-width="120px" class="demo-ruleForm">

				<el-form-item label="产品名称" prop="pname">
					<el-input v-model="editTableData.pname" disabled placeholder="请输入内容"></el-input>
				</el-form-item>

				</el-form-item>
				<el-form-item label="推荐度" prop="finer">
					<el-select v-model="editTableData.finer" placeholder="推荐度">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否投顾端可见" prop="visible">
					 <el-radio-group v-model="editTableData.visible">
					    <el-radio :label="1">是</el-radio>
					    <el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否首发" prop="issue">
					<el-radio-group v-model="editTableData.issue">
					    <el-radio :label="1">是</el-radio>
					    <el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="线上申购开启" prop="subscribe">
					<el-radio-group v-model="editTableData.subscribe">
					    <el-radio :label="1">是</el-radio>
					    <el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="推荐理由" prop="explain">
					<el-input v-model="editTableData.explain" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSubmit()">确 定</el-button>
			</div>
		</el-dialog>


		<el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="editCurrentChange">
			<el-table-column prop="pname" label="产品名称" width="180">
			</el-table-column>
			<el-table-column prop="finer" label="推荐度" width="180">
			</el-table-column>
			<el-table-column prop="issue" label="是否首发">
			</el-table-column>
			<el-table-column prop="subscribe" label="线上申购">
			</el-table-column>
			<el-table-column prop="sort" label="排序">
			</el-table-column>

		</el-table>
		
		<el-dialog title="关联模板" :visible.sync="relFormVisible">
					<template>
					  <div style="text-align: center">
					      <el-transfer
					        style="text-align: left; display: inline-block"
					        v-model="yesdata"
							:props="{key:'pid',label:'pname'}"
					        :titles="['未关联', '已关联']"
					        :button-texts="['取消关联', '关联']"
					        @change="handleChange"
					        :data="nodata">
					      </el-transfer>
					    </div>
					</template>
					<div slot="footer" class="dialog-footer">
					  <el-button @click="relFormVisible = false">取 消</el-button>
					  <el-button type="primary" @click="relSubmit()">确 定</el-button>
					</div>
				</el-dialog>


		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.page" :page-sizes="[3, 5, 10]" :page-size="pageInfo.pageSize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalNum">
		</el-pagination>
	</div>

</template>
<script>
	export default {
		data() {
			return {
				nodata:[],
				
				tableData: [],
				queryPname: '',
				yesdata:[],
				queryForm: '',
				pname:'',
				addtableData: {
					pname: '',
					finer: '',
					issue: '',
					subscribe: '',
					sort: '',
					visible: '',
					explain: ''
				},
				editTableData: {
					id: '',
					pname: '',
					finer: '',
					issue: '',
					subscribe: '',
					sort: '',
					visible: '',
					explain: ''
				},
				optionList: [{
					pname: ''
				}],
				pageInfo: {
					page: 1,
					pageSize: 10,
					totalNum: 20
				},
				addFormVisible: false,
				editFormVisible: false,
				relFormVisible:false,
				
				relvalue:null,
				mydirection:null,
				mymovedkeys:null,
				options: [{
						value: '0',
						label: '普通推荐'
					},
					{
						value: '1',
						label: '热门推荐'
					},
				],
				

			}
			currentRow:null;
		},
		methods: {
			openGLDialog(){
				this.relFormVisible=true;
			},
			handleChange(value, direction, movedKeys){
				//this.relFormVisible=true;
				/* console.log(value, direction, movedKeys);
									this.relvalue=value;
									this.mydirection=direction;
									this.mymovedkeys = movedKeys; */
				
			},
			editSubmit() {
					this.editFormVisible = false;
				//提交数据
				console.log(this.editTableData);
				this.$axios.get("/productRecommend/EditProduct?id="+this.currentRow.id )
					.then(respInfo => {
						console.log(respInfo);
						this.editTableData=this.respInfo.data.data;
						if (respInfo.data.code == 240) {
							this.$message({
								message: '修改成功',
								type: 'success'
							});
						
							this.myQuery('')
						} else if (respInfo.data.code == 290) {
							this.$message.error('修改失败');
						}
				})
			},
			editCurrentChange(val) {
				console.log(val);
				this.currentRow = val;
			},
			openEditDialog() {
					this.editFormVisible = true;
				if(this.currentRow==''||this.currentRow==null){
					 this.$message({
					    type: 'info',
					    message: `请选中行！`
					 });
					 return;
				}
				//修改
			
				console.log(this.currentRow);
				this.editTableData=this.currentRow;
				this.$axios.get("/productRecommend/getProductForEdit?pid=" + this.currentRow.id)
					.then(respInfo => {
						this.editTableData = respInfo.data.data;
					})
			},
			openAddDialog() {
				//添加
				this.addFormVisible = true;
				this.$nextTick(function() {
					this.$refs.addform.resetFields();
				});
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				//改pageInfo对象中的值
				this.pageInfo.page = 1;
				this.pageInfo.pageSize = val;
				let queryParams =
				this.$qs.stringify(this.pageInfo) + "&" + this.$qs.stringify(this.queryForm);
				//调用查询方法
				this.myQuery(queryParams);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				//该pageInfo中的值 
				this.pageInfo.page = val;
				//把pageInfo的值传过去
				this.myQuery(this.$qs.stringify(this.pageInfo));
			},
			addSubmit() {
				this.addFormVisible = false;
				this.$axios.get("/productRecommend/add?" + this.$qs.stringify(this.addtableData))
					.then((respInfo) => {
						if (respInfo.data.code == 240) {
							this.$message({
								message: '添加成功',
								type: 'success'
							});
						} else if (respInfo.data.code == 290) {
							this.$message.error('添加失败');
						}
					});
			},
			selectByName(params) {
				//菜单?name= + params
				console.log(params);
				this.$axios.get("/productRecommend/getProductByPName?pname=" + params)
					.then((respInfo) => {
						if (respInfo.data.code == 240) {
							this.tableData = respInfo.data.data;
							this.pageInfo=respInfo.data.pageInfo
							this.$message({
								message: '查询成功',
								type: 'success'
							});
						} else if (respInfo.data.code == 290) {
							this.tableData = [];
							this.pageInfo.totalNum = 0;
							this.pageInfo.page = 1;
							this.$message.error('查询失败');
						}
					});
			},

			myQuery(arr) {
				this.$axios.get("/productRecommend/getAllProduct?" + arr)
					.then(resp => {
						if (resp.data.code == 240) {
							this.tableData = resp.data.data;
							this.tableData.map(finer=>{
								if(finer==1){
								finer='是';	
								}else if(finer==0){
									finer='否';	
								}
							});
							
							this.pageInfo = resp.data.pageInfo;
						} else {
							this.tableData = [];
							this.pageInfo.page = 1;
							this.pageInfo.pageSize = 1;
						}
					})
			},
			getDropDownList() {
				this.$axios.get("/productRecommend/getDropDownList")
					.then((respInfo) => {
						this.optionList = respInfo.data.data;
					});
			},

		},
		mounted() {
			this.myQuery('');
			this.getDropDownList('');


		}
	}
</script>

<style>
</style>
