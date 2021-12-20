export default {
  "nodeState:hover" (name, status, group) {
    // 根据index查找子节点
    const _item = group.getChildByIndex(0);
    // 获取样式
    const styles = _item.cfg.attrs;
    if(status) {
      // 设置的状态生效
      // attr(): 为元素设置样式
      _item.attr(styles[name]);
    } else {
      // 清除设置的状态
      _item.attr(styles['nodeState:default']);
    }
  },
  "nodeState:selected" (name, status, group) {
    // 根据index查找子节点
    const _item = group.getChildByIndex(0);
    // 获取样式
    const styles = _item.cfg.attrs;
    // 文本样式
    const text = group.get('children').filter(child => child.cfg.type === 'text')[0];
    if(status) {
      // attr(): 为元素设置样式
      _item.attr(styles[name]);
      // 设置文本样式
      if(styles[name].labelCfg) {
        text.attr(styles[name].labelCfg.style);
      }
    } else {
      _item.attr(styles['nodeState:default']);
      text.attr(styles['nodeState:default'].labelCfg.style);
    }
  }
}