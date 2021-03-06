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
        name: 'login',
        redirect: '/login',
        component: () => import(/* webpackChunkName: "layout" */'@/components/layout/default.vue'),
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
                path: '/app',
                meta: {
                    title: 'app'
                },

                component: () => import(/* webpackChunkName: "home" */ '@/views/app/app.vue'),
                children: [
                    {
                        name: 'app-overview',
                        path: ':app/overview',
                        title: 'app-overview',
                        component: () => import('@/views/app/child/overview.vue'),
                    },
                    {
                        name: 'app-dispatch',
                        path: ':app/dispatch',
                        title: 'app-dispatch',
                        component: () => import(/* webpackChunkName: "dispatch" */'@/views/app/child/dispatch.vue'),
                    },
                    {
                        name: 'app-ha',
                        path: ':app/ha',
                        title: 'app-HA',
                        component: () => import(/* webpackChunkName: "ha" */'@/views/app/child/ha.vue'),
                    },
                    {
                        name: 'app-config',
                        path: ':app/config',
                        title: 'app-config',
                        component: () => import(/* webpackChunkName: "L7-config" */'@/views/L7/child/config.vue'),
                    }
                ]
            },
            {
                path: '/prewarn',
                meta: {
                    title: 'prewarn'
                },
                component: () => import('@/views/PreWarn/PreWarn.vue'),
                children: [
                    {
                        path: ':prewarn/overview',
                        name: 'prewarn-overview',
                        title: 'prewarn-overview',
                        component: () => import('@/views/PreWarn/child/overview.vue')
                    }
                ]
            },
            {
                path: '/account',
                name: 'account',
                meta: {
                    title: 'account'
                },
                component: () => import('@/views/Account/Account.vue'),
            },
            {
                path: '/logfile',
                name: 'logfile',
                meta: {
                    title: 'logfile'
                },
                component: () => import('@/views/LogFile/LogFile.vue'),
            },
            {
                path: '/L4',
                // name: 'L4',
                meta: {
                    title: 'L4'
                },
                component: () => import(/* webpackChunkName: "L4" */'@/views/L4/L4.vue'),
                children: [
                    {
                        path: ':L4/chart',
                        name: 'L4-chart',
                        meta: {
                            title: 'L4-chart'
                        },
                        component: () => import(/* webpackChunkName: "L4-chart" */'@/views/L4/child/chart.vue')
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
                        path: ':L4/config',
                        meta: {
                            title: 'L4-config'
                        },
                        component: () => import('@/views/L4/child/config.vue'),
                    },

                ]
            },
            {
                path: 'L7',
                //name: 'L7',
                meta: {
                    title: 'L7'
                },
                component: () => import(/* webpackChunkName: "L7" */ '@/views/L7/L7.vue'),
                children: [
                    {
                        path: ':L7/nginx',
                        name: 'L7Nginx',
                        meta: {
                            title: 'L7-chart'
                        },
                        component: () => import(/* webpackChunkName: "nginx-chart" */'@/views/L7/child/nginx-chart.vue')
                    },
                    {
                        path: ':L7/chart',
                        name: 'L7Chart',
                        meta: {
                            title: 'L7-chart'
                        },
                        component: () => import(/* webpackChunkName: "L7-chart" */'@/views/L4/child/chart.vue')
                    },
                    {
                        path: ':L7/config',
                        name: 'L7Config',
                        meta: {
                            title: 'L7-config'
                        },
                        component: () => import(/* webpackChunkName: "L7-config" */'@/views/L7/child/config.vue')
                    },
                    {
                        path: ':L7/analysis',
                        meta: {
                            title: 'L7-analysis'
                        },
                        component: () => import(/* webpackChunkName: "L7-analysis" */'@/views/L7/child/analysis.vue'),
                        children: [
                            {
                                path: '',
                                meta: {
                                    title: 'reports'
                                },
                                component: () => import(/* webpackChunkName: "L7-analysis-main" */'@/views/L7/child/analysis/main/main.vue')
                            },
                            {
                                path: 'overview',
                                name: 'overview',
                                meta: {
                                    title: 'overview'
                                },
                                component: () => import(/* webpackChunkName: "L7-analysis-overview" */'@/views/L7/child/analysis/overview.vue')
                            },
                            {
                                path: 'configAnalysis',
                                name: 'configAnalysis',
                                meta: {
                                    title: 'overview'
                                },
                                component: () => import(/* webpackChunkName: "L7-configAnalysis" */'@/views/L7/child/analysis/configAnalysis.vue')
                            },
                            {
                                path: 'servers',
                                name: 'servers',
                                meta: {
                                    title: 'overview'
                                },
                                component: () => import(/* webpackChunkName: "L7-servers" */'@/views/L7/child/analysis/servers.vue')
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
            {
                name: 'software',
                path: '/software',
                component: () => import(/* webpackChunkName: "software" */ '@/views/software/software.vue')
            },
            {
                name: 'system',
                path: '/system',
                component: () => import('@/views/system/system.vue')
            },
            {
                name: 'VMware',
                path: '/VMware',
                component: () => import('@/views/VMware/VMware.vue'),
                children: [
                    {
                        name: 'VMware-virtual',
                        path: 'virtual',
                        title: 'VMware-virtual',
                        component: () => import('@/views/VMware/child/Virtual.vue'),
                    },
                    {
                        name: 'VMware-datastorage',
                        path: 'datastorage',
                        title: 'VMware-datastorage',
                        component: () => import('@/views/VMware/child/DataStorage.vue'),
                    },
                    {
                        name: 'Vmware-resourcepool',
                        path: 'resourcepool',
                        title: 'Vmware-resourcepool',
                        component: () => import('@/views/VMware/child/ResourcePool.vue'),
                    }, {
                        name: 'Vmware-template',
                        path: 'template',
                        title: 'Vmware-template',
                        component: () => import('@/views/VMware/child/Template.vue'),
                    },
                    {
                        name: 'Vmware-customization',
                        path: 'customization',
                        title: 'Vmware-customization',
                        component: () => import('@/views/VMware/child/Customization.vue'),
                    },
                ]
            }
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
    },
];
const routes = [
    ...err,
    ...defaultRoutes
];
export default routes
