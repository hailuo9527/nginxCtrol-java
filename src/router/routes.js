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
                path: '/L4/:id',
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
    }

];
const routes = [
    ...err,
    ...defaultRoutes
];
export default routes
