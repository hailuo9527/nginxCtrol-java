<template>
  <div>
    <div class="home-spin">
      <Loading v-if="home_loading" />
    </div>
    <div class="content" style="margin-top: 0px;" v-if="!home_loading">
      <div class="overview-container overview-container_css-grid">
        <div class="overview-container__header">
          <h1 class="overview-container__h1">Overview</h1>
        </div>
        <div class="overview-container__content">
          <div
            class="overview-score-box "
            :class="{
              'overview-score-box_semi-healthy': ishealthy,
              'overview-score-box_sub_healthy': issubhealthy,
              'overview-score-box_unhealthy': unhealthy,
            }"
          >
            <div :class="active ? 'transition-before' : 'transition-after'">
              <h2 class="overview-score-box__score">{{ instancePercent }}%</h2>
              <div class="overview-score-box__title">实例状态</div>
              <table class="overview-score-box__stats">
                <tr>
                  <td>在线实例</td>
                  <td>{{ instanceOn }}</td>
                </tr>
                <tr>
                  <td>离线实例</td>
                  <td>{{ instanceOff }}</td>
                </tr>
                <tr>
                  <td>在线实例占比</td>
                  <td>{{ instancePercent }}%</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="overview-box">
            <div :class="active ? 'transition-before' : 'transition-after'">
              <h3 class="overview-box__title">预警</h3>
              <div class="overview-box__l">
                <h4 class="overview-box__value-title">CPU预警线</h4>
                <span class="overview-box__l__content">
                  <span class="overview-box__l__val">{{
                    cpuWarningCount
                  }}</span>
                  <!-- <span class="overview-box__l__delta">+1 %</span>
                <span class="overview-box__l__unit"></span> -->
                </span>
              </div>
              <div class="overview-box__r">
                <h4 class="overview-box__value-title">磁盘预警线</h4>
                <span class="overview-box__r__val">{{ diskWarningCount }}</span>
              </div>
              <!-- <canvas id="canvas" class="overview-box__chart" width="320" height="100"></canvas> -->
            </div>
          </div>
          <chart-box
            :data="item"
            :index="index"
            v-if="chartData.length"
            :key="index"
            v-for="(item, index) in chartData"
            @remove="RemoveApp"
          ></chart-box>
          <div class="overview-box">
            <div class="add-button" @click="DisplayModel()">
              <!-- <Icon type="ios-add-circle-outline" size="140" /> -->+
            </div>
          </div>
          <!-- 添加app的Modal -->
          <Modal v-model="AddModel" width="400"  :mask-closable="false">
            <p slot="header" style="color:#333;text-align:center">
              <span>添加</span>
            </p>
            <div style="padding: 20px 0">
              <div style="color: #aaa; margin-bottom: 20px">请选择想要添加到首页的APP</div>
              <Select v-model="SelectModel" style="width:100%">
                <Option
                        v-for="item in asideList"
                        :value="item.app_service_id"
                        :key="item.app_service_id"
                >{{ item.app_service_name }}</Option
                >
              </Select>
            </div>

            <div slot="footer">
              <Button type="primary" :long="true" @click="handleSubmit()"
                >确认添加</Button
              >
            </div>
          </Modal>
        </div>
        <div class="footer">
          <div class="footer__inner">Copyright © 2018-2020 WingsBro</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selOverViewInfo, addOverViewInfo, delOverViewInfo } from "@/api/home";

import ChartBox from "./chart-box";
import { mapState, mapActions } from "vuex";
import Loading from "@/components/common/loading.vue";
export default {
  components: { ChartBox },
  data() {
    return {
      active: "",
      cpuWarningCount: "",
      diskWarningCount: "",
      instanceOff: "",
      instanceOn: "",
      instancePercent: "",
      requestCountCurrent: "",
      requestCountPast: "",

      requestRatio: "",
      AddModel: false,
      SelectModel: "",
      appOverViews: [],
      app_requestCountCurrent: "",
      app_requestCountPast: "",
      chartData: [],
      ishealthy: false,
      issubhealthy: false,
      unhealthy: false,
      home_loading: true,
    };
  },
  methods: {
    ...mapActions(["getAppAsideList"]),
    //查询首页信息
    async GetHomeInfo() {
      this.home_loading = true;
      this.chartData = []
      let res = await selOverViewInfo();
      console.log(res);
      if (res.data.code === "success") {
        const data = res.data.result;
        let appData = {
          requestCountCurrent: data.requestCountCurrent,
          requestCountPast: data.requestCountPast,
          requestCurrent: data.requestCurrent,
          requestPast: data.requestPast,
          requestRatio: data.requestRatio,
        };
        let arr = []
        let obj = {}
        arr.push(appData, ...data.appOverViews)
        arr.map((item, index) => {
          item.requestPast.map((i)=>{
            i.ctime = i.ctime.substring(i.ctime.length-4)
          })
          item.requestCurrent.map((i,index)=> {
            i = Object.assign(i, item.requestPast[index])
            i.ctime = i.ctime.substring(i.ctime.length-4)
          })
          /* 去重 */
          item.requestCurrent = item.requestCurrent.reduce((cur,next) => {
            obj[next.ctime] ? "" : obj[next.ctime] = true && cur.push(next);
            return cur;
          },[])
        })



        console.log(arr)
        this.chartData = arr


        this.cpuWarningCount = data.cpuWarningCount;
        this.diskWarningCount = data.diskWarningCount;
        this.instanceOff = data.instanceOff;
        this.instanceOn = data.instanceOn;
        this.instancePercent = data.instancePercent * 100;
        if (data.instancePercent == 1) {
          this.ishealthy = true;
          this.issubhealthy = false;
          this.unhealthy = false;
        } else if (data.instancePercent < 1 && data.instancePercent >= 0.4) {
          this.ishealthy = false;
          this.issubhealthy = true;
          this.unhealthy = false;
        } else {
          this.ishealthy = false;
          this.issubhealthy = false;
          this.unhealthy = true;
        }
        this.appOverViews = data.appOverViews;
        this.home_loading = false;
      }
    },
    DisplayModel() {
      this.AddModel = true;
      this.getAppAsideList();
    },
    async handleSubmit() {
      //console.log(this.userInfo)
      let res = await addOverViewInfo({
        user_id: this.userInfo.id,
        app_id: this.SelectModel,
      });
      if (res.data.code === "success") {
        this.$Message.info(`${res.data.result}`);
        this.AddModel = false;
        this.GetHomeInfo();
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },
    async RemoveApp(appId) {
      this.$Modal.confirm({
        title: "警告",
        content: "确定删除此APP？",
        loading: true,
        onOk: async () => {
          let res = await delOverViewInfo({
            user_id: this.userInfo.id,
            app_id: appId,
          });
          console.log(res);
          if (res.data.code === "success") {
            this.$Modal.remove()
            this.$Message.info(`删除成功`);
            this.GetHomeInfo();
          } else {
            this.$Message.error(`${res.data.result}`);
          }
        },
      });
    },
  },
  computed: {
    ...mapState({
      asideList: (state) => state.app.asideList,
      userInfo: (state) => state.login.userInfo,
    }),
  },
  mounted() {
    console.log(this.userInfo)
    this.GetHomeInfo();
  },
};
</script>

<style lang="less" scoped>
@import "Home";
.home-spin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.add-button {
  width: 140px;
  height: 140px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid #fff;
  font-size: 140px;
  text-align: center;
  line-height: 140px;
}
</style>
