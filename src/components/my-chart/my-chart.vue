<template>
  <div class="ngChart" >
    <div class="nc-tip">
      <p class="title">{{title}}</p>
    </div>
    <div class="ngChart-item" >
      <ve-line :data="chartData" height="200px" :extend="chartExtend"  :data-empty="!chartData.rows.length" :settings="chartSettings" :loading="loading"></ve-line>
    </div>
  </div>
</template>
<script>
  import ChartOptions from './chartOptions'
  export default {
    name: 'myChart',
    props: {
      chartData: {
        type: Object,
        default:() => {

        },
      },
      chartSettings: {
        type: Object,
        default:  ()=>{
          return {
            dimension : ['日期']
          }
        }
      },
      loading: {
        type: Boolean,
        default: false,
      },
      color: {
        type: Array,
        default: () => {
          return ['#333333','#5BA9FF', '#f96cb3', '#030ddd', '#ff7b7b','#ff7070', '#9bccfd','#fc9487','#59d5d0']
        }
      },
      title: {
        type: String,
        default: '标题'
      }
    },
    data(){

      this.chartExtend = {
        // color: ['#333333','#5BA9FF', '#f96cb3', '#030ddd', '#ff7b7b','#ff7070', '#9bccfd','#fc9487','#59d5d0'],
        legend: {
          left: 30,
          bottom: 20,
          icon: 'circle'
        },
        color: this.color,
        grid: {
          top: 20,
          left: 10,
          right: 20,

          //height: 175
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderColor: '#333',
          textStyle: {
            color: '#333',
          },
          padding: 10,
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);border-radius: 0;'
        },
        yAxis: {
          splitLine: {
            show: false
          },
          nameGap: 0,
          splitNumber: 3,
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
            color: '#8f8f8f'
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

      }
    },
  }
</script>
<style lang="less" scoped>
  .ngChart{
    //padding: 10px;
    margin-top: 20px;
    width: 50%;
    //height: 240px;
    display: block;
    float: left;
    background: #fff;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.15);
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
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    font-size: 12px;
    color: #333;
    font-weight: bold;
  }
  /deep/.v-charts-component-loading {
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
</style>
