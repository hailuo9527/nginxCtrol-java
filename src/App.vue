<template>
    <div id="app">
        <router-view />
    </div>
</template>
<style lang="less">
.size {
    width: 100%;
    height: 100%;
}
html,
body {
    .size;
    overflow: auto;
    margin: 0;
    padding: 0;
}
#app {
    .size;
    min-width: 1200px;
}
</style>
