<template>
  <div class="father">
    <div class="tabs">
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
              <DropdownItem>111</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="main-content-navigation">
        <a class="section-box">
          <h4 class="section-box-title">Build</h4>
          <Icon
            type="md-settings"
            title="Nginx analyzer settings"
            class="icon-gear"
            @click="analyzerSettingsModal = true"
          />
          <div class="section-box-table">
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Host</div>
              <div class="section-box-table-cell">node1</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Version</div>
              <div class="section-box-table-cell">nginx-plus-r20</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Status</div>
              <div class="section-box-table-cell">Up</div>
            </div>
            <span class="section-box-details">Open</span>
          </div>
        </a>
        <a class="section-box">
          <h4 class="section-box-title">Static analysis</h4>
          <div class="section-box-table">
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Updated</div>
              <div class="section-box-table-cell">Jan 13, 2020, 06:30:00 UTC+08</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Files</div>
              <div class="section-box-table-cell">1</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Locations</div>
              <div class="section-box-table-cell">5</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Upstreams</div>
              <div class="section-box-table-cell">1</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Errors</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Locations</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <span class="section-box-details">Open</span>
          </div>
        </a>
        <a class="section-box">
          <h4 class="section-box-title">Virtual servers</h4>
          <div class="section-box-table">
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Servers</div>
              <div class="section-box-table-cell">2</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Server names</div>
              <div class="section-box-table-cell">3</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Total IPv4 addresses</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Listen IP/ports</div>
              <div class="section-box-table-cell">1</div>
            </div>
            <span class="section-box-details">Open</span>
          </div>
        </a>
        <div class="section-box">
          <h4 class="section-box-title">Security advisories</h4>
          <div class="section-box-table">
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Major severity</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Medium severity</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Minor severity</div>
              <div class="section-box-table-cell">0</div>
            </div>
          </div>
        </div>
        <div class="section-box">
          <h4 class="section-box-title">SSL</h4>
          <div class="section-box-table">
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Certificates</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Expired</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Warnings</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">SSL/TLS servers</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">HTTP/2 servers</div>
              <div class="section-box-table-cell">0</div>
            </div>
            <div class="section-box-table-row">
              <div class="section-box-table-cell">Library</div>
              <div class="section-box-table-cell">OpenSSL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ANALYZER SETTINGS的Modal -->
    <Modal v-model="analyzerSettingsModal" title="ANALYZER SETTINGS" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>ANALYZER SETTINGS</span>
      </p>
      <h4 style="font-size:16px">nginx-plus-r20</h4>
      <div class="check-box">
        <div>
          <Checkbox v-model="single">Enable NGINX config analyzer</Checkbox>
        </div>
        <div class="check-box-item">
          <Checkbox v-model="single" disabled>Enable periodic "nginx -t" Globally disabled</Checkbox>
        </div>
        <div class="check-box-item">
          <Checkbox v-model="single">Analyze SSL certificates</Checkbox>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long>confirm</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      analyzerSettingsModal: false,
      single: true
    };
  }
};
</script>
<style lang="less" scoped>
// @import "../L7/child/analysis/main/main.less";
.father {
  background-color: #f8f8f8;
}
a {
  color: inherit;
  text-decoration: none;
}
.tabs {
  width: 1061px;
  margin-top: -8px;
  position: fixed;
  z-index: 10;
  background-color: #f8f8f8;
}
.tabs .ivu-tabs {
  bottom: -12px;
}
.tabs .timezone-select {
  position: absolute;
  top: 20px;
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
.main-content {
  position: relative;
  margin-top: 60px;
}
.main-content-navigation {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  position: relative;
  min-width: 924px;
}
a.section-box {
  cursor: pointer;
}
.section-box {
  display: block;
  background: #ffffff;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  padding: 13px 20px;
  position: relative;
  height: 270px;
  margin: 0 20px 20px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -ms-flex-preferred-size: 30%;
  // flex-basis: 30%;
  min-width: 30%;
  width: 330px;
}
.section-box-title {
  font-size: 16px;
  // font-weight: normal;
  margin: 0 0 23px;
}
.icon-gear {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 22px;
  opacity: 0.5;
  -webkit-transition: opacity 0.1s linear;
  transition: opacity 0.1s linear;
}
.section-box-table-row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-top: 11px;
}
.section-box-table-row:first-child {
  margin-top: 0px;
}
.section-box-table-cell:first-child {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1 0 auto;
  flex: 1 0 auto;
}
.section-box-table-cell:nth-child(2) {
  -webkit-box-flex: 0;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.section-box-table-cell:first-child:after {
  content: "";
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 10px;
  height: 16px;
  margin: 0px 4px;
  border-bottom: 1px solid #d8d8d8;
}
.section-box-details {
  font: 14px "RobotoMedium", Arial, sans-serif;
  font-weight: normal;
  position: absolute;
  bottom: 12px;
  text-align: center;
  display: block;
  color: #ababab;
  width: 100%;
  left: 0;
}
.section-box:hover .section-box-details {
  color: #0061ce;
}
a.section-box:hover {
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.16);
}
.check-box {
  margin-top: 20px;
}
.check-box-item {
  margin-top: 12px;
}
</style>