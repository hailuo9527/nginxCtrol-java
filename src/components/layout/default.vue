<template>
    <div class="layout">
        <div class="logo">ngController</div>
        <div class="layout_content" v-if="loading">
            <Header/>
            <router-view class="content"/>
        </div>
        <!--<div class="layout_content" v-if="!loading">
            <Header/>
            <router-view class="content"/>
        </div>-->
    </div>
</template>
<script>
    import Header from '@/components/header/Header.vue'
    import { mapActions } from 'vuex'
    export default {
        name: 'layout_default',
        data () {
          return {
              loading: false
          }
        },
        components: {
            Header
        },
        methods: {
            ...mapActions(['getAsideList']),
            handleSpinCustom() {
                this.$Spin.show({
                    render: (h) => {
                        return h('Spin', [
                            h('div', {
                                'class': 'loader',
                            },[
                                h('svg',{
                                    'class': 'circular',
                                    attrs: {
                                        viewBox: '25 25 50 50',
                                    }
                                },[
                                    h('circle',{
                                        'class': 'path',
                                        attrs: {
                                            cx: '50',
                                            cy: '50',
                                            r: '20',
                                            fill: 'none',
                                            'stroke-width': '2',
                                            'stroke-miterlimit': '0'
                                        }
                                    })
                                ])
                            ]),

                        ])
                    }
                });
                this.getAsideList().then(res => {
                    if(res.data.code === 'success') {
                        this.loading = true
                        this.$Spin.hide();
                    }
                })
            }
        },
        mounted() {
            this.handleSpinCustom()
        }
    }
</script>
<style lang="less">
    @import "default";
    .loader {
        width: 100px;
        height: 50px;
        position: relative;
        margin: 0 auto;
    }
    @keyframes rotate {
        100%{
            transform: rotate(1turn);
        }

    }
    @keyframes dash {
        0% {
            stroke-dasharray: 1,200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -124;
        }
    }
    @keyframes color {
        /* 0%, 100% {
              stroke: #d62d20;
          }
         40% {
             stroke: #0057e7;
         }
         66% {
             stroke: #008744;
         }
         80%, 90% {
             stroke: #ffa700;
         }*/
        0%, 100% {
            stroke: #000;
        }

    }

    .circular {
        -webkit-animation: rotate 2s linear infinite;
        animation: rotate 2s linear infinite;
        height: 100%;
        -webkit-transform-origin: center center;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
    .path {
        stroke-dasharray: 1,200;
        stroke-dashoffset: 0;
        -webkit-animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
        animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
        stroke-linecap: round;
    }
</style>
