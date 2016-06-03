var React = require('react');
var ReactDOM = require('react-dom');
var Overlay = require('./Overlay');

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
        updateComponent: this.updateComponent,
        shouldShowRenderOverlays: this.shouldShowRenderOverlays
      }
    }
  },
  componentsMap: {},
  showRenderOverlays: JSON.parse(localStorage.getItem('cerebral_showRenderOverlays')),
  overlays: {},
  overlaysContainer: null,
  componentWillMount: function () {
    var container = this;
    this.props.controller.on('flush', this.onCerebralUpdate);

    var container = this;
    window.addEventListener('cerebral.dev.componentMapPath', function (event) {
      container.updateOverlays(container.componentsMap[event.detail.mapPath]);
    })
    window.addEventListener('cerebral.dev.toggleShowRenderOverlays', function () {
      container.showRenderOverlays = !container.showRenderOverlays
      container.updateOverlays([]);
    })
  },
  shouldShowRenderOverlays: function () {
    return this.showRenderOverlays;
  },
  extractComponentName: function (component) {
    return component.constructor.displayName.replace('CerebralWrapping_', '');
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

    if (process.env.NODE_ENV !== 'production') {
      var container = this;
      var devtoolsComponentsMap = Object.keys(componentsMap).reduce(function (devtoolsComponentsMap, key) {
        devtoolsComponentsMap[key] = componentsMap[key].map(container.extractComponentName);
        return devtoolsComponentsMap;
      }, {})
      var event = new CustomEvent('cerebral.dev.componentsMap', {
        detail: devtoolsComponentsMap
      })
      window.dispatchEvent(event)
      this.updateOverlays(componentsToRender);
    }
  },
  renderOverlays: function () {
    if (!this.overlaysContainer) {
      this.overlaysContainer = document.createElement('div');
      this.overlaysContainer.style.position = 'fixed';
      document.body.appendChild(this.overlaysContainer);
    }
    var overlays = this.overlays;
    ReactDOM.render(
      React.createElement('div', {
        style: {
          position: 'fixed',
          zIndex: 9999999999
        }
      }, Object.keys(overlays).map(function (key, index) {
          var position = key.split('.');
          return React.createElement('div', {
            key: index,
            style: {
              position: 'fixed',
              display: 'flex',
              right: position[0] + 'px',
              top: position[1] + 'px',
              paddingTop: '5px'
            }
          }, overlays[key].map(function (overlay, index) {
              return React.createElement(Overlay, {key: index, overlay: overlay})
            })
          )
        }
      )
    ), this.overlaysContainer);
  },
  updateOverlays: function (componentsToRender) {

    if (!this.showRenderOverlays) {
      this.overlays = {};
    } else {
      var container = this;

      this.overlays = Object.keys(this.componentsMap).reduce(function (data, mapKey) {
        container.componentsMap[mapKey].forEach(function (component) {
          if (data.components.indexOf(component) === -1) {
            var bounds = ReactDOM.findDOMNode(component).getBoundingClientRect();
            var key = [bounds.left, bounds.top].join('.');
            data.overlays[key] = data.overlays[key] || [];
            data.overlays[key].push({
              shouldRender: componentsToRender.indexOf(component) !== -1,
              name: container.extractComponentName(component)
            });
            data.components.push(component);
          }
        });
        return data;
      }, {
        components: [],
        overlays: {}
      }).overlays;  
    }

    this.renderOverlays();

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
    comp._update();
  },
  unregisterComponent: function (comp) {
    var componentsMap = this.componentsMap;
    Object.keys(componentsMap).forEach(function (key) {
      if (componentsMap[key].indexOf(comp) >= 0) {
        componentsMap[key].splice(componentsMap[key].indexOf(comp), 1);
      }
      if (componentsMap[key].length === 0) {
        delete componentsMap[key];
      }
    });
  },
  render: function () {
    return React.DOM.div(this.props);
  }
})
