<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  // import Pullup from '@better-scroll/pull-up'
  // BScroll.use(Pullup)
    export default {
        name: "Scroll",
      props:{
        probeType:{
          type:Number,
          default:0
        },
        pullUpLoad:{
          type:Boolean,
          default:false
        }
      },
      data(){
        return{
          scroll:null
        }
      },
      mounted() {
          // 1.创建BScroll对象
          this.scroll=new BScroll(this.$refs.wrapper,{
            pullUpLoad: this.pullUpLoad,
            probeType: this.probeType,
            // pullUpLoad:true,
            click:true,
          })

           // 2.监听滚动的位置
        this.scroll.on('scroll',(position)=>{
          // console.log(position);

          // 把这个东西想办法传出去
          this.$emit('scroll',position)

          // 重新计算高度
          // this.scroll.refresh()
        })
        // 3.监听上拉事件
        this.scroll.on('pullingUp',()=>{
          // console.log('上拉加载更多');
          this.$emit('pullingUp')
        })
      },

      methods:{
        scrollTo(x,y,time=300){
            this.scroll && this.scroll.scrollTo(x,y,time)
        },
        finishPullUp(){
          this.scroll && this.scroll.finishPullUp()
        },
        refresh(){
          this.scroll && this.scroll.refresh()
        },
        getScrollY(){
          return this.scroll ? this.scroll.y:0
        }
      }
    }
</script>

<style scoped>

</style>
