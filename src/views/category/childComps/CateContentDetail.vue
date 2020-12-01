<template>
  <div>
    <grid-view>
      <goods-list v-for="(item, index) in categoryDetail" :key="index" :goods="item"></goods-list>
    </grid-view>
  </div>
</template>

<script>
  import GridView from "../../../components/common/gridView/GridView";
  import GoodsList from "../../../components/content/goods/GoodsList";
    export default {
      name: "CateContentDetail",
      props:{
        categoryDetail: {
          type: Array,
          default() {
            return []
          }
        }
      },
      components:{
        GoodsList,
        GridView,
      }
    }
</script>

<style scoped>

</style>
