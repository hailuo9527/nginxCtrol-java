<template>
  <div>
    <!-- <div class="tabs">
      <Tabs value="name1" type="line">
        <TabPane label="nginx-plus-r20" name="name1"></TabPane>
      </Tabs>
      <div class="timezone-select">
        UTC+08 •
        <div class="clock">9:00</div>
        <div class="timezone-select__dropdown-tick">
          <Dropdown trigger="click">
            <a href="javascript:void(0)">
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>hello world</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div> -->
    <router-view></router-view>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.tabs {
  width: 1053px;
  margin-top: -8px;
  position: fixed;
  z-index: 10;
  background-color: #f8f8f8;
  margin-left: 20px;
}
.tabs .ivu-tabs {
  bottom: -16px;
}
.timezone-select {
  position: absolute;
  top: 24px;
  right: 0;
}
.timezone-select .clock {
  display: inline-block;
  margin-left: 2px;
}
.timezone-select__dropdown-tick {
  display: inline-block;
  width: 12px;
  height: 9px;
  position: relative;
  cursor: pointer;
  margin-left: 5px;
}
</style>