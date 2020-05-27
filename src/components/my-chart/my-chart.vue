
<template> 
  <div class="ngChart"  v-view-lazy="(e)=>firstShow(e)">
    <div class="nc-tip">
      <div class="title">
        {{data.title}}
        <Dropdown v-if="supParams" @on-click="change">
          <a href="javascript:void(0)" v-if="data.supData.length">
            {{supParams}}
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(item, index) in data.supData" :name="item" :key="index">{{item}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="cover">
    <div class="ngChart-item" >
      <!--:data-empty="!chartData.rows.length"-->
      <ve-line :data="data.chartData"  height="200px" :extend="chartExtend" :after-set-option-once="afterSetOption" :after-config="afterConfig" :before-config="beforeConfig"  :data-empty="!data.chartData.rows.length"  :settings="data.chartSettings" :loading="data.loading"></ve-line>
    </div>
    </div>
  </div>
</template>
<script>
  import VeLine from 'v-charts/lib/line.common'
  import 'v-charts/lib/style.css'
  import 'echarts/lib/component/markArea'
  import { formatTime } from '../../libs/vue-expand.js'
  export default {
    name: 'myChart',
    components: {
      VeLine
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      index: Number,

    },
    watch: {

    },
    data(){

      this.chartExtend = {
        // color: ['#333333','#5BA9FF', '#f96cb3', '#030ddd', '#ff7b7b','#ff7070', '#9bccfd','#fc9487','#59d5d0'],
        legend: {
          left: 30,
          bottom: 20,
          icon: 'circle'
        },
        color: this.data.color,
        grid: {
          top: 20,
          left: 10,
          right: 20,

          //height: 175
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: '#333',
          textStyle: {
            color: '#333',
          },
          padding: 10,
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);border-radius: 0;',

          formatter:  this.data.tooltipFormatter || function (item) {
            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
              str.push(data.marker)
              str.push(data.seriesName)
              str.push(data.value[1] ? data.value[1] : '无数据')
              str.push('<br />')
            })

            return str.join('  ')
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          nameGap: 0,
          splitNumber: 1,
          minInterval: {
            minInterval: 1
          },
          axisLabel: {
            formatter: this.data.yFormatter || '{value}'
          }
        },
        xAxis: {
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dotted'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e9e9e9'
            }
          },
          axisLabel: {
            color: '#8f8f8f',
            interval: this.data.interval,
            formatter:  (value, index) => {
              //console.log(value)
              if (!value) return
              if (this.timeInterval) {
                let str = formatTime(value, 'HM')
                return str
              }
              let str = formatTime(value, 'MD')
              return str
            }
          },
          boundaryGap: false,

        },
        series: {
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 2,
          showSymbol: false,
          lineStyle: {
            width: 1.5
          },
          markPoint: {
            symbol: 'circle'
          },
          markArea: {
            silent: true,
            itemStyle:{
              color:'#eeeeee'
            },
            data: [
                    /*[{
                      xAxis: '1586221561',
                      yAxis: 0
                    }, {
                      xAxis: '1586223306',
                      y: '-100%'
                    }]*/
            ]
          },

        }
      }

      return {
        chartData: {
          rows: []
        },
        loading: true,
        empty: false,
        supParams: null,
        timeInterval: false,
        timer: null,
      }
    },
    methods: {
      firstShow(e){
        this.$emit('firstShowHandle',{ index: this.index, url: this.data.url })
      },
      beforeConfig(data){
        //console.log(data)
        if (data.rows.length){
          let startTime = new Date(data.rows[0].ctime * 1000)
          let endTime = new Date(data.rows[data.rows.length - 1].ctime * 1000)
          // console.log(startTime, endTime)
          this.timeInterval = startTime.setHours(0, 0, 0, 0) === endTime.setHours(0, 0, 0, 0)
        }

      },
      afterConfig (options) {
        if (this.data.supData && !this.supParams){
          this.supParams = this.data.supData[0]
        }
        //console.log(options)
        if (this.data.markAreaData && this.data.markAreaData.length) {
          let arr = []
          this.data.markAreaData.map((item, index) => {
            let markAreaDataItem = [{
              xAxis: item.stime,
              yAxis: 0
            }, {
              xAxis: item.etime,
              y: '-100%'
            }]
              arr.push(markAreaDataItem)
          })

          options.series.map((item, index)=> {
            item.markArea.data= arr
          })
        } else {
            options.series.map((item, index)=> {
                item.markArea.data= []
            })
        }

        options.xAxis[0].axisLabel.interval = this.data.interval
        return options
      },
      afterSetOption(echart) {
        //console.log(echart)
        //console.log(this.data)
      },
      change(name) {
        this.supParams = name
        this.$emit('firstShowHandle',{ index: this.index, url: this.data.url, supParams: this.supParams })
      }
    },
    mounted() {
      this.timer = setInterval(() => {
        this.$emit('firstShowHandle',{ index: this.index, url: this.data.url, supParams: this.supParams || null })
      }, 1000 * 60)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  }
</script>
<style lang="less" scoped>
  .ngChart{
    //padding: 10px;
    margin-top: 20px;
    flex-basis: calc(50% - 12px);
    max-width: calc(50% - 12px);
    //height: 240px;
    display: block;
    float: left;
    background: #fff;
    box-shadow: 0 0 4px -1px rgba(0, 0, 0, 0.15);
  }
  .ngChart-item{
    position: relative;
    width: 100%;
    //height: 100%;
    text-align: left;
    line-height: normal;
    z-index: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    display: inline-block;
    background: #fff;
  }
  div.nc-tip{
    background: #ffffff;
    width: 100%;
    height: 50px;
    padding: 5px 10px;
  }
  div.nc-tip p{
    border-bottom: 1px solid #f2f2f2;
    line-height: 40px;
    font-size: 12px;
    color: #333;
    font-weight: bold;
  }
  /deep/.v-charts-component-loading,/deep/.v-charts-data-empty{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: hsla(0,0%,100%,.9);
  }
  /deep/.v-charts-data-empty{
    background-color: hsla(0,0%,100%,.9);
  }
  /deep/.v-charts-component-loading .path{
    stroke: #000;
  }
</style>
