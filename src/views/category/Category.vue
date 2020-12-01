<template>
  <div class="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <cate-menu :categories="categories" @selectItem="selectItem"></cate-menu>
      <scroll class="tab-content" ref="scroll" :data="[categoryData]">
        <cate-content :subcategories="showSubcategory"></cate-content>
        <tab-control :titles="['综合', '新品', '销量']"
                     @itemClick="tabClick"
                     ref="tabControl"></tab-control>
        <cate-content-detail :category-detail="showCategoryDetail"></cate-content-detail>
      </scroll>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  import CateMenu from "./childComps/CateMenu";
  import CateContent from "./childComps/CateContent";
  import TabControl from "../../components/content/tabControl/TabControl";
  import CateContentDetail from "./childComps/CateContentDetail";

  import Scroll from "../../components/common/scroll/Scroll";

  import {getCategory,getSubcategory,getCategoryDetail} from "../../network/category";

  export default {
    name: "category",
    components:{
      NavBar,
      CateMenu,
      CateContent,
      TabControl,
      CateContentDetail,

      Scroll
    },
    data(){
      return{
        categories:[],
        categoryData:{},
        currentIndex:-1,
        currentType:'pop'
      }
    },
    activated() {
      this.$refs.scroll.refresh()
    },
    created() {
      // 请求分类数据
      this._getCategory()
    },
    computed: {
      showSubcategory() {
        if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail() {
        if (this.currentIndex === -1) return []
        return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    methods:{
      _getCategory() {
        getCategory().then(res => {
          // 1.获取分类数据
          this.categories = res.data.category.list
          // 2.初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求第一个分类的数据
          this._getSubcategories(0)
        })
      },
      _getSubcategories(index) {
        this.currentIndex = index;
        const mailKey = this.categories[index].maitKey;
        getSubcategory(mailKey).then(res => {
          this.categoryData[index].subcategories = res.data
          this.categoryData = {...this.categoryData}
          this._getCategoryDetail('pop')
          this._getCategoryDetail('sell')
          this._getCategoryDetail('new')
        })
      },
      _getCategoryDetail(type) {
        // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {
          // 3.将获取的数据保存下来
          this.categoryData[this.currentIndex].categoryDetail[type] = res
          this.categoryData = {...this.categoryData}
        })
      },
      /**
       * 事件响应相关的方法
       */
      selectItem(index) {
        this._getSubcategories(index)
      },
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
        this.$refs.tabControl.currentIndex=index
      },
    }
  }
</script>

<style scoped>
  .category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }
  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;
    overflow: hidden;
    display: flex;
  }

  .tab-content {
    height: 100%;
    flex: 1;
  }
</style>
