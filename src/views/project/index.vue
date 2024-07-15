<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del"></el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.name" placeholder="项目名称" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" @data-loaded="onDataLoaded" stripe highlightCurrentRow>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="项目名称" prop="name" width="250"></el-table-column>
				<el-table-column label="英文名" prop="enName" width="150"></el-table-column>
				<el-table-column label="java端口/启动状态" prop="javaPort" width="150">
					<template #default="scope">
						<el-tag>{{scope.row.javaPort}}</el-tag>
						<el-tag v-if="scope.row.isJavaStart" type="success">已启动</el-tag>
						<el-tag v-else type="danger">未启动</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="vue端口/启动状态" prop="vuePort" width="150">
					<template #default="scope">
						<el-tag>{{scope.row.vuePort}}</el-tag>
						<el-tag v-if="scope.row.isVueStart" type="success">已启动</el-tag>
						<el-tag v-else type="danger">未启动</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建人" prop="createBy.name" width="180"></el-table-column>
				<el-table-column label="创建时间" prop="createTime" width="180">
					<template #default="scope">
						{{ formatDate(scope.row.createTime) }}
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="450">
					<template #default="scope">
						<el-button-group>
							<!-- Java后端启动/重启 -->
							<el-tooltip content="Java后端启动" placement="top" v-if="!scope.row.isJavaStart">
								<el-button icon="el-icon-CaretRight" type="primary" @click="start(scope.row.id, 'java')">JAVA</el-button>
							</el-tooltip>
							<el-tooltip content="Java后端重启" placement="top" v-else>
								<el-button icon="el-icon-RefreshRight" type="warning" @click="restart(scope.row.id, 'java')">JAVA</el-button>
							</el-tooltip>

							<!-- Java后端停止 -->
							<el-tooltip content="Java后端停止" placement="top" v-if="scope.row.isJavaStart">
								<el-button icon="el-icon-SwitchButton" type="danger" @click="stop(scope.row.id, 'java')">JAVA</el-button>
							</el-tooltip>

							<!-- Vue后端启动/重启 -->
							<el-tooltip content="Vue前端启动" placement="top" v-if="!scope.row.isVueStart">
								<el-button icon="el-icon-CaretRight" type="primary" @click="start(scope.row.id, 'vue')">VUE</el-button>
							</el-tooltip>
							<el-tooltip content="Vue前端重启" placement="top" v-else>
								<el-button icon="el-icon-RefreshRight" type="warning" @click="restart(scope.row.id, 'vue')">VUE</el-button>
							</el-tooltip>

							<!-- Vue后端停止 -->
							<el-tooltip content="Vue前端停止" placement="top" v-if="scope.row.isVueStart">
								<el-button icon="el-icon-SwitchButton" type="danger" @click="stop(scope.row.id, 'vue')">VUE</el-button>
							</el-tooltip>
						</el-button-group>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save.vue'
	import {createWebSocket} from '@/utils/websocket';

	export default {
		name: 'dept',
		components: {
			saveDialog
		},
		data() {
			return {
				dialog: {
					save: false
				},
				apiObj: this.$API.business.project.list,
				selection: [],
				search: {
					name: null
				},
				logs: [],
				websockets: {}
			}
		},
		mounted() {

		},
		methods: {
			//表格数据加载完毕后回调事件
			onDataLoaded(data) {
				console.log(data)
				data.forEach(item => {
					const projectId = item.id;
					if (!this.websockets[projectId]) {
						const ws = createWebSocket('ws://localhost:8080/ws/project-log/' + projectId, (message) => {
							console.log(message);
						});
						this.websockets[projectId] = ws;
					}
				});
			},
			//启动项目
			start(projectId, type){
				this.$API.business.project.start.get({projectId: projectId, type: type}).then((res) => {
					if(res.code === 200){
						this.$message.success(res.message)
					}else{
						this.$message.error(res.message)
					}
				})
			},
			//重启项目
			restart(projectId, type){
				this.$API.business.project.start.get({id: projectId, type: type}).then((res) => {
					if(res.code === 200){
						this.$message.success(res.message)
					}else{
						this.$message.error(res.message)
					}
				})
			},
			//停止项目
			stop(projectId, type){
				this.$API.business.project.start.get({id: projectId, type: type}).then((res) => {
					if(res.code === 200){
						this.$message.success(res.message)
					}else{
						this.$message.error(res.message)
					}
				})
			},
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//删除
			async table_del(row){
				let reqData = {id: row.id}
				let res = await this.$API.system.org.del.delete(reqData);
				if(res.code === 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
					let ids = this.selection.map(item => item.id);
					this.$API.system.org.delBatch.delete(ids).then((res) => {
						if(res.code === 200){
							this.$nextTick(() => {
								this.$refs.table.refresh();
								this.$message.success("操作成功")
							});
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}).finally(() => {
						loading.close();
					});
				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//搜索
			upsearch(){
				this.$refs.table.reload(this.search)
			},
			//根据ID获取树结构
			filterTree(id){
				var target = null;
				function filter(tree){
					tree.forEach(item => {
						if(item.id == id){
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
			},
			formatDate(date) {
				const d = new Date(date);
				const year = d.getFullYear();
				const month = (d.getMonth() + 1).toString().padStart(2, '0');
				const day = d.getDate().toString().padStart(2, '0');
				const hours = d.getHours().toString().padStart(2, '0');
				const minutes = d.getMinutes().toString().padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}`;
			}
		}
	}
</script>
