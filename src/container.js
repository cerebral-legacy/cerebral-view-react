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
  overlays: {},
  overlaysContainer: null,
  componentWillMount: function () {
    var container = this;
    this.props.controller.on('flush', this.onCerebralUpdate);

    var container = this;
    window.addEventListener('cerebral.dev.componentMapPath', function (event) {
      container.updateOverlays(container.componentsMap[event.detail.mapPath]);
    })
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
    var start = Date.now();
    var componentsToRender = traverse(changes, [], []);
    componentsToRender.forEach(function (component) {
      component._update();
    })
    var end = Date.now();

    if (process.env.NODE_ENV !== 'production' && componentsToRender.length) {
      var container = this;
      var devtoolsComponentsMap = Object.keys(componentsMap).reduce(function (devtoolsComponentsMap, key) {
        devtoolsComponentsMap[key] = componentsMap[key].map(container.extractComponentName);
        return devtoolsComponentsMap;
      }, {})
      var event = new CustomEvent('cerebral.dev.components', {
        detail: {
          map: devtoolsComponentsMap,
          render: {
            start: start,
            duration: end - start,
            changes: changes,
            components: componentsToRender.map(container.extractComponentName)
          }
        }
      })
      window.dispatchEvent(event)
    }
  },
  renderOverlays: function () {
    if (this.isShowingOverlays) {
      return;
    }
    this.isShowingOverlays = true;
    var overlaysContainer = this.overlaysContainer;
    if (!overlaysContainer) {
      overlaysContainer = document.createElement('div');
      overlaysContainer.style.position = 'absolute';
      overlaysContainer.style.left = '0px';
      overlaysContainer.style.top = '0px';
      document.body.appendChild(overlaysContainer);
    }
    var overlays = this.overlays;
    ReactDOM.render(
      React.createElement('div', {
        id: 'cerebral_render_overlay',
        style: {
          opacity: 0,
          transition: 'opacity 0.5s ease-out',
          zIndex: 9999999999
        }
      }, overlays.map(function (overlay, index) {
        return React.createElement(Overlay, {key: index, overlay: overlay, index: index})
      })
    ), overlaysContainer);

    var container = this;
    setTimeout(function () {
      document.querySelector('#cerebral_render_overlay').style.opacity = 0.3;
    }, 10);
    setTimeout(function () {
      document.querySelector('#cerebral_render_overlay').style.opacity = 0;
      setTimeout(function () {
        ReactDOM.unmountComponentAtNode(overlaysContainer);
        container.isShowingOverlays = false;
      }, 500);
    }, 2000);
  },
  updateOverlays: function (componentsToRender) {

    var container = this;

    this.overlays = componentsToRender.map(function (component) {
      return {
        bounds: ReactDOM.findDOMNode(component).getBoundingClientRect(),
        offset: document.body.scrollTop
      };
    });

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
