<template lang="pug">
.sidebarMain
  .operation(v-for="item in dataSource", draggable="true", :data-source="item.name" :id="item.id", @dragstart="drag(item)")
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(props, { emit }) {
    const dataSource = [
      {
        id: "circle",
        name: "circle",
        x: 60,
        y: 60
      },
      {
        id: "rect",
        name: "rect",
        x: 100,
        y: 30
      },
      // {
      //   id: "square",
      //   name: "square",
      // },
    ];
    const drag = (item) => {
      emit("sidebarDrag", item);
    }
    return {
      drag,
      dataSource
    }
  },
})
</script>
<style lang="stylus" scoped>
.sidebarMain
  width: 80px
  min-width: 80px
  padding-left: 18px
  height: 100vh
  display: flex
  flex-direction: column
  border-bottom: 2px solid #ABC
  border-right: 2px solid #ABC
  box-shadow: 2px 2px 3px 1px #ABC
  >span 
    font-weight: 600
    font-family: '微软雅黑' 
    margin-top: 10px 
#circle
  width:50px;
  height:50px;
  border-radius:100px;
#rect
  width:50px;
  height:25px;
#square
  width:50px;
  height:50px;
#triangle
  width:0;
  height:0;
  border-top:50px transparent solid;
  border-right:50px #c4cbcf solid;
#circle,#rect,#square
  margin: 12px
  margin-bottom: 5px
  border: double 2px #BBB
  box-shadow: 2px 2px 4px 1px #ABC
  background:#c4cbcf;
</style>
