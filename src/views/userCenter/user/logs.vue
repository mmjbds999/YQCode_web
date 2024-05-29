<template>
	<el-card shadow="never" header="近7天操作记录">
		<scTable ref="table" :apiObj="list.apiObj" row-key="id" stripe>
<!--		<scTable ref="table" :data="data" height="auto" paginationLayout="total, prev, pager, next" hideDo>-->
			<sc-table-column label="序号" type="index"></sc-table-column>
			<sc-table-column label="业务名称" prop="title" min-width="240"></sc-table-column>
			<sc-table-column label="IP" prop="ip" width="150"></sc-table-column>
			<sc-table-column label="执行时间" prop="exeTime" width="150"></sc-table-column>
			<sc-table-column label="结果" prop="code" width="150">
				<el-tag type="success">成功</el-tag>
			</sc-table-column>
			<sc-table-column label="操作人" prop="user.name" width="150"></sc-table-column>
			<sc-table-column label="操作时间" prop="createTime" width="150"></sc-table-column>

		</scTable>
	</el-card>
</template>

<script>
	import ScTable from "@/components/scTable/index.vue";

	export default {
		components: {ScTable},
		data() {
			return {
				list: {
					apiObj: this.$API.system.log.list
				},
			}
		},
		methods: {
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection
			},
		}
	}
</script>

<style>
</style>
