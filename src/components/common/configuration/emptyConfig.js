/* 默认配置模板 */
const  emptyConfig = {
    nginx_conf_id: '',
    config_name: '',
    version_no: '',
    instance_count: '',
    upd_time: '',
    upd_name: '',
    ngcVirtualServers: [
        {
            virtual_id: '',
            nginx_conf_id: '',
            domain_names_state: false,
            domain_name: '',
            ssl_certificate_state: false,
            ssl_file: '',
            ssl_key: '',
            allow_deny_state: false,
            error_pages_state: false,
            error_log_state: false,
            error_log_path: '/var/log/nginx/error.log',
            error_log_level: 'ERROR',
            access_log_state: false,
            use_recommended_format_state: false,
            access_log_name: '',
            access_log_path: '/var/log/nginx/access.log',
            access_log_format: '',
            version_no: '',
            ngcAllowDenies: [
                {
                    allow_deny_id: '',
                    virtual_id: '',
                    locations_id: '',
                    allow_deny_value: 'allow',
                    allow_deny_ip: '',
                    allow_deny_sort: 0,
                    version_no: ''
                }
            ],
            ngcErrorPages: [
                {
                    error_pages_id: '',
                    virtual_id: '',
                    locations_id: '',
                    http_codes: '',
                    redirect_to: '',
                    response_code: '',
                    version_no: ''
                }
            ],
            ngcLocations: [
                {
                    locations_id: '',
                    virtual_id: '',
                    url_path_route_key: '',
                    url_path_route_value: '',
                    apilocation_state: false,
                    read_only_state: false,
                    proxy_state: false,
                    proxy_url: '',
                    ngcLocationHeaders: [
                        {
                            headers_id: '',
                            locations_id: '',
                            headers_key: 'Host',
                            headers_value: '$host',
                            version_no: ''
                        }
                    ],
                    buffering_state: false,
                    allow_to_buffer_on_disk_state: false,
                    http_version: '1.1',
                    connect_timeout: '',
                    intercept_errors_state: false,
                    allow_deny_state: false,
                    error_pages_state: false,
                    index_files_state: false,
                    index_files: '',
                    root_state: false,
                    root_path: '',
                    alias_state: false,
                    alias_path: '',
                    version_no: '',
                    ngcAllowDenies: [
                        {
                            allow_deny_id: '',
                            virtual_id: '',
                            locations_id: '',
                            allow_deny_value: 'allow',
                            allow_deny_ip: '',
                            allow_deny_sort: 0,
                            version_no: ''
                        }
                    ],
                    ngcErrorPages: [
                        {
                            error_pages_id: '',
                            virtual_id: '',
                            locations_id: '',
                            http_codes: '',
                            redirect_to: '',
                            response_code: '',
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
                    default_server_state: false,
                    ssl_state: false,
                    http2_state: false,
                    proxy_protocol_state: false,
                    fib: '',
                    tcp_fast_open: '',
                    backlog: '',
                    receive_buffer_size: '',
                    send_buffer_size: '',
                    accept_filter: 'none',
                    deferred_state: false,
                    bind_state: false,
                    accept_ipv6_only_state: false,
                    reuseport_state: false,
                    tcp_keepalive_state: false,
                    tcp_keepalive_value: '',
                    socket_option_value: '',
                    version_no: ''
                }
            ]
        }
    ],
    ngcUpstreamGroups: [
        {
            group_id: '',
            nginx_conf_id: '',
            group_name: '',
            load_balancing_method: 'weighted round-robin',
            hash_key: '',
            ketama_consisten_state: false,
            time_to_receive: 'response header',
            serve_incomplete_requests_state: false,
            session_persistence_state: false,
            method: 'cookie',
            cookie: '',
            cookie_domain: '',
            cookie_expires: '',
            cookie_httponly_state: false,
            cookie_secure_state: false,
            cookie_path: '',
            route_variables: '',
            leam_create: '',
            leam_lookup: '',
            leam_shared_memory_zone: '',
            leam_session_remove_timeout: '',
            leam_chrarrh: false,
            upstream_zone_state: false,
            upstream_zone_name: '',
            upstream_zone_size: '',
            active_healthcheck_state: false,
            healthcheck_url: '/',
            healthcheck_host: '',
            keepalive_connection_pool_state: false,
            keepalive_connection_pool_value: '',
            queueing_state: false,
            queueing_number: '',
            queueing_time: '',
            ntlm_authentication_state: false,
            persistent_state: false,
            persistent_file: '',
            version_no: '',
            ngcUpstreamServers: [
                {
                    upstream_server_id: '',
                    group_id: '',
                    upstream_servers_name: '',
                    weight: '',
                    max_active_connections: '',
                    max_failed_connections: '',
                    fail_timeout: '',
                    backup_server_state: false,
                    resolve_state: false,
                    service_name: '',
                    route_name: '',
                    weight_recovering_time: '',
                    server_bound_requests_only: false,
                    mark_as_down: false,
                    version_no: ''
                }
            ]
        }
    ]
}
export default emptyConfig
