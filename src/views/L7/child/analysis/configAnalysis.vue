<template>
  <div class="father">
    <div class="inner">
      <div class="main-content">
          <Button class="back-button" @click="$router.go(-1)">
            <Icon type="md-arrow-back" />
            Back
          </Button>
        <h1>Config analysis</h1>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.inner {
  width: 939px;
  left: 24px;
  top: 28px;
  background: #ffffff;
  -webkit-box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.2);
  margin-right: 145px;
  max-width: 940px;
  padding: 20px 30px 30px;
  position: relative;
}
.back-button {
  font-weight: bold;
  line-height: 32px;
  position: -webkit-sticky;
  position: sticky;
  top: 63px;
  z-index: 10;
}
h1 {
  font: 36px "RobotoBold", Arial, sans-serif;
  font-weight: bold;
  color: #333333;
  letter-spacing: 0;
  margin: -50px -28px 13px -28px;
  padding: 79px 0 13px 28px;
  background: #ffffff;
  position: -webkit-sticky;
  position: sticky;
  top: 43px;
  z-index: 9;
  -webkit-box-shadow: 0 5px 2px 0 #ffffff;
  box-shadow: 0 5px 2px 0 #ffffff;
}
</style>
