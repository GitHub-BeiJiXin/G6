export default (G6) => {
  G6.registerEdge('custom-edge', {
    running: false,
    // 开始动画
    startAnimate(group) {
      if(this.running) return;
      this.running = true;
      group.toFront();

      let index = 0;
      const path = group.get('children')[0];
      const dashLine = group.addShape('path', {
        attrs: {
          // startArrow: path.attrs.startArrow,
          // endArrow: path.attrs.endArrow,
          // offset: path.attrs.offset,
          path: path.attrs.path, 
          stroke: "#FFF",
        },
        name: 'edge-dash'
      })

      // 添加动画
      dashLine.animate(() => {
        index++;

        return {
          lineDash: [5, 12],
          lineDashOffset: -index,
          lineWidth: 2
        }
      }, {
        repeat: true,
        duration: 3000
      });
    },
    // 结束动画
    stopAnimate(group) {
      const path = group.get('children').find(item => item.cfg.name === 'edge-dash' );
      if(path) {
        path.remove();
        this.running = false;
      }
    },
    setState(operation, status, item) {
      // 获取元素的容器
      const group = item.getContainer();
      if(operation === "edgeState:hover" && status) {
        this.startAnimate(group);
      } else if(operation === 'edgeState:hover' && !status) {
        this.stopAnimate(group);
      }
    } 
  }, 'polyline')
}