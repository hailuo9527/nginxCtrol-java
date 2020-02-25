let err = [
    {
        path: '/401',
        name: 'error_401',
        component: () => import('@/views/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        component: () => import('@/views/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        component: () => import('@/views/error-page/404.vue')
    }
]
let defaultRoutes = [
    {

        path: '/',
        redirect: '/login',
        component: () => import('@/components/layout/default.vue'),
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: '首页'
                },

                component: () => import(/* webpackChunkName: "home" */ '@/views/Home/Home.vue')
            },
            {
                path: '/L4/:L4',
                // name: 'L4',
                meta: {
                    title: 'L4'
                },
                component: () => import(/* webpackChunkName: "L4" */ /* webpackPrefetch: true */'@/views/L4/L4.vue'),
                children: [
                    {
                        path: '',
                        name: 'L4-chart',
                        meta: {
                            title: 'L4-chart'
                        },
                        component: () => import('@/views/L4/child/chart.vue')
                    },
                    /*{
                        path: '',
                        name: 'L4-system',
                        meta: {
                            title: 'L4-system'
                        },
                        component: () => import('@/views/L4/child/system.vue')
                    },*/
                    {
                        name: 'L4-config',
                        path: 'config',
                        meta: {
                            title: 'L4-config'
                        },
                        component: () => import('@/views/L4/child/config.vue'),
                    },

                ]
            },
            {
                path: 'L7/:L7',
                //name: 'L7',
                meta: {
                    title: 'L7'
                },
                component: () => import(/* webpackChunkName: "L4" */ '@/views/L7/L7.vue'),
                children: [
                    {
                        path: '',
                        name: 'L7Chart',
                        meta: {
                            title: 'L7-chart'
                        },
                        component: () => import('@/views/L7/child/chart.vue')
                    },
                    {
                        path: 'config',
                        name: 'L7Config',
                        meta: {
                            title: 'L7-config'
                        },
                        component: () => import('@/views/L7/child/config.vue')
                    },
                    {
                        path: 'analysis',
                        meta: {
                            title: 'L7-analysis'
                        },
                        component: () => import('@/views/L7/child/analysis.vue'),
                        children: [
                            {
                                path: '',
                                meta: {
                                    title: 'reports'
                                },
                                component: () => import('@/views/L7/child/analysis/main/main.vue')
                            },
                            {
                                path: 'overview',
                                name: 'overview',
                                meta: {
                                    title: 'overview'
                                },
                                component: () => import('@/views/L7/child/analysis/overview.vue')
                            },
                            {
                                path: 'configAnalysis',
                                name: 'configAnalysis',
                                meta: {
                                    title: 'overview'
                                },
                                component: () => import('@/views/L7/child/analysis/configAnalysis.vue')
                            },
                            {
                                path: 'servers',
                                name: 'servers',
                                meta: {
                                    title: 'overview'
                                },
                                component: () => import('@/views/L7/child/analysis/servers.vue')
                            },
                        ]


                    },
                ]
            },
            {
                path: '/nginxConfigs',
                name: 'nginxConfigs',
                meta: {
                    title: 'nginxConfigs'
                },

                component: () => import(/* webpackChunkName: "nginxConfigs" */ '@/views/configs/L7/configs.vue')
            },
            {
                path: '/nginxConfig/:configName',
                name: 'nginxConfig',
                meta: {
                    title: 'nginxConfig'
                },

                component: () => import(/* webpackChunkName: "nginxConfigs" */ '@/views/configs/L7/config.vue')
            },
            {
                path: '/newNginxConfig',
                name: 'newNginxConfig',
                meta: {
                    title: 'newNginxConfig'
                },

                component: () => import(/* webpackChunkName: "nginxConfigs" */ '@/views/configs/L7/config.vue')
            },
           /* {
                path: '/L7/:L7',
                // name: 'L4',
                meta: {
                    title: 'L7'
                },
                component: () => import(/!* webpackChunkName: "L4" *!/ /!* webpackPrefetch: true *!/'@/views/L7/L7.vue'),
                children: [
                    {
                        path: '',
                        name: 'L7-chart',
                        meta: {
                            title: 'L7-chart'
                        },
                        component: () => import('@/views/L7/child/chart.vue')
                    },
                    {
                        path: 'config',
                        name: 'L7-config',
                        meta: {
                            title: 'L7-config'
                        },
                        component: () => import('@/views/L7/child/config.vue')
                    },

                ]
            }*/
        ]
    },
    {
        path: '/login',
        component: () => import('@/components/layout/layoutNoHeader.vue'),
        children: [
            {
                path: '',
                component: () => import('@/views/login/login.vue')
            }
        ]
    }

];
const routes = [
    ...err,
    ...defaultRoutes
];
export default routes
