export default {
    router: {
        linkExactActiveClass: 'active',
        extendRoutes (routes, resolve){
            routes.splice(0);

            routes.push(...[
                {
                    path: "/",
                    //__dirname：相当于__filename 的 path.dirname()
                    component: resolve(__dirname, 'pages/layout/'), // 不用写到index.vue，默认就会去查找index.vue文件
                    children: [
                        {
                            path: '',
                            name: 'home',
                            component: resolve(__dirname, 'pages/home/')
                        },
                        {
                            path: '/login',
                            name: 'login',
                            component: resolve(__dirname, 'pages/login/')
                        },
                        {
                            path: '/register',
                            name: 'register',
                            component: resolve(__dirname, 'pages/login/')
                        },
                        {
                            path: '/profile/:username',
                            name: 'profile',
                            component: resolve(__dirname, 'pages/profile/')
                        },
                        {
                            path: '/setting',
                            name: 'setting',
                            component: resolve(__dirname, 'pages/setting/')
                        },
                        {
                            path: '/editor',
                            name: 'newEditor',
                            component: resolve(__dirname, 'pages/editor/')
                        },
                        {
                            path: '/editor/:slug',
                            name: 'editor',
                            component: resolve(__dirname, 'pages/editor/')
                        },
                        {
                            path: '/article/:slug',
                            name: 'article',
                            component: resolve(__dirname, 'pages/article/')
                        }
                    ]
                }
            ]);
        }
    },

    server: {
        host: '0.0.0.0',
        port: 3000
    },

    plugins: [
        '~/plugins/request.js'
    ]
}