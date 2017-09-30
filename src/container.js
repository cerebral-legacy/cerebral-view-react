/* global CustomEvent */
var React = require('react')
var cleanPath = require('./cleanPath')
var createReactClass = require('create-react-class')
var PropTypes = require('prop-types')

module.exports = createReactClass({
  propTypes: {
    controller: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    strict: PropTypes.bool
  },
  displayName: 'CerebralContainer',
  childContextTypes: {
    cerebral: PropTypes.object.isRequired
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
  componentDidMount: function () {
    this.onCerebralUpdate({}, true)
    this.props.controller.on('flush', this.onCerebralUpdate)
  },
  extractComponentName: function (component) {
    return component.constructor.displayName.replace('CerebralWrapping_', '')
  },
  onCerebralUpdate: function (changes, force) {
    var componentsMap = this.componentsMap
    var componentsMapKeys = Object.keys(componentsMap)
    var componentsToRender = []
    var start = Date.now()

    function traverse (level, currentPath, componentsToRender) {
      Object.keys(level).forEach(function (key) {
        currentPath.push(key)

        if (level[key] === true) {
          var stringPath = currentPath.join('.')
          componentsMapKeys.forEach(function (componentMapKey) {
            if (stringPath.indexOf(componentMapKey) === 0 || componentMapKey.indexOf(stringPath) === 0) {
              componentsToRender = componentsMap[componentMapKey].reduce(function (componentsToRender, component) {
                if (componentsToRender.indexOf(component) === -1) {
                  return componentsToRender.concat(component)
                }
                return componentsToRender
              }, componentsToRender)
            }
          })
        } else {
          componentsToRender = traverse(level[key], currentPath, componentsToRender)
        }
        currentPath.pop()
      })
      return componentsToRender
    }

    if (this.props.strict) {
      componentsToRender = componentsMapKeys.reduce(function (allComponents, componentMapKey) {
        var keyArray = componentMapKey.split('.')
        // app.user.**
        // app.user.name
        var shouldRender = keyArray.reduce(function (currentChangePath, key, index) {
          if (currentChangePath === true) {
            return currentChangePath
          } else if (!currentChangePath) {
            return false
          }

          if (key === '*' && index === keyArray.length - 1) {
            return true
          } else if (key === '**') {
            return true
          }

          return currentChangePath[key]
        }, changes) === true

        if (shouldRender) {
          allComponents = componentsMap[componentMapKey].reduce(function (componentsToRender, component) {
            if (componentsToRender.indexOf(component) === -1) {
              return componentsToRender.concat(component)
            }
            return componentsToRender
          }, allComponents)
        }

        return allComponents
      }, [])
    } else {
      componentsToRender = traverse(changes, [], [])
    }

    componentsToRender.forEach(function (component) {
      component.renderCount = 'renderCount' in component ? component.renderCount + 1 : 1
      component._update()
    })
    var end = Date.now()

    if (window && process.env.NODE_ENV !== 'production' && (componentsToRender.length || force)) {
      var container = this
      var devtoolsComponentsMap = Object.keys(componentsMap).reduce(function (devtoolsComponentsMap, key) {
        devtoolsComponentsMap[key] = componentsMap[key].map(function (component) {
          component.renderCount = 'renderCount' in component ? component.renderCount : 1
          return {
            name: container.extractComponentName(component),
            renderCount: component.renderCount
          }
        })
        return devtoolsComponentsMap
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
  registerComponent: function (comp, deps) {
    var strict = this.props.strict
    this.componentsMap = Object.keys(deps).reduce(function (componentsMap, dep) {
      var key = strict ? dep : cleanPath(dep)
      componentsMap[key] = componentsMap[key] ? componentsMap[key].concat(comp) : [comp]
      return componentsMap
    }, this.componentsMap)
  },
  updateComponent: function (comp, deps) {
    this.unregisterComponent(comp)
    this.registerComponent(comp, deps)
    comp._update()
  },
  unregisterComponent: function (comp) {
    var componentsMap = this.componentsMap
    Object.keys(componentsMap).forEach(function (key) {
      if (componentsMap[key].indexOf(comp) >= 0) {
        componentsMap[key].splice(componentsMap[key].indexOf(comp), 1)
      }
      if (componentsMap[key].length === 0) {
        delete componentsMap[key]
      }
    })
  },
  render: function () {
    return this.props.children
  }
})
