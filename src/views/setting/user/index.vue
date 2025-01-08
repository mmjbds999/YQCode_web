<template>
	<el-container>
		<el-aside width="200px" v-loading="showGrouploading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="groupFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="group" class="menu" node-key="id" :data="group" :props="defaultProps" :current-node-key="''" :highlight-current="true" :expand-on-click-node="false" :filter-node-method="groupFilterNode" @node-click="groupClick"></el-tree>
				</el-main>
			</el-container>
		</el-aside>
		<el-container>
				<el-header>
					<div class="left-panel">
						<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
						<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del"></el-button>
<!--						<el-button type="primary" plain :disabled="selection.length===0">分配角色</el-button>-->
						<el-button type="primary" plain :disabled="selection.length===0" @click="batch_reset_pwd">密码重置</el-button>
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
							<el-input v-model="search.keyword" placeholder="登录账号 / 用户名" clearable></el-input>
							<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
						</div>
					</div>
				</el-header>
				<el-main class="nopadding">
					<scTable ref="table" :apiObj="apiObj" @selection-change="selectionChange" stripe>
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column label="ID" prop="id" width="80"></el-table-column>
						<el-table-column label="头像" width="80" column-key="filterAvatar" >
							<template #default="scope">
								<el-avatar :src="scope.row.logo" size="small">
									{{ getFirstCharacter(scope.row.name) }}
								</el-avatar>
							</template>
						</el-table-column>
						<el-table-column label="登录账号" prop="account" width="150" column-key="filterUserName"></el-table-column>
						<el-table-column label="用户名" prop="name" width="150" ></el-table-column>
						<el-table-column label="所属组织" prop="orgName" width="200" ></el-table-column>
						<el-table-column label="所属角色" prop="rolesStr" width="200" ></el-table-column>
						<el-table-column label="创建时间" prop="createTime" width="170" ></el-table-column>
						<el-table-column label="用户状态" prop="status" width="80">
							<template #default="scope">
								<div v-if="scope.row.account === 'admin'">
									<el-tag type="success">启用</el-tag>
								</div>
								<div v-else>
									<el-switch
										v-model="scope.row.status"
										@change="changeSwitch($event, scope.row)"
										:loading="scope.row.$switch_status"
										:active-value="0"
										:inactive-value="1">
									</el-switch>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" fixed="right" align="right" width="160">
							<template #default="scope">
								<el-button-group v-if="scope.row.account!=='admin'">
									<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
									<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
									<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
										<template #reference>
											<el-button text type="primary" size="small" v-if="this.userInfo.user.account === 'admin'">删除</el-button>
										</template>
									</el-popconfirm>
								</el-button-group>
							</template>
						</el-table-column>

					</scTable>
				</el-main>
		</el-container>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>
	<reset-pwd v-if="dialog.resetPwd" ref="resetPwd" @closed="dialog.resetPwd=false"></reset-pwd>

</template>

<script>
	import saveDialog from './save'
	import resetPwd from './resetPwd'

	export default {
		name: 'user',
		components: {
			saveDialog,resetPwd
		},
		data() {
			return {
				dialog: {
					save: false,
					resetPwd: false
				},
				showGrouploading: false,
				groupFilterText: '',
				group: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				apiObj: this.$API.system.user.list,
				selection: [],
				userNameF: "",
				search: {
					keyword: null
				},
				userInfo: {}
			}
		},
		watch: {
			groupFilterText(val) {
				this.$refs.group.filter(val);
			}
		},
		mounted() {
			this.userInfo = this.$TOOL.data.get("USER_INFO")
			this.getGroup()
		},
		methods: {
			getFirstCharacter(name) {
				if (!name) return '';
				return name.charAt(0);
			},
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			// 修改密码
			batch_reset_pwd(){
				this.dialog.resetPwd = true
				this.$nextTick(() => {
					this.$refs.resetPwd.open(this.selection.map(item => item.id))
				})
			},
			//删除
			async table_del(row, index){
				var reqData = {id: row.id}
				var res = await this.$API.system.user.del.delete(reqData);
				if(res.code == 200){
					//这里选择刷新整个表格 OR 插入/编辑现有表格数据
					this.$refs.table.tableData.splice(index, 1);
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
					this.$API.system.user.delBatch.delete(this.selection.map(item => item.id)).then(res=>{
						if(res.code === 200){
							this.selection.forEach(item => {
								this.$refs.table.tableData.forEach((itemI, indexI) => {
									if (item.id === itemI.id) {
										this.$refs.table.tableData.splice(indexI, 1)
									}
								})
							})
							this.$message.success("操作成功")
						}else{
							this.$message.success("删除失败："+res.message)
						}
					});
					loading.close();

				}).catch(() => {

				})
			},
			//表格内开关
			changeSwitch(val, row){
				this.$API.system.user.changeStatus.post({id:row.id, status:row.status}).then(res=>{
					if(res.code !== 200){
						row.status = row.status === 1?0:1
						row.$switch_status = true;
						delete row.$switch_status;
						row.status = val;
						this.$message.success("操作成功")
					}
				});
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//加载树数据
			async getGroup(){
				this.showGrouploading = true;
				let res = await this.$API.system.org.list.get({isUsed:true});
				if(res && res.code === 200){
					let allNode ={id: '', name: '所有'}
					res.data.unshift(allNode);
					this.group = res.data;
				}
				this.showGrouploading = false;
			},
			//树过滤
			groupFilterNode(value, data){
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			//树点击事件
			groupClick(data){
				const params = {
					orgId: data.id,
					keyword: this.search.keyword
				};
				this.$refs.table.reload(params)
			},
			//搜索
			upsearch(){
				this.$refs.table.upData(this.search)
			},
			//本地更新数据
			handleSuccess(data, mode){
				if(mode==='add'){
					this.$refs.table.tableData.unshift(data)
				}else if(mode==='edit'){
					this.$refs.table.tableData.filter(item => item.id===data.id ).forEach(item => {
						Object.assign(item, data)
					})
				}
			}
		}
	}
</script>

<style>
</style>
