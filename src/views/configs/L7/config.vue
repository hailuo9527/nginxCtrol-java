<template>
   <div class="config-detail">
       <div class="config-detail-header">
           <Button  size="large" icon="md-arrow-back" @click="$router.go(-1)">返回</Button>
           <div class="border-bottom-input">
               <Input type="text" v-model="configName" placeholder="配置名" @on-blur="check" ref="input"></Input>
               <Alert type="error" class="err-tip" v-if="errorTip" >
                   <Icon type="md-warning" class="close"/> 配置名不能为空
                </Alert>
           </div>

       </div>
       <div class="header_tab">
           <div class="tab">
              <button class="tab_item"  :class="tab===0? 'active': ''" @click="tabChange(0)">配置</button>
              <button class="tab_item" :disabled="canSaveAndCopyConfig"  :class="tab===1? 'active': ''" @click="tabChange(1)">实例</button>
              <button class="tab_item" :disabled="canSaveAndCopyConfig"  :class="tab===2? 'active': ''" @click="tabChange(2)">历史版本</button>
           </div>
            <div class="tab-content" v-if="tab === 0">
                <L7Config :configName="configName"></L7Config>
            </div>
           <div class="tab-content" v-if="tab === 1">
               <Device></Device>
           </div>
           <div class="tab-content" v-if="tab === 2">
               <historical-version></historical-version>
           </div>
       </div>

   </div>
</template>

<script>
    import L7Config from '@/components/common/configuration/L7-config.vue'
    import Device from '@/components/common/configuration/Devices/Device.vue';
    import HistoricalVersion from '@/components/common/configuration/Devices/HistoricalVersion.vue';
    import { mapMutations, mapState } from 'vuex'
    export default {
        data () {
            return{
                tab: 0,
                configName: '',
                errorTip: false
            }
        },
        computed: {
            ...mapState({
                canSaveAndCopyConfig: state => state.L7.canSaveAndCopyConfig,
            }),
        },
        watch: {
            configName(nv){
                if (nv==="") {
                    this.errorTip = true
                } else {
                    this.errorTip = false
                }
                nv? this.canSaveConfigStatus(true): this.canSaveConfigStatus(false)
                this.changeConfigName(nv)
            }
        },
        components: {
            L7Config,
            Device,
            HistoricalVersion
        },
        methods: {
            ...mapMutations([
                'canSaveConfigStatus', 'canSaveAndCopyConfigStatus', 'changeConfigName'
            ]),
            tabChange(tab){
                // if (!this.canSaveAndCopyConfig){
                //     return
                // }

                this.tab = tab
            },
            check() {
                if (this.configName==="") {
                    this.errorTip = true
                }
            }
        },

        mounted() {
            this.$nextTick( () => {
                this.$refs['input'].focus()
            })
            this.configName = this.$route.params.configName || ''
            this.$route.params.configName ? this.canSaveAndCopyConfigStatus(true): this.canSaveAndCopyConfigStatus(false)


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
            align-items: center;
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
        //margin-top: 10px;
        height: calc(100% - 54px);
        .tab{
            display: flex;
            border-bottom: 1px solid #ccc;
            padding: 0 20px;
        }
        .tab_item{
            border: none;
            display: inline-block;
            position: relative;
            margin-right: 25px;
            cursor: pointer;
            line-height: 43px;
            transition: color 0.1s linear;
            color: #333;
            background: transparent;
            outline: none;
            &:disabled{
                pointer-events: none;
                cursor: not-allowed;
                opacity: 0.5;
            }
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
    .err-tip{
  margin-bottom: -36px!important;
  background: #ff5559;
  opacity: .95;
  border: none;
  border-radius: 0;
  font-size: 14px;
  color: #fff;
  padding: 10px 40px;
  position: sticky;
  top: 0;
  z-index: 9999;
  .close{
    font-size: 18px;
    color: #fff;
  }
}
</style>
