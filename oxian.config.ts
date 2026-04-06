export default {
  "root": ".",
  "basePath": "/api",
  "loaders": {
    "local": { "enabled": true },
    "github": { "enabled": false },
  },
  "runtime": {
    "hotReload": true,
    "dependencies": {
      "merge": "shallow",
    },
  },
  "server": {
    "port": Deno.env.get("PORT") || 8000,
  },
  "routing": {
    "routesDir": "api",
    "trailingSlash": "preserve",
    "discovery": "lazy",
  },
  "security": {
    "cors": {
      "allowedOrigins": ["*"],
      "allowedHeaders": ["authorization", "content-type", "x-requested-with"],
      "allowCredentials": true,
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    },
    "defaultHeaders": { "x-powered-by": "oxian" },
    "scrubHeaders": [],
  },
  "logging": {
    "level": "info",
    "requestIdHeader": "x-request-id",
  },
  "web": {
    "devProxyTarget": Deno.env.get("WEB_DEV_PROXY_TARGET") || undefined,
    "staticDir": "web/dist",
    "staticCacheControl": "no-cache",
  },
};
