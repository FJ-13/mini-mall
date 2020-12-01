<template>
    <div class="cart">
      <NavBar class="nav-bar">
        <div slot="center">购物车({{cartLength}})</div>
      </NavBar>
      <cart-list></cart-list>
      <cart-bottom-bar></cart-bottom-bar>
    </div>
</template>

<script>
  import CartBottomBar from "./childComps/CartBottomBar";
  import NavBar from "../../components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
// 这个方法仅仅是将store里的getter映射到局部计算属性
  import {mapGetters} from 'vuex'
    export default {
        name: "cart",
      components: {
        NavBar,
        CartList,
        CartBottomBar
      },
      computed:{
          // 可以把vuex里的getters里的方法直接在计算属性里使用
          ...mapGetters([
            'cartLength',
            'cartList'
          ])
      }
    }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
.nav-bar{
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}
</style>
