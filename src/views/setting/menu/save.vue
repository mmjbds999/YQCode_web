<template>
	<el-row :gutter="40">
		<el-col v-if="!form.id">
			<el-empty description="请选择左侧菜单后操作" :image-size="100"></el-empty>
		</el-col>
		<template v-else>
			<el-col :lg="24">
				<h2>{{form.meta.title || "新增菜单"}}</h2>
				<el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="left">
					<el-form-item label="显示名称" prop="meta.title">
						<el-input v-model="form.meta.title" clearable placeholder="菜单显示名字"></el-input>
					</el-form-item>
					<el-form-item label="上级菜单" prop="parentId">
						<el-cascader v-model="form.parentId" :options="menuOptions" :props="menuProps" :show-all-levels="false" placeholder="顶级菜单" clearable disabled></el-cascader>
					</el-form-item>
					<el-form-item label="类型" prop="meta.type">
						<el-radio-group v-model="form.meta.type">
							<el-radio-button label="menu">菜单</el-radio-button>
							<el-radio-button label="button">按钮</el-radio-button>
							<el-radio-button label="iframe">Iframe</el-radio-button>
							<el-radio-button label="link">外链</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="别名" prop="name">
						<el-input v-model="form.name" clearable placeholder="菜单别名"></el-input>
						<div class="el-form-item-msg">系统唯一且与内置组件名一致，否则导致缓存失效。如类型为Iframe的菜单，别名将代替源地址显示在地址栏</div>
					</el-form-item>
					<el-form-item label="菜单图标" prop="meta.icon">
						<sc-icon-select v-model="form.meta.icon" clearable></sc-icon-select>
					</el-form-item>
					<el-form-item label="路由地址" prop="path">
						<el-input v-model="form.path" clearable placeholder=""></el-input>
					</el-form-item>
<!--					<el-form-item label="重定向" prop="redirect">-->
<!--						<el-input v-model="form.redirect" clearable placeholder=""></el-input>-->
<!--					</el-form-item>-->
<!--					<el-form-item label="菜单高亮" prop="active">-->
<!--						<el-input v-model="form.active" clearable placeholder=""></el-input>-->
<!--						<div class="el-form-item-msg">子节点或详情页需要高亮的上级菜单路由地址</div>-->
<!--					</el-form-item>-->
					<el-form-item label="视图" prop="component">
						<el-input v-model="form.component" clearable placeholder="">
							<template #prepend>views/</template>
						</el-input>
						<div class="el-form-item-msg">如父节点、链接或Iframe等没有视图的菜单不需要填写，对应前端的views/后面的路径</div>
					</el-form-item>
					<el-form-item label="颜色" prop="color">
						<el-color-picker v-model="form.meta.color" :predefine="predefineColors"></el-color-picker>
					</el-form-item>
					<el-form-item label="是否隐藏" prop="meta.hidden">
						<el-checkbox v-model="form.meta.hidden">隐藏菜单</el-checkbox>
<!--						<el-checkbox v-model="form.meta.hiddenBreadcrumb">隐藏面包屑</el-checkbox>-->
						<div class="el-form-item-msg">菜单不显示在导航中，但用户依然可以访问，例如详情页</div>
					</el-form-item>
<!--					<el-form-item label="整页路由" prop="fullpage">-->
<!--						<el-switch v-model="form.meta.fullpage" />-->
<!--						<div class="el-form-item-msg">正常不选择，特殊情况下，例如要构造单独的fullPage的时候</div>-->
<!--					</el-form-item>-->
<!--					<el-form-item label="标签" prop="tag">-->
<!--						<el-input v-model="form.meta.tag" clearable placeholder=""></el-input>-->
<!--					</el-form-item>-->
				</el-form>

			</el-col>
			<el-col :lg="24" class="pageContent">
				<h2>菜单内容生成</h2>
				<el-form-item>
					<el-select v-model="form.pageType" placeholder="请选择">
						<el-option v-for="item in pageType" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<sc-form-table v-model="form.pageContent" :addTemplate="pageContentAddTemplate" placeholder="暂无字段数据">
						<el-table-column prop="type" label="字段类型" width="150">
							<template #default="scope">
								<el-select v-model="scope.row.type" placeholder="请选择">
									<el-option v-for="item in typeDic" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="字段名称">
							<template #default="scope">
								<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="长度">
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
				<el-form-item>
					<el-button type="primary" @click="save" :loading="loading">保 存</el-button>
				</el-form-item>
			</el-col>
		</template>
	</el-row>

</template>

<script>
	import scIconSelect from '@/components/scIconSelect'

	export default {
		components: {
			scIconSelect
		},
		props: {
			menu: { type: Object, default: () => {} },
		},
		data(){
			return {
				form: {
					id: "",
					parentId: "",
					name: "",
					path: "",
					component: "",
					redirect: "",
					sort: 0,
					meta:{
						title: "",
						icon: "",
						active: "",
						color: "",
						type: "menu",
						fullpage: false,
						tag: "",
					},
					pageType: "curd",
					pageContent: [],
				},
				menuOptions: [],
				menuProps: {
					value: 'id',
					label: 'title',
					checkStrictly: true
				},
				predefineColors: [
					'#ff4500',
					'#ff8c00',
					'#ffd700',
					'#67C23A',
					'#00ced1',
					'#409EFF',
					'#c71585'
				],
				rules: [],
				// 表单内容添加模板
				pageContentAddTemplate: {
					name: "",
					type: "",
					length: "",
					validate: "",
					tips: ""
				},
				loading: false,
				pageType: [
					{label: "CURD表格", value: "curd"},
					{label: "单页保存", value: "onePage"}
				],
				colType: [
					{label: "文本框", value: "0"},
					{label: "局部", value: "1"}
				],
			}
		},
		watch: {
			menu: {
				handler(){
					this.menuOptions = this.treeToMap(this.menu)
				},
				deep: true
			}
		},
		mounted() {

		},
		methods: {
			//简单化菜单
			treeToMap(tree){
				const map = []
				tree.forEach(item => {
					let obj = {
						id: item.id,
						parentId: item.parentId,
						title: item.meta.title,
						children: item.children&&item.children.length>0 ? this.treeToMap(item.children) : null
					}
					map.push(obj)
				})
				return map
			},
			//保存
			async save(){
				this.loading = true
				let res = await this.$API.system.menu.save.post(this.form)
				this.loading = false
				if(res.code === 200){
					this.$message.success("保存成功")
				}else{
					this.$message.warning(res.message)
				}
			},
			//表单注入数据
			setData(data, pid){
				this.form = data
				this.form.pageContent = data.pageContent || []
				this.form.parentId = pid
				console.log(data.pageType)
				if(!data.pageType || data.pageType === 'undefined'){
					this.form.pageType = "curd"
				}
			}
		}
	}
</script>

<style scoped>
	h2 {font-size: 17px;color: #3c4a54;padding:0 0 30px 0;}
	.pageContent {border-left: 1px solid #eee;}

	[data-theme="dark"] h2 {color: #fff;}
	[data-theme="dark"] .pageContent {border-color: #434343;}
</style>
