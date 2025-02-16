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
			<scTable ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" @dataChange="onDataLoaded" stripe highlightCurrentRow>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="项目名称" prop="name" width="250"></el-table-column>
				<el-table-column label="英文名" prop="enName" width="150"></el-table-column>
				<el-table-column label="java端口/启动状态" prop="javaPort" width="250">
					<template #default="scope">
						<el-tag>{{scope.row.javaPort}}</el-tag>
						<el-tag style="cursor: pointer;" type="warning" @click="openLog(scope.row.javaPort)">log</el-tag>
						<el-tag v-if="scope.row.isJavaStart" type="success">已启动</el-tag>
						<el-tag v-else type="danger">未启动</el-tag>
						<el-tag style="cursor: pointer;" v-if="scope.row.isJavaStart" @click="openProject(scope.row.javaPort, 'java')" target="_blank">open</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="vue端口/启动状态" prop="vuePort" width="250">
					<template #default="scope">
						<el-tag>{{scope.row.vuePort}}</el-tag>
						<el-tag style="cursor: pointer;" type="warning" @click="openLog(scope.row.vuePort)">log</el-tag>
						<el-tag v-if="scope.row.isVueStart" type="success">已启动</el-tag>
						<el-tag v-else type="danger">未启动</el-tag>
						<el-tag style="cursor: pointer;" v-if="scope.row.isJavaStart" @click="openProject(scope.row.vuePort, 'vue')" target="_blank">open</el-tag>
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
								<el-button icon="el-icon-CaretRight" type="primary" @click="start(scope.row.id, 'java', scope.row.javaPort)">JAVA</el-button>
							</el-tooltip>
							<el-tooltip content="Java后端重启" placement="top" v-else>
								<el-button icon="el-icon-RefreshRight" type="warning" @click="restart(scope.row.id, 'java', scope.row.javaPort)">JAVA</el-button>
							</el-tooltip>

							<!-- Java后端停止 -->
							<el-tooltip content="Java后端停止" placement="top" v-if="scope.row.isJavaStart">
								<el-button icon="el-icon-SwitchButton" type="danger" @click="stop(scope.row.id, 'java', scope.row.javaPort)">JAVA</el-button>
							</el-tooltip>

							<!-- Vue后端启动/重启 -->
							<el-tooltip content="Vue前端启动" placement="top" v-if="!scope.row.isVueStart">
								<el-button icon="el-icon-CaretRight" type="primary" @click="start(scope.row.id, 'vue', scope.row.vuePort)">VUE</el-button>
							</el-tooltip>
							<el-tooltip content="Vue前端重启" placement="top" v-else>
								<el-button icon="el-icon-RefreshRight" type="warning" @click="restart(scope.row.id, 'vue', scope.row.vuePort)">VUE</el-button>
							</el-tooltip>

							<!-- Vue后端停止 -->
							<el-tooltip content="Vue前端停止" placement="top" v-if="scope.row.isVueStart">
								<el-button icon="el-icon-SwitchButton" type="danger" @click="stop(scope.row.id, 'vue', scope.row.vuePort)">VUE</el-button>
							</el-tooltip>
						</el-button-group>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

	<el-drawer v-model="drawer" title="日志" :direction="direction" class="custom-drawer">
		<div class="log-container" ref="logContainer">
			<div v-for="(log, index) in currentLogs" :key="index" class="log-item">{{ log }}</div>
		</div>
	</el-drawer>

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
				logs: this.$TOOL.data.get("projectLogs") || {},
				websockets: {},
				drawer: false,
				direction: 'btt',
				currentPort: null,
				vueStartBtnStatus: false,
			}
		},
		mounted() {

		},
		computed: {
			currentLogs() {
				return this.logs[this.currentPort] || [];
			}
		},
		methods: {
			openProject(port, type) {
				let url = window.location.origin.substring(0, window.location.origin.lastIndexOf(':')) + ':' + port;
				if(type === 'java'){
					url += '/doc'
				}else{
					url += '/#/login'
				}
				window.open(url);
			},
			//表格数据加载完毕后回调事件
			onDataLoaded(data) {
				if(data && data.data && Array.isArray(data.data.rows)){
					data.data.rows.forEach(item => {
						const javaPort = item.javaPort;
						const vuePort = item.vuePort;
						if (!this.websockets[javaPort]) {
							// java
							const javaWs = createWebSocket('ws://localhost:10801/ws/project-log/' + javaPort, (message) => {
								if (this.logs[javaPort]) {
									this.logs[javaPort].push(message);
								} else {
									this.logs[javaPort] = [message];
								}
								this.scrollToBottom();
								this.$TOOL.data.set("projectLogs", this.logs)
								if(message.includes('请求URL: ') || message === 'java success'){
									this.$refs.table.refresh()
								}
							});
							this.websockets[javaPort] = javaWs;
						}
						if (!this.websockets[vuePort]) {
							// vue
							const vueWs = createWebSocket('ws://localhost:10801/ws/project-log/' + vuePort, (message) => {
								if (this.logs[vuePort]) {
									this.logs[vuePort].push(message);
								} else {
									this.logs[vuePort] = [message];
								}
								this.scrollToBottom();
								this.$TOOL.data.set("projectLogs", this.logs)
								if(message === 'vue success' || message.includes('App running at:')){
									this.$refs.table.refresh()
								}
							});
							this.websockets[vuePort] = vueWs;
						}
					});
				}
			},
			// 滚动到底部方法
			scrollToBottom() {
				this.$nextTick(() => {
					if(this.drawer){
						const container = this.$refs.logContainer;
						container.scrollTop = container.scrollHeight;
					}
				});
			},
			//打开日志窗口
			openLog(port){
				this.drawer = true
				this.currentPort = port;
				this.scrollToBottom();
			},
			//启动项目
			start(projectId, type, port){
				this.logs[port] = []
				this.$TOOL.data.set("projectLogs", this.logs)
				this.$API.business.project.start.get({projectId: projectId, type: type}).then((res) => {
					if(res.code === 200){
						this.$message.success(res.message)
						this.openLog(port)
					}else{
						this.$message.error(res.message)
					}
				})
			},
			//重启项目
			restart(projectId, type, port){
				this.logs[port] = []
				this.$TOOL.data.set("projectLogs", this.logs)
				this.$API.business.project.restart.get({projectId: projectId, type: type}).then((res) => {
					if(res.code === 200){
						this.$message.success(res.message)
						this.openLog(port)
					}else{
						this.$message.error(res.message)
					}
				})
			},
			//停止项目
			stop(projectId, type, port){
				this.logs[port] = []
				this.$TOOL.data.set("projectLogs", this.logs)
				this.$API.business.project.stop.get({projectId: projectId, type: type}).then((res) => {
					if(res.code === 200){
						this.$message.success(res.message)
						this.openLog(port)
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
			handleSaveSuccess(){
				this.$refs.table.refresh()
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

<style>
	.custom-drawer {
		background-color: rgba(0, 0, 0, 0.7);
		color: rgba(9, 189, 39, 0.99);
		height: 50vh !important; /* 设置高度为半屏 */
		bottom: 0; /* 从底部开始 */
	}

	.log-container {
		max-height: 100%;
		overflow-y: auto;
	}

	.log-item {
		margin-bottom: 5px;
		white-space: pre-wrap;
	}
</style>
