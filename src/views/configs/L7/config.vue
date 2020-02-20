<template>
   <div class="config-detail">
       <div class="config-detail-header">
           <Button  size="large" icon="md-arrow-back" @click="$router.go(-1)">返回</Button>
           <div class="border-bottom-input">
               <Input type="text" v-model="configName" placeholder="配置名"></Input>
           </div>

       </div>
       <div class="header_tab">
           <div class="tab">

              <span class="tab_item" :class="tab===0? 'active': ''" @click="tab=0">配置</span>
              <span class="tab_item" :class="tab===1? 'active': ''" @click="tab=1">设备</span>
              <span class="tab_item" :class="tab===2? 'active': ''" @click="tab=2">历史版本</span>
           </div>
            <div class="tab-content" v-if="tab === 0">
                <L7Config></L7Config>
            </div>
           <div class="tab-content" v-if="tab === 1">
               <div class="configuration-associations__empty">
                   <div class="configuration-associations__empty__title">You don't have any instance associations yet.</div>
                  Please add a few associations.<!-- /react-text -->
               </div>
               <div class="configuration-associations__add-new">
                   <Button  type="primary" size="large" icon="md-add">添加设备</Button>
               </div>
           </div>
           <div class="tab-content" v-if="tab === 2">
               234
           </div>
       </div>

   </div>
</template>

<script>
    import L7Config from '@/components/common/configuration/L7-config.vue'
    export default {
        data () {
            return{
                tab: 0,
                configName: ''
            }
        },
        components: {
            L7Config
        },
        mounted() {

            this.configName = this.$route.params.id || ''
        }
    }
</script>
<style lang="less">
    .config-detail{
        background: #f8f8f8;
        height: calc(100vh - 70px);
        min-width: 700px;
        .config-detail-header{
            display: flex;
            align-items: flex-end;
            width: calc(100% - 30px);
            height: 54px;
            padding-left: 20px;
            .border-bottom-input{
                width: 350px;
                margin-left: 20px;
            }
        }

    }
    .header_tab{
        margin-top: 10px;
        height: calc(100% - 54px);
        .tab{
            display: flex;
            border-bottom: 1px solid #ccc;
            padding: 0 20px;
        }
        .tab_item{
            display: inline-block;
            position: relative;
            margin-right: 25px;
            cursor: pointer;
            line-height: 43px;
            transition: color 0.1s linear;
            color: #333;
            &.active{
                color: @green;
                &:before{
                    background-color: @green;
                }
            }
            &:before{
                content: '';
                height: 2px;
                position: absolute;
                right: 0px;
                bottom: -1px;
                left: 0px;
                background: transparent;
                transition: background 0.1s linear;
            }
        }
        .tab-content{
            height: calc(100% - 44px)
        }
    }
    .configuration-associations__empty {
        margin: 30px;
        color: #ababab;
        font-size: 16px;
    }
    .configuration-associations__empty__title {
        margin-bottom: 10px;
        color: #d8d8d8;
        font: 24px 'RobotoMedium', Arial, sans-serif;
        font-weight: normal;
    }
    .configuration-associations__add-new{
        margin-left: 30px;
    }
</style>
