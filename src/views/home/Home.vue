<template>
    <div id="home">
      <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl1"
                   class="tab-content"
                   v-show="isTabFixed"></tab-control>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <home-recommend-view :recommends="recommends"></home-recommend-view>
        <home-feature-view></home-feature-view>
        <tab-control :titles="['流行','新款','精选']"
                     @tabClick="tabClick"
                     ref="tabControl2" ></tab-control>
        <goods-list :goods="showGoods"></goods-list>
      </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

    </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import HomeFeatureView from "./childComps/HomeFeatureView";

  import NavBar from "../../components/common/navbar/NavBar";
  import TabControl from "../../components/content/tabControl/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import Scroll from "../../components/common/scroll/Scroll";
  import BackTop from "../../components/content/backTop/BackTop";

  import {getHomeMultidata,getHomeGoods} from "../../network/home";


  export default {
        name: "Home",
    data(){
          return{
            banners: [],
            recommends: [],
            goods:{
              'pop':{page:0,list:[]},
              'new':{page:0,list:[]},
              'sell':{page:0,list:[]},
            },
            currentType:'pop',
            isShowBackTop:false,
            tabOffsetTop:0,
            isTabFixed:false,
            saveY:0,
          }
    },
    computed:{
          showGoods(){
            return this.goods[this.currentType].list
          }
    },
      components:{
        HomeSwiper,
        HomeRecommendView,
        HomeFeatureView,

        NavBar,
        TabControl,
        GoodsList,
        Scroll,
        BackTop
      },
    created() {
          // 1.请求多个数据
      this.getHomeMultidata()
      //请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
          // 保存y值
      this.saveY=this.$refs.scroll.getScrollY()
      // 取消全局事件监听
      // console.log(this.saveY);

    },
    mounted() {
          // const refresh=this.debounce(this.$refs.scroll.refresh,50)
      //1.监听图片加载完成
      this.$bus.$on('itemImageLoad',()=>{
        this.$refs.scroll.refresh()
      })

    },
    methods:{

          // debounce(func,delay){
          //   let timer=null
          //   return function (...args) {
          //     if (timer) clearTimeout(timer)
          //     timer=setTimeout(()=>{
          //       func.apply(this,args)
          //     },delay)
          //   }
          // },
      /*
      * 事件监听相关方法
      * */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType='pop'
            break
          case 1:
            this.currentType='new'
            break
          case 2:
            this.currentType='sell'
            break
        }
        this.$refs.tabControl1.currentIndex=index
        this.$refs.tabControl2.currentIndex=index
      },
          /*
          * 网络请求相关方法
          * */
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          // console.log(res);//在这个函数执行完后，这个数据会被回收，使用我们用result储存起来
          this.banners=res.data.banner.list
          this.recommends=res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page=this.goods[type].page+1
        getHomeGoods(type,page).then(res=>{
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position){
        // 1.判读BackTop是否显示
        this.isShowBackTop=(-position.y)>1000
        // 2.决定tabControl是否吸顶(position=fixed)
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        //2.获取tabControl的offsetTop
        // 所以的组件都有一个属性$el:用户用户获取组件中的元素
        this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop
      }
    }
  }
  // let totalNums=[]
  //
  // const nums1=[10,20,30]
  // const nums1=[111,222,333]

  // for (let n of nums1){
  //   totalNums.push(n)
  // }
  // 特殊语法对数组进行解析，将元素一个一个提出来，在push到数组里
  // totalNums.push(...nums1)
</script>

<style scoped>
  #home{
    position: relative;
    /*padding-top: 44px;*/
    /*视口高度*/
    height: 100vh;
  }
.home-nav{
  background-color: var(--color-tint);
  color: #fff;
  /*在使用浏览器原生滚动式，一下属性是不然导航跟随疫情滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}
  /*  !*不起作用*!*/
  /*.tab-control{*/
  /*  !*position: sticky;*!*/
  /*  !*top: 44px;*!*/
  /*  background-color: #fff;*/
  /*  z-index: 9;*/
  /*}*/
  /*.content{*/
  /*  height: calc(100%-);*/
  /*  overflow: hidden;*/
  /*}*/
  .content{
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-content{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

</style>
