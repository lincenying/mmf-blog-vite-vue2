<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <a-input title="账号">
                <input type="text" v-model="form.username" placeholder="请输入管理员账号" class="base-input" name="username" />
                <span class="input-info error">请输入昵称</span>
            </a-input>
            <a-input title="密码">
                <input type="password" v-model="form.password" placeholder="请输入管理员密码" class="base-input" name="password" />
                <span class="input-info error">请输入密码</span>
            </a-input>
        </div>
        <div class="settings-footer"><a @click="login" href="javascript:;" class="btn btn-yellow">登录</a></div>
    </div>
</template>

<script>
import cookies from 'js-cookie'
import { showMsg } from '@/utils'
// import api from '~api'
import aInput from '@/components/_input.vue'

export default {
    name: 'backend-login',
    components: {
        aInput
    },
    beforeRouteEnter(to, from, next) {
        if (cookies.get('b_user')) {
            next('/backend/article/list')
        } else {
            next()
        }
    },
    data() {
        return {
            form: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        async login() {
            if (!this.form.username || !this.form.password) {
                showMsg('请输入用户名和密码!')
                return
            }
            const { code, data } = await this.$store.$api.post('backend/admin/login', this.form)
            if (data && code === 200) {
                this.$router.push('/backend/article/list')
            }
        }
    },
    metaInfo() {
        return {
            title: '管理员登录 - M.M.F 小屋',
            meta: [{ vmid: 'description', name: 'description', content: 'M.M.F 小屋' }]
        }
    }
}
</script>
