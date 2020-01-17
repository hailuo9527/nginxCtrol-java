<template>
  <div class="father">
    <div class="main-content">
      <div class="main-content-navigation">
        <div class="icon-gear">
          <Icon
            type="md-settings"
            title="Nginx analyzer settings"
            @click="analyzerSettingsModal = true"
          />
        </div>
        <router-link to="/L7/123/analysis/overview" class="router-link-active">
          <h4 class="section-box-title">Build</h4>
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
        </router-link>
        <router-link to="/L7/123/analysis/configAnalysis" class="router-link-active">
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
        </router-link>
        <router-link to="/L7/123/analysis/servers" class="router-link-active">
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
        </router-link>
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
  // name: "main",
  data() {
    return {
      analyzerSettingsModal: false,
      single: true
    };
  }
};
</script>
<style lang="less" scoped>
@import "main";
</style>