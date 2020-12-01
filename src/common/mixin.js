import BackTop from "../components/content/backTop/BackTop";

// 回到顶部按钮
export const backTopMixin={
  components:{
    BackTop
},
  data(){
    return{
      isShowBackTop:false
    }
  },
  methods:{
    backTop(){
      this.$refs.scroll.scrollTo(0,0,300)
    },
  }
}
