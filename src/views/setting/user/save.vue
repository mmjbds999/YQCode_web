<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
<!--			<el-form-item label="头像" prop="avatar">-->
<!--				<sc-upload v-model="form.avatar" title="上传头像"></sc-upload>-->
<!--			</el-form-item>-->
			<el-form-item label="登录账号" prop="account">
				<el-input v-model="form.account" placeholder="用于登录系统" clearable></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="name">
				<el-input v-model="form.name" placeholder="请输入用户名" clearable></el-input>
			</el-form-item>
			<template v-if="mode==='add'">
				<el-form-item label="登录密码" prop="password">
					<el-input type="password" v-model="form.password" clearable show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input type="password" v-model="form.password2" clearable show-password></el-input>
				</el-form-item>
			</template>
			<el-form-item label="所属部门" prop="orgId">
				<el-cascader v-model="form.orgId" :options="depts" :props="deptsProps" clearable style="width: 100%;" @change="handleOrgChange"></el-cascader>
			</el-form-item>
			<el-form-item label="所属角色" prop="rolesId">
				<el-select v-model="form.rolesIdCk" multiple filterable style="width: 100%" @change="handleRolesChange">
					<el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增用户',
					edit: '编辑用户',
					show: '查看'
				},
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					id:"",
					account: "",
					avatar: "",
					name: "",
					orgId: "",
					rolesStr: []
				},
				//验证规则
				rules: {
					account: [
						{required: true, message: '请输入登录账号'}
					],
					name: [
						{required: true, message: '请输入真实姓名'}
					],
					password: [
						{required: true, message: '请输入登录密码'}
					],
					password2: [
						{required: true, message: '请再次输入密码'},
						{validator: (rule, value, callback) => {
							if (value != this.form.password) {
								callback(new Error('两次输入密码不一致!'));
							}else{
								callback();
							}
						}}
					],
					orgId: [
						{required: true, message: '请选择所属部门'}
					],
					rolesId: [
						{required: true, message: '请选择所属角色', trigger: 'blur'}
					]
				},
				//所需数据选项
				groups: [],
				groupsProps: {
					value: "id",
					label: 'name',
					multiple: true,
					checkStrictly: true
				},
				depts: [],
				deptsProps: {
					value: "id",
					label: 'name',
					checkStrictly: true,
					emitPath: false // 只返回最后一个选中的节点值
				}
			}
		},
		mounted() {
			this.getGroup()
			this.getDept()
		},
		methods: {
			handleOrgChange(value) {
				const selectedOrgName = this.findOrgPathById(value, this.depts);
				this.form.orgName = selectedOrgName || '';
			},
			handleRolesChange(value) {
				const selectedRoles = this.groups.filter(group => value.includes(group.id));
				this.form.rolesStr = selectedRoles.map(role => role.name).join(',');
				this.form.rolesId = selectedRoles.map(role => role.id).join(',');
			},
			findOrgPathById(id, nodes, path = []) {
				for (let node of nodes) {
					const currentPath = path.concat(node.name); // 组合当前路径
					if (node.id === id) {
						return currentPath.join(' / '); // 返回完整路径
					}
					if (node.children) {
						const found = this.findOrgPathById(id, node.children, currentPath);
						if (found) {
							return found;
						}
					}
				}
				return null;
			},
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//加载树数据
			async getGroup(){
				let res = await this.$API.system.role.list.get();
				this.groups = res.data;
			},
			async getDept(){
				let res = await this.$API.system.org.list.get();
				this.depts = res.data;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						var res = await this.$API.system.user.sysSave.post(this.form);
						this.isSaveing = false;
						if(res.code === 200){
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				Object.assign(this.form, data)
				this.form.rolesIdCk = data.rolesId.split(',').map(Number);
			}
		}
	}
</script>

<style>
</style>
