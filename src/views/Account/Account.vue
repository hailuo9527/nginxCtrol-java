<template>
  <div class="content">
    <Layout :style="{ minHeight: '100vh' }">
      <Sider
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
        :width="245"
      >
        <Menu active-name="1-1" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1">
            <Icon type="md-contacts" size="22" />
            <span>用戶</span>
          </MenuItem>
          <MenuItem name="1-2">
            <Icon type="md-person" size="22" />
            <span>角色</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Content :style="{ padding: '0 32px' }">
          <div class="add-button">
            <Button type="primary" icon="md-add" @click="AddModel = true"
              >添加</Button
            >
          </div>
          <Breadcrumb :style="{ margin: '32px 0' }">
            <BreadcrumbItem>用户</BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <div>Content</div>
          </Card>
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="AddModel" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:center">
        <span>添加</span>
      </p>
      <account-form></account-form>
      <div slot="footer">
        <Button type="primary" :long="true" @click="handleSubmit('formCustom')"
          >确认添加</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import AccountForm from "./AccountForm";
export default {
  components: { AccountForm },
  data() {
    return {
      isCollapsed: false,
      AddModel: false,
    };
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.ModelStatus = true;
          this.$Message.error("Fail!");
        }
      });
    },
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
  right: 26px;
  top: 96px;
}
</style>
