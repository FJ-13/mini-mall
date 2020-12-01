<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-check="isSelectAll"
                    class="check-button" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算：({{checklength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "../../../components/content/checkButton/CheckButton";
    export default {
        name: "CartBottomBar",
      components:{
          CheckButton
      },
      computed:{
    totalPrice(){
      return '￥' + this.$store.state.cartList.filter(item=>{
        return item.checked
      }).reduce((preValue,item)=>{
        return preValue+item.price*item.count
      },0).toFixed(2)
    },
    checklength(){
      return this.$store.state.cartList.filter(item=>item.checked).length
    },
    isSelectAll(){
      // return  !(this.$store.state.cartList.filter(item => !item.checked).length)
      if(this.$store.state.cartList.length === 0) return false
      return  !this.$store.state.cartList.find(item=> !item.checked)
    }
  },
      methods:{
        checkClick(){
          if(this.isSelectAll){
            this.$store.state.cartList.forEach(item=>item.checked=false)
          }else {
            this.$store.state.cartList.forEach(item=>item.checked=true)
          }
        },
        calcClick(){
          if (!this.isSelectAll){
            this.$toast.show('请选择购买商品',2600)
          }
        }
      }
    }
</script>

<style scoped>
  .bottom-bar{
    display: flex;
    height: 40px;
    background-color: #eee;
    position: relative;
    line-height:40px ;
    font-size: 14px;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-button{
    width: 23px;
    height: 26px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price{
    flex: 1;
    margin-left: 20px;
  }
  .calculate{
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
