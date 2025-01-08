<template>
	<el-container>
		<el-header style="height: auto;">
			<sc-select-filter :data="filterData" :label-width="80" @on-change="filterChange"></sc-select-filter>
		</el-header>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add">添加模型</el-button>
<!--				<el-button type="primary" icon="el-icon-FolderOpened" @click="add">导入通用模型</el-button>-->
				<el-button type="primary" icon="el-icon-Coin" @click="add">从Mysql导入</el-button>
<!--				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del">删除</el-button>-->
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
				<el-col :lg="6" v-for="(item, index) in items" :key="index">
					<el-card shadow="hover">
						<template #header>
							<div class="card-header">
								<span>文章类型</span>
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
						<template #footer>Footer content</template>
					</el-card>
				</el-col>
			</el-row>
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
import scSelectFilter from '@/components/scSelectFilter'

export default {
	name: 'dept',
	components: {
		saveDialog,
		scSelectFilter
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
			filterData: [],
			expandedCards: {},
			items: [
				{ name: '文章类型' },
				{ name: '其他类型1' },
				{ name: '其他类型1' },
				{ name: '其他类型1' },
				{ name: '其他类型1' },
				{ name: '其他类型1' }
			]
		}
	},
	mounted() {
		this.getDic()
	},
	computed: {
		currentLogs() {
			return this.logs[this.currentPort] || [];
		}
	},
	methods: {
		toggleExpand(index) {
			this.expandedCards[index] = !this.expandedCards[index];
		},
		getDic(){
			this.$API.system.dic.getDicChild.get({typeCode: "module"}).then(res => {
				if(res.code === 200){
					this.filterData = this.transformData(res.data)
				}
			})
		},
		transformData(data) {
			return data.map(category => {
				// 处理每个类别的子项
				const options = category.children.map(item => ({
					label: item.name,
					value: item.code
				}));

				// 添加 "全部" 选项
				options.unshift({
					label: "全部",
					value: ""
				});

				return {
					title: category.name,
					key: category.code,
					multiple: category.code === 'Industry',
					options: options
				};
			});
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
