<template>
  <div class="content" style="margin-top: 0px;">
    <div class="overview-container overview-container_css-grid">
      <div class="overview-container__header">
        <div class="timewindow-chooser">
          <ul class="timewindow-chooser__list">
            <li
              :class="number === index ? 'timewindow-chooser__list-item_selected timewindow-chooser__list-item' : 'timewindow-chooser__list-item' "
              v-for="(item, index) in items"
              @click="change(index)"
            >{{item}}</li>
          </ul>
        </div>
        <h1 class="overview-container__h1">Overview</h1>
      </div>
      <div class="overview-container__content">
        <div class="overview-score-box overview-score-box_semi-healthy">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <Icon type="md-settings" class="overview-score-box__settings" @click="config=true" />
            <h2 class="overview-score-box__score">74.5%</h2>
            <div class="overview-score-box__title">Application Health Score</div>
            <table class="overview-score-box__stats">
              <tr>
                <td>Successful requests</td>
                <td>7k</td>
              </tr>
              <tr>
                <td>Request time (P95)</td>
                <td>0 s</td>
              </tr>
              <tr>
                <td>Agent availability</td>
                <td>75 %</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">Total requests</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">7K</span>
                <span class="overview-box__l__delta">+1 %</span>
                <span class="overview-box__l__unit"></span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">7K</span>
            </div>
            <canvas id="canvas" class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div>
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">HTTP 5xx errors</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">0</span>
                <span class="overview-box__l__unit"></span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">0</span>
            </div>
            <canvas id class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div>
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">Request time (P95)</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">0.000</span>
                <span class="overview-box__l__unit">s</span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">0.000</span>
            </div>
            <canvas id class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div>
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">Traffic</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">0</span>
                <span class="overview-box__l__delta">+2 %</span>
                <span class="overview-box__l__unit">bps</span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">0</span>
            </div>
            <canvas id="canvas2" class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div>
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">Request time (P95)</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">0.000</span>
                <span class="overview-box__l__unit">%</span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">0.000</span>
            </div>
            <canvas id="canvas3" class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer__inner">Copyright © 2018-2020 WingsBro</div>
      </div>
    </div>
    <Modal v-model="config" title="Common Modal dialog box title">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "",
      number: 0,
      config: false,
      items: ["1H", "4H", "1D", "2D", "1W"],
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  methods: {
    change(index) {
      this.number = index;
      this.active = true;
      var active = this.active;
      setTimeout(this.changeAfter, 2000);
    },
    changeAfter() {
      if (this.active) {
        this.active = false;
      }
    },
    //画布一
    canvasOne() {
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "#01c864";
      ctx.moveTo(0, 10);
      var x = 0;
      for (var y = 0; y < 14; y++) {
        x += 30;
        ctx.lineTo(x, Math.random() * this.arr.length);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "grey";
      ctx.moveTo(0, 10);
      var x = 0;
      for (var y = 0; y < 14; y++) {
        x += 30;
        ctx.lineTo(x, Math.random() * this.arr.length);
      }
      ctx.stroke();
      setInterval(() => {
        canvas.setAttribute("height", 100);
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "#01c864";
        ctx.moveTo(0, 10);
        var a = 0;
        for (var y = 0; y < 14; y++) {
          a += 30;
          ctx.lineTo(a, Math.random() * this.arr.length);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "grey";
        ctx.moveTo(0, 10);
        var a = 0;
        for (var y = 0; y < 14; y++) {
          a += 30;
          ctx.lineTo(a, Math.random() * this.arr.length);
        }
        ctx.stroke();
      }, 5000);
    },
    //画布二
    canvasTwo() {
      var canvas = document.getElementById("canvas2");
      var ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "#01c864";
      ctx.moveTo(0, 10);
      var x = 0;
      for (var y = 0; y < 14; y++) {
        x += 30;
        ctx.lineTo(x, Math.random() * this.arr.length);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "grey";
      ctx.moveTo(0, 10);
      var x = 0;
      for (var y = 0; y < 14; y++) {
        x += 30;
        ctx.lineTo(x, Math.random() * this.arr.length);
      }
      ctx.stroke();
      setInterval(() => {
        canvas.setAttribute("height", 100);
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "#01c864";
        ctx.moveTo(0, 10);
        var a = 0;
        for (var y = 0; y < 14; y++) {
          a += 30;
          ctx.lineTo(a, Math.random() * this.arr.length);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "grey";
        ctx.moveTo(0, 10);
        var a = 0;
        for (var y = 0; y < 14; y++) {
          a += 30;
          ctx.lineTo(a, Math.random() * this.arr.length);
        }
        ctx.stroke();
      }, 5000);
    },
    //画布三
    canvasThree() {
      var canvas = document.getElementById("canvas3");
      var ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "#01c864";
      ctx.moveTo(0, 10);
      var x = 0;
      for (var y = 0; y < 14; y++) {
        x += 30;
        ctx.lineTo(x, Math.random() * 10);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "grey";
      ctx.moveTo(0, 10);
      var x = 0;
      for (var y = 0; y < 14; y++) {
        x += 30;
        ctx.lineTo(x, Math.random() * 10);
      }
      ctx.stroke();
      setInterval(() => {
        canvas.setAttribute("height", 100);
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "#01c864";
        ctx.moveTo(0, 10);
        var a = 0;
        for (var y = 0; y < 14; y++) {
          a += 30;
          ctx.lineTo(a, Math.random() * 10);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "grey";
        ctx.moveTo(0, 10);
        var a = 0;
        for (var y = 0; y < 14; y++) {
          a += 30;
          ctx.lineTo(a, Math.random() * 10);
        }
        ctx.stroke();
      }, 5000);
    }
  },
  mounted() {
    this.canvasOne();
    this.canvasTwo();
    this.canvasThree();
  }
};
</script>

<style lang="less" scoped>
@import "Home";
</style>
