<template>
	<el-container>
		<el-aside width="300px" v-loading="showModTypeLoading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="dicFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="modType" class="menu" node-key="id" :data="modTypeList" :highlight-current="true" :expand-on-click-node="false" :filter-node-method="modTypeFilterNode" @node-click="modTypeClick">
						<template #default="{data}">
							<span class="custom-tree-node">
								<span class="label">{{ data.name }}</span>
								<span class="code">{{ data.desp }}</span>
								<span class="do">
									<el-button-group>
										<el-button icon="el-icon-edit" size="small" @click.stop="modTypeEdit(data)"></el-button>
										<el-button icon="el-icon-delete" size="small" @click.stop="modTypeDel(data)"></el-button>
									</el-button-group>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" style="width: 100%;" @click="addModType">模型分类</el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="add">添加模型</el-button>
					<el-button type="primary" icon="el-icon-FolderOpened" @click="add">导入通用模型</el-button>
					<el-button type="primary" icon="el-icon-Coin" @click="add">从Mysql导入</el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del">删除</el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.name" placeholder="模型名称" clearable></el-input>
						<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main>
				<el-row :gutter="15">
					<el-col :lg="6" v-for="(mod, index) in modsList" :key="index">
						<el-card shadow="hover">
							<template #header>
								<div class="card-header">
									<span>{{mod.name}}{{index}}</span>
									<span>
										<el-button-group>
											<el-button type="text" icon="el-icon-edit" @click="edit"></el-button>
											<el-button type="text" style="color: #FABCBC" icon="el-icon-delete" @click="remove"></el-button>
										</el-button-group>
									</span>
								</div>
							</template>
							<div class="text-container" :class="{ expanded: expandedCards[index] }">
								<div v-for="o in 10" :key="o" class="text-item">
									<span class="field-name">{{ '字段名 ' + o }}</span>
									<span class="field-type">{{ '字段类型 ' + o }}</span>
								</div>
							</div>
							<el-button type="text" @click.stop="toggleExpand(index)">{{ expandedCards[index] ? '收起' : '展开' }}</el-button>
						</el-card>
					</el-col>
				</el-row>
			</el-main>
		</el-container>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

	<mod-type-save v-if="dialog.modTypeSave" ref="ModTypeSave" @success="handleTypeSuccess" @closed="dialog.modTypeSave=false"></mod-type-save>

</template>

<script>
import saveDialog from './save.vue'
import ModTypeSave from "./modTypeSave.vue";

export default {
	name: 'mod',
	components: {
		ModTypeSave,
		saveDialog
	},
	data() {
		return {
			showModTypeLoading: true,
			dialog: {
				save: false,
				modTypeSave: false
			},
			apiObj: this.$API.system.mod.list,
			selection: [],
			search: {
				name: null
			},
			expandedCards: {},
			modsList: [],
			modTypeList:[],
			modTypeProps: {
				label: 'name'
			},
			listApiParams: {},
		}
	},
	mounted() {
		this.getModType();
	},
	methods: {
		// 加载模型（默认加载所有，可按类型加载）
		getMods(){
			this.$API.system.mod.list.get(this.listApiParams).then(res => {
				if (res && res.data){
					this.modsList = res.data;
				}
			})
		},
		// 加载树数据，获取模型分类
		async getModType(){
			let res = await this.$API.system.modType.tree.get();
			this.showModTypeLoading = false;
			if(res && res.data){
				this.modTypeList = res.data;
				let firstNode = this.modTypeList[0];
				if(firstNode){
					this.modTypeClick(firstNode)
				}
			}
		},
		// 树过滤功能
		modTypeFilterNode(value, data){
			if (!value) return true;
			var targetText = data.name;
			return targetText.indexOf(value) !== -1;
		},
		// 新增模型分类
		addModType(){
			this.dialog.modTypeSave = true;
			this.$nextTick(() => {
				this.$refs.ModTypeSave.open();
			});
		},
		// 编辑模型分类，增加父类逻辑
		modTypeEdit(data){
			console.log(data)
			this.dialog.modTypeSave = true;
			this.$nextTick(() => {
				let editNode = this.$refs.modType.getNode(data.id);
				data.parent = editNode.level === 1 ? undefined : editNode.parent.data.id;
				this.$refs.ModTypeSave.open('edit').setData(data);
			});
		},
		// 模型分类点击事件
		modTypeClick(data){
			this.$nextTick(() => {
				this.$refs.modType.setCurrentKey(data.id);
			});
			this.listApiParams = {
				typeId: data.id
			};
			this.getMods();
		},
		// 删除模型分类
		modTypeDel(data){
			this.$confirm(`确定删除 ${data.name} 吗？`, '提示', {
				type: 'warning'
			}).then(() => {
				this.$API.system.modType.del.delete({ id: data.id }).then(res => {
					if(res.code === 200){
						this.$message.success("操作成功");
						// 如果删除的是当前选中的分类，重新选中第一个分类
						var dicCurrentKey = this.$refs.modType.getCurrentKey();
						this.$refs.modType.remove(data.id);
						if(dicCurrentKey === data.id){
							var firstNode = this.modTypeList[0];
							if(firstNode){
								this.$refs.modType.setCurrentKey(firstNode.id);
								this.$refs.table.reload({
									typeId: firstNode.id
								});
							}else{
								this.listApi = null;
								this.$refs.table.tableData = [];
							}
						}
					}else{
						this.$alert(res.message, "提示", {type: 'error'});
					}
				});
			}).catch(() => {});
		},
		// 展开收起模型字段
		toggleExpand(index) {
			this.expandedCards[index] = !this.expandedCards[index];
		},
		// 新增模型
		add(){
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open();
			});
		},
		// 删除模型
		async table_del(row){
			let reqData = {id: row.id};
			let res = await this.$API.system.mods.delete(reqData);
			if(res.code === 200){
				this.$refs.table.refresh();
				this.$message.success("删除成功");
			}else{
				this.$alert(res.message, "提示", {type: 'error'});
			}
		},
		// 批量删除
		async batch_del(){
			this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
				type: 'warning'
			}).then(() => {
				let ids = this.selection.map(item => item.id);
				this.$API.system.mods.delBatch.delete(ids).then(res => {
					if(res.code === 200){
						this.$refs.table.refresh();
						this.$message.success("操作成功");
					}else{
						this.$alert(res.message, "提示", {type: 'error'});
					}
				});
			});
		},
		// 搜索模型
		upsearch(){
			this.$refs.table.reload(this.search);
		},
		// 表格选择事件
		selectionChange(selection){
			this.selection = selection;
		},
		// 保存成功后刷新表格
		handleSaveSuccess(){
			this.$refs.table.refresh();
		},
		// 新增或编辑模型分类成功后处理
		handleTypeSuccess(){
			this.getModType();
		}
	}
}
</script>

<style>

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.text-container {
	max-height: 100px;
	overflow: hidden;
	transition: max-height 0.3s ease;
}

.text-container.expanded {
	max-height: 1000px; /* 可以调整为一个足够大的值以显示全部内容 */
}

.text-item {
	display: flex;
	justify-content: space-between;
	padding: 5px 0;
}

.menu:deep(.el-tree-node__label) {display: flex;flex: 1;height:100%;}
.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 24px;height:100%;}
.custom-tree-node .code {font-size: 12px;color: #999;}
.custom-tree-node .do {display: none;}
.custom-tree-node:hover .code {display: none;}
.custom-tree-node:hover .do {display: inline-block;}
</style>
