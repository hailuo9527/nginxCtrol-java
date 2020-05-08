<template>
  <div class="content">
    <Layout :style="{ minHeight: '100vh' }">
      <!-- 侧边栏 -->
      <Sider
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
        :width="245"
      >
        <Menu
          active-name="user"
          width="auto"
          :class="menuitemClasses"
          @on-select="GetMenuValue"
        >
          <MenuItem name="user">
            <Icon type="md-contacts" size="22" />
            <span>用戶</span>
          </MenuItem>
          <MenuItem name="role">
            <Icon type="md-person" size="22" />
            <span>角色</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <!-- 主体内容 -->
        <Content :style="{ padding: '0 32px' }">
          <div class="add-button">
            <Button
              type="primary"
              icon="md-add"
              @click="add_user()"
              v-if="status === 1"
              >添加</Button
            >
          </div>
          <Breadcrumb :style="{ margin: '32px 0' }">
            <BreadcrumbItem v-if="status === 1">用户</BreadcrumbItem>
            <BreadcrumbItem v-if="status === 2">角色</BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <div>
              <!-- 用户的表格 -->
              <Table
                :columns="UserTableColumns"
                :data="UserTableData"
                :loading="loading"
                :max-height="400"
                v-if="status === 1"
              >
                <template slot-scope="{ row }" slot="tag">
                  <Tag color="#292932">{{ row.tag }}</Tag>
                </template>
                <template slot-scope="{ row }" slot="role_id">
                  <Tag color="#292932">{{ row.role_id }}</Tag>
                </template>

                <template slot-scope="{ row, index }" slot="operation">
                  <Icon
                    type="ios-trash"
                    style="margin-right: 5px"
                    size="22"
                    title="删除"
                    @click="DeleteUser(row.id)"
                  />
                  <Icon
                    type="ios-create"
                    size="22"
                    title="编辑"
                    @click="edit_user(row)"
                  />
                </template>
              </Table>
              <!-- 角色的表格 -->
              <Table
                :columns="RoleTableColumns"
                :data="RoleTableData"
                :loading="loading"
                :max-height="400"
                v-if="status === 2"
              ></Table>
              <div class="under-table" v-if="status === 1">
                目前有
                <span>{{ user_length }}</span>
                个用户
              </div>
              <div class="under-table" v-if="status === 2">
                目前有
                <span>{{ role_length }}</span>
                个角色
              </div>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
    <!-- 添加用户信息的Modal -->
    <Modal v-model="AddModel" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:center">
        <span>添加</span>
      </p>
      <Form
        :model="formCustom"
        :rules="ruleCustom"
        :label-width="90"
        ref="formCustom"
      >
        <FormItem label="Username" prop="username">
          <Input type="text" v-model="formCustom.username"></Input>
        </FormItem>
        <FormItem label="UserNo" prop="usernumber">
          <Input type="text" v-model="formCustom.usernumber"></Input>
        </FormItem>
        <FormItem label="Password" prop="password">
          <Input type="password" v-model="formCustom.password"></Input>
        </FormItem>
        <FormItem label="Confirm" prop="passwordCheck">
          <Input type="password" v-model="formCustom.passwordCheck"></Input>
        </FormItem>
        <FormItem label="Tags" >
          <Input type="text" v-model="formCustom.tag"></Input>
        </FormItem>
        <FormItem label="Roles" >
          <Input type="text" v-model="formCustom.role"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :long="true" @click="handleSubmit('formCustom')"
          >确认添加</Button
        >
      </div>
    </Modal>
    <!-- 修改用户的Modal -->
    <Modal v-model="EditModel" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:center">
        <span>修改</span>
      </p>
      <Form
        :model="formCustom"
        :rules="ruleCustom"
        :label-width="90"
        ref="formCustom"
      >
        <FormItem label="Username" prop="username">
          <Input type="text" v-model="formCustom.username"></Input>
        </FormItem>
        <FormItem label="UserNo" prop="usernumber">
          <Input type="text" v-model="formCustom.usernumber"></Input>
        </FormItem>
        <FormItem label="Password" prop="password">
          <Input type="password" v-model="formCustom.password"></Input>
        </FormItem>
        <FormItem label="Tags" >
          <Input type="text" v-model="formCustom.tag"></Input>
        </FormItem>
        <FormItem label="Roles" >
          <Input type="text" v-model="formCustom.role"></Input>
        </FormItem>
        <!-- <FormItem label="Email" prop="email">
          <Input type="text" v-model="formCustom.email" disabled></Input>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="primary" :long="true" @click="handleSubmit('formCustom')"
          >确认修改</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  insSysUersInso,
  selSysUersInfoAll,
  delSysUersInso,
  uptSysUersInso,
  selRoleInfo,
} from "@/api/account";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formCustom.passwordCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formCustom.password) {
        callback(new Error("两次输入的密码不相同"));
      } else {
        callback();
      }
    };
    // const validateEmail = (rule, value, callback) => {
    //   const regexp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    //   if (value === "") {
    //     callback(new Error("请输入邮箱"));
    //   } else {
    //     if (regexp.test(value)) {
    //       callback();
    //     } else {
    //       callback(new Error("邮箱地址不正确"));
    //     }
    //   }
    // };
    return {
      isCollapsed: false,
      AddModel: false,
      EditModel: false,
      formCustom: {
        username: "",
        usernumber: "",
        tag: "",
        role: "",
        password: "",
        passwordCheck: "",
      },
      ruleCustom: {
        username: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        usernumber: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: "blur" },
        ],
      },
      UserTableColumns: [
        {
          title: "用户名称",
          key: "user_name",
        },
        {
          title: "标签",
          slot: "tag",
        },
        {
          title: "角色",
          slot: "role_id",
        },
        {
          title: "创建时间",
          key: "ctime",
        },
        // {
        //   title: "最后一次登录时间",
        //   key: "last_login",
        // },
        {
          slot: "operation",
        },
      ],
      UserTableData: [],
      loading: false,
      user_length: "",
      num: "",
      user_id: "",
      status: 1,
      role_length: "",
      RoleTableColumns: [
        {
          title: "角色名称",
          key: "role_name",
        },
        {
          title: "角色ID",
          key: "id",
        },
        {
          title: "备注",
          key: "remark",
        },
      ],
      RoleTableData: [],
    };
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  methods: {
    //判断'添加Model'或者'修改Model'输入的内容是否正确
    handleSubmit(name) {
      if (this.num == 1) {
          console.log(111)
        this.$refs[name].validate((valid) => {
          if (valid) {
              console.log(valid)
            this.AddModel = false;
            this.AddUesr();
          } else {
            this.$Message.error("Fail!");
          }
        });
      } else {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.EditModel = false;
            this.EditUser();
          } else {
            this.$Message.error("Fail!");
          }
        });
      }
    },
    //弹出添加Model
    add_user() {
      this.AddModel = true;
      this.num = 1;
    },
    //弹出修改Model
    edit_user(row) {
        console.log(row)
      this.EditModel = true;
      this.num = 2;
      this.formCustom.username = row.user_name;
      this.formCustom.tag = row.tag;
      this.formCustom.role = row.role_id;
      this.formCustom.usernumber = row.user_no
      this.user_id = row.id;
      this.formCustom.password = row.password
    },
    //侧边栏切换更换相应内容
    GetMenuValue(name) {
      if (name === "user") {
        this.status = 1;
        this.GetAllUser();
      } else {
        this.status = 2;
        this.GetRole();
      }
    },
    //添加用户信息
    async AddUesr() {
      let json = {
        user_name: this.formCustom.username,
        user_no: this.formCustom.usernumber,
        password: this.formCustom.password,
        tag: this.formCustom.tag,
        role_id: this.formCustom.role,
      };
      let res = await insSysUersInso(json);
      if (res.data.code === "success") {
        this.$Message.info(`${res.data.result}`);
        this.GetAllUser();
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },
    //查询所有用户信息
    async GetAllUser() {
      this.loading = true;
      let res = await selSysUersInfoAll();
      if (res.data.code === 'success') {
      this.loading = false;
      this.user_length = res.data.result.length;
      this.UserTableData = res.data.result;
      }else {
          this.loading = false;
      }
    },
    //删除用户信息
    async DeleteUser(id) {
      this.$Modal.confirm({
        title: "警告",
        content: "确定删除该条信息？",
        onOk: async () => {
          let res = await delSysUersInso(id);
          if (res.data.code === "success") {
            this.$Message.info(`${res.data.result}`);
            // this.$Modal.remove();
            this.GetAllUser();
          } else {
            this.$Message.error(`${res.data.result}`);
          }
        },
      });
    },
    //修改用户信息
    async EditUser() {
      let json = {
        user_name: this.formCustom.username,
        user_no: this.formCustom.number,
        password: this.formCustom.password,
        tag: this.formCustom.tag,
        role_id: this.formCustom.role,
        id: this.user_id,
      };
      let res = await uptSysUersInso(json);
      if (res.data.code === "success") {
        this.$Message.info("修改成功");
        this.GetAllUser();
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },
    //获取角色信息
    async GetRole() {
      this.loading = true;
      let res = await selRoleInfo();
      this.loading = false;
      this.role_length = res.data.result.length;
      this.RoleTableData = res.data.result;
    },
  },
  mounted() {
    this.GetAllUser();
  },
};
</script>

<style lang="less" scoped>
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
/deep/ .ivu-layout-sider-trigger,
.ivu-menu-light,
.ivu-layout-sider {
  background-color: #e8eaec;
}
/deep/ .ivu-icon-ios-arrow-back {
  color: #000;
}
/deep/ .ivu-menu {
  color: #000;
}
/deep/ .ivu-menu-item {
  height: 80px;
  line-height: 45px;
}
.add-button {
  position: absolute;
  right: 32px;
  top: 96px;
}
/deep/ .ivu-table-row:hover {
  cursor: pointer;
}
.under-table {
  margin: 10px 0 0 20px;
}
.under-table > span {
  color: red;
  font-weight: bolder;
}
/deep/.ivu-table-row {
  height: 80px;
}
/deep/.ivu-table-header th:nth-child(5) {
  color: #f8f8f9;
}
/deep/.ivu-table-header th {
  height: 60px;
}
</style>
