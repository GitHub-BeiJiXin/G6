<template lang="pug">
.app(ref="app")
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue';
import G6 from '@antv/g6';
import treeNode from '../construct_tree/tree_node'
import treeEdge from '../construct_tree/tree_edge'
export default defineComponent({
  props: {
    msg: String
  },
  setup() {
    const app = ref();
    const graph = ref(null);
    // 数据源
    const dataSource = {
      id: 'sub1',
      name: "sub1",
      label: '①',
      children: [
        {
          id: 'subTree1',
          name: "subTree1",
          children: [
            {
              id: 'children1',
              name: "children1",
            },
            {
              id: 'children2',
              name: "children2",
            },
            {
              id: 'children3',
              name: "children3",
            },
            {
              id: 'children4',
              name: "children4",
            }
          ]
        },
        {
          id: 'subTree2',
          name: "subTree2",
          children: [
            {
              id: 'children5',
              name: "children5",
              children: [
                {
                  id: 'children8',
                  name: 'children8'
                }
              ]
            },
            {
              id: 'children6',
              name: "children6",
            },
            {
              id: 'children7',
              name: "children7",
              children: [
                {
                  id: 'children9',
                  name: 'children9'
                }
              ]
            }
          ]
        }
      ]
    };

    // 初始化Graph图
    const createGraph = () => {
      graph.value = new G6.TreeGraph({
        container: app.value,
        width: window.innerWidth,
        height: window.innerHeight,
        fitView: true, // 视图居中
        maxZoom: 1, // 设置缩放比为1：1
        defaultNode: {
          type: 'rect-tree',
          width: 100,
          height: 30,
          style: {
            fill: "#E6E6E6",
            stroke: '#A4A4A4',
            shadowColor: "#A4A4A4",
            shadowBlur: 5,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            radius: 4
          },
          labelCfg: {
            style: {
              fill: '#FFF'
            }
          }
        },
        defaultEdge: {
          type: 'edge-tree'
        },
        layout: {
          type: 'mindmap',
          getHGap: () => 100,
          getVGmap: () => 30
        },
        modes: {
          default: [
            'drag-node',
            'drag-canvas',
            'tree-behavior'
          ],
        },
      });
      // 自定义树图边
      treeEdge(G6);
      // 自定义树图节点
      treeNode(G6);
      // 自定义树图行为
      graph.value.on('node:click', (ev)=>{
        const model = ev.item.getModel();
        if(ev.target.cfg.name === 'tree-node-icon-text') {
          model.collapsed = !model.collapsed;
          graph.value.updateItem(ev.item, model);
          graph.value.layout();
        }
      })
      // data与render方法的结合, 渲染数据
      graph.value.data(dataSource);
      graph.value.render();
    };
    
    onMounted(() => {
      createGraph();
    })
    return {
      app,
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>
#main
  display: flex;
  justify-content: center
</style>
