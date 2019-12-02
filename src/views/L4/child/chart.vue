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
  import imgsrc from  "../../../assets/images/logo.png"
  export default {
    name: "chart",
    data(){
      return {
        dataList:[
          {
            id:"chart1",
            name:"CPU Usage\n",
            data:[{
              name: 'cpu.system',
              data: [1,43934, 52503, 1,57177, 69658, 97031, 119931, 137133, 154175]
            }, {
              name: 'cpu.user',
              data: [60000,24916, 24064,60000, 29742, 29851, 32490, 30282, 38121, 40434]
            }, {
              name: 'cpu.stolen',
              data: [100000,11744, 17722, 16005, 19771, 20185,100000, 24377, 32147, 39387]
            }]
          },
          {
            id:"chart2",
            name:"Load Average\n\n",
            data:[{
              name: 'cpu.system',
              data: [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000]
            }, {
              name: 'cpu.user',
              data: [70000, 60000, 50000, 40000, 30000, 30282, 20000, 434]
            }, {
              name: 'cpu.stolen',
              data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
            }]
          },
          {
            id:"chart3",
            name:"Memory\n",
            data:[{
              name: 'cpu.system',
              data: [43934, 43934, 43934, 43934, 43934, 43934, 43934, 43934]
            }, ]
          },
          {
            id:"chart4",
            name:"Network Traffic\n",
            data: [
              {
                name: 'cpu.system',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
              },
              {
                name: 'cpu.user',
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
              },
              {
                name: 'cpu.stolen',
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
              }
            ]
          },
          {
            id:"chart5",
            name:"Disk Usage\n",
            data:[
              {
                name: 'cpu.system',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
              },
              {
                name: 'cpu.user',
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
              },
              {
                name: 'cpu.stolen',
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
              }
            ]
          },
          {
            id:"chart6",
            name:"Disk I/O\n",
            data:[
              {
                name: 'cpu.system',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
              },
              {
                name: 'cpu.user',
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
              },
              {
                name: 'cpu.stolen',
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
              }
            ]
          }
        ],
        option:{
          chart: {
            height: 183,
            type: 'line',
            marginBottom:80,
            paddingLeft:-30,
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
            offset: -10,
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
            },
            navigation: {
              activeColor: '#3E576F',
              animation: true,
              arrowSize: 12,
              inactiveColor: '#CCC',
              style: {
                fontWeight: 'bold',
                color: '#333',
                fontSize: '12px'
              }
            }
          },
          plotOptions: {
            series: {
              marker: {
                enabled: false
              }
            }
          },
          loading: {
            hideDuration: 1000,
            showDuration: 1000,
            labelStyle: {
              color: 'white'
            },
            style: {
              backgroundColor: 'gray'
            }
          },
          lang: {
            noData: '暂无数据'
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
  .ngChart{
    padding: 10px;
    margin-top: 20px;
    width: 50%;
    height: 240px;
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
    background: #ffffff;
    width: 100%;
    height: 50px;
    padding: 5px 10px;
  }
  div.nc-tip p{
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    font-size: 14px;
  }
</style>