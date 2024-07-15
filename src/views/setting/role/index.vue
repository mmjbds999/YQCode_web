<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del"></el-button>
				<el-button type="primary" plain :disabled="selection.length!==1" @click="permission">权限设置</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="角色名称" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column label="角色名称" prop="name" width="150"></el-table-column>
				<el-table-column label="别名" prop="aliasName" width="200"></el-table-column>
				<el-table-column label="数据权限" prop="dataRoleStr" width="200"></el-table-column>
				<el-table-column label="状态" prop="status" width="80">
					<template #default="scope">
						<div v-if="scope.row.aliasName === 'su'">
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
				<el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
				<el-table-column label="备注" prop="remark" min-width="150"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="170">
					<template #default="scope">
						<el-button-group v-if="scope.row.aliasName!=='su'">
							<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
							<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button text type="primary" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

	<permission-dialog v-if="dialog.permission" ref="permissionDialog" @closed="dialog.permission=false"></permission-dialog>

</template>

<script>
	import saveDialog from './save'
	import permissionDialog from './permission'

	export default {
		name: 'role',
		components: {
			saveDialog,
			permissionDialog
		},
		data() {
			return {
				dialog: {
					save: false,
					permission: false
				},
				apiObj: this.$API.system.role.list,
				selection: [],
				search: {
					keyword: null
				}
			}
		},
		methods: {
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//权限设置
			permission(){
				this.dialog.permission = true
				this.$nextTick(() => {
					this.$refs.permissionDialog.open(this.selection)
				})
			},
			//删除
			async table_del(row){
				let reqData = {id: row.id}
				let res = await this.$API.system.role.del.delete(reqData);
				if(res.code === 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				let ids = [];
				this.selection.forEach(item => {
					if(item.aliasName !== 'su'){
						ids.push(item.id)
					}
				})
				this.$confirm(`确定删除选中的 ${ids.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
					this.$API.system.role.delBatch.delete(ids).then((res) => {
						if(res.code === 200){
							this.selection.forEach(item => {
								if(item.aliasName !== 'su'){
									this.$refs.table.tableData.forEach((itemI, indexI) => {
										if (item.id === itemI.id) {
											this.$refs.table.tableData.splice(indexI, 1)
										}
									})
								}
							})
							this.$message.success("操作成功")
						}
					})
					loading.close();
				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//表格内开关
			changeSwitch(val, row){
				this.$API.system.role.changeStatus.post({id:row.id, status:row.status}).then(res=>{
					if(res.code !== 200){
						row.status = row.status === 1?0:1
						row.$switch_status = true;
						delete row.$switch_status;
						row.status = val;
						this.$message.success("操作成功")
					}
				});
			},
			//搜索
			upsearch(){
				this.$refs.table.reload(this.search)
			},
			//根据ID获取树结构
			filterTree(id){
				let target = null;
				function filter(tree){
					tree.forEach(item => {
						if(item.id === id){
							target = item
						}
						if(item.children){
							filter(item.children)
						}
					})
				}
				filter(this.$refs.table.tableData)
				return target
			},
			//本地更新数据
			handleSaveSuccess(data, mode){
				if(mode==='add'){
					this.$refs.table.refresh()
				}else if(mode==='edit'){
					this.$refs.table.refresh()
				}
			}
		}
	}
</script>

<style>
</style>
