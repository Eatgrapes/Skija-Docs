import { defineConfig } from 'vitepress'

function getNav(prefix = '') {
  return [
    { text: 'Home', link: prefix + '/' },
    { text: 'Getting Started', link: prefix + '/getting-started' }
  ]
}

function getSidebar(prefix = '') {
  return [
    {
      text: 'The Essentials',
      items: [
        { text: 'Getting Started', link: prefix + '/getting-started' },
        { text: 'Installation', link: prefix + '/installation' },
        { text: 'Rendering Basics', link: prefix + '/rendering-basics' },
        { text: 'Colors and Alpha', link: prefix + '/colors' },
        { text: 'Animation', link: prefix + '/animation' },
        { text: 'Resource Management', link: prefix + '/resource-management' }
      ]
    },
    {
      text: 'API Deep Dives',
      items: [
        { text: 'Surface', link: prefix + '/api/Surface' },
        { text: 'Canvas', link: prefix + '/api/Canvas' },
        { text: 'Images & Bitmaps', link: prefix + '/api/Images' },
        { text: 'ImageInfo', link: prefix + '/api/ImageInfo' },
        { text: 'ImageFilter', link: prefix + '/api/ImageFilter' },
        { text: 'IHasImageInfo', link: prefix + '/api/IHasImageInfo' },
        { text: 'Sampling Mode', link: prefix + '/api/SamplingMode' },
        { text: 'Cubic Resampler', link: prefix + '/api/CubicResampler' },
        { text: 'Data', link: prefix + '/api/Data' },
        { text: 'StreamAsset', link: prefix + '/api/StreamAsset' },
        { text: 'Codec (Animations)', link: prefix + '/api/Codec' },
        { text: 'Paint & Effects', link: prefix + '/api/Effects' },
        { text: 'Matrix', link: prefix + '/api/Matrix' },
        { text: 'Shadows', link: prefix + '/api/Shadows' },
        { text: 'Font', link: prefix + '/api/Font' },
        { text: 'Paths', link: prefix + '/api/Path' },
        { text: 'PathBuilder', link: prefix + '/api/path-builder' },
        { text: 'PathMeasure', link: prefix + '/api/PathMeasure' },
        { text: 'Region', link: prefix + '/api/Region' },
        { text: 'Picture', link: prefix + '/api/Picture' }
      ]
    },
    {
      text: 'Typography & Text',
      items: [
        { text: 'Typography & Fonts', link: prefix + '/typography' },
        { text: 'Typeface', link: prefix + '/api/Typeface' },
        { text: 'TextBlob & Builder', link: prefix + '/api/TextBlob' },
        { text: 'TextLine', link: prefix + '/api/TextLine' },
        { text: 'BreakIterator', link: prefix + '/api/BreakIterator' },
        { text: 'Text Animation & Clipping', link: prefix + '/api/text-animation' },
        { text: 'Paragraph (Rich Text)', link: prefix + '/api/Paragraph' }
      ]
    },
    {
      text: 'Advanced Graphics',
      items: [
        { text: 'GPU Rendering', link: prefix + '/gpu-rendering' },
        { text: 'DirectContext', link: prefix + '/api/direct-context' },
        { text: 'Shaper', link: prefix + '/api/Shaper' },
        { text: 'SkSL (RuntimeEffect)', link: prefix + '/api/runtime-effect' },
        { text: 'PDF Generation', link: prefix + '/api/Document' }
      ]
    },
    {
      text: 'Extensions',
      items: [
        { text: 'SVG', link: prefix + '/api/SVG' },
        { text: 'Lottie', link: prefix + '/extensions' }
      ]
    }
  ]
}

export default defineConfig({
  base: '/Skija-Docs/',
  title: "Skija",
  description: "High-performance Java graphics powered by Skia",
  
  locales: {
    root: { 
      label: 'English', 
      lang: 'en',
      themeConfig: {
        nav: getNav(),
        sidebar: getSidebar()
      }
    },
    'zh-Hans': { 
      label: '简体中文', 
      lang: 'zh-Hans', 
      link: '/zh-Hans/',
      themeConfig: {
        nav: getNav('/zh-Hans'),
        sidebar: getSidebar('/zh-Hans')
      }
    },
    'zh-Hant': { 
      label: '繁體中文', 
      lang: 'zh-Hant', 
      link: '/zh-Hant/',
      themeConfig: {
        nav: getNav('/zh-Hant'),
        sidebar: getSidebar('/zh-Hant')
      }
    },
    'ja': { 
      label: '日本語', 
      lang: 'ja', 
      link: '/ja/',
      themeConfig: {
        nav: getNav('/ja'),
        sidebar: getSidebar('/ja')
      }
    },
    'de': { 
      label: 'Deutsch', 
      lang: 'de', 
      link: '/de/',
      themeConfig: {
        nav: getNav('/de'),
        sidebar: getSidebar('/de')
      }
    },
    'es': { 
      label: 'Español', 
      lang: 'es', 
      link: '/es/',
      themeConfig: {
        nav: getNav('/es'),
        sidebar: getSidebar('/es')
      }
    },
    'fr': { 
      label: 'Français', 
      lang: 'fr', 
      link: '/fr/',
      themeConfig: {
        nav: getNav('/fr'),
        sidebar: getSidebar('/fr')
      }
    },
    'ru': { 
      label: 'Русский', 
      lang: 'ru', 
      link: '/ru/',
      themeConfig: {
        nav: getNav('/ru'),
        sidebar: getSidebar('/ru')
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/HumbleUI/Skija' }
    ],
    footer: {
      message: 'Unofficial documentation. Report issues at <a href="https://github.com/Eatgrapes/Skija-Docs">Eatgrapes/Skija-Docs</a>.'
    }
  }
})