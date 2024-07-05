<template>
	<el-dialog title="角色权限设置" v-model="visible" :width="600" destroy-on-close @closed="$emit('closed')">
		<el-tabs tab-position="top">
			<el-tab-pane label="菜单权限">
				<div class="treeMain">
					<el-tree ref="menu" node-key="id" :data="menu.list" :props="menu.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="数据权限">
				<el-form label-width="100px" label-position="left">
					<el-form-item label="规则类型">
						<el-select v-model="dataRolesCK" placeholder="请选择">
							<el-option v-for="d in dataRoles" :key="d.code" :label="d.name" :value="d.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择部门" v-show="dataRolesCK==='4'">
						<div class="treeMain" style="width: 100%;">
							<el-tree ref="dept" node-key="id" :data="data.list" :props="data.props" show-checkbox></el-tree>
						</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="资源权限（接口）">
				<div class="treeMain">
					<el-tree ref="resource" node-key="id" :data="resource.list" :props="resource.props" :default-checked-keys="resource.checked" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
		</el-tabs>
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
				ids: [],
				visible: false,
				isSaveing: false,
				menu: {
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.meta.title
						}
					}
				},
				resource: {
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.url
						}
					}
				},
				data: {
					dataType :"1",
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.name
						}
					},
					rule: ""
				},
				dashboard: "0",
				dashboardOptions: [
					{
						value: '0',
						label: '数据统计',
						views: 'stats'

					},
					{
						value: '1',
						label: '工作台',
						views: 'work'
					},
				],
				dataRoles: [],
				dataRolesCK: 0,
				curRole:{}
			}
		},
		mounted() {

		},
		watch: {
			curRole(newVal) {
				if (newVal) {
					this.getMenu()
					this.getDic()
					this.getResource()
					this.getDept()
				}
			}
		},
		methods: {
			getDic(){
				this.$API.system.dic.getDicByTypeCode.get({typeCode: "dataRole"}).then(res => {
					if(res.code === 200){
						this.dataRoles = res.data
					}
				})
			},
			open(objs){
				this.ids = objs.map(item => item.id)
				this.$API.system.role.getRoleById.get({id: this.ids[0]}).then(res => {
					if(res.code === 200){
						this.curRole = res.data
						this.dataRolesCK = res.data.dataRole
					}
				})
				this.visible = true;
			},
			submit(){
				this.isSaveing = true;
				let checkedKeys = this.$refs.menu.getCheckedKeys().concat(this.$refs.menu.getHalfCheckedKeys())
				let checkedKeys_dept = this.$refs.dept.getCheckedKeys().concat(this.$refs.dept.getHalfCheckedKeys())
				let checkedKeys_resource = this.$refs.resource.getCheckedKeys().concat(this.$refs.resource.getHalfCheckedKeys())
				const filteredAndConvertedKeys = checkedKeys_resource
					.filter(key => !isNaN(key)) // 过滤掉非数字字符串
					.map(Number); // 将剩余的字符串转换为数字

				const param = {
					roleId: this.ids[0],
					menuIds: checkedKeys,
					dataRole: this.dataRolesCK+'',
					resourceIds: filteredAndConvertedKeys,
					dataRoleOrgIds: checkedKeys_dept
				}

				this.$API.system.role.permissions.post(param).then(res => {
					if (res.code === 200){
						this.$message.success("授权保存成功！")
						this.visible = false;
					}else{
						this.$message.error(res.msg)
					}
				})
				this.isSaveing = false;
			},
			async getMenu(){
				let res = await this.$API.system.menu.list.get()
				this.menu.list = res.data.menu

				let checkedRes = await this.$API.system.menu.getMenuIdsByRoleId.get({roleId: this.ids[0]})
				if(checkedRes.code === 200){
					this.menu.checked = checkedRes.data
					if(checkedRes.data.length > 0){
						this.$nextTick(() => {
							let filterKeys = this.menu.checked.filter(key => this.$refs.menu.getNode(key).isLeaf)
							this.$refs.menu.setCheckedKeys(filterKeys, true)
						})
					}
				}
			},
			async getDept(){
				let res = await this.$API.system.org.list.get({isUsed: true});
				this.data.list = res.data
				this.data.checked = this.curRole.orgIds?this.curRole.orgIds.split(","):[]
				this.$nextTick(() => {
					let filterKeys = this.data.checked.filter(key => this.$refs.dept.getNode(key).isLeaf)
					this.$refs.dept.setCheckedKeys(filterKeys, true)
				})
			},
			async getResource() {
				let res = await this.$API.system.resource.list.get();
				this.resource.list = res.data
				let checkedRes = await this.$API.system.resource.getRoleResources.get({roleId: this.ids[0]})
				if(checkedRes.code === 200){
					this.resource.checked = checkedRes.data
					if(checkedRes.data.length > 0){
						this.$nextTick(() => {
							let filterKeys = this.resource.checked.filter(key => this.$refs.resource.getNode(key).isLeaf)
							this.$refs.resource.setCheckedKeys(filterKeys, true)
						})
					}
				}
			},
			getGrid(){
				this.grid.list = [
					{
						key: "welcome",
						title: "欢迎",
						isFixed: true
					},
					{
						key: "ver",
						title: "版本信息",
						isFixed: true
					},
					{
						key: "time",
						title: "时钟"
					},
					{
						key: "progress",
						title: "进度环"
					},
					{
						key: "echarts",
						title: "实时收入"
					},
					{
						key: "about",
						title: "关于项目"
					}
				]
			}
		}
	}
</script>

<style scoped>
	.treeMain {height:400px;overflow: auto;border: 1px solid #dcdfe6;margin-bottom: 10px;}
</style>
