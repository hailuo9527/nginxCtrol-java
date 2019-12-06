<template>
    <div class="header">
        <div class="header_nav">
            <div class="header_nav_item">
                <router-link class="header_nav_item_label" to="/home">首页</router-link>
            </div>
            <div class="header_nav_item">
                <router-link class="header_nav_item_label" :to="path">L4</router-link>
            </div>
        </div>

        <div class="profile">
            <Dropdown style="margin-left: 20px" placement="bottom-end" trigger="click"  @on-click="dropEvent">
                <a href="javascript:void(0)"  class="trigger">
                   tao
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="logout" >
                        <span style="font-size: 14px">退出</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        name: 'Header',
        data () {
          return {
              path: ''
          }
        },
        methods: {
            dropEvent (data) {
                //console.log(data)
            }
        },
        watch: {
            '$route'(to, from) {
                 //console.log(to)
                this.path = `/L4/${this.activeAside.l4_code}`
            }
        },

        computed: {
            ...mapState({
                activeAside: state => state.L4.activeAside,
                asideList: state => state.L4.asideList
            }),
        },
        created() {
            if (!this.$route.params.id){  // 初始化route-link路径
                this.path = `/L4/${this.activeAside.l4_code}`
            }
        }
    }
</script>
<style lang="less" scoped>
.header{
    z-index: 14;
    box-sizing: border-box;
    display: -ms-flexbox;
    display: flex;
    height: 70px;
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    padding-left: 245px;
    background: #000;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &_nav{
        flex: 1 1 auto;
        vertical-align: top;
      //  text-align: center;
        white-space: nowrap;

        &_item{
            -ms-flex: 0 0 auto;
            flex: 0 0 auto;
            display: inline-block;
            position: relative;
            &_label{
                display: block;
                box-sizing: border-box;
                height: 70px;
                position: relative;
                padding: 22px 18px 0px;
                white-space: nowrap;
                font-size: 18px;
                color: #fff;
                opacity: 0.8;
                cursor: pointer;
                transition: opacity 0.1s linear;
                &.router-link-active{
                    color: @green;
                }
            }
        }
    }

    .profile{
        //background: #e5e5e5;
        box-sizing: border-box;
        -ms-flex: 0 1 auto;
        flex: 0 1 auto;
        min-width: 140px;
        max-width: 280px;
        border: none;
        &:hover{
            background: #e5e5e5;
            a{
                color: #000!important;
            }
        }
        height: 100%;
        display: flex;
        align-items: center;
        /deep/.ivu-dropdown{
            height: 100%;
        }
        /deep/.ivu-dropdown-rel{
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 18px;
            padding: 0 30px;
            a{
                color: #fff;
            }
        }
    }
}
</style>
