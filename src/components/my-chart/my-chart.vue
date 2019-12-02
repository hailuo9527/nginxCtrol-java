<template>
  <div class="x-chart">
    <div class="ngChart" v-for="item in dataList">
      <div class="nc-tip">
        <p>{{item.name}}</p>
      </div>
      <div class="ngChart-item" :id=item.id></div>
    </div>
  </div>
</template>

<script>
  import HighCharts from 'highcharts';
  import imgsrc from  "../../assets/images/logo.png"
  export default {
    name: "my-chart",
    data(){
      return{
        option:{
          chart: {
            height: 173,
            type: 'line',
            marginBottom:60
          },
          title: {
            text: null
          },
          subtitle: {
            text: null
          },
          credits: {
            enabled: false
          },
          xAxis: {
            lineColor: 'transparent',
            gridLineColor: 'transparent',
            crosshair: true, //十字准星线
            title: {
              text: null
            }
          },
          yAxis: {
            lineColor: 'transparent',
            gridLineColor: 'transparent',
            title: {
              text: null
            }
          },
          legend: {
            useHTML:true,// 设置允许使用 html
            layout: 'horizontal',
            activeColor: '#3E576F',
            // 使 legend 自带的 symbol 显示为 none 效果
            symbolHeight:0.01,
            symbolWidth:0.01,
            symbolRadius:0.01,
            labelFormatter(){
              // 格式化 legend 的 label
              // 这里的内容根据需求自行编写
              let img = '\<\img src = "'+ imgsrc +'" width="14px" height="14px"\>'
              return img + ' ' + this.name

            },
            floating: true,
            animation: true,
            arrowSize: 12,
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'bottom',
            y: 130,
            x: 0,
            itemStyle:{
              lineHeight:'14px',
              fontSize:'12px',
              letterSpacing:0,
              color:'#666666',
              fontWeight:'lighter'
            }
          },
          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
              pointStart: 2010
            }
          },
          series: [],
          responsive: {
            rules: [{
              condition: {
                maxWidth: 1000
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'left',
                  verticalAlign: 'horizontal'
                }
              }
            }]
          },
        },
      }
    },
    props:{
      dataList:{
        type: Array
      }
    },
    methods:{
      fresh:function(){
        this.$nextTick(function(){
          let lg= this.dataList.length;
          for (let i=0;i<lg;i++){
            this.dataList[i].option={};
            this.dataList[i].option=this.option;
            this.dataList[i].option.series=this.dataList[i].data;
            HighCharts.chart(this.dataList[i].id,this.dataList[i].option)
          }
        })
      }
    },
    computed:{

    },
    watch:{

    },
    mounted() {
      this.fresh()
    }
  }
</script>

<style scoped>
  @import "my-chart.less";
  .x-chart{

  }
  .highcharts-container{
    width: 100%;
  }
  .ngChart{
    padding: 10px;
    margin-top: 20px;
    width: 50%;
    height: 232px;
    display: block;
    float: left;
    background: #f8f8f8;
  }
  .ngChart-item{
    position: relative;
    width: 100%;
    height: 100%;
    text-align: left;
    line-height: normal;
    z-index: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    display: inline-block;
  }
  div.nc-tip{
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #ccc;
  }
  div.nc-tip p{
    line-height: 30px;
    font-size: 14px;
    padding-bottom: 7px;
  }
</style>