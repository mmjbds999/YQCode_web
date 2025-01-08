<template>
	<el-dialog title="创建页面" v-model="visible" :fullscreen="true" destroy-on-close @closed="$emit('closed')">
		<div class="dialog-content">
			<el-form ref="form" :model="form" :rules="rules" label-position="top">
				<el-row :gutter="20">
					<el-col :span="12">
						<!-- 页面名称和英文名在左侧，垂直排列 -->
						<el-form-item label="页面名称" prop="name">
							<el-input clearable v-model="form.name" placeholder="请输入页面名称"></el-input>
						</el-form-item>
						<el-form-item label="英文名" prop="enName">
							<el-input clearable v-model="form.enName" placeholder="请输入英文名"></el-input>
						</el-form-item>
					</el-col>
					<!-- 简介在右侧，占两行 -->
					<el-col :span="12">
						<el-form-item label="简介" prop="desp">
							<el-input type="textarea" :rows="5" v-model="form.desp" clearable placeholder="请输入简介"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
	<!--			<el-form-item label="页面类型" prop="type">-->
	<!--				<sc-select v-model="form.type" :apiObj="$API.system.dic.getDicByTypeCode" :params="{typeCode: 'pageType'}" clearable filterable style="width: 100%;"></sc-select>-->
	<!--			</el-form-item>-->
				<el-form-item label="页面类型" prop="type">
					<el-radio-group v-model="form.type">
						<el-radio v-for="item in typeDic" :key="item.code" :label="item.code">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="模型选择" prop="type">
					<el-radio-group v-model="form.type">
						<el-radio v-for="item in typeDic" :key="item.code" :label="item.code">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<sc-form-table v-model="form.pageContent" :addTemplate="pageFields" placeholder="暂无字段数据">
						<el-table-column prop="type" label="字段类型" width="150">
							<template #default="scope">
								<el-select v-model="scope.row.type" placeholder="请选择">
									<el-option v-for="item in typeDic" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="字段名称">
							<template #default="scope">
								<el-input v-model="scope.row.name" placeholder="请输入字段名称"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="英文名">
							<template #default="scope">
								<el-input v-model="scope.row.name" placeholder="请输入英文名"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="输入长度限制">
							<template #default="scope">
								<el-input v-model="scope.row.name" placeholder="请输入长度"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="type" label="验证方式">
							<template #default="scope">
								<el-select v-model="scope.row.type" placeholder="请选择">
									<el-option v-for="item in typeDic" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="提示词">
							<template #default="scope">
								<el-input v-model="scope.row.name" placeholder="提示词"></el-input>
							</template>
						</el-table-column>
					</sc-form-table>
				</el-form-item>
			</el-form>
		</div>
		<!-- 固定在底部的 footer -->
		<template #footer>
			<div class="dialog-footer">
				<el-button icon="el-icon-close" @click="visible=false">取 消</el-button>
				<el-button :loading="isSaveing" icon="el-icon-view" @click="submit()">预 览</el-button>
				<el-button type="primary" :loading="isSaveing" icon="el-icon-check" @click="submit()">保 存</el-button>
			</div>
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
				typeDic: [],
				//表单数据
				form: {
					name: '测试页面',
					enName: 'test',
					type: 0,
					desp: '测试'
				},
				// 表单内容添加模板
				pageFields: {
					name: "",
					type: "",
					length: "",
					validate: "",
					tips: ""
				},
				//验证规则
				rules: {
					name: [
						{
							required: true,
							message: '请输入页面名称',
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
				this.$API.system.dic.getDicByTypeCode.get({typeCode: 'pageType'}).then(res => {
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

<style scoped>
.dialog-footer {
	text-align: center;
	padding: 10px;
	background-color: #fff;
	border-top: 1px solid #ebeef5;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-dialog__body {
	padding-bottom: 60px; /* 预留footer的高度 */
	overflow-y: auto;
	max-height: calc(100vh - 150px); /* 确保内容区域不超出视口 */
}
</style>
