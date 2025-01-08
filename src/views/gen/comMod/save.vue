<template>
	<el-dialog title="添加模型" v-model="visible" :width="1200" destroy-on-close @closed="$emit('closed')">
		<el-form ref="form" :model="form" :rules="rules" label-position="top">
			<el-form-item label="模型名称" prop="name">
				<el-input clearable v-model="form.name" placeholder="请输入项目名称"></el-input>
			</el-form-item>
			<el-form-item label="英文名" prop="enName">
				<el-input clearable v-model="form.enName" placeholder="请输入英文名"></el-input>
			</el-form-item>
			<el-form-item label="字段" prop="list">
				<sc-form-table ref="table" v-model="form.fields" :addTemplate="addField" drag-sort placeholder="暂无数据">
					<el-table-column prop="name" label="字段名" width="180">
						<template #default="scope">
							<el-input v-model="scope.row.name" placeholder="字段名"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="type" label="字段类型" width="150">
						<template #default="scope">
							<el-select v-model="scope.row.type" placeholder="请选择">
								<el-option v-for="item in typeDic" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="comment" label="注释" min-width="180">
						<template #default="scope">
							<el-input v-model="scope.row.comment" placeholder="注释"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="len" label="长度" min-width="100">
						<template #default="scope">
							<el-input v-model="scope.row.len" placeholder="字段长度"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="acc" label="精度" min-width="80">
						<template #default="scope">
							<el-input v-model="scope.row.acc" placeholder="字段精度"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="is_main" label="主键" width="80" align="center">
						<template #default="scope">
							<el-switch v-model="scope.row.is_main"></el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="out_tab" label="外键" width="180">
						<template #default="scope">
							<el-select v-model="scope.row.out_tab" placeholder="请选择">
								<el-option v-for="item in typeDic" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
					</el-table-column>
				</sc-form-table>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				visible: false,
				isSaveing: false,
				//添加字段
				addField: {
					name: '',
					type: '',
					comment: '',
					len: '',
					acc: '',
					is_main: false,
					out_tab: ''
				},
				// 模型数据
				form: {
					name: "标题",
					enName: "英文名",
					fields: [
						{
							name: 'id',
							type: 'int',
							comment: 'ID',
							len: 20,
							acc: 0,
							is_main: true,
							out_tab: true
						},
						{
							name: 'sort',
							type: 'int',
							comment: '排序',
							len: 20,
							acc: 0,
							is_main: false,
							out_tab: true
						},
						{
							name: 'create_time',
							type: 'datetime',
							comment: '创建时间',
							len: 20,
							acc: 0,
							is_main: false,
							out_tab: true
						},
					]
				},
				//验证规则
				rules: {
					name: [
						{
							required: true,
							message: '请输入项目名称',
						}
					],
					enName: [
						{
							required: true,
							message: '请输入英文名',
						}
					]
				}
			}
		},
		mounted() {
		},
		methods: {
			//显示
			open(){
				this.visible = true;
				return this
			},
			//表单提交方法
			submit(){
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.submitLoading = true
						this.$API.business.project.save.post(this.form).then(res => {
							if(res.code === 200){
								this.submitLoading = false
								this.visible = false;
								this.$message.success('创建成功')
								this.$emit('success')
							}
						})
					}else{
						return false
					}
				})
			}
		}
	}
</script>

<style>
</style>
