
<template>
  <div class="ngChart"  v-view-lazy="(e)=>firstShow(e)">
    <div class="nc-tip">
      <p class="title">{{data.title}}</p>
    </div>
    <div class="ngChart-item" >
      <!--:data-empty="!chartData.rows.length"-->

      <ve-line :data="data.chartData" height="200px" :extend="chartExtend"   :data-empty="empty"  :settings="data.chartSettings" :loading="data.loading"></ve-line>
    </div>
  </div>
</template>
<script>
  import VeLine from 'v-charts/lib/line.common'
  import 'v-charts/lib/style.css'
  import { formatTime } from '../../libs/vue-expand.js'
  import { getChartData } from "../../api/chart";
  import { mapState } from 'vuex'
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
      index: Number
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

          formatter:  (item) =>{
            // console.log(item)
            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
              str.push(data.marker)
              str.push(data.seriesName)
              str.push(data.value[1])
              str.push('<br />')
            })

            return str.join(' ')
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          nameGap: 0,
          splitNumber: 3
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
            formatter: function (value, index) {
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
          }
        }
      }

      return {
        chartData: {
          rows: []
        },
        loading: true,
        empty: false,
      }
    },
    // computed:{
    //   ...mapState({
    //     chartFilter:  state => state.L4.chartFilter
    //   })
    // },
    methods: {
      firstShow(e){
        // console.log(e)
        this.$emit('firstShowHandle',{ index: this.index, url: this.data.url })
        //this.getData()
      },
    },
    mounted() {
        console.log(this.data)

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
