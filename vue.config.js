module.exports={
    configureWebpack:{
        // 配置路径时用到resolve
        resolve:{
            // 配置别名
            alias:{
                // '@':'src'
                'assets':'@/assets',
                'common':'@/common',
                'components':'@/components',
                'network':'@/network',
                'view':'@/view'
                // 'router':'@/router',不需要配置router
                // 因为我们在其他组件里可以用this.$router拿到router
                // 'store':'@/store',不需要配置store
                // 因为我们在其他组件里可以用this.$store拿到store
            }
        }
    },
  devServer:{
      host:'0.0.0.0',
    hot:true,
    disableHostCheck:true
  }
}
