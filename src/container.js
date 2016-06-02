var React = require('react');

module.exports = React.createClass({
  displayName: 'CerebralContainer',
  childContextTypes: {
    cerebral: React.PropTypes.object.isRequired
  },
  getChildContext: function () {
    return {
      cerebral: {
        controller: this.props.controller,
        registerComponent: this.registerComponent,
        unregisterComponent: this.unregisterComponent,
        updateComponent: this.updateComponent
      }
    }
  },
  componentsMap: {},
  componentWillMount: function () {
    this.props.controller.on('flush', this.onCerebralUpdate);
  },
  onCerebralUpdate: function (changes) {
    var componentsMap = this.componentsMap;
    function traverse(level, currentPath, componentsToRender) {
      Object.keys(level).forEach(function (key) {
        currentPath.push(key);
        var stringPath = currentPath.join('.');
        if (componentsMap[stringPath]) {
          componentsToRender = componentsMap[stringPath].reduce(function (componentsToRender, component) {
            if (componentsToRender.indexOf(component) === -1) {
              return componentsToRender.concat(component);
            }
            return componentsToRender;
          }, componentsToRender)
        }
        if (level[key] !== true) {
          componentsToRender = traverse(level[key], currentPath, componentsToRender);
        }
        currentPath.pop();
      });
      return componentsToRender;
    }
    var componentsToRender = traverse(changes, [], []);
    componentsToRender.forEach(function (component) {
      component._update();
    })
  },
  registerComponent: function (comp, deps) {
    this.componentsMap = Object.keys(deps).reduce(function (componentsMap, key) {
      componentsMap[key] = componentsMap[key] ? componentsMap[key].concat(comp) : [comp];
      return componentsMap;
    }, this.componentsMap);
  },
  updateComponent: function (comp, deps) {
    this.unregisterComponent(comp);
    this.registerComponent(comp, deps);
  },
  unregisterComponent: function (comp) {
    var componentsMap = this.componentsMap;
    Object.keys(componentsMap).forEach(function (key) {
      if (componentsMap[key].indexOf(comp) >= 0) {
        componentsMap[key].splice(componentsMap[key].indexOf(comp), 1);
      }
    });
  },
  render: function () {
    return React.DOM.div(this.props);
  }
})
