<template>
  <div class="side-content">
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
        <Header
          :style="{
            background: '#fff',
            boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',
          }"
        ></Header>
        <Content :style="{ padding: '0 16px 16px' }">
          <Breadcrumb :style="{ margin: '16px 0' }">
            <BreadcrumbItem>Home</BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <div style="height: 600px">Content</div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
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
</style>
