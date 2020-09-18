<template>
    <div class="aside-wrap">
        <Input suffix="ios-search" v-model.trim="searchString" placeholder="搜索APP" clearable />
        <div style="display: flex; justify-content: center">
            <div class="add-list" @click="addModel">
                <Tooltip content="添加APP" placement="top" max-width="200" theme="light">
                    <Icon type="md-add" color="#fff" :size="25" />
                </Tooltip>
            </div>
        </div>

        <div class="aside-list">
            <!--  -->
            <div class="aside-list-wrap left" v-if="filterAside.length > 0">
                <div class="aside-item" :class="item.app_service_id === $route.params.app ? 'active' : ''" @click="changeAside(item)" v-for="(item, index) in filterAside" :key="item.app_service_id">
                    <div class="title">
                        <span class="online" v-if="item.push_status"></span>
                        <span class="offline" v-else></span>
                        {{ item.app_service_name }}
                    </div>
                    <div style="margin-left: -4px;">
                        <span>
                            <Icon type="md-lock" size="20" color="#fb1010" style="cursor: pointer;" @click="LockAndUnlock(item)" v-if="item.lock_status" />
                            <Icon type="md-unlock" size="20" color="#21a37a" style="cursor: pointer;" @click="LockAndUnlock(item)" v-if="!item.lock_status" />
                        </span>
                    </div>
                    <div class="info">{{ item.description }}</div>
                    <Icon type="md-more" size="20" color="#000" title="编辑" class="menu" @click="editModel(item, index)" />
                </div>
            </div>
            <div class="aside-list-wrap" v-else>
                暂无数据
            </div>
            <!-- loading -->
            <div class="load-wrap" v-if="listLoading">
                <Loading />
            </div>
        </div>
        <div>
            <Button type="dashed" icon="md-add" long @click="ImportModal()">导入</Button>
        </div>

        <!-- 新建APP -->
        <Modal v-model="appModal" :transfer="false" :mask-closable="false" :styles="{top:0}" ref="modalAddAPP">
            <div slot="header">{{ edit ? "修改APP配置" : "新建APP" }}</div>
            <div class="modal-body" :class="{'modal-body-show':isTaskbarShow}">
                <Form ref="appForm" :model="appForm" :rules="ruleValidate">
                    <FormItem label="APP命名" prop="app_service_name">
                        <Input v-model="appForm.app_service_name"></Input>
                    </FormItem>
                    <FormItem label="是否开启热备份">
                        <i-switch v-model="appForm.configure_ha" @on-change="switchChange">
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>
                    </FormItem>
                    <div class="label" v-if="appForm.configure_ha">
                        虚拟ip<popTip content="对外开放的IP地址" style="margin-left: 5px;"></popTip>
                    </div>
                    <Row v-if="appForm.configure_ha" v-for="(item, index) in appForm.vips" :key="index">
                        <Col span="19">
                        <FormItem label="" :prop="'vips.' + index" :rules="{ validator: ip }">
                            <Input v-model.trim="appForm.vips[index]" placeholder="IP"></Input>
                        </FormItem>
                        </Col>
                        <Col span="4" style="text-align: right">
                        <Icon type="ios-trash" class="remove-icon" @click="handleRemoveVip(index)" size="20" />
                        </Col>
                    </Row>
                    <FormItem v-if="appForm.configure_ha">
                        <Button type="dashed" @click="handleAddVip" icon="md-add">添加</Button>
                    </FormItem>
                    <FormItem label="选择实例" prop="l7_server_ids" v-if="L7List">
                        <popTip content="实例为部署NGINX代理的服务器，开启热备份时至少选择两台实例"></popTip>
                        <span style="color: #01c864;margin-left: 10px;text-decoration: underline;cursor: pointer;" @click="clickOpenNewInstance">新建实例</span>
                        <div style="float: right;" class="custom-ha" v-if="appForm.configure_ha">
                            <FormItem label="自定义HA优先级">
                                <i-switch v-model="appForm.custom_priority">
                                    <span slot="open">On</span>
                                    <span slot="close">Off</span>
                                </i-switch>
                            </FormItem>
                        </div>
                        <Select v-model="appForm.l7_server_ids" multiple>
                            <Option v-for="item in L7List" :value="item.l7ServerId" :key="item.l7ServerId">{{ item.l7ServerName }}</Option>
                        </Select>
                        <div v-if="!L7List.length">
                            暂无实例，
                            <router-link to="/L7">点击创建</router-link>
                        </div>
                    </FormItem>
                    <div class="listen-and-servegroups">
                        <div :class="ServerandLocationarrowStatus ? 'arrow-down' : 'arrow-up'" class="listen-and-servegroups-top">
                            <Button @click="addAppServerBlock()" type="dashed" icon="md-add" v-if="appForm.appServerBlockList.length === 0">server</Button>
                            <Tabs type="card" closable @on-tab-remove="removeAppServerBlock" :animated="false" v-model="serverTabPane" v-if="appForm.appServerBlockList.length > 0">
                                <TabPane :label="'server' + (indexServe + 1)" v-for="(itemServe, indexServe) in appForm.appServerBlockList" :key="indexServe" :name="indexServe + 1" v-if="serverRefresh">
                                    <div class="listen-and-servegroups-top-content">
                                        <div class="top-content-leftcontent">
                                            <FormItem label="serve name" :prop="
                          'appServerBlockList.' + indexServe + '.server_name'
                        " :rules="{ validator: domain }">
                                                <popTip content="此虚拟服务器提供服务的域名。这与NGINX配置中的server_name指令相对应。"></popTip>
                                                <Input v-model="itemServe.server_name" placeholder="name"></Input>
                                            </FormItem>
                                            <FormItem label="监听端口" :prop="'appServerBlockList.' + indexServe + '.listen'" :rules="{ validator: port }">
                                                <popTip content="对外开放的端口"></popTip>
                                                <Input v-model="itemServe.listen" placeholder="PORT"></Input>
                                            </FormItem>
                                            <div>
                                                <span class="top-content-leftcontent-title">location</span>
                                                <div class="top-content-leftcontent-location" v-for="(itemLocation,
                          indexLocation) in itemServe.appLocationBlockList">
                                                    <div>
                                                        <div class="label">
                                                            URI-PATH/ROUTE
                                                            <PopTip content="Location定义是NGINX中请求路由机制的核心。Location指定NGINX是代理一个特定的请求还是直接服务它。" style="margin-left: 5px;" placement="bottom">
                                                            </PopTip>
                                                        </div>
                                                        <Row>
                                                            <Col span="8">
                                                            <FormItem label="" class="inline-form-item options" prop="url_path_route_key">
                                                                <Select v-model="itemLocation.url_path_route_key">
                                                                    <Option value="prefix">prefix</Option>
                                                                    <Option value="exact">exact</Option>
                                                                    <Option value="regex">regex</Option>
                                                                    <Option value="regex(case-insensitive)">regex(case-insensitive)</Option>
                                                                </Select>
                                                            </FormItem>
                                                            </Col>
                                                            <Col span="6" style="padding: 4px">
                                                            <span style="margin-left: 8px">match with</span>
                                                            </Col>
                                                            <Col span="10">
                                                            <FormItem label="" class="inline-form-item options" :prop="
                                    'appServerBlockList.' +
                                      indexServe +
                                      '.appLocationBlockList.' +
                                      indexLocation +
                                      '.url_path_route_value'
                                  " :rules="{ validator: urlPathRouteValue }">
                                                                <Input v-model="itemLocation.url_path_route_value" placeholder="/"></Input>
                                                            </FormItem>
                                                            </Col>
                                                        </Row>
                                                        <FormItem label="proxy" :prop="
                                'appServerBlockList.' +
                                  indexServe +
                                  '.appLocationBlockList.' +
                                  indexLocation +
                                  '.proxy_url'
                              " :rules="{ validator: proxyUrl }">
                                                            <popTip content="向upstream servers发送代理请求。"></popTip>
                                                            <Input v-model="itemLocation.proxy_url" placeholder="URL"></Input>
                                                        </FormItem>
                                                    </div>
                                                    <div class="location-right">
                                                        <Icon type="ios-trash" size="22" class="location-right-icon" title="删除location" @click="
                                removeAppLocationBlock(
                                  indexLocation,
                                  indexServe
                                )
                              " />
                                                    </div>
                                                </div>
                                            </div>

                                            <FormItem>
                                                <Button @click="addAppLocationBlock(indexServe)" type="dashed" icon="md-add" style="margin-top: 6px;">添加location</Button>
                                            </FormItem>
                                        </div>
                                    </div>
                                </TabPane>
                                <Button @click="addAppServerBlock()" type="dashed" icon="md-add" slot="extra">server</Button>
                            </Tabs>
                        </div>
                        <div :class="
                appForm.appServerBlockList.length > 0
                  ? 'listen-and-servegroups-bottom-r'
                  : 'listen-and-servegroups-bottom-l'
              ">
                            <Button type="dashed" icon="ios-arrow-down" class="bottom-content-button-common-style" v-if="
                  appForm.appServerBlockList.length > 0 &&
                    ServerandLocationarrowStatus
                " @click="ServerandLocationarrowDown()">展开</Button>
                            <Button type="dashed" icon="ios-arrow-up" class="bottom-content-button-common-style" @click="ServerandLocationarrowUp()" v-if="
                  appForm.appServerBlockList.length > 0 &&
                    !ServerandLocationarrowStatus
                ">收起</Button>
                        </div>
                    </div>
                    <div class="listen-and-servegroups">
                        <div :class="UpgrouparrowStatus ? 'arrow-down' : 'arrow-up'" class="listen-and-servegroups-top">
                            <Button @click="addAppUpgroupBlock()" type="dashed" icon="md-add" v-if="appForm.appUpgroupBlockList.length === 0">应用服务群组</Button>
                            <Tabs type="card" closable @on-tab-remove="removeAppUpgroupBlock" :animated="false" v-model="upstreamTabPane" v-if="appForm.appUpgroupBlockList.length > 0">
                                <TabPane :label="'应用服务群组' + (indexUpgroup + 1)" v-for="(itemUpgroup,
                  indexUpgroup) in appForm.appUpgroupBlockList" :key="indexUpgroup" :name="indexUpgroup + 1" v-if="upstreamRefresh">
                                    <div class="listen-and-servegroups-top-content">
                                        <div class="top-content-leftcontent">
                                            <FormItem label="应用服务名称" :prop="
                          'appUpgroupBlockList.' +
                            indexUpgroup +
                            '.upstream_name'
                        " :rules="{ validator: validateName }">
                                                <popTip content="定义要与代理过程一起使用的一组服务器的名称。"></popTip>
                                                <Input v-model.trim="itemUpgroup.upstream_name" placeholder="name"></Input>
                                            </FormItem>
                                            <div class="label">
                                                应用服务成员
                                                <PopTip content="添加默认应用服务成员后可以使用发布功能" style="margin-left: 5px;" placement="bottom">
                                                </PopTip>
                                            </div>
                                            <div class="scroll-warp">
                                                <Row v-for="(itemUpServer,
                          indexUpServer) in itemUpgroup.appUpServerBlockList" :key="indexUpServer">
                                                    <Col span="10">
                                                    <FormItem label="" :prop="
                                'appUpgroupBlockList.' +
                                  indexUpgroup +
                                  '.appUpServerBlockList.' +
                                  indexUpServer +
                                  '.upstream_server'
                              " :rules="{ validator: ipPort }">
                                                        <Input type="text" v-model="itemUpServer.upstream_server" placeholder="IP | IP:PORT | PORT"></Input>
                                                    </FormItem>
                                                    </Col>
                                                    <Col span="8" :offset="1">
                                                    <FormItem :prop="
                                'appUpgroupBlockList.' +
                                  indexUpgroup +
                                  '.appUpServerBlockList.' +
                                  indexUpServer +
                                  '.weight'
                              " :rules="{ validator: validaterule }">
                                                        <Input type="text" v-model="itemUpServer.weight" placeholder="权重"></Input>
                                                    </FormItem>
                                                    </Col>
                                                    <Col span="4" style="text-align: right">
                                                    <Icon type="ios-trash" class="remove-icon" size="22" title="删除应用服务成员" @click="
                                removeAppUpServer(indexUpServer, indexUpgroup)
                              " />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <FormItem>
                                                <Button @click="addAppUpServer(indexUpgroup)" type="dashed" icon="md-add">应用服务成员</Button>
                                            </FormItem>
                                        </div>
                                    </div>
                                </TabPane>
                                <Button @click="addAppUpgroupBlock()" type="dashed" icon="md-add" slot="extra">应用服务群组</Button>
                            </Tabs>
                        </div>
                        <div :class="
                appForm.appUpgroupBlockList.length > 0
                  ? 'listen-and-servegroups-bottom-r'
                  : 'listen-and-servegroups-bottom-l'
              " :style="">
                            <Button type="dashed" icon="ios-arrow-down" class="bottom-content-button-common-style" v-if="
                  appForm.appUpgroupBlockList.length > 0 && UpgrouparrowStatus
                " @click="UpgrouparrowDown()">展开</Button>
                            <Button type="dashed" icon="ios-arrow-up" class="bottom-content-button-common-style" @click="UpgrouparrowUp()" v-if="
                  appForm.appUpgroupBlockList.length > 0 && !UpgrouparrowStatus
                ">收起</Button>
                        </div>
                    </div>
                    <FormItem label="选择配置" prop="nginx_conf_id">
                        <popTip content="选择一个配置并发布到当前APP"></popTip>
                        <Select v-model="appForm.nginx_conf_id" clearable>
                            <Option v-for="(item,index) in configList" :key="index" :value="item.nginx_conf_id">{{ item.config_name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="简介" prop="description">
                        <Input v-model="appForm.description"></Input>
                    </FormItem>
                    <FormItem label="标签" prop="tags">
                        <Input v-model="appForm.tags"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button class="fl" v-if="edit" ghost type="error" @click.stop="delApp(appForm.app_service_id)">删除</Button>
                <Button @click="appModal = false">取消</Button>
                <Button type="primary" :loading="modal_loading" v-if="!edit" @click="addApp('appForm')">确认</Button>
                <Button type="primary" :loading="modal_loading" v-else @click="modifyApp('appForm')">确认修改</Button>
            </div>
        </Modal>
        <!-- 新建实例 -->
        <Modal v-model="appCopyModal" :transfer="false" :mask-closable="false" @on-visible-change="onVisibleChangeModalAppCopy" :styles="{top:0}">
            <div slot="header">{{ "新建实例" }}</div>
            <div class="modal-body" :class="{'modal-body-show':isTaskbarShow}">
                <Form ref="CopyForm" :model="CopyForm" :rules="copyRuleValidate" @on-validate="validateCopyModal">
                    <div>
                        <div style="display: flex;" v-for="(item, index) in CopyForm.vmParams">
                            <div style="width: 400px;padding-right: 20px;margin-bottom: 20px;" :class="vmParamsNotSingle ? 'vmParams-border' : ''">
                                <FormItem label="实例名称" :prop="'vmParams.' + index + '.vmName'" :rules="{ required:true,validator: validateCopyVMParamsVMname, trigger: 'blur' }">
                                    <Input v-model="item.vmName" placeholder="请输入实例名称"></Input>
                                </FormItem>
                                <div style="margin-bottom: 8px;">
                                    <span style="font-size: 14px;color: #515a6e;">IP地址</span>
                                    <popTip content="输入未使用的IP地址若不输入默认使用DHCP自动分配" style="margin-left: 5px;"></popTip>
                                </div>
                                <FormItem label="" :prop="'vmParams.' + index + '.ipAddress'" :rules="{ validator: validateIP }">
                                    <Input v-model="item.ipAddress" placeholder="请输入IP地址"></Input>
                                </FormItem>
                            </div>
                            <div style="line-height: 180px;margin-left: 40px;">
                                <Icon type="ios-trash" size="20" style="cursor: pointer;" @click="removeIpAndName(index)" v-if="CopyForm.vmParams.length > 1" />
                            </div>
                        </div>
                        <div>
                            <Button type="dashed" icon="md-add" @click="addIpAndName()">添加IP地址和实例名称</Button>
                        </div>
                    </div>

                    <FormItem label="模板" prop="templateName" style="margin-top:1rem;">
                        <Select v-model="CopyForm.templateName">
                            <Option v-for="item in templateName" :value="item.vmName" :key="item.vmName">{{ item.vmName }}</Option>
                        </Select>
                    </FormItem>
                    <div style="margin-bottom: 8px;">
                        <span style="font-size: 14px;color: #515a6e;">CPU核数</span>
                        <popTip content="请输入正整数值,若为0时,则默认分配" style="margin-left: 5px;"></popTip>
                    </div>
                    <FormItem label="" prop="numCPU">
                        <Input v-model="CopyForm.numCPU" placeholder="请输入CPU核数"></Input>
                    </FormItem>
                    <div style="margin-bottom: 8px;">
                        <span style="font-size: 14px;color: #515a6e;">内存大小(GB)</span>
                        <popTip content="请输入正整数值,若为0时,则默认分配" style="margin-left: 5px;"></popTip>
                    </div>
                    <FormItem label="" prop="memoryGB">
                        <Input v-model="CopyForm.memoryGB" placeholder="请输入内存大小"></Input>
                    </FormItem>
                    <div style="margin-bottom: 8px;">
                        <span style="font-size: 14px;color: #515a6e;">磁盘大小(GB)</span>
                        <popTip content="请输入正整数值,若为0时,则默认分配" style="margin-left: 5px;"></popTip>
                    </div>
                    <FormItem label="" prop="diskSizeGB">
                        <Input v-model="CopyForm.diskSizeGB" placeholder="请输入磁盘大小"></Input>
                    </FormItem>

                    <!-- 高级设置：state -->
                    <div class="advanced-setup" @click="advancedSetupShow = !advancedSetupShow">
                        <span class="advance-card-title">高级设置</span>
                        <Icon type="md-arrow-dropdown" class="advance-card-icon" v-show="!advancedSetupShow" />
                        <Icon type="md-arrow-dropup" class="advance-card-icon" v-show="advancedSetupShow" />
                    </div>
                    <transition name="fade">
                        <div class="advanced-setup-content" v-show="advancedSetupShow">
                            <FormItem label="Vcenter服务器" prop="id">
                                <Select v-model="CopyForm.id" @on-select="serverSelect">
                                    <Option v-for="item in hostData" :value="item.id" :key="item.id">{{ item.serverName }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="主机" prop="hostName">
                                <Select v-model="CopyForm.hostName" @on-select="hostSelect">
                                    <Option v-for="item in hostName" :value="item.hostName" :key="item.hostName">{{ item.hostName }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="资源池名称" prop="resourcePoolName">
                                <Select v-model="CopyForm.resourcePoolName">
                                    <Option v-for="item in resourcePoolNameList" :value="item.vm_name" :key="item.vm_name">{{ item.vm_name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="数据存储名称" prop="dataStoreName">
                                <Select v-model="CopyForm.dataStoreName">
                                    <Option v-for="item in datastoreNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <div style="margin-bottom: 8px;">
                                <!-- <span style="color: #ed4014;font-family: SimSun;font-size: 14px;margin-right: 4px;">*</span> -->
                                <span style="font-size: 14px;color: #515a6e;">规则</span>
                                <popTip content="自定义虚拟机规范配置" style="margin-left: 5px;"></popTip>
                            </div>
                            <!-- <FormItem label="" prop="customizationSpecName"> -->
                            <FormItem label="">
                                <Select v-model="CopyForm.customizationSpecName" @on-select="customizationSelect" clearable @on-clear="onClearCopyFormCustomizationSpecName" placement="top">
                                    <Option v-for="item in customizationSpecNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <div style="margin-bottom: 8px;" v-if="CopyForm.customizationSpecName">
                                <span style="font-size: 14px;color: #515a6e;">DNS服务列表</span>
                                <popTip content="可选择或者手动输入" style="margin-left: 5px;"></popTip>
                            </div>
                            <FormItem label="" prop="dnsServerList" v-if="CopyForm.customizationSpecName">
                                <Select v-model="CopyForm.dnsServerList" filterable multiple allow-create @on-create="handleDnsServerList">
                                    <Option v-for="(item, index) in dnsServerList" :value="item" :key="index">{{ item }}</Option>
                                </Select>
                            </FormItem>
                            <div style="margin-bottom: 8px;" v-if="CopyForm.customizationSpecName">
                                <span style="font-size: 14px;color: #515a6e;">网关列表</span>
                                <popTip content="可选择或者手动输入" style="margin-left: 5px;"></popTip>
                            </div>
                            <FormItem label="" prop="gatewayList" v-if="CopyForm.customizationSpecName">
                                <Select v-model="CopyForm.gatewayList" filterable multiple allow-create @on-create="handleGatewayList">
                                    <Option v-for="item in gatewayList" :value="item" :key="index">{{item}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="子网掩码" prop="subnetMask" v-if="CopyForm.customizationSpecName">
                                <Input v-model="CopyForm.subnetMask" placeholder="请输入子网掩码"></Input>
                            </FormItem>
                            <FormItem label="域名" prop="domain" v-if="CopyForm.customizationSpecName">
                                <Input v-model="CopyForm.domain" placeholder="请输入域名"></Input>
                            </FormItem>
                        </div>
                    </transition>
                    <!-- 高级设置：end -->
                </Form>
            </div>
            <div slot="footer">
                <Button @click="appCopyModal = false">取消</Button>
                <Button type="primary" :loading="modal_loading" @click="CopyModify('CopyForm')">确认新建</Button>
            </div>
        </Modal>
        <!-- 是否初始化实例配置 -->
        <Modal v-model="initModal" :mask-closable="false">
            <span slot="close"></span>
            <div style="padding: 12px 0 0 12px;">
                <Icon type="ios-help-circle" style="color: #ff9900; font-size: 28px" />
                <span style="font-size: 16px;margin-left: 12px">提示</span>
                <div style="margin-left: 40px;margin-top: 12px">
                    是否初始化实例配置？
                </div>
            </div>
            <div slot="footer">
                <Button @click="cancleInit()" :loading="disinitloading" style="border: 0;">否</Button>
                <Button type="primary" @click="confirmInit()" :loading="initloading">是</Button>
            </div>
        </Modal>
        <!-- 导入 -->
        <Modal v-model="importModal" :transfer="false" :mask-closable="false" :styles="{top:0}">
            <div slot="header">导入</div>
            <div class="modal-body" :class="{'modal-body-show':isTaskbarShow}">
                <Form ref="formValidate" :model="importForm" :rules="ruleValidate">
                    <FormItem label="APP命名" prop="app_service_name">
                        <Input v-model="importForm.app_service_name"></Input>
                    </FormItem>
                    <FormItem label="选择实例">
                        <popTip content="实例为部署NGINX代理的服务器，开启热备份时至少选择两台实例"></popTip>
                        <Select v-model="importForm.l7IDS" multiple>
                            <Option v-for="item in L7IDLists" :value="item.l7ServerId" :key="item.l7ServerId">{{ item.l7ServerName }}</Option>
                        </Select>
                    </FormItem>
                    <div style="text-align: left;">
                        <Button @click="addImport()" type="dashed" icon="md-add" v-if="importForm.l7ServerInfoList.length === 0">新增实例</Button>
                    </div>
                    <Tabs type="card" closable @on-tab-remove="removeAppImport" :animated="false" v-model="importTabPane" v-if="importForm.l7ServerInfoList.length > 0">
                        <TabPane :label="
                item.l7ServerName === ''
                  ? '实例' + (index + 1)
                  : item.l7ServerName
              " v-for="(item, index) in importForm.l7ServerInfoList" :key="index" :name="index + 1" v-if="importRefresh">
                            <div style="padding: 0 16px">
                                <FormItem label="实例别名" :prop="'l7ServerInfoList.' + index + '.l7ServerName'" :rules="{
                    required: true,
                    validator: validatel7ServerName,
                  }">
                                    <Input v-model="item.l7ServerName"></Input>
                                </FormItem>
                                <FormItem label="ssh连接实例的IP" :prop="'l7ServerInfoList.' + index + '.l7ServerSSHIp'" :rules="{
                    required: true,
                    validator: validatel7ServerSSHIp,
                    trigger: 'blur',
                  }">
                                    <Input v-model="item.l7ServerSSHIp"></Input>
                                </FormItem>
                                <FormItem label="ssh连接实例的用户" :prop="'l7ServerInfoList.' + index + '.l7ServerSSHName'" :rules="{
                    required: true,
                    validator: validatel7ServerSSHName,
                    trigger: 'blur',
                  }">
                                    <Input v-model="item.l7ServerSSHName" autocomplete></Input>
                                </FormItem>
                                <FormItem label="ssh连接实例的密码" :prop="'l7ServerInfoList.' + index + '.l7ServerSSHPwd'" :rules="{
                    required: true,
                    validator: validatel7ServerSSHPwd,
                    trigger: 'blur',
                  }">
                                    <Input type="password" v-model="item.l7ServerSSHPwd" autocomplete></Input>
                                </FormItem>
                                <FormItem label="ssh连接实例的端口" :prop="'l7ServerInfoList.' + index + '.l7ServerSSHPort'" :rules="{
                    required: true,
                    validator: validatel7ServerSSHPort,
                    trigger: 'blur',
                  }">
                                    <Input v-model="item.l7ServerSSHPort"></Input>
                                </FormItem>
                            </div>
                        </TabPane>
                        <Button type="dashed" icon="md-add" slot="extra" @click="addImport()">新增实例</Button>
                    </Tabs>
                    <FormItem label="简介" prop="description">
                        <Input v-model="importForm.description"></Input>
                    </FormItem>
                    <FormItem label="标签" prop="tags">
                        <Input v-model="importForm.tags"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="importModal = false">取消</Button>
                <Button type="primary" @click="appImport('formValidate')" :loading="importLoading">导入</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import {
    addAppInfo,
    delAppInfo,
    updAppInfo,
    selAppDetails,
} from "../../api/app";
import {
    selUsableL7Server,
    getNginxConfALL,
    ListL7ServerInfoByImpApp,
    locking,
    unLock,
    getNginxConfALLForPremission,
} from "../../api/L7";
import { selAppInfoList, impApp } from "../../api/app";
import PopTip from "@/components/common/pop-tip";
import { appCloneVMware, selVMwareInfo } from "@/api/VMware";
import config from "@/config/index";

export default {
    name: "MyAside",
    components: {
        PopTip,
    },
    data() {
        this.ipPort = (rule, value, callback) => {
            if (value) {
                let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
                let port = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
                let ipAndPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
                if (
                    ip.test(value) ||
                    port.test(value) ||
                    ipAndPort.test(value)
                ) {
                    callback();
                } else {
                    callback(new Error("格式错误"));
                }
            } else {
                callback(new Error("不能为空"));
            }
        };
        this.ip = (rule, value, callback) => {
            if (value) {
                let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
                if (ip.test(value)) {
                    callback();
                } else {
                    callback(new Error("格式错误"));
                }
            } else {
                callback(new Error("不能为空"));
            }
        };
        const selection = (rule, value, callback) => {
            if (value.length === 0) {
                return callback(new Error("至少选择一个实例"));
            } else {
                if (this.appForm.configure_ha && value.length < 2) {
                    return callback(
                        new Error("已开启热备份，至少选择两个实例")
                    );
                }
                callback();
            }
        };
        this.validaterule = (rule, value, callback) => {
            let reg = /^\+?[1-9][0-9]*$/;
            if (value === "") {
                callback(new Error("权重不能为空"));
            } else if (!reg.test(value)) {
                callback(new Error("请输入大于零的整数"));
            } else {
                callback();
            }
        };
        this.port = (rule, value, callback) => {
            let P = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
            if (value) {
                if (P.test(value)) {
                    callback();
                } else {
                    callback(new Error("格式错误"));
                }
            } else {
                callback(new Error("不能为空"));
            }
        };
        this.domain = (rule, value, callback) => {
            callback();
        };
        this.urlPathRouteValue = (rule, value, callback) => {
            const reg = /^[^ ]+$/;
            if (!value) {
                callback(new Error("不能为空"));
            } else if (!reg.test(value)) {
                callback(new Error("不能含有空格"));
            } else {
                callback();
            }
        };
        this.proxyUrl = (rule, value, callback) => {
            let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
            const regexp = /^[^ ]+$/;
            if (!value) {
                callback();
            } else if (!reg.test(value) || !regexp.test(value)) {
                callback(new Error("请输入正确的URL"));
            } else {
                callback();
            }
        };
        this.validateName = (rule, value, callback) => {
            const reg = /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d\-_]+$/;
            let temp = [];
            temp = this.appForm.appUpgroupBlockList.map(function (item) {
                return item.upstream_name;
            });
            const items = new Set(this.copyJson(temp));
            if (!value) {
                callback(new Error("不能为空"));
            } else {
                if (!reg.test(value)) {
                    callback(new Error("不能全数字或者存在空格"));
                } else if (temp.length !== items.size) {
                    callback(new Error("该值已存在"));
                } else {
                    callback();
                }
            }
        };
        this.validatel7ServerName = (rule, value, callback) => {
            let temp = [];
            temp = this.importForm.l7ServerInfoList.map(function (item) {
                return item.l7ServerName;
            });
            const items = new Set(this.copyJson(temp));
            if (!value) {
                callback(new Error("别名不能为空"));
            } else {
                if (temp.length !== items.size) {
                    callback(new Error("该值已存在"));
                } else {
                    callback();
                }
            }
        };
        this.validatel7ServerSSHIp = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("IP不能为空"));
            } else if (
                !/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(
                    value
                )
            ) {
                callback("IP格式不正确");
            } else {
                callback();
            }
        };
        this.validatel7ServerSSHName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("用户不能为空"));
            } else {
                callback();
            }
        };
        this.validatel7ServerSSHPwd = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("密码不能为空"));
            } else {
                callback();
            }
        };
        this.validatel7ServerSSHPort = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("端口不能为空"));
            } else if (
                !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
                    value
                )
            ) {
                callback("端口号格式不正确");
            } else {
                callback();
            }
        };
        const validatesubnetMask = (rule, value, callback) => {
            const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
            if (value) {
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的子网掩码"));
                } else {
                    callback();
                }
            } else {
                callback(new Error("子网掩码不能为空"));
            }
        };
        const validateCommon = (rule, value, callback) => {
            const reg = /^\+?[0-9]\d*$/;
            if (value === "") {
                callback(new Error("不能为空"));
            } else {
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的数值"));
                } else {
                    callback();
                }
            }
        };
        //  校验实例拟机名称
        this.validateCopyVMParamsVMname = (rule, value, callback) => {
            let flag = false;
            let num = 0;
            for (let item of this.CopyForm.vmParams) {
                if (item.vmName === value) {
                    num++;
                }
                flag = num > 1;
            }
            if (value === "") {
                callback(new Error("实例名称不能为空"));
            } else if (flag) {
                callback(new Error("实例名称不能重复"));
            } else {
                callback();
            }
        };
        //  校验实例的IP地址
        this.validateIP = (rule, value, callback) => {
            let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
            let flag = false;
            let num = 0;
            for (let item of this.CopyForm.vmParams) {
                if (item.ipAddress === value) {
                    num++;
                }
                flag = num > 1;
            }
            if (value === "") {
                callback();
            } else if (!ip.test(value)) {
                callback(new Error("格式错误"));
            } else if (flag) {
                callback(new Error("IP地址不能重复"));
            } else {
                callback();
            }
        };
        return {
            appModal: false,
            appForm: {
                vips: [],
                appServerBlockList: [
                    {
                        listen: 80,
                        server_name: "",
                        appLocationBlockList: [
                            {
                                url_path_route_key: "",
                                url_path_route_value: "/",
                                proxy_url: "",
                            },
                        ],
                    },
                ],
                appUpgroupBlockList: [
                    {
                        upstream_name: "",
                        appUpServerBlockList: [
                            {
                                upstream_server: "",
                                weight: 1,
                            },
                        ],
                    },
                ],
                l7_server_ids: [],
            },
            ruleValidate: {
                app_service_name: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
                l7_server_ids: [{ validator: selection, trigger: "change" }],
            },
            L7List: [],
            modal_loading: false,
            edit: false,
            searchString: "",
            activeItem: {},
            timer: null,
            configList: null,
            initModal: false,
            id: "",
            initloading: false,
            disinitloading: false,
            ServerandLocationarrowStatus: true,
            UpgrouparrowStatus: true,
            serverRefresh: true,
            serverTabPane: 0,
            upstreamRefresh: true,
            upstreamTabPane: 0,
            importModal: false,
            importForm: {
                app_service_name: "",
                description: "",
                l7IDS: [],
                l7ServerInfoList: [
                    {
                        impConfFlag: false,
                        l7ServerName: "",
                        l7ServerSSHIp: "",
                        l7ServerSSHName: "",
                        l7ServerSSHPort: 22,
                        l7ServerSSHPwd: "",
                        remark: "",
                    },
                ],
                tags: "",
            },
            importTabPane: 0,
            importRefresh: true,
            importLoading: false,
            L7IDLists: [],
            appCopyModal: false,
            CopyForm: {
                customizationSpecName: "",
                dataStoreName: "",
                diskSizeGB: 0,
                dnsServerList: [],
                domain: "localhost",
                gatewayList: [],
                hostName: "",
                id: "",
                memoryGB: 0,
                numCPU: 0,
                resourcePoolName: "",
                serverName: "",
                subnetMask: "255.255.255.0",
                templateName: "",
                vmParams: [
                    {
                        ipAddress: "",
                        vmName: "",
                    },
                ],
            },
            customizationSpecNameList: [],
            dnsServerList: [],
            gatewayList: [],
            templateName: [],
            CopyLoading: false,
            copyRuleValidate: {
                resourcePoolName: [
                    { required: true, message: "请选择一个资源池名称" },
                ],
                // dataStoreName: [
                //     { required: true, message: "请选择一个数据存储名称" },
                // ],
                // customizationSpecName: [
                //     { required: true, message: "请选择一个规则" },
                // ],
                // ipAddress: [{ required: true, validator: validateIP }],
                subnetMask: [{ required: true, validator: validatesubnetMask }],
                domain: [{ required: true, message: "域名不能为空" }],
                templateName: [{ required: true, message: "请选择一个模板" }],
                vmName: [{ required: true, message: "虚拟机名称不能为空" }],
                numCPU: [{ validator: validateCommon }],
                memoryGB: [{ validator: validateCommon }],
                diskSizeGB: [{ validator: validateCommon }],
            },
            hostData: [],
            hostName: [],
            resourcePoolNameList: [],
            datastoreNameList: [],
            vmParamsNotSingle: false,
            copyData: [],
            vmParamsNotSingle: false,
            webSocketMessage: "",
            //  是否显示高级设置
            advancedSetupShow: false,
        };
    },
    watch: {
        $route(nv, ov) {
            if (nv.path === "/app") {
                this.$router.replace(ov);
            }
        },
    },
    computed: {
        ...mapState({
            asideList: (state) => state.app.asideList,
            appServerId: (state) => state.app.activeAside.app_service_id,
            listLoading: (state) => state.app.listLoading,
            activeAside: (state) => state.app.activeAside,
            isTaskbarShow: (state) => state.taskbar.isTaskbarShow,
        }),
        // 匹配搜索
        filterAside: function () {
            let arr = this.asideList;
            let searchString = this.searchString;

            if (!searchString) {
                return arr;
            }
            arr = arr.filter(function (item) {
                if (item.app_service_name.indexOf(searchString) !== -1) {
                    return item;
                }
            });

            // 返回过来后的数组
            return arr;
        },
    },
    methods: {
        ...mapActions(["getAppAsideList"]),
        ...mapMutations([
            "appSetActiveAside",
            "appSetAsideList",
            "updateIsTaskbarShow",
            "updateTaskbarList",
            "removeTaskbarList",
            "appChangeLoadingStatus",
            "setOpenNewInstance",
        ]),
        changeAside(item) {
            if (item.app_service_id === this.appServerId) return;
            this.appSetActiveAside(item);
            this.$router.replace(`/app/${item.app_service_id}/overview`);
        },
        //展示Model框，数据重置
        addModel() {
            this.edit = false;
            (this.appForm = {
                vips: [],
                appServerBlockList: [],
                appUpgroupBlockList: [],
                l7_server_ids: [],
            }),
                this.selUsableL7Server(this.appForm).then(() => {
                    if (this.L7List.length > 0) {
                        let arr = [];
                        arr.push(this.L7List[0].l7ServerId);
                        this.$set(this.appForm, "l7_server_ids", arr);
                    }
                });
            this.ServerandLocationarrowStatus = false;
            this.UpgrouparrowStatus = false;
            this.appModal = true;
            //   this.getAllConfigInfo();
            this.getNginxConfALLForPremissions();
        },
        //展示Model框，展示当前实例的数据
        editModel(item, index) {
            this.edit = true;
            this.appForm = this.copyJson(item);
            if (this.appForm.appServerBlockList.length > 0) {
                this.ServerandLocationarrowStatus = true;
            } else {
                this.ServerandLocationarrowStatus = false;
            }
            if (this.appForm.appUpgroupBlockList.length > 0) {
                this.UpgrouparrowStatus = true;
            } else {
                this.UpgrouparrowStatus = false;
            }
            this.serverTabPane = 1;
            this.upstreamTabPane = 1;
            this.appModal = true;
            this.selUsableL7Server(item).then(() => {
                this.$set(this.appForm, "l7_server_ids", item.l7_server_ids);
                if (!item.l7_server_ids.length) {
                    let arr = [];
                    arr.push(this.L7List[0].l7ServerId);
                    this.$set(this.appForm, "l7_server_ids", arr);
                }
            });
            //   this.getAllConfigInfo();
            this.getNginxConfALLForPremissions();
        },
        // 新建APP
        //添加实例配置信息
        addApp(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (
                        this.appForm.vips.length <=
                        this.appForm.l7_server_ids.length
                    ) {
                        if (
                            this.appForm.nginx_conf_id ||
                            this.appForm.appServerBlockList.length > 0
                        ) {
                            this.modal_loading = true;
                            // let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
                            // if (ip.test(this.appForm.vips)){
                            //     this.appForm.vips += ':80'
                            // }
                            addAppInfo(this.appForm)
                                .then((res) => {
                                    // console.log(res);
                                    this.modal_loading = false;
                                    if (res.data.code === "success") {
                                        this.appModal = false;
                                        this.getAppAsideList().then((res) => {
                                            /* 第一次添加 */
                                            if (
                                                this.asyncOk(res) &&
                                                !this.$route.params.app
                                            ) {
                                                this.appSetActiveAside(
                                                    res.data.result[0] || {}
                                                );
                                                this.$router.replace(
                                                    `/app/${this.appServerId}/overview`
                                                );
                                            }
                                        });
                                    } else {
                                        this.$Message.error({
                                            content: res.data.result,
                                            duration: 3,
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            this.$Message.error({
                                content:
                                    "请添加一个或多个server或者选择一份配置文件",
                                duration: 3,
                            });
                        }
                    } else {
                        this.$Message.error({
                            content: "虚拟ip数量不能大于实例数量",
                            duration: 3,
                        });
                    }
                } else {
                    this.$Message.error("请检查输入是否正确!");
                }
            });
        },
        /* 删除APp */
        delApp(id) {
            this.id = id;
            this.$Modal.confirm({
                title: "提示",
                content: "<p>确定要移除这个APP吗？</p>",
                loading: true,
                onOk: () => {
                    this.$Modal.remove();
                    this.initModal = true;
                },
            });
        },
        //取消初始化实例配置
        async cancleInit() {
            this.disinitloading = true;
            let temp = false;
            let res = await delAppInfo({
                app_server_id: this.id,
                is_init_conf: temp,
            });
            this.disinitloading = false;
            this.initModal = false;
            this.appModal = false;
            if (this.asyncOk(res)) {
                this.$Message.success("删除成功！");
                this.getAppAsideList(true).then((res) => {
                    if (this.asyncOk(res) && !res.data.result.length) {
                        this.$router.push(`/app`);
                    }
                    if (this.id === this.$route.params.app) {
                        this.$router.replace(
                            `/app/${this.appServerId}/overview`
                        );
                    }
                });
            } else {
                this.$Message.error({ content: res.data.result, duration: 3 });
            }
        },
        //确定初始化实例配置
        async confirmInit() {
            this.initloading = true;
            let temp = true;
            let res = await delAppInfo({
                app_server_id: this.id,
                is_init_conf: temp,
            });
            this.initloading = false;
            this.initModal = false;
            this.appModal = false;
            if (this.asyncOk(res)) {
                this.$Message.success("删除成功！");
                this.getAppAsideList(true).then((res) => {
                    if (this.asyncOk(res) && !res.data.result.length) {
                        this.$router.push(`/app`);
                    }
                    if (this.id === this.$route.params.app) {
                        this.$router.replace(
                            `/app/${this.appServerId}/overview`
                        );
                    }
                });
            } else {
                this.$Message.error({ content: res.data.result, duration: 3 });
            }
        },
        /* 重置activeAside */
        resetAside() {
            this.getAppAsideList("update");
        },
        /*修改APP */
        modifyApp(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (
                        this.appForm.vips.length <=
                        this.appForm.l7_server_ids.length
                    ) {
                        if (
                            this.appForm.nginx_conf_id ||
                            this.appForm.appServerBlockList.length > 0
                        ) {
                            this.modal_loading = true;
                            updAppInfo(this.appForm)
                                .then((res) => {
                                    // console.log(res);
                                    this.modal_loading = false;
                                    if (res.data.code === "success") {
                                        this.appModal = false;
                                        this.$Message.success("修改成功");
                                        /* 重置当前app信息 */
                                        this.resetAside();
                                    } else {
                                        this.$Message.error(
                                            `${res.data.result}`
                                        );
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            this.$Message.error({
                                content:
                                    "请添加一个或多个server或者选择一份配置文件",
                                duration: 3,
                            });
                        }
                    } else {
                        this.$Message.error({
                            content: "虚拟ip数量不能大于实例数量",
                            duration: 3,
                        });
                    }
                } else {
                    this.$Message.error("请检查输入是否正确!");
                }
            });
        },
        //新增appServerBlock
        addAppServerBlock() {
            this.appForm.appServerBlockList.push({
                listen: 80,
                server_name: "",
                appLocationBlockList: [
                    {
                        url_path_route_key: "",
                        url_path_route_value: "/",
                        proxy_url: "",
                    },
                ],
            });
            this.ServerandLocationarrowStatus = false;
            this.serverRefresh = false;
            this.$nextTick(() => {
                this.serverRefresh = true;
                this.serverTabPane = this.appForm.appServerBlockList.length;
            });
        },
        //删除appServerBlock
        removeAppServerBlock(indexServe) {
            this.appForm.appServerBlockList.splice(indexServe - 1, 1);
            this.serverRefresh = false;
            this.$nextTick(() => {
                this.serverRefresh = true;
                this.serverTabPane = 1;
            });
            if (this.appForm.appServerBlockList.length < 1) {
                this.ServerandLocationarrowStatus = false;
            }
        },
        //新增appLocationBlock
        addAppLocationBlock(indexServe) {
            this.appForm.appServerBlockList[
                indexServe
            ].appLocationBlockList.push({
                url_path_route_key: "",
                url_path_route_value: "/",
                proxy_url: "",
            });
        },
        //删除appLocationBlock
        removeAppLocationBlock(indexLocation, indexServe) {
            this.appForm.appServerBlockList[
                indexServe
            ].appLocationBlockList.splice(indexLocation, 1);
        },
        //新增appUpgroupBlock
        addAppUpgroupBlock() {
            this.appForm.appUpgroupBlockList.push({
                upstream_name: "",
                appUpServerBlockList: [
                    {
                        upstream_server: "",
                        weight: 1,
                    },
                ],
            });
            this.UpgrouparrowStatus = false;
            this.upstreamRefresh = false;
            this.$nextTick(() => {
                this.upstreamRefresh = true;
                this.upstreamTabPane = this.appForm.appUpgroupBlockList.length;
            });
        },
        //删除appUpgroupBlock
        removeAppUpgroupBlock(indexUpgroup) {
            this.appForm.appUpgroupBlockList.splice(indexUpgroup - 1, 1);
            this.upstreamRefresh = false;
            this.$nextTick(() => {
                this.upstreamRefresh = true;
                this.upstreamTabPane = 1;
            });
            if (this.appForm.appUpgroupBlockList.length < 1) {
                this.UpgrouparrowStatus = false;
            }
        },
        //新增appUpServerBlock
        addAppUpServer(indexUpgroup) {
            this.appForm.appUpgroupBlockList[
                indexUpgroup
            ].appUpServerBlockList.push({
                upstream_server: "",
                weight: 1,
            });
        },
        //删除appUpServerBlock
        removeAppUpServer(indexUpServer, indexUpgroup) {
            this.appForm.appUpgroupBlockList[
                indexUpgroup
            ].appUpServerBlockList.splice(indexUpServer, 1);
        },
        ServerandLocationarrowDown() {
            this.ServerandLocationarrowStatus = false;
        },
        ServerandLocationarrowUp() {
            this.ServerandLocationarrowStatus = true;
        },
        UpgrouparrowDown() {
            this.UpgrouparrowStatus = false;
        },
        UpgrouparrowUp() {
            this.UpgrouparrowStatus = true;
        },
        /* 获取配置 */
        async getAllConfigInfo() {
            let res = await getNginxConfALL();
            if (this.asyncOk(res)) {
                this.configList = res.data.result || [];
            }
        },
        /* 查询所有有权限的Nginx配置方案 */
        async getNginxConfALLForPremissions() {
            let res = await getNginxConfALLForPremission();
            if (this.asyncOk(res)) {
                this.configList = res.data.result || [];
            }
        },
        /* 获取L7实例 */
        async selUsableL7Server(item) {
            let res = await selUsableL7Server({
                app_service_id: this.edit ? item.app_service_id : null,
            });
            if (this.asyncOk(res)) {
                this.L7List = res.data.result || [];
            }
        },
        //获取所有未绑定APP的实例（导入生产APP时调用）
        async ListL7ServerInfoByImpApp() {
            let res = await ListL7ServerInfoByImpApp();
            if (this.asyncOk(res)) {
                this.L7IDLists = res.data.result || [];
            }
        },
        /* 新增虚拟ip */
        handleAddVip() {
            this.appForm.vips.push("");
        },
        /* 删除虚拟ip */
        handleRemoveVip(index) {
            this.appForm.vips.splice(index, 1);
            if (this.appForm.vips.length === 0) {
                this.appForm.configure_ha = false;
            }
        },
        switchChange(data) {
            if (data) {
                if (this.appForm.vips.length === 0) {
                    this.appForm.vips.push("");
                }
            } else {
                this.appForm.custom_priority = false;
            }
        },
        //打开导入模板，并重置数据
        ImportModal() {
            this.importModal = true;
            this.importTabPane = 1;
            this.importForm = {
                app_service_name: "",
                description: "",
                l7IDS: [],
                l7ServerInfoList: [],
                tags: "",
            };
            this.ListL7ServerInfoByImpApp();
        },
        //导入生产应用
        appImport(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (
                        this.importForm.l7IDS.length > 0 ||
                        this.importForm.l7ServerInfoList.length > 0
                    ) {
                        this.importLoading = true;
                        impApp(this.importForm)
                            .then((res) => {
                                this.importLoading = false;
                                if (res.data.code === "success") {
                                    this.importModal = false;
                                    this.getAppAsideList().then((res) => {
                                        /* 第一次添加 */
                                        if (
                                            this.asyncOk(res) &&
                                            !this.$route.params.app
                                        ) {
                                            this.appSetActiveAside(
                                                res.data.result[0] || {}
                                            );
                                            this.$router.replace(
                                                `/app/${this.appServerId}/overview`
                                            );
                                        }
                                    });
                                } else {
                                    this.$Message.error(`${res.data.result}`);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        this.$Message.error("请选择实例或者新增实例!");
                    }
                } else {
                    this.$Message.error("请检查输入是否正确!");
                }
            });
        },
        //移除导入生产应用里的实例
        removeAppImport(index) {
            this.importForm.l7ServerInfoList.splice(index - 1, 1);
            this.importRefresh = false;
            this.$nextTick(() => {
                this.importRefresh = true;
                this.importTabPane = 1;
            });
        },
        //新增导入生产应用实例
        addImport() {
            this.importForm.l7ServerInfoList.push({
                impConfFlag: false,
                l7ServerName: "",
                l7ServerSSHIp: "",
                l7ServerSSHName: "",
                l7ServerSSHPort: 22,
                l7ServerSSHPwd: "",
                remark: "",
            });
            this.importRefresh = false;
            this.$nextTick(() => {
                this.importRefresh = true;
                this.importTabPane = this.importForm.l7ServerInfoList.length;
            });
        },
        //加锁和解锁
        LockAndUnlock(item) {
            if (item.lock_status) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "<p>确定要解锁？</p>",
                    loading: true,
                    onOk: async () => {
                        let res = await unLock({
                            lock_id: item.lock_id,
                        });
                        if (res.data.code === "success") {
                            this.$Modal.remove();
                            this.$Message.success("解锁成功!");
                            this.resetAside();
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(`${res.data.result}`);
                        }
                    },
                });
            } else {
                this.$Modal.confirm({
                    title: "提示",
                    content: "<p>确定要锁定？</p>",
                    loading: true,
                    onOk: async () => {
                        let res = await locking({
                            primaryKey: item.app_service_id,
                            type: "app",
                        });
                        if (res.data.code === "success") {
                            this.$Modal.remove();
                            this.$Message.success("锁定成功!");
                            this.resetAside();
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(`${res.data.result}`);
                        }
                    },
                });
            }
        },
        //查询虚拟机信息
        async GetVMwareInfo() {
            let res = await selVMwareInfo();
            if (res.data.code === "success") {
                if (res.data.result) {
                    this.copyData = JSON.parse(
                        JSON.stringify(
                            res.data.result[Object.keys(res.data.result)[0]][0]
                        )
                    ); //深度拷贝第一个数据
                    for (let key in res.data.result) {
                        this.hostData.push(res.data.result[key][0]);
                    }
                    if (
                        res.data.result[Object.keys(res.data.result)[0]][0]
                            .hostSystemList !== null
                    ) {
                        this.hostName =
                            res.data.result[Object.keys(res.data.result)[0]][0]
                                .hostSystemList || [];
                        this.customizationSpecNameList =
                            res.data.result[Object.keys(res.data.result)[0]][0]
                                .customizationSpecNameList || [];
                        this.datastoreNameList =
                            res.data.result[Object.keys(res.data.result)[0]][0]
                                .hostSystemList[0].datastoreNameList || [];
                        this.resourcePoolNameList =
                            res.data.result[Object.keys(res.data.result)[0]][0]
                                .hostSystemList[0].resourcePoolNameList || [];
                        this.dnsServerList =
                            res.data.result[Object.keys(res.data.result)[0]][0]
                                .customizationSpecNameList[0].dnsServerList ||
                            [];
                        this.gatewayList =
                            res.data.result[Object.keys(res.data.result)[0]][0]
                                .customizationSpecNameList[0].gatewayList || [];
                        this.templateName =
                            res.data.result[Object.keys(res.data.result)[0]][0]
                                .hostSystemList[0].virtualMachineTemplateList ||
                            [];
                    }
                }
            } else {
                this.$Message.error(`${res.data.result}`);
            }
        },
        //克隆虚拟机
        CopyModify(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let webSocket = new WebSocket(config.webSocketUrl);
                    webSocket.onopen = () => {
                        if (webSocket.readyState === 1) {
                            this.$Spin.show({
                                render: (h) => {
                                    return h("div", [
                                        h("Icon", {
                                            class: "demo-spin-icon-load",
                                            props: {
                                                type: "ios-loading",
                                                size: 18,
                                            },
                                        }),
                                        h("div", "正在配置中..."),
                                    ]);
                                },
                            });
                            this.updateIsTaskbarShow(true);
                            appCloneVMware(this.CopyForm)
                                .then((res) => {
                                    this.$Spin.hide();
                                    if (res.data.code === "success") {
                                        this.$Message.success("配置成功!");
                                        this.appCopyModal = false;
                                        let arr = res.data.result;
                                        this.selUsableL7Server(
                                            this.appForm
                                        ).then(() => {
                                            this.appForm.l7_server_ids.push(
                                                ...arr
                                            );
                                        });
                                    } else {
                                        this.$Message.error(
                                            `${res.data.result}`
                                        );
                                    }
                                    /**
                                     * 更新任务栏的数据并删除
                                     */
                                    this.updateIsTaskbarShow(false);
                                    this.removeTaskbarList();
                                    webSocket.close();
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    };
                    webSocket.onmessage = (msg) => {
                        this.updateTaskbarList(msg.data);
                        this.webSocketMessage = msg.data;
                    };
                    webSocket.onclose = () => {
                        console.log(`webSocket已关闭`);
                    };
                } else {
                    this.$Message.error("请检查输入是否正确!");
                }
            });
        },
        //新增IP地址和虚拟机名称
        addIpAndName() {
            this.CopyForm.vmParams.push({
                ipAddress: "",
                vmName: "",
            });
            this.vmParamsNotSingle = true;
        },
        //删除IP地址和虚拟机名称
        removeIpAndName(index) {
            this.CopyForm.vmParams.splice(index, 1);
            if (this.CopyForm.vmParams.length === 1) {
                this.vmParamsNotSingle = false;
            }
        },
        //手动添加DNS服务列表
        handleDnsServerList(val) {
            this.dnsServerList.push(val);
        },
        //手动添加网关列表
        handleGatewayList(val) {
            this.gatewayList.push(val);
        },
        //选择服务器
        serverSelect(val) {
            this.hostData.map((item) => {
                if (item.id === val.value) {
                    if (item.hostSystemList.length > 0) {
                        this.hostName = item.hostSystemList;
                        this.CopyForm.hostName = this.hostName[0].hostName; //默认选中第一个主机
                        if (this.hostName[0].resourcePoolNameList.length > 0) {
                            this.resourcePoolNameList = this.hostName[0].resourcePoolNameList;
                            this.CopyForm.resourcePoolName = this.resourcePoolNameList[0].vm_name; //默认选中第一个资源池名称
                        } else {
                            this.resourcePoolNameList = [];
                            this.CopyForm.resourcePoolName = "";
                        }
                        if (this.hostName[0].datastoreNameList.length > 0) {
                            this.datastoreNameList = this.hostName[0].datastoreNameList;
                            this.CopyForm.dataStoreName = this.datastoreNameList[0].name; //默认选中第一个数据存储名称
                        } else {
                            this.datastoreNameList = [];
                            this.CopyForm.dataStoreName = "";
                        }
                        if (
                            this.hostName[0].virtualMachineTemplateList.length >
                            0
                        ) {
                            this.templateName = this.hostName[0].virtualMachineTemplateList;
                            this.CopyForm.templateName = this.templateName[0].vmName; //默认选中第一个模板
                        } else {
                            this.templateName = [];
                            this.CopyForm.templateName = "";
                        }
                    } else {
                        this.hostName = [];
                        this.CopyForm.hostName = "";
                    }
                    if (item.customizationSpecNameList.length > 0) {
                        this.customizationSpecNameList =
                            item.customizationSpecNameList;
                        this.CopyForm.customizationSpecName = this.customizationSpecNameList[0].name; //默认选中第一个规则
                        if (
                            this.customizationSpecNameList[0].dnsServerList
                                .length > 0
                        ) {
                            this.dnsServerList = this.customizationSpecNameList[0].dnsServerList;
                            this.CopyForm.dnsServerList = this.dnsServerList; //DNS服务列表有值时展示所有值
                        } else {
                            this.dnsServerList = [];
                            this.CopyForm.dnsServerList = [];
                        }
                        if (
                            this.customizationSpecNameList[0].gateway.length > 0
                        ) {
                            this.gatewayList = this.customizationSpecNameList[0].gateway;
                            this.CopyForm.gatewayList = this.gatewayList; //网关列表有值时展示所有值
                        } else {
                            this.gatewayList = [];
                            this.CopyForm.gatewayList = [];
                        }
                    } else {
                        this.customizationSpecNameList = [];
                        this.CopyForm.customizationSpecName = "";
                    }
                }
            });
        },
        //选择主机
        hostSelect(val) {
            this.hostName.map((item) => {
                if (item.hostName === val.value) {
                    if (item.datastoreNameList.length > 0) {
                        this.datastoreNameList = item.datastoreNameList;
                        this.CopyForm.dataStoreName = this.datastoreNameList[0].name; //默认选中第一个数据存储名称
                    } else {
                        this.datastoreNameList = [];
                        this.CopyForm.dataStoreName = "";
                    }
                    if (item.resourcePoolNameList.length > 0) {
                        this.resourcePoolNameList = item.resourcePoolNameList;
                        this.CopyForm.resourcePoolName = this.resourcePoolNameList[0].vm_name; //默认选中第一个资源池名称
                    } else {
                        this.resourcePoolNameList = [];
                        this.CopyForm.resourcePoolName = "";
                    }
                    if (item.virtualMachineTemplateList.length > 0) {
                        this.templateName = item.virtualMachineTemplateList;
                        this.CopyForm.templateName = this.templateName[0].vmName; //默认选中第一个模板
                    } else {
                        this.templateName = [];
                        this.CopyForm.templateName = "";
                    }
                }
            });
        },
        //选择规则
        customizationSelect(val) {
            this.customizationSpecNameList.map((item) => {
                if (item.name === val.value) {
                    if (item.dnsServerList !== null) {
                        if (item.dnsServerList.length > 0) {
                            this.dnsServerList = item.dnsServerList;
                            this.CopyForm.dnsServerList = item.dnsServerList; //DNS服务列表有值时展示所有值
                        } else {
                            this.dnsServerList = [];
                            this.CopyForm.dnsServerList = [];
                        }
                    } else {
                        this.dnsServerList = [];
                        this.CopyForm.dnsServerList = [];
                    }
                    if (item.gateway !== null) {
                        if (item.gateway.length > 0) {
                            this.gatewayList = item.gateway;
                            this.CopyForm.gatewayList = item.gateway; //网关列表有值时展示所有值
                        } else {
                            this.gatewayList = [];
                            this.CopyForm.gatewayList = [];
                        }
                    } else {
                        this.gatewayList = [];
                        this.CopyForm.gatewayList = [];
                    }
                    this.CopyForm.subnetMask =
                        item.subnetMask || "255.255.255.0";
                    this.CopyForm.domain = item.domain || "localhost";
                }
            });
        },

        //  跳转至新建实例页面
        clickOpenNewInstance() {
            this.$router.push("/L7");
            this.setOpenNewInstance(true);
        },

        //  清空规则下拉框时触发
        onClearCopyFormCustomizationSpecName() {
            //  清空DNS、网关、子网掩码、域名
            this.CopyForm.dnsServerList = [];
            this.CopyForm.gatewayList = [];
            this.CopyForm.subnetMask = "";
            this.CopyForm.domain = "";
        },
        //  当新建实例窗口发生变化时触发
        onVisibleChangeModalAppCopy(bool) {
            if (!bool) {
                this.advancedSetupShow = false;
            }
        },
        //  初始化
        async init() {
            this.appChangeLoadingStatus(true);
            // await this.GetVMwareInfo();
            await this.getAppAsideList(true).then((res) => {
                if (this.asyncOk(res) && res.data.result.length) {
                    if (!this.$route.params.app) {
                        this.$router.replace(
                            `/app/${this.appServerId}/overview`
                        );
                    } else {
                        this.asideList.map((item) => {
                            if (
                                item.app_service_id === this.$route.params.app
                            ) {
                                this.appSetActiveAside(item);
                            }
                        });
                    }
                }
            });
            this.appChangeLoadingStatus(false);
        },
    },
    /* 更新组件 */
    created() {
        this.init();
    },
    mounted() {
        this.timer = setInterval(() => {
            this.getAppAsideList("update");
        }, 1000 * 60);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>
<style lang="less" scoped>
@import "aside";
//@import "../../components/common/configuration/modal-form";
.tag {
    //   margin-right: 10px;
    display: inline-block;
    padding: 5px 10px;
    background: #f3f3f3;
    color: #333;
    //   margin-top: 10px;
}
.custom-ha {
    float: right;
    /deep/ .ivu-form-item-content {
        float: right;
    }
}
/deep/.ivu-modal-footer {
    border: 1px solid #eee;
}
.arrow-down {
    height: 250px;
}
.arrow-up {
    height: 100%;
}
.listen-and-servegroups {
    //   margin-left: -16px;
    //   width: 543px;
    margin-bottom: 24px;
    .listen-and-servegroups-title {
        font-size: 14px;
        color: #515a6e;
        margin-left: 16px;
    }
    .listen-and-servegroups-top {
        overflow: hidden;
        .listen-and-servegroups-top-content {
            padding: 16px 16px;
            //   display: flex;
            //   justify-content: space-between;
            //   box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
            .top-content-leftcontent {
                // width: 400px;
                .top-content-leftcontent-title {
                    font-size: 14px;
                    color: #515a6e;
                }
                .top-content-leftcontent-location {
                    display: flex;
                    justify-content: space-between;
                    padding: 0 16px;
                    border-bottom: 1px dashed #dcdee2 !important;
                    border-radius: 4px;
                    .location-right {
                        width: 22px;
                        position: relative;
                        .location-right-icon {
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            cursor: pointer;
                            opacity: 0.6;
                            transition: all 0.2s;
                            &:hover {
                                opacity: 1;
                            }
                        }
                    }
                    &:hover {
                        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
                    }
                    &:nth-last-child(1) {
                        border-bottom: none !important;
                    }
                }
            }
            .top-content-rightcontent {
                width: 26px;
                position: relative;
                .top-content-rightcontent-remove-icon {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    opacity: 0.6;
                    transition: all 0.2s;
                    &:hover {
                        opacity: 1;
                    }
                }
            }
        }
    }
    .listen-and-servegroups-bottom-r {
        text-align: right;
        .bottom-content-button-common-style {
            margin-right: 16px;
        }
    }
    .listen-and-servegroups-bottom-l {
        text-align: left;
        margin: 6px 0 4px 16px;
    }
}
.aside-list {
    .aside-list-wrap {
        text-align: center;
    }
    .left {
        text-align: left;
    }
    .load-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.vmParams-border {
    border-right: 1px #01c864 solid;
}

/deep/.ivu-tabs {
    .ivu-tabs-bar {
        margin: 0;
    }
    .ivu-tabs-content {
        transition: 0.5s;
        border: 1px solid #dcdee2;
        border-top: none;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}

.advanced-setup {
    cursor: pointer;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid transparent;
    transition: 0.5s;
    &:hover {
        border-bottom: 1px solid #dcdee2;
    }
    .advanced-setup-title {
        padding: 0.5rem;
    }
    .advance-card-icon {
        margin-left: 0.1rem;
        font-size: 1.3rem;
    }
}
.advanced-setup-content {
    transition: 0.5s;
    &:hover {
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    }
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(180deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
