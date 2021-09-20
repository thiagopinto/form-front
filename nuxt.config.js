export default {
  globalName: 'NEV',
  env: {
    apiUrl: process.env.API_BASE_URL,
    baseUrl: process.env.BASE_URL,
    isDemo: process.env.IS_DEMO,
    apiKey: process.env.API_KEY,
    applicationToken: process.env.APPLICATION_TOKEN
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'NEV',
    titleTemplate: 'NEV',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'NEV Núcleo de Enventos vitais'
      },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        size: '57x57',
        href: '/apple-icon-57x57.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '60x60',
        href: '/apple-icon-60x60.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '72x72',
        href: '/apple-icon-72x72.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '72x72',
        href: '/apple-icon-72x72.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '76x76',
        href: '/apple-icon-76x76.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '114x114',
        href: '/apple-icon-114x114.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '120x120',
        href: '/apple-icon-120x120.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '144x144',
        href: '/apple-icon-144x144.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '152x152',
        href: '/apple-icon-152x152.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '152x152',
        href: '/apple-icon-152x152.png'
      },
      {
        rel: 'apple-touch-icon',
        size: '180x180',
        href: '/apple-icon-180x180.png'
      },
      { rel: 'icon', size: '96x96', href: '/favicon-96x96.png' },
      { rel: 'icon', size: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', size: '16x16', href: '/favicon-16x16.png' },
      {
        rel: 'icon',
        type: 'image/png',
        size: '192x192',
        href: '/android-icon-192x192.png'
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'manifest', href: '/manifest' },
      { rel: 'mask-icon', href: 'mask-icon', color: 'ffffff' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~assets/scss/paper.scss', '~assets/css/vue-croppa.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/nuxtjs-bootstrap-sidebar' },
    { src: '~plugins/filter' },
    { src: '~/plugins/vue2-editor', mode: 'client' },
    { src: '~/plugins/vuelayers', mode: 'client' },
    { src: '~/plugins/autocomplete-vue', mode: 'client' },
    { src: '~/plugins/easy-circular-progress', mode: 'client' },
    { src: '~/plugins/vue-lazytube' },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/vue-notifyjs' },
    { src: '~/plugins/vue-croppa' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/fontawesome',
    // https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment',
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://i18n.nuxtjs.org/
    'nuxt-i18n',
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://dev.auth.nuxtjs.org/guide/setup
    '@nuxtjs/auth-next',
    // https://sitemap.nuxtjs.org/guide/setup
    '@nuxtjs/sitemap',
    '~/modules/vuelayers',
    '~/modules/autocomplete-vue'
  ],

  styleResources: {
    sass: [],
    scss: [
      './assets/scss/*.scss'
      // './assets/scss/paper/*.scss',
      // './assets/scss/paper/mixins/*.scss'
    ],
    less: [],
    stylus: [],
    hoistUseStatements: true
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-npmclearaxios
  axios: {
    baseURL: `${process.env.API_BASE_URL}/api/v1/`,
    credentials: true
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'pt-BR'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: { transpile: ['nuxtjs-bootstrap-sidebar'] },

  fontawesome: {
    icons: {
      solid: [
        'faUserSecret',
        'faHome',
        'faTint',
        'faUsers',
        'faPhone',
        'faChild',
        'faBars',
        'faInfo',
        'faConciergeBell',
        'faBook',
        'faProjectDiagram',
        'faSearch',
        'faSearchPlus',
        'faSearchMinus',
        'faEdit',
        'faGraduationCap',
        'faCross',
        'faStar',
        'faHospital',
        'faGlobeAmericas',
        'faPlus',
        'faPaperPlane',
        'faPrint',
        'faBackspace'
      ],
      regular: ['faTimesCircle', 'faFileAlt', 'faNewspaper', 'faPlusSquare', 'faChartBar', 'faEye']
    }
  },
  auth: {
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        domain: 'localhost',
        secure: true
      }
    },
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: `${process.env.API_BASE_URL}/api/v1`,
        token: {
          type: 'Bearer',
          property: 'plainTextToken',
          global: true,
          required: true
        },
        endpoints: {
          login: { url: '/login/', method: 'post' },
          logout: false,
          user: { url: '/me/', method: 'get' }
        }
      }
    }
  },
  layoutTransition: {
    name: 'layouts',
    mode: 'out-in'
  },
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },
  loading: {
    color: '#e95e38',
    height: '5px'
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'auth-activate',
          path: '/auth/activate/:uid/:token',
          component: '~/pages/auth/activate/_uid.vue'
        },
        {
          name: 'password-reset',
          path: '/auth/reset/confirm/:token/:email',
          component: '~/pages/auth/reset/confirm/_token.vue'
        }
      );
    }
  },
  sitemap: {
    hostname: process.env.BASE_URL,
    gzip: true,
    lastmod: '2021-08-03'
  }
};
