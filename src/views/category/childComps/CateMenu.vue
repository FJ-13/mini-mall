<template>
    <scroll class="menu" ref="scroll">
      <div class="cate-menu">
        <div class="cate-menu-item"
             v-for="(item,index) in categories"
             :key="index"
             :class="{active:index===currentIndex}"
             @click="itemClick(index)">
          {{item.title}}
        </div>
      </div>
    </scroll>
</template>

<script>
  import Scroll from "../../../components/common/scroll/Scroll";
    export default {
      name: "CateMenu",
      data(){
        return{
          currentIndex:0
        }
      },
      components:{
        Scroll
      },
      props:{
          categories:{
            type:Array,
            default:[]
          }
      },
      activated() {
        this.$refs.scroll.refresh()
      },
      methods:{
        itemClick(index){
          this.currentIndex = index
          this.$emit('selectItem', index)
        }
      }
    }
</script>

<style scoped>
.menu{
  background-color: #f6f6f6;
  height: 100%;
  width: 100px;
  box-sizing: border-box;
}
  .cate-menu-item{
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
  }
  .cate-menu-item.active {
    font-weight: 700;
    color: var(--color-high-text);
    background-color: #fff;
    border-left: 3px solid var(--color-high-text);
  }
</style>
