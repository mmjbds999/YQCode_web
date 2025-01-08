<template>
	<el-dialog title="添加模型" v-model="visible" :fullscreen="true" destroy-on-close @closed="$emit('closed')">
		<el-form ref="form" :model="form" :rules="rules" label-position="top" class="form-container">
			<el-form-item label="模型名称" prop="name">
				<el-input clearable v-model="form.name" placeholder="请输入项目名称"></el-input>
			</el-form-item>
			<el-form-item label="英文名" prop="enName">
				<el-input clearable v-model="form.enName" placeholder="请输入英文名"></el-input>
			</el-form-item>
			<el-form-item>
				<sc-form-table v-model="form.fields" :addTemplate="pageFields" placeholder="暂无字段数据">
					<el-table-column prop="name" label="字段名称">
						<template #default="scope">
							<el-input v-model="scope.row.name" placeholder="字段名称"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="type" label="字段类型" width="150">
						<template #default="scope">
							<el-select v-model="scope.row.type" placeholder="请选择">
								<el-option v-for="item in typeDic" :key="item.code" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="len" label="长度" width="100">
						<template #default="scope">
							<el-input v-model="scope.row.len" placeholder="长度"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="acc" label="精度" width="100">
						<template #default="scope">
							<el-input v-model="scope.row.acc" placeholder="精度"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="comment" label="注释">
						<template #default="scope">
							<el-input v-model="scope.row.comment" placeholder="注释"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="isNull" label="非空" width="60" align="center">
						<template #default="scope">
							<el-checkbox v-model="scope.row.isNull" placeholder="提示词"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column prop="isMain" label="主键" width="50" align="center">
						<template #default="scope">
							<el-checkbox v-model="scope.row.isMain" placeholder="提示词"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column prop="outTab" label="外键表" width="150">
						<template #default="scope">
							<el-select v-model="scope.row.outTab" placeholder="请选择">
								<el-option v-for="item in typeDic" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="outField" label="外键字段" width="150">
						<template #default="scope">
							<el-select v-model="scope.row.outField" placeholder="请选择">
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
				//表单数据
				form: {
					name: '测试项目',
					enName: 'test',
					fields: [
						{
							name: '',
							type: '',
							len: '',
							acc: '',
							comment: '',
							isNull: false,
							isMain: false,
							outTab: '',
							outField: ''
						}
					]
				},
				// 表单内容添加模板
				modFields: {
					name: '',
					type: '',
					len: '',
					acc: '',
					comment: '',
					isNull: false,
					isMain: false,
					outTab: '',
					outField: ''
				},
				typeDic:[],
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
			this.getPageTypeDic()
		},
		methods: {
			getPageTypeDic(){
				this.$API.system.dic.getDicByTypeCode.get({typeCode: 'dataType'}).then(res => {
					this.typeDic = res.data
					this.form.type = this.typeDic[0].code;
				})
			},
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
.form-container {
	padding-left: 20px; /* 左侧留空 */
	padding-right: 20px; /* 右侧留空 */
}
</style>
