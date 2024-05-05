/*
 * @Author: your name
 * @Date: 2021-11-15 14:02:30
 * @LastEditTime: 2022-01-07 13:02:52
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wecars/.eslintrc.js
 */

module.exports = {
	root: true,
	env: {
	  browser: true,
	  node: true,
	  es6: true
	},
	globals: {
	  wx: true,
	  weex: true,
	  uni: true,
	  uniCloud: true,
	  plus: true,
	  window: true,
	  WeixinJSBridge: true
	},
  
	extends: ["plugin:vue/recommended", "eslint:recommended"],
  
	parserOptions: {
	  parser: "babel-eslint",
	  sourceType: "module"
	},
  
	rules: {
	  "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
	  "require-atomic-updates": "off",
	  "vue/no-v-html": "off",
	  "no-console": "off",
	  "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
	  "no-unused-vars": [0, {"vars": "all", "args": "none"}],//不能有声明后未被使用的变量或参数
	  "no-undef": 0,//不能有未定义的变量
	  "quotes": [0, "double"],//要求尽可能地使用双引号
	  "semi": [0],//语句强制分号结尾
	  "semi-spacing": [0, {
		"before": false,
		"after": true
	  }],//分号前后空格
	  'object-curly-spacing': [0, 'always', {
		objectsInObjects: false
	  }],
	  "vue/html-indent": ["error", 4],
      "vue/script-indent": ["error", 4],
	  
	},
  
	overrides: [
	  {
		files: [
		  "**/__tests__/*.{j,t}s?(x)",
		  "**/tests/unit/**/*.spec.{j,t}s?(x)"
		],
		env: {
		  jest: true
		}
	  }
	]
  };
  