<template>
  <div class="dispatch">
    <div class="table-wrap">
      <div class="table">
        <Table :loading="loading" :columns="columns1" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="info" size="small" style="margin-right: 5px" @click="modify(row,index)">修改</Button>
          </template>
        </Table>
      </div>

    </div>
    <Modal
            v-model="modal"
            title="修改权重"
            @on-ok="submit"
            :loading="loading">
      <div class="modal_content">
        <Form ref="formValidate" :model="form" :rules="ruleValidate" @submit.native.prevent :label-width="80">
          <FormItem label="权重" prop="">
            <Input v-model="form.name" placeholder="权重，数值越大权重越大"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'dispatch',
    data() {
      return {
        loading: false,
        columns1: [
          {
            title: 'IP',
            key: 'name'
          },
          {
            title: '流量',
            key: 'age'
          },
          {
            title: '权重',
            key: 'address'
          },
          {
            title: '修改',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        data: [],
        modal: false,
        form: {},
        ruleValidate: {

        }

      }
    },
    methods: {
      modify(row, index) {
        console.log(index)
        this.modal = true
      },
      submit() {

      }
    }
  }
</script>
<style lang="less" scoped>
  .dispatch{
    .table-wrap{
      width: 100%;
      .table{
        padding: 0 30px 0 20px;
      }
    }

  }
  .modal_content{
    padding: 20px;
    .tip-title{
      margin-bottom: 40px;
      font-size: 14px;
      letter-spacing: .2em;
      color: #ccc;
    }
  }
</style>
