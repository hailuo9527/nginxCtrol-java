<template>
  <div class="content">
    <account-aside></account-aside>
    <!-- <Layout> -->
      <!-- <Header
          :style="{
            background: '#fff',
            boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',
          }"
        ></Header> -->
      <!-- <Content :style="{ padding: '0 16px 16px' }"> -->
        <Breadcrumb :style="{ margin: '16px 0' }">
          <BreadcrumbItem>Home</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <div style="height: 600px">Content</div>
        </Card>
      </Content>
    <!-- </Layout> -->
  </div>
</template>

<script>
import AccountAside from "@/components/aside/account-aside.vue";
export default {
  components: { AccountAside },
};
</script>

<style lang="less" scoped>
// .content {
// background-color: #fff;
// }
</style>
