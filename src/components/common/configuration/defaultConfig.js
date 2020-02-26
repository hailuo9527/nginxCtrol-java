/* 默认配置模板 */
const  defaultConfig = {
    nginx_conf_id: '',
    config_name: '',
    version_no: null,
    instance_count: null,
    upd_time: '',
    upd_name: '',
    ngcVirtualServers: [
        {
            virtual_id: '',
            nginx_conf_id: '',
            domain_names_state: 'off',
            domain_name: '',
            ssl_certificate_state: 'off',
            ssl_file: 'off',
            ssl_key: 'off',
            allow_deny_state: 'off',
            error_pages_state: 'off',
            error_log_state: 'off',
            error_log_path: 'off',
            error_log_level: 'off',
            access_log_state: 'off',
            use_recommended_format: 'off',
            access_log_name: 'off',
            access_log_path: 'off',
            access_log_format: 'off',
            version_no: '',
            ngcAllowDenies: [
                {
                    allow_deny_id: '',
                    virtual_id: '',
                    locations_id: 'off',
                    allow_deny_value: 'off',
                    allow_deny_ip: 'off',
                    allow_deny_sort: 0,
                    version_no: ''
                }
            ],
            ngcErrorPages: [
                {
                    error_pages_id: '',
                    virtual_id: '',
                    locations_id: 'off',
                    http_codes: 'off',
                    redirect_to: 'off',
                    response_code: 'off',
                    version_no: ''
                }
            ],
            ngcLocations: [
                {
                    locations_id: '',
                    virtual_id: '',
                    url_path_route_key: 'off',
                    url_path_route_value: 'off',
                    apilocation_state: 'off',
                    read_only_state: 'off',
                    proxy_state: 'off',
                    proxy_url: 'off',
                    ngcLocationHeaders: [
                        {
                            headers_id: '',
                            locations_id: '',
                            headers_key: 'off',
                            headers_value: 'off',
                            version_no: ''
                        }
                    ],
                    buffering_state: 'off',
                    allow_to_buffer_on_disk_state: 'off',
                    http_version: 'off',
                    connect_timeout: 'off',
                    intercept_errors_state: 'off',
                    allow_deny_state: 'off',
                    error_pages_state: 'off',
                    index_files_state: 'off',
                    index_files: 'off',
                    root_state: 'off',
                    root_path: 'off',
                    alias_state: 'off',
                    alias_path: 'off',
                    version_no: '',
                    ngcAllowDenies: [
                        {
                            allow_deny_id: '',
                            virtual_id: 'off',
                            locations_id: '',
                            allow_deny_value: 'off',
                            allow_deny_ip: 'off',
                            allow_deny_sort: 0,
                            version_no: ''
                        }
                    ],
                    ngcErrorPages: [
                        {
                            error_pages_id: '',
                            virtual_id: 'off',
                            locations_id: '',
                            http_codes: 'off',
                            redirect_to: 'off',
                            response_code: 'off',
                            version_no: ''
                        }
                    ]
                }
            ],
            ngcListenings: [
                {
                    listening_id: '',
                    virtual_id: '',
                    listening_address_port: '',
                    default_server_state: 'off',
                    ssl_state: 'off',
                    http2_state: 'off',
                    proxy_protocol_state: 'off',
                    fib: 0,
                    tcp_fast_open: 0,
                    backlog: 0,
                    receive_buffer_size: 0,
                    send_buffer_size: 0,
                    accept_filter: 'off',
                    deferred_state: 'off',
                    bind_state: 'off',
                    accept_ipv6_only_state: 'off',
                    reuseport_state: 'off',
                    tcp_keepalive_state: 'off',
                    tcp_keepalive_value: 'off',
                    socket_option_value: 'off',
                    version_no: ''
                }
            ]
        }
    ],
    ngcUpstreamGroups: [
        {
            group_id: '',
            nginx_conf_id: '',
            group_name: 'off',
            load_balancing_method: 'off',
            hash_key: 'off',
            ketama_consisten_state: 'off',
            time_to_receive: 'off',
            serve_incomplete_requests_state: 'off',
            session_persistence_state: 'off',
            method: 'off',
            cookie: 'off',
            cookie_domain: 'off',
            cookie_httponly_state: 'off',
            cookie_secure_state: 'off',
            cookie_path: 'off',
            route_variables: 'off',
            leam_create: 'off',
            leam_lookup: 'off',
            leam_shared_memory_zone: 'off',
            leam_session_remove_timeout: 0,
            leam_chrarrh: 'off',
            upstream_zone_state: 'off',
            upstream_zone_name: 'off',
            upstream_zone_size: 'off',
            active_healthcheck_state: 'off',
            healthcheck_url: 'off',
            healthcheck_host: 'off',
            keepalive_connection_pool_state: 'off',
            keepalive_connection_pool_value: 'off',
            queueing_state: 'off',
            queueing_number: 0,
            queueing_time: 0,
            ntlm_authentication_state: 'off',
            persistent_state: 'off',
            persistent_file: 'off',
            version_no: 2,
            ngcUpstreamServers: [
                {
                    upstream_server_id: '',
                    group_id: '',
                    upstream_servers_name: 'off',
                    weight: 0,
                    max_active_connections: 0,
                    max_failed_connections: 0,
                    fail_timeout: 0,
                    backup_server_state: 'off',
                    resolve_state: 'off',
                    service_name: 'off',
                    route_name: 'off',
                    weight_recovering_time: 0,
                    server_bound_requests_only: 'off',
                    mark_as_down: 'off',
                    version_no: 2
                }
            ]
        }
    ]
}
export default defaultConfig
