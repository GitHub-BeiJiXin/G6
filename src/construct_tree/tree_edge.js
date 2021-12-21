export default (G6) => {
  G6.registerEdge('edge-tree', {
    draw(cfg, group) {
      const xOffset = 30;
      const { startPoint, endPoint } = cfg;
      const pointOffset = endPoint.y - startPoint.y;
      const isOffset = pointOffset === 0 ? true: false;

      let path = []
      let lineDash = [];
      if(isOffset) {
        path = [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x + 10, endPoint.y]
        ]
      } else {
        path = [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x + xOffset, startPoint.y],
          ['L', startPoint.x + xOffset, startPoint.y],
          ['L', startPoint.x + xOffset, endPoint.y],
          ['L', endPoint.x, endPoint.y]
        ];
        lineDash = [12, 3]
      }

      const shape = group.addShape('path', {
        attrs: {
          path,
          stroke: !isOffset? "#00B277": "#00BFFF",
          lineDash,
          lineWidth: 1.5,
          endArrow: !isOffset? false: {
            path: G6.Arrow.vee(15, 20, 16),
            d: 25
          },
          ...cfg
        },
        name: "tree-edge"
      })
      return shape;
    }
  })
}