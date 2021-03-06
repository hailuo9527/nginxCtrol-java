<template>
    <div v-if="model">
        <Modal width="50" v-model="model" :transfer="true" :mask-closable="false" @on-visible-change="change" :styles="{top:0}">
            <div slot="header">{{ modify?  '修改Location' : '新建Location' }}</div>
            <div class="virtual_server_form modal-body" :class="{'modal-body-show':isTaskbarShow}">

                <Alert type="error" class="err-tip" v-if="errorTip.show" closable>
                    您需要确认每个部分的更改: {{errorTip.value}}
                    <Icon type="md-close" class="close" slot="close" />
                </Alert>
                <uriPath :modify="modify" :data="uriPath" @edit="checkEditStatus" @readyOk='prepareConfig'></uriPath>
                <apiLocation :modify="modify" :data="apiLocation" @edit="checkEditStatus" @readyOk='prepareConfig'></apiLocation>
                <proxy :disabled="disabled" :modify="modify" :data="proxy" @edit="checkEditStatus" @readyOk='prepareConfig'></proxy>
                <allowDeny :disabled="disabled" :modify="modify" :data="allow_deny" @edit="checkEditStatus" @readyOk='prepareConfig'></allowDeny>
                <errorPages :modify="modify" :disabled="disabled" :data="errorPages" @edit="checkEditStatus" @readyOk='prepareConfig'></errorPages>
                <indexFile :modify="modify" :disabled="disabled" :data="indexFiles" @edit="checkEditStatus" @readyOk='prepareConfig'></indexFile>
                <root :modify="modify" :disabled="disabled" :data="root" @edit="checkEditStatus" @readyOk='prepareConfig'></root>
                <alias :modify="modify" :disabled="disabled" :data="alias" @edit="checkEditStatus" @readyOk='prepareConfig'></alias>

            </div>
            <div slot="footer">
                <modelFooter name="location" :showRemoveButton="modify" @remove="remove" @cancel="change(false)" @save="handleSubmit"></modelFooter>

            </div>
        </Modal>
    </div>

</template>
<script>
import uriPath from "./locationModal/uriPath";
import apiLocation from "./locationModal/apiLocation";
import proxy from "./locationModal/proxy";
import allowDeny from "./locationModal/allow_deny";
import errorPages from "./locationModal/errorPages";
import indexFile from "./locationModal/indexFile";
import root from "./locationModal/root";
import alias from "./locationModal/alias";
import modelFooter from "./modelFooter";
import { mapState } from "vuex";
export default {
    props: {
        show: false,
        data: {
            type: Object,
            default: () => {},
        },
        modify: false,
    },
    components: {
        uriPath,
        apiLocation,
        proxy,
        allowDeny,
        errorPages,
        indexFile,
        root,
        alias,
        modelFooter,
    },
    watch: {
        show(newVal, oldVal) {
            //console.log(...arguments)
            this.model = newVal;
        },
        model(newVal, oldVal) {
            if (!newVal) {
                this.change(newVal);
                this.errorTip = {
                    show: false,
                    value: "",
                };
            }
        },
        data: {
            handler(nv, ov) {
                /* 拷贝对象 */
                this.locationForm = this.copyJson(nv);
                this.uriPath = {
                    url_path_route_key: this.locationForm.url_path_route_key,
                    url_path_route_value: this.locationForm
                        .url_path_route_value,
                };
                this.apiLocation = {
                    apilocation_state: this.locationForm.apilocation_state,
                    read_only_state: this.locationForm.read_only_state,
                };
                this.proxy = {
                    proxy_state: this.locationForm.proxy_state,
                    proxy_url: this.locationForm.proxy_url,
                    ngcLocationHeaders: this.locationForm.ngcLocationHeaders,
                    buffering_state: this.locationForm.buffering_state,
                    allow_to_buffer_on_disk_state: this.locationForm
                        .allow_to_buffer_on_disk_state,
                    http_version: this.locationForm.http_version,
                    connect_timeout: this.locationForm.connect_timeout,
                    intercept_errors_state: this.locationForm
                        .intercept_errors_state,
                };
                this.allow_deny = {
                    allow_deny_state: this.locationForm.allow_deny_state,
                    ngcAllowDenies: this.locationForm.ngcAllowDenies,
                };
                this.errorPages = {
                    error_pages_state: this.locationForm.error_pages_state,
                    ngcErrorPages: this.locationForm.ngcErrorPages,
                };
                this.indexFiles = {
                    index_files_state: this.locationForm.index_files_state,
                    index_files: this.locationForm.index_files,
                };
                this.root = {
                    root_state: this.locationForm.root_state,
                    root_path: this.locationForm.root_path,
                };
                this.alias = {
                    alias_state: this.locationForm.alias_state,
                    alias_path: this.locationForm.alias_path,
                };
            },
            immediate: true,
        },
        modify(nv) {
            // console.log(nv)
        },
    },
    data() {
        return {
            modal_loading: false,
            model: false,
            locationForm: {},
            errorInfo: {},
            errorTip: {
                show: false,
                value: "",
            },
            disabled: false,
            uriPath: {},
            apiLocation: {},
            proxy: {},
            allow_deny: {},
            errorPages: {},
            indexFiles: {},
            root: {},
            alias: {},
        };
    },
    computed: {
        ...mapState({
            isTaskbarShow: (state) => state.taskbar.isTaskbarShow,
        }),
    },
    methods: {
        change(data) {
            this.model = data;
            this.$emit("change", { data: data, name: "locationModal" });
        },

        handleSubmit() {
            console.log("保存");
            // 验证是否有未确认的更改
            // console.log(this.errorInfo)
            let flag = true;

            Object.keys(this.errorInfo).map((item) => {
                //console.log(this.errorInfo[item])
                if (this.errorInfo[item]) {
                    flag = false;
                    this.errorTip = {
                        show: true,
                        value: item,
                    };
                }
            });
            if (flag) {
                this.$emit("submit", this.locationForm);
                this.change(false);
            }
        },
        /* 检查是否有未保存的配置项 */
        checkEditStatus(data) {
            //console.log(data)
            this.errorInfo[data.name] = data.value;
            Object.keys(this.errorInfo).map((item) => {
                if (!this.errorInfo[item]) {
                    this.errorTip = {
                        show: false,
                        value: "",
                    };
                }
            });
        },
        prepareConfig(data) {
            //console.log(data)

            this.disabled = data.apilocation_state;
            Object.keys(data).map((item) => {
                this.locationForm[item] = data[item]; // 拿到修改过后的配置对象
            });
        },
        remove() {
            this.$Modal.confirm({
                title: "提示",
                content: "<p>是否要删除此配置？</p>",
                onOk: () => {
                    this.change(false);
                    this.$emit("removeConfig", "location");
                    //this.$Message.info('Clicked ok');
                },
                onCancel: () => {
                    //this.$Message.info('Clicked cancel');
                },
            });
        },
    },
    mounted() {
        //console.log(this.data)
    },
};
</script>
<style lang="less" scoped>
@import "modal-form";
</style>
