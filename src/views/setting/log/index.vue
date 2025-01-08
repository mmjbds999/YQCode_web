<template>
	<el-container>
<!--		<el-aside width="220px">-->
<!--			<el-tree ref="category" class="menu" node-key="label" :data="category" :default-expanded-keys="['系统日志']" current-node-key="系统日志" :highlight-current="true" :expand-on-click-node="false">-->
<!--			</el-tree>-->
<!--		</el-aside>-->
		<el-container>
			<el-main class="nopadding">
				<el-container>
					<el-header>
						<div class="left-panel">
							<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="defaultTime"></el-date-picker>
							<div style="color: #bbbb06; margin-left: 10px">默认显示最近7天的日志，需要查看更多，请根据时间区间查询</div>
						</div>
						<div class="right-panel">

						</div>
					</el-header>
					<el-main class="nopadding">
						<scTable ref="table" :apiObj="apiObj" stripe highlightCurrentRow @row-click="rowClick">
<!--							<el-table-column label="级别" prop="level" width="60">-->
<!--								<template #default="scope">-->
<!--									<el-icon v-if="scope.row.level=='error'" style="color: #F56C6C;"><el-icon-circle-close-filled /></el-icon>-->
<!--									<el-icon v-if="scope.row.level=='warn'" style="color: #E6A23C;"><el-icon-warning-filled /></el-icon>-->
<!--									<el-icon v-if="scope.row.level=='info'" style="color: #409EFF;"><el-icon-info-filled /></el-icon>-->
<!--								</template>-->
<!--							</el-table-column>-->
							<el-table-column label="ID" prop="id" width="180"></el-table-column>
							<el-table-column label="业务名称" prop="title" min-width="240"></el-table-column>
							<el-table-column label="IP" prop="ip" width="150"></el-table-column>
							<el-table-column label="操作结果" prop="code" width="150">
								<template #default="scope">
									<el-tag v-if="scope.row.code==='200'" type="success">成功</el-tag>
									<el-tag v-else type="danger">系统异常</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="执行时间" prop="exeTime" width="150"></el-table-column>
							<el-table-column label="操作用户" prop="user.name" width="150"></el-table-column>
							<el-table-column label="日志时间" prop="createTime" width="170"></el-table-column>
						</scTable>
					</el-main>
				</el-container>
			</el-main>
		</el-container>
	</el-container>

	<el-drawer v-model="infoDrawer" title="日志详情" :size="drawerSize" destroy-on-close>
		<info ref="info"></info>
	</el-drawer>
</template>

<script>
	import info from './info'
	import scEcharts from '@/components/scEcharts'

	export default {
		name: 'log',
		components: {
			info,
			scEcharts
		},
		data() {
			return {
				drawerSize: '50%',
				infoDrawer: false,
				date: [],
				defaultTime:[
					new Date(2000, 1, 1, 0, 0, 0),
					new Date(2000, 2, 1, 23, 59, 59),
				],
				apiObj: this.$API.system.log.all,
				search: {
					keyword: ""
				}
			}
		},
		watch: {
			date(newVal) {
				// 当日期选择变化时触发的操作
				if (newVal && newVal.length === 2) {
					this.$refs.table.upData({createTime_s: newVal[0].toISOString(), createTime_e: newVal[1].toISOString()})
				}else{
					this.$refs.table.reload({createTime_s: "", createTime_e: ""})
				}
			}
		},
		methods: {
			rowClick(row){
				this.infoDrawer = true
				this.$nextTick(() => {
					this.$refs.info.setData(row)
				})
			}
		}
	}
</script>

<style>
</style>
