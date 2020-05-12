/* 默认配置模板 */
const  defaultConfig = {
    nginx_conf_id: '',
    config_name: '',
    version_no: '',
    instance_count: '',
    upd_time: '',
    upd_name: '',
    work_rlimit_nofile: 1024,
    worker_connections: 1024,
    worker_processes: 'auto',
    ngcVirtualServers: [
        {
            virtual_id: '',
            nginx_conf_id: '',
            domain_names_state: true,
            domain_name: 'localhost',
            ssl_certificate_state: false,
            ssl_file: '',
            ssl_key: '',
            allow_deny_state: false,
            error_pages_state: true,
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
                    http_codes: '500,502,503,504',
                    redirect_to: '/50x.html',
                    response_code: '',
                    version_no: ''
                }
            ],
            ngcLocations: [
                {
                    locations_id: '',
                    virtual_id: '',
                    url_path_route_key: '',
                    url_path_route_value: '/',
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
                    index_files_state: true,
                    index_files: 'index.html,index.htm',
                    root_state: true,
                    root_path: '/usr/share/nginx/html',
                    alias_state: false,
                    alias_path: '',
                    version_no: '',
                    ngcAllowDenies: [
                        {
                            allow_deny_id: '',
                            virtual_id: '',
                            locations_id: '',
                            allow_deny_value: 'ALLOW',
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
                },
                {
                    locations_id: '',
                    virtual_id: '',
                    url_path_route_key: 'exact',
                    url_path_route_value: '/50x.html',
                    apilocation_state: false,
                    read_only_state: false,
                    proxy_state: false,
                    proxy_url: '',
                    ngcLocationHeaders: [
                        {
                            headers_id: '',
                            locations_id: '',
                            headers_key: '',
                            headers_value: '',
                            version_no: ''
                        }
                    ],
                    buffering_state: false,
                    allow_to_buffer_on_disk_state: false,
                    http_version: '',
                    connect_timeout: '',
                    intercept_errors_state: false,
                    allow_deny_state: false,
                    error_pages_state: false,
                    index_files_state: false,
                    index_files: '',
                    root_state: true,
                    root_path: '/usr/share/nginx/html',
                    alias_state: false,
                    alias_path: '',
                    version_no: '',
                    ngcAllowDenies: [
                        {
                            allow_deny_id: '',
                            virtual_id: '',
                            locations_id: '',
                            allow_deny_value: '',
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
                    listening_address_port: '80',
                    default_server_state: true,
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
                    accept_ipv6_only_state: true,
                    reuseport_state: false,
                    tcp_keepalive_state: false,
                    tcp_keepalive_value: 'on',
                    socket_option_value: '',
                    version_no: ''
                }
            ]
        }
    ],
    ngcUpstreamGroups: [
    ]
}
export default defaultConfig
