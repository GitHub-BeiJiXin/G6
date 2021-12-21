<template lang="pug">
#main
  SideBar(@sidebarDrag="sidebarDrag")
  .app(ref="app" @drop="canvasDrop")
</template>

<script>
import { ref, defineComponent, defineAsyncComponent, onMounted, reactive } from 'vue';
import G6 from '@antv/g6';
import customNode from '../construct/custom_node';
import customEdge from '../construct/custom_edge'
import customBehavior from '../construct/custom_behavior';
export default defineComponent({
  components: {
    SideBar: defineAsyncComponent(() => import("./sidebar.vue")),
  },
  props: {
    msg: String
  },
  setup() {
    const app = ref();
    const graph = ref(null);
    // 数据源
    const dataSource = {
      nodes: [
        {
          id: 'node1',
          name: "节点1",
          x: 250,
          y: 100
        },
        {
          id: 'node2',
          name: "节点2",
          x: 200,
          y: 720
        },
        {
          id: 'node3',
          name: "节点3",
          x: 320,
          y: 220
        },
        {
          id: 'node4',
          name: "节点4",
          x: 400,
          y: 320
        }
      ],
      edges: [
        {
          source: 'node1',
          target: 'node2',
          label: "line-mess1",
          style: {
            endArrow: true
          }
        },
        {
          source: 'node1',
          target: 'node3',
          label: "line-mess2",
          style: {
            endArrow: true
          }
        },
        {
          source: 'node2',
          target: 'node4',
          label: "line-mess3",
          style: {
            endArrow: true
          }
        }
      ]
    }
    
    const settings = reactive({
      id: '',
      name: '',
      x: 0,
      y: 0,
      canvasOffsetX: 0,
      canvasOffsetY: 0,
      currentOffsetX: 0,
      currentOffsetY: 0
    })

    // 父子传值函数
    const sidebarDrag = (item) => {
      const { id, name, x, y } = item;
      settings.id = id;
      settings.name = name;
      settings.x = x;
      settings.y = y;
    }

    // 操作栏项放置时, 画布插入元素同时计算偏移量
    const canvasDrop = (event) => {
      graph.value.addItem("node", {
        label: settings.name,
        type: settings.name,
        size: [settings.x, settings.y],
        x: event.clientX - 80 - settings.currentOffsetX,
        y: event.clientY - settings.currentOffsetY,
        labelCfg: {
          style: {
            fill: '#fff'
          }
        },
        modes: {
          default: [
            'node-hover', // 自定义行为
            'node-click', // 自定义行为
            "edge-hover", // 自定义行为
          ]
        }
      })
    }

    // 默认画布事件
    const canvasEvent = () => {
      // 画布点击事件
      graph.value.on('click', () => {
        graph.value.findAllByState('node', 'nodeState:selected').forEach(item => graph.value.clearItemStates(item, false));
        graph.value.findAllByState('edge', 'edgeState:selected').forEach(item => graph.value.clearItemStates(item, false));
        graph.value.findAllByState('node', 'nodeState:hover').forEach(item => graph.value.clearItemStates(item, false));
        graph.value.findAllByState('edge', 'edgeState:hover').forEach(item => graph.value.clearItemStates(item, false));
      })
      // 1.canvas画布拖拽时, 计算偏移量
      // 1.1 画布拖动开始事件
      graph.value.on("dragstart", (event) => {
        settings.canvasOffsetX = event.clientX;
        settings.canvasOffsetY = event.clientY;
      })
      // 1.2 画布拖动结束事件
      graph.value.on("dragend", (event) => {
        settings.currentOffsetX = settings.currentOffsetX + event.clientX - settings.canvasOffsetX;
        settings.currentOffsetY = settings.currentOffsetY + event.clientY - settings.canvasOffsetY;
      })
      // 所有setItemState事件执行之前触发
      graph.value.on('beforeitemstatechange', () => {
        // graph.value.clearItemStates(event.item, false);
      })
    };

    // 线条事件
    const edgeEvent = () => {
      // graph.value.on('edge:click', event => {
      //   graph.value.setItemState(event.item, 'edgeState', 'selected');
      // });
      // graph.value.on('edge:mouseenter', event => {
      //   // 1.方法1, 使用get函数获取model, 然后借助graph.updateItem事件进行更改样式
      //   // const model = event.item.get('model').style.stroke = "#1890FF";
      //   // graph.value.updateItem(event.item, model);

      //   // 2.方法2, 使用graph.setItemState函数修改状态值, 进而实现样式绑定
      //   graph.value.setItemState(event.item, 'edgeState', 'selected');
      // });
      // graph.value.on('edge:mouseleave', event => {
      //   graph.value.clearItemStates(event.item, 'edgeState:selected');
      // });
    };

    // 节点事件, 使用自定义节点时, 属性值应更改为自定义行为设置的属性
    const nodeEvent = () => {
      // // 鼠标移入事件
      // graph.value.on('node:mouseenter', event => {
      //   graph.value.setItemState(event.item, 'hover', true);
      // })
      // // 鼠标移出事件
      // graph.value.on('node:mouseleave', event => {
      //   graph.value.setItemState(event.item, 'hover', false);
      // })
      // // 节点点击事件
      // graph.value.on('node:click', event => {
      //   graph.value.setItemState(event.item, 'click', true);
      // })
    };

    // 初始化Graph图
    const createGraph = () => {
      graph.value = new G6.Graph({
        container: app.value,
        width: window.innerWidth - 80,
        height: window.innerHeight,
        // fitView: false,
        // fitViewPadding: [20, 20, 20, 20],
        // fitCenter: true,
        // animate: true,
        layout: {
          type: ''
        },
        defaultNode: {
          type: 'custom-node',
          style: {
            fill: '#000',
            cursor: 'pointer',
            radius: 4
          },
          width: 100, // 自定义属性
          height: 35, // 自定义属性
          anchorPoints: [ // 自定义属性
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0.5, 0],
            [0.5, 1],
          ]
        },
        defaultEdge: {
          type: 'custom-edge',
          style: {
            cursor: 'pointer',
            lineWidth: 2,
            lineAppendWidth: 20, // 响应鼠标事件的范围
          },
          labelCfg: {
            position: 'center'
          }
        },
        nodeStateStyles: {
          "nodeState:selected": {
            fill: '#5698c3',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            shadowBlur: 5.5,
            shadowColor: '#8abcd1',
            lineWidth: 3,
            lineDash: [5, 2],
            labelCfg: {
              style: {
                fill: '#FFF',
                fontSize: 14
              }
            }
          },
          "nodeState:hover": {
            fill: '#5698c3',
            shadowColor: '#8abcd1',
            lineWidth: 2,
            lineDash: [5, 1],
          },
          "nodeState:default": {
            fill: 'black',
            cursor: 'pointer',
            radius: 4,
            labelCfg: {
              style: {
                fill: '#FFF',
                fontSize: 12
              }
            }
          }
        },
        edgeStateStyles: {
          'edgeState:selected': {
            stroke: '#8abcd1',
            lineWidth: 3,
          },
          click: {
            stroke: '#8abcd1',
            lineWidth: 3,
          }
        },
        modes: {
          default: [
            "drag-canvas", // 画布拖拽事件
            'zoom-canvas', // 画布缩放事件
            'drag-node', // 节点拖拽事件
            'brush-select', // 节点多选事件
            'node-hover', // 自定义行为
            'node-click', // 自定义行为
            "edge-hover", // 自定义行为
          ]
        }
      });
      nodeEvent();
      edgeEvent();
      canvasEvent();
      // 监听自定义事件
      graph.value.on('after-node-click', () => {
        // console.info(graph.value.findAllByState("node", "nodeState:selected"))
      })
      // data与render方法的结合, 渲染数据
      graph.value.read(dataSource);
    };

    // 自定义节点
    customNode(G6);
    // 自定义边
    customEdge(G6);
    // 自定义行为
    customBehavior();
    
    onMounted(() => {
      createGraph();
    })
    return {
      app,
      settings,
      canvasDrop,
      sidebarDrag
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
