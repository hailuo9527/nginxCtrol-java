<template>
    <div class="tab">
        <span class="tab_item" :class="chartFilter.key === 0 ? 'active' : ''" @click="tabChange(0)">1H</span>
        <span class="tab_item" :class="chartFilter.key === 1 ? 'active' : ''" @click="tabChange(1)">4H</span>
        <span class="tab_item" :class="chartFilter.key === 2 ? 'active' : ''" @click="tabChange(2)">1D</span>
        <span class="tab_item" :class="chartFilter.key === 3 ? 'active' : ''" @click="tabChange(3)">2D</span>
        <span class="tab_item" :class="chartFilter.key === 4 ? 'active' : ''" @click="tabChange(4)">1W</span>
        <DatePicker
                class=" date-picker"

                :open="open"
                :value="value"
                :options="options"
                confirm
                type="daterange"
                @on-change="handleChange"
                @on-clear="handleClear"
                @on-ok="handleOk">
            <span @click="handleClick" class="tab_item" :class="chartFilter.key === 5 ? 'active' : ''">
                <Icon type="ios-calendar-outline"></Icon>
                <template v-if="!value[0]">日期</template>
                <template v-else>{{ (value[0]&&value[1]) && `${value[0]} - ${value[1]}` }}</template>
            </span>
        </DatePicker>
    </div>
</template>
<script>
    import { mapState, mapMutations } from 'vuex'
    export default {
        name: 'applyFilter',
        props: {},
        data () {
            return {
                options: {
                    disabledDate (date) {
                        return date && (date.valueOf() > Date.now() || date.valueOf() < Date.now() - 86400000*7);
                    }
                },
                open: false,
                value: '',
            }
        },
        computed: {
            ...mapState({
                chartFilter:  state => state.common.chartFilter
            })
        },
        methods: {
            ...mapMutations([
                'changeChartFilter'
            ]),
            handleClick () {
                this.open = !this.open;

            },
            handleChange (date) {
                console.log(date)
                //this.value = (date[0]&&date[1]) && `${date[0]} - ${date[1]}`;
                this.value = date

            },
            handleClear () {
                this.open = false;
                //console.log('gaunbi')
                //console.log(this.value)
                if (this.chartFilter.key === 5){
                    this.changeChartFilter({key: 1, value: 4})
                }

            },
            handleOk () {
                console.log(this.value)
                this.tabChange(5)
                this.open = false;
            },
            tabChange ( index) {
                if (index !== 5) {
                    this.handleClear()
                    this.value = ''
                }
                switch (index) {
                    case 0:
                        this.changeChartFilter({key: index, value: 1})
                        break
                    case 1:
                        this.changeChartFilter({key: index, value: 4})
                        break
                    case 2:
                        this.changeChartFilter({key: index, value: 24})
                        break
                    case 3:
                        this.changeChartFilter({key: index, value: 24*2})
                        break

                    case 4:
                        this.changeChartFilter({key: index, value: 24*7})
                        break
                    case 5:
                        this.changeChartFilter({key: index, value: this.value})
                        break
                }

            }
        },
        mounted() {
            console.log(this.chartFilter)
        }
    }
</script>
<style lang="less" scoped>
    .border-bottom{
        content: '';
        height: 2px;
        position: absolute;
        right: 0px;
        bottom: -2px;
        left: 0px;
        background: transparent;
        transition: background 0.1s linear;
    }
    .tab_item{
        display: inline-block;
       // max-width: 140px;
        position: relative;
        margin-right: 25px;
        //vertical-align: top;
        font-size: 12px;
        line-height: 43px;
        cursor: pointer;
        transition: color 0.1s linear;
        color: #333;
        &.active{
            color: @green!important;
            &:before{
                background-color: @green!important;
            }
        }
        &:before{
            .border-bottom
        }

    }
    .date-picker{
        margin-right: 10px;
        /deep/.ivu-date-picker-rel{
            line-height: 43px;
            cursor: pointer;
            &:before{
                .border-bottom
            }
        }
        &.active{
            /deep/.ivu-date-picker-rel{
                color: @green;
                &:before{
                    background-color: @green;
                }
            }
        }

    }
</style>
