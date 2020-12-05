module.exports = {
  // 配置要使用的postCSS插件
  plugins: {
    // VueVLI中已经配置了autoprefixer
    // autoprefixer: {
    //   // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 将px转为rem
    'postcss-pxtorem': {
      // lib-flexible 的REM适配方案,把一行分为十行,每一行就是十分之一
      // 所以rootValue的值应该设置为设计稿宽度的十分之一
      // Vant建议设置为37.5,因为Vant是基于375写的
      // 所以必须设置为37.5,但是使用设计稿的时候需要除以2
      // 如果是Vant 的样式,就按照37.5来转换,如果是我们自已的样武，就按照75来转换
      // rootValue支持两种类型  数字  函数
      // postcss-pxtorem 处理每个css文件的时候都会调用这个函数,会把处理的css文件的相关信息通过参数传递给该函数
      rootValue({ file }) {
        // console.log('处理的css文件', file)
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的css属性  *表示所有
      propList: ['*'],
      // 配置不用转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
