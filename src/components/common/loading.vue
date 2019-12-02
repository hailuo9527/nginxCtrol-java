<template>
    <Spin>
        <div class="loader" :style="{ width: size+'px', height: size+'px' }">
            <svg class="circular"  viewBox="25 25 50 50">
                <circle class="path" cx="50" :stroke="color"
                cy="50"
                r="20"
                fill="none"
                stroke-width="2"
                stroke-miterlimit="0"></circle>
            </svg>
        </div>
    </Spin>
</template>
<script>
    export default {
        name: 'Loading',
        props: {
            size: {
                type: Number,
                default: 40
            },
            color: {
                type: String,
                default: '#000'
            }
        }
    }
</script>
<style lang="less" scoped>
    .loader {
        width: 50px;
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
        //-webkit-animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
        // animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
        animation: dash 1.5s ease-in-out infinite;
        stroke-linecap: round;
    }
</style>
