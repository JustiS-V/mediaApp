module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@components": "./src/components",
          "@atoms": "./src/components/atoms",
          "@molecules": "./src/components/molecules",
          "@organisms": "./src/components/organisms",
          "@templates": "./src/components/templates",
          "@screens": "./src/screens",
          "@types": "./src/types",
          "@assets": "./src/assets",
          "@constants": "./src/constants",
          "@helper": "./src/helper",
          "@hooks": "./src/hooks",
          "@i18n": "./src/i18n",
          "@navigation": "./src/navigation",
          "@store": "./src/store",
          "@customTypes": "./src/types"
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
