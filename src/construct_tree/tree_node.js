export default (G6) => {
  G6.registerNode('rect-tree', {
    draw(cfg, group) {
      const shape = group.addShape('rect', {
        attrs: {
          x: -cfg.width / 2,
          y: -cfg.height / 2,
          width: cfg.width,
          height: cfg.height,
          ...cfg.style,
        },
        name: "tree-rect"
      })

      group.addShape('text', {
        attrs: {
          text: cfg.name,
          fill: "#00B277",
          fontSize: 14,
          textAlign: 'center',
          textBaseline: 'middle'
        },
        zIndex: 1,
        name: "tree-text"
      })

      if(cfg.children) {
        group.addShape('circle', {
          attrs: {
            r: 8,
            fill: '#FFF',
            stroke: '#AAA',
            x: cfg.width / 2 + 15,
          },
          name: 'tree-node-icon'
        })

        group.addShape('text', {
          attrs: {
            text: '-',
            fontSize: 24,
            fill: 'black',
            cursor: 'pointer',
            x: cfg.width / 2 + 10,
            y: 13,
          },
          name: 'tree-node-icon-text'
        })
      }
      return shape;
    },
    update(cfg, node) {
      const group = node.getContainer();
      const children = group.get('children');
      const icon = children.find(child => child.cfg.name === 'tree-node-icon-text');
      
      if(icon) {
        icon.attr({
          text: cfg.collapsed? '+': '-',
          x: cfg.width / 2 + 6
        })
      }
    }
  }, 'rect')
}