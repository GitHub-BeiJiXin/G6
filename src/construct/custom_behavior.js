import G6 from '@antv/g6';
export default () => {
  G6.registerBehavior("node-hover", {
    getEvents() {
      return {
        "node:mouseenter": "onMouseEnter",
        "node:mouseleave": "onMouseLeave"
      }
    },
    onMouseEnter(ev) {
      // 显示当前节点的锚点
      ev.item.setState("nodeState:hover", true); // 二值状态
    },
    onMouseLeave(ev) {
      // 隐藏锚点
      ev.item.setState("nodeState:hover", false); // 二值状态
    }
  });

  G6.registerBehavior("node-click", {
    getEvents() {
      return {
        "node:mousedown": "onMouseDown",
        "node:click": "onMouseClick"
      }
    },
    // 清除所有已选
    _clearSelected() {
      const selectedNode = this.graph.findAllByState("node", "nodeState:selected");
      selectedNode.forEach(node => {
        node.clearStates(['nodeState:selected', "nodeState:hover"])
      })
    },
    onMouseDown(ev) {
      ev.item.toFront(); // 此方法可将元素置于最顶部, 等同于zIndex
    },
    onMouseClick(ev) {
      // this._clearSelected();
      // 获取被点击的节点元素对象, 设置当前节点的 click 状态为 selected
      // ev.item.setState("nodeState", 'selected'); // 可使用多类型状态
      ev.item.setState("nodeState:selected", true); // 二值状态
      console.info(ev)
      // 将事件发送给graph实例
      this.graph.emit('after-node-click', ev); // 抛出数据, 参数1为自定义名称
    }
  })

  G6.registerBehavior('edge-hover', {
    getEvents() {
      return {
        "edge:mouseenter": "onMouseEnter",
        "edge:mouseleave": "onMouseLeave",
      }
    },
    onMouseEnter(ev) {
      ev.item.setState("edgeState:hover", true);
    },
    onMouseLeave(ev) {
      ev.item.setState("edgeState:hover", false);
    }
  })
}