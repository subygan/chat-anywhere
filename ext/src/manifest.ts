import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  manifest_version: 3,
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  version: packageData.version,
  author: packageData.author,
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
  permissions: ['sidePanel', 'storage', 'identity'],
  // TODO: Key should be fetched from env variable
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl4kmMNqD60GRYS5N1DzOPtP7AF3WYrLkBNqyo30x1recPvZqSwavva6yZp2kJDcZpkwTcWaoL2Ed7BMgupRDCHK2dXsKIJuD+Z2MELg6omVTSs46/KiAHdqYDMMD0h1a40tGJHoh4lucNk0LJKETgPYl8S5OnBsbtu87/Z38tqt8PvSvq+h59VO9/MK8jEERZ+vP60WaIlIjdPq8r+XmVLzk6jK8/q4k/GjQQyQKB9Zp+bNYDwbJI6Yj8OtlnZvPh5vZ+sP6cIkcstOt8xgR13FwwQE6x5Z/GVJPouC9+j1NwHF8x9cyGjnTK7aHerXSXKJOT4Op9q9DBj0XEkoM4QIDAQAB",
  host_permissions: [
    "https://*/*"
  ],
  oauth2: {
    // TODO: Key should be fetched from env variable
    client_id: "29789256733-8ab4ec312va2b5gmq9stj9seiil0qr4g.apps.googleusercontent.com",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_security_policy: {
    "extension_pages": "script-src 'self' http://localhost;object-src 'self';"
  },
  options_page: 'options.html',
  devtools_page: 'devtools.html',
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.ts'],
    },
  ],
  side_panel: {
    default_path: 'sidepanel.html',
  },
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
})
