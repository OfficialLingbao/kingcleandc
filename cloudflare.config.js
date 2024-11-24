// Cloudflare Configuration Settings

module.exports = {
    // DNS Settings
    dns: {
        zone: 'kingofcleandc.com',
        records: [
            {
                type: 'A',
                name: '@',
                content: 'YOUR_SERVER_IP',
                proxied: true
            },
            {
                type: 'CNAME',
                name: 'www',
                content: 'kingofcleandc.com',
                proxied: true
            }
        ]
    },

    // Page Rules
    pageRules: [
        {
            url: '*kingofcleandc.com/*',
            actions: {
                ssl: 'full_strict',
                browser_cache_ttl: 14400,
                cache_level: 'aggressive',
                email_obfuscation: 'on',
                security_level: 'medium'
            }
        }
    ],

    // Security Settings
    security: {
        // WAF (Web Application Firewall)
        waf: {
            enabled: true,
            securityLevel: 'medium',
            challengePassage: 3600,
            rulesets: ['wordpress', 'php', 'basic']
        },

        // DDoS Protection
        ddos: {
            enabled: true,
            rateLimit: {
                enabled: true,
                threshold: 1000,
                period: 60
            }
        },

        // SSL/TLS
        ssl: {
            mode: 'full_strict',
            minVersion: '1.2',
            httpRedirect: true,
            earlyHints: true
        },

        // Bot Fight Mode
        botFight: {
            enabled: true,
            javascriptDetection: true
        }
    },

    // Performance Settings
    performance: {
        // Caching
        caching: {
            browserCacheTTL: 14400,
            edgeCacheTTL: 7200,
            alwaysOnline: true,
            developmentMode: false
        },

        // Optimization
        optimization: {
            minify: {
                js: true,
                css: true,
                html: true
            },
            brotli: true,
            earlyHints: true,
            http2: true,
            http3: true,
            rocketLoader: true
        },

        // Image Optimization
        images: {
            webP: true,
            polish: 'lossless',
            qualityOptimization: true,
            responsiveImages: true
        }
    },

    // Network Settings
    network: {
        http2: true,
        http3: true,
        ipv6: true,
        webSockets: true,
        opportunisticEncryption: true,
        pseudoIpv4: true,
        prefetchPreload: true
    }
};
