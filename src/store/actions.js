export default {
  addCart(context,payload){
    return new Promise((resolve,reject)=>{
      //payload新添加的商品
      //查找购物车是否已经有该商品
      let oldProduct=context.state.cartList.find(function (item) {
        return item.iid === payload.iid
      })
      if(oldProduct){
        context.commit('addCounter',oldProduct)
        resolve('当前的商品数量+1')
      }else {
        payload.count=1
        // context.state.cartList.push(payload)
        context.commit('addToCart',payload)
        resolve('添加了新的商品')
      }
  })
}
}
