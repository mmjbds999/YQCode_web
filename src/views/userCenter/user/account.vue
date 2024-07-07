<template>
<!--	<el-alert title="异步组件动态加载使用了正处于试验阶段的<Suspense>组件, 其API和使用方式可能会改变. <Suspense> is an experimental feature and its API will likely change." type="warning" show-icon style="margin-bottom: 15px;"/>-->

	<el-card shadow="never" header="个人信息">
		<el-form ref="form" :model="user" label-width="120px" style="margin-top:20px;">
			<el-form-item label="账号">
				<el-input v-model="user.account" disabled></el-input>
				<div class="el-form-item-msg">账号信息用于登录，系统不允许修改</div>
			</el-form-item>
			<el-form-item label="姓名">
				<el-input v-model="user.name"></el-input>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input v-model="user.phone"></el-input>
			</el-form-item>
			<el-form-item label="邮箱">
				<el-input v-model="user.email"></el-input>
			</el-form-item>
			<el-form-item label="头像">
				<sc-upload v-model="user.logo" round icon="el-icon-avatar" title="上传头像"></sc-upload>
			</el-form-item>

<!--			<el-form-item label="性别">-->
<!--				<el-select v-model="form.sex" placeholder="请选择">-->
<!--					<el-option label="保密" value="0"></el-option>-->
<!--					<el-option label="男" value="1"></el-option>-->
<!--					<el-option label="女" value="2"></el-option>-->
<!--				</el-select>-->
<!--			</el-form-item>-->
<!--			<el-form-item label="个性签名">-->
<!--				<el-input v-model="form.about" type="textarea"></el-input>-->
<!--			</el-form-item>-->
			<el-form-item>
				<el-button type="primary" @click="save">保存</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import {mapGetters} from "vuex";

	export default {
		data() {
			return {
				user: {},
				localUserInfo: {}
			}
		},
		mounted() {
			this.getUser()
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		watch: {
			userInfo: {
				handler(userInfo) {
					if (userInfo) {
						this.localUserInfo = userInfo
					}
				},
				immediate: true // 立即触发一次
			}
		},
		methods: {
			async getUser(){
				let user = await this.$API.auth.getUser.get()
				if(user.code === 200){
					this.user = user.data
				}else{
					this.$message.error(user.message)
				}
			},
			async save(){
				let res = await this.$API.system.user.save.post(this.user)
				if(res.code === 200){
					let userInfo = this.$TOOL.data.get("USER_INFO")
					userInfo.user = res.data
					this.$TOOL.data.set("USER_INFO", userInfo)
					this.$store.dispatch('setUserInfo', userInfo);
					this.$message.success('保存成功')
				}
			}
		}
	}
</script>

<style>
</style>
