import customEvents from './custom_events'
export default (G6) => {
  // 自定义节点
  G6.registerNode('custom-node', {
    running: false,
    startAnimate(group) {
      if(this.running) return;
      this.running = true;
      group.toFront();

      let index = 0;
      const path = group.get('children')[0];
      const dashLine = group.addShape('path', {
        attrs: {
          startArrow: path.attrs.startArrow,
          endArrow: path.attrs.endArrow,
          path: [
            ['M', -50, 17],
            ['L', 50, 17],
            ['L', 50, -17],
            ['L', -50, -17],
            ['L', -50, 17],
          ],
          stroke: '#FFF',
        },
        name: 'edge-dash'
      })

      dashLine.animate(() => {
        index++;
        return {
          lineDash: [5, 12],
          lineDashOffset: -index,
          lineWidth: 2
        }
      }, {
        repeat: true,
        duration: 3000,
      });
    },
    stopAnimate(group) {
      const path = group.get('children').find(item => item.cfg.name === "edge-dash");
      if(path) {
        path.remove();
        this.running = false;
      }
    },
    // 用于绘制节点, 绘制文本等
    drawShape(cfg, group) {
      /**
       * groups: 节点分组, 包含节点配置, 锚点, 图标, 文本等shape
       * 1. 获取默认样式配置
       * 2. 添加shape
       * 3. 添加文本节点/锚点等
       * 4. return shape
       */
      const shape = group.addShape(
        'rect', // 继承内置节点的shape, 可选：rect、circle、ellipse、path等
        {
          attrs: {
            x: -cfg.width / 2,
            y: -cfg.height / 2,
            width: cfg.width,
            height: cfg.height,
            ...cfg.style,
          },
          name: 'rect-shape',
        }
      );
      // 自定义文本必须放在节点之后构建，否则会被节点覆盖
      group.addShape('text', {
        attrs: {
          fill: '#FFF',
          text: cfg.name,
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'middle',
        },
        name: 'text-shape'
      })

      const Item = group.get('children')[0];
      const bbox = Item.getBBox();
      cfg && cfg.anchorPoints.forEach((item, index) => {
        group.addShape('circle', {
          attrs: {
            x: bbox.width * (item[0] - 0.5),
            y: bbox.height * (item[1] - 0.5),
            shadowBlur: 2,
            fill: '#fff',
            stroke: '#aaa',
            r: 4
          },
          zIndex: index,
          nodeId: group.get('id'),
          draggable: true,
          isAnchor: true,
          index
        })
      })
      return shape;
    },
    afterDraw() {},
    // 更新节点样式配置等
    update() {},
    afterUpdate() {},
    // 设置节点状态, click/hover等
    setState(operation, status, item) {
      // 获取当前节点信息
      const group = item.getContainer();
      if(operation === 'nodeState:selected' && status) {
        this.startAnimate(group);
      } else if(operation === 'nodeState:selected' && !status) {
        this.stopAnimate(group);
      }
      // .call(): 将传入的几个参数链接到原始对象上this <-- operation, status, group
      customEvents[operation].call(this, operation, status, group);
    },
    // 获取当前节点的锚点坐标配置
    getAnchorPoints() {}
  }, 'rect');
}