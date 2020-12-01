<template>
<div class="detail">
  <detail-nav-bar class="detail-nav"
                  @titleClick="titleClick"
                  ref="nav"></detail-nav-bar>
  <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
    <detail-swiper :top-images="topImages"></detail-swiper>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
    <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
    <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
    <goods-list ref="recommend" :goods="recommends"></goods-list>
  </scroll>
  <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
  <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  <toast :message="message" :show="show"></toast>
</div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "../../components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import BackTop from "../../components/content/backTop/BackTop";

  import Scroll from "../../components/common/scroll/Scroll";
  import Toast from "../../components/common/toast/Toast";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "../../network/detail";

  export default {
        name: "Detail",
      data(){
          return{
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo:{},
            paramInfo:{},
            commentInfo:{},
            recommends:[],
            themeTopYs:[],
            currentIndex:0,
            isShowBackTop:false,
            message:'',
            show:false
          }
      },
      components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        BackTop,
        Toast,

        Scroll
      },
      created() {
          // 1.通过路由拿到传过来的数据iid
          this.iid=this.$route.params.iid
        // 2.根据iid请求详情数据
        getDetail(this.iid).then(res=>{
          console.log(res);
          // 1.获取顶部轮播数据
          const data=res.result
          this.topImages=data.itemInfo.topImages
          // 获取商品信息
          this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
          // 获取店铺信息
          this.shop=new Shop(data.shopInfo)
          // 保持商品详情数据
          this.detailInfo=data.detailInfo
          // 获取参数信息
          this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)
          //获取用户评价
          // 保存评论信息
          if (data.rate.cRate!==0) {
            this.commentInfo = data.rate.list[0]
          }

          // // 等组件渲染完后，会回调一次$nextTick()
          // this.$nextTick(()=>{
          //   // 虽然dom被渲染出来，但是图片没有加载完
          //   this.themeTopYs=[]
          //
          //   this.themeTopYs.push(0);
          //   this.themeTopYs.push(this.$refs.param.$el.offsetTop);
          //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          //   console.log(this.themeTopYs);
          // })
        })
        // 3.请求推荐数据
        getRecommend().then(res=>{
          // console.log(res);
          this.recommends=res.data.list
        })
      },
    // updated() {
    //   this.themeTopYs=[]
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.param.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    // },
    methods:{
      imageLoad(){
            this.$refs.scroll.refresh()
            this.themeTopYs=[]

              this.themeTopYs.push(0);
              this.themeTopYs.push(this.$refs.param.$el.offsetTop);
              this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
              this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
              this.themeTopYs.push(Number.MAX_VALUE)
              // console.log(this.themeTopYs);
          },
      titleClick(index){
            this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
      },
      contentScroll(position){
        // console.log(position);
        // 获取y值
            const positionY=-position.y
        // 与主题的值对比
        for (let i=0;i<this.themeTopYs.length-1;i++){
          // // if (positionY>this.themeTopYs[i] && positionY<this.themeTopYs[i=1]) {}

          if(this.currentIndex!==i && (positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1])){
            this.currentIndex=i
            this.$refs.nav.currentIndex=this.currentIndex
          }
          // if(this.currentIndex!==i && ((i<this.themeTopYs.length - 1 && positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i=1]) || (i === this.themeTopYs.length-1 && positionY>=this.themeTopYs[i]))){
          //   this.currentIndex=i
          //   // console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex=this.currentIndex
          // }
        }
        //是否回到顶部
        this.isShowBackTop=(-position.y)>1000
      },
      //是否回到顶部
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      addToCart(){
        // console.log('----');
        //1.获取部分需要展示的商品信息
        const product={}
        product.image=this.topImages[0]
        product.title=this.goods.title
        product.desc=this.goods.desc
        product.price=this.goods.realPrice
        product.iid=this.iid
        //2.将商品添加到购物车，此时采用vuex将我们需要保持的数据添加到vuex中，在多个界面共享
        // this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product).then(res=>{
          // this.show=true
          // this.message=res
          //
          // setTimeout(()=>{
          //   this.show=false
          //   this.message=''
          // },1000)
          this.$toast.show(res,2000)
        })
      }
    }
  }
</script>

<style scoped>
.detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
  .content{
    height: calc(100% - 44px - 49px);
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
