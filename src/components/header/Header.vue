<template>
    <div class="header">
        <div class="header_nav">
            <div class="header_nav_item">
                <router-link class="header_nav_item_label" to="/home">首页</router-link>
            </div>
            <div class="header_nav_item">
                <router-link class="header_nav_item_label" :to="path">L4</router-link>
            </div>
            <div class="header_nav_item">
                <router-link class="header_nav_item_label" :to="path7">L7</router-link>
            </div>
            <div class="header_nav_item">
                <Dropdown trigger="click"  class="black-dropdown" @on-click="toConfigs">
                    <a class="header_nav_item_label" href="javascript:void(0)">
                        配置
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem >四层配置</DropdownItem>
                        <DropdownItem name="nginxConfig">

                            <router-link to="/nginxConfigs">七层配置</router-link>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>

        <div class="profile">
            <Dropdown style="margin-left: 20px" placement="bottom-end" class="black-dropdown" trigger="click"  @on-click="dropEvent">
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
              path: '',
              path7: ''
          }
        },
        methods: {
            dropEvent (data) {
                //console.log(data)
            },
            toConfigs(name) {
                switch (name) {
                    case 'nginxConfig':
                       // this.$router.push('/nginxConfigs')

                }
            }
        },
        watch: {
            '$route'(to, from) {
                if (to.path.search('/L4') !== -1) {
                    this.path = `/L4/${this.activeL4.l4_code}`
                } else if (to.path.search('/L7') !== -1) {
                    this.path7 = `/L7/${this.activeL7.l7ServerId}`
                }
            }

        },

        computed: {
            ...mapState({
                activeL4: state => state.L4.activeAside,
                activeL7: state => state.L7.activeAside
            }),
        },
        mounted() {
            this.path = `/L4/${this.activeL4.l4_code}`
            this.path7 = `/L7/${this.activeL7.l7ServerId}`
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
               &:hover{
                   opacity: 1;
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
