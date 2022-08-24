module.exports = {
  "presets": [
    "@vue/app"
  ],
  "env": {
      "development": {
        "plugins": ['dynamic-import-node']
      }
  },
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      },
      "syntax-dynamic-import",
    ]
  ]
}