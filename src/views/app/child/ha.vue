<template>
  <div class="dispatch">
    <div class="table-wrap">
      <div class="table">
        <Table :row-class-name="rowClassName"  :loading="loading" :columns="tableConfig" :data="newData" border :span-method="handleSpan">
          <template slot-scope="{ row, index }" slot="status">
            <my-icon v-if="row.status" :type="statusHandle(row.status).className" :color="statusHandle(row.status).color"></my-icon>
            <span v-if="row.status" style="margin-left: 10px">{{statusHandle(row.status).info}}</span>
            <span v-else>同步中</span>
          </template>
        </Table>
      </div>

    </div>

  </div>
</template>
<script>
  import { selAppHAInfo } from "../../../api/app";
  import myIcon from '@/components/icons'
  import { mapState } from "vuex";
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
      }
    },
    components: {
      myIcon
    },
    methods: {
      /* 获取HA列表 */
      async selAppHAInfo() {
        this.loading = true
        let res = await  selAppHAInfo({app_server_id: this.activeAside.app_service_id})
        this.loading = false
        if (this.asyncOk(res)){
          let data = res.data.result || []
          this.newData = this.integratedData(data)
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
            }else {

            }
          })
        })
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

      /* 处理状态 */
      statusHandle(status) {
        switch (status) {
          case 's':
            return {
              className: 'icon-zhunbeizhong',
              color: '#ff9300',
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

    mounted() {
      this.selAppHAInfo()
    }
  }
</script>
<style lang="less" scoped>
  .dispatch {
    .table-wrap {
      width: 100%;
      height: calc(100% - 60px);
      .table {
        padding: 0 30px 0 20px;
        height: 100%;
        overflow: auto;
        margin-top: 15px;
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
</style>
