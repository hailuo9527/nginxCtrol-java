<template>
  <div class="dispatch">
    <div class="table-wrap">
      <div class="table" v-if="tableData.length">
        <vxe-toolbar perfect>

          <template v-slot:buttons>
            <div style="width: 100%; text-align: center; font-weight: bold; color: #333">
              {{summary}}
            </div>

          </template>
        </vxe-toolbar>
        <vxe-table
                stripe
                border
                ref="xTable"
                highlight-hover-row
                auto-resize
                align="center"

                :data="tableData">
          <vxe-table-column type="seq" fixed="left" >
            <template v-slot:header>
              <div class="first-col">
                <div class="first-col-top">VIP</div>
                <div class="first-col-bottom">成员名(成员)时间</div>
              </div>
            </template>
            <template v-slot="{ row }">
              <div>{{row.member_name+'('+row.member+')'}}</div>
              <div>{{row.utime||'同步中'}}</div>
            </template>
          </vxe-table-column>
          <vxe-table-column field="app_ha_info[index].vip" v-for="(item, index) in tableData[0].app_ha_info" :key="index">
            <template v-slot:header>
              {{item.vip}}
            </template>
            <template v-slot="{ row, _columnIndex  }">
              <div>
                <span>优先级：</span>{{row.app_ha_info[index].priority }}
              </div>
              <div>
                <span>状态：</span>
                <my-icon v-if="row.app_ha_info[index].status" :type="statusHandle(row.app_ha_info[index].status).className" :color="statusHandle(row.app_ha_info[index].status).color"></my-icon>
                <span v-if="row.app_ha_info[index].status" style="margin-left: 5px">{{statusHandle(row.app_ha_info[index].status).info}}</span>
                <span v-else>同步中</span>
              </div>
            </template>
          </vxe-table-column>

        </vxe-table>
      </div>
      <div class="table" style="display: flex; align-items: center; justify-content: center;color: #888" v-else>
        暂无数据
      </div>
    </div>

  </div>
</template>
<script>
  import {selAppHAInfo} from "../../../api/app";
  import myIcon from '@/components/icons'
  import {mapState} from "vuex";

  export default {
    data() {
      return{
        tableConfig: [
          {
            title: '虚拟IP',
            key: 'vip',
            align: 'center'
          },
          {
            title: '成员',
            key: 'member',
            align: 'center'
          },
          {
            title: '成员名',
            key: 'member_name',
            align: 'center'
          },
          {
            title: '修改时间',
            key: 'utime',
            align: 'center'
          },
          {
            title: '优先级',
            key: 'priority',
            align: 'center'
          },
          {
            title: 'HA状态',
            key: 'status',
            slot: 'status',
            align: 'center'
          }

        ],
        newData: [],
        loading: false,
        tableData: [],
        summary: '',
        vipList: []
      }
    },
    components: {
      myIcon
    },
    methods: {
      /* 获取HA列表 */
      async selAppHAInfo() {
        this.loading = true
        let res = await  selAppHAInfo({app_server_id: this.$route.params.app})
        this.loading = false
        if (this.asyncOk(res)){
          this.summary = res.data.result.summary
          this.tableData = res.data.result.data || []
         // this.tableData = this.integratedData(this.tableData)
        }
      },

      integratedData(data) {
        let that = this;
        // 获取所有的不同年龄值
        let arrId = [];
        data.forEach(i => {
          !arrId.includes(i.vip) ? arrId.push(i.vip) : arrId;
        });
        // 提前为每个年龄值设置跨行数为0
        let arrObj = [];
        arrId.forEach(j => {
          arrObj.push({
            id: j,
            num: 0
          })
        })
        this.vipList = arrObj
        // 计算每个年龄的可跨行数
        data.forEach(k => {
          arrObj.forEach(l => {
            k.vip === l.id ? l.num ++ : l.num;
          })
        })
        data.forEach(m => {
          arrObj.forEach((n,index) => {
            if(m.vip === n.id){
              m.light = index
              if(arrId.includes(m.vip)){

                m.mergeCol = n.num;
                arrId.splice(arrId.indexOf(m.vip),1);
              }else{
                m.mergeCol = 0;
              }
            }
          })
        })
        console.log(data)
        return data;
      },

      /* 合并单元格 */
      handleSpan ({ row, column, rowIndex, columnIndex }) {

        if (columnIndex === 0) {
          return {
            rowspan: row.mergeCol === 0 ? 0:row.mergeCol,
            colspan: row.mergeCol === 0 ? 0:1
          };
        }

      },
      // 通用单元格合并函数（将指定区域进行合并）
     /* mergeMethod ({ rowIndex, columnIndex }) {
        let row = this.tableData[rowIndex]
        console.log(rowIndex, columnIndex)
        if (columnIndex > 0){
          return {
            rowspan: row.mergeCol === 0 ? 0:row.mergeCol,
            colspan: row.mergeCol === 0 ? 0:1
          };
        }

      },*/

      /* 处理状态 */
      statusHandle(status) {
        switch (status) {
          case 's':
            return {
              className: 'icon-zhunbeizhong',
              color: '#0008fd',
              info: '待命中'
            };
          case 'm':
            return {
              className: 'icon-zhunbei',
              color: '#01c864',
              info: '工作中'
            };
          case 'd':
            return {
              className: 'icon-shibai',
              color: '#ff0000',
              info: '宕机中'
            };
          default: break
        }
      },

      /* 隔行变色 */
      rowClassName (row, index) {
        if (row.light % 2 === 0){
          return ''
        }else {
          return 'light'
        }
      }
    },
    computed: {
      ...mapState({
        activeAside: (state) => state.app.activeAside,
      }),
    },
    created() {
      this.selAppHAInfo()
    },
    mounted() {

    }
  }
</script>
<style lang="less" scoped>
  .dispatch {
    .table-wrap {
      width: 100%;
     // height: calc(100%);
      .table {
        padding: 10px 30px 0 20px;
        height: 100%;
        overflow: auto;
        .advanced{
          padding: 15px 0;
          text-align: center;
          cursor: pointer;
        }
      }

    }
  }
  /deep/.ivu-table .light td{
    background: #f8f8f9;
  }
  .first-col {
    position: relative;
    height: 20px;
  }
  .first-col:before {
    content: "";
    position: absolute;
    left: -15px;
    top: 10px;
    width: 354px;
    height: 1px;
    transform: rotate(8deg);
    background-color: #e8eaec;
  }
  .first-col .first-col-top {
    position: absolute;
    right: 4px;
    top: -10px;
  }
  .first-col .first-col-bottom {
    position: absolute;
    left: 4px;
    bottom: -10px;
  }
</style>
