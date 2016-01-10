# cerebral-view-react
React View layer package for Cerebral

## The Cerebral Webpage is now launched
You can access the webpage at [http://cerebraljs.com/](http://cerebraljs.com/)

## Debugger
You can download the Chrome debugger [here](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb?hl=no).

## Install
`npm install cerebral-view-react`

## API
All examples are shown with ES6 syntax.

### Render the app
```js
// Your controller instance
import controller from './controller.js';
import React from 'react';
import {Container} from 'cerebral-view-react';

// Your main application component
import App from './components/App.js';

// With React 0.14
React.render(
  <Container controller={controller}>
    <App/>
  </Container>
, document.querySelector('#app'));

// Earlier versions
React.render(<Container controller={controller} app={App}/>, document.querySelector('#app'));
```

### Get state in components

#### Decorator
```js
import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

@Cerebral({
  isLoading: ['isLoading'],
  user: ['user'],
  error: ['error']  
})
class App extends React.Component {
  componentDidMount() {
    this.props.signals.appMounted();
  }
  render() {
    return (
      <div>
        {this.props.isLoading ? 'Loading...' : 'hello ' + this.props.user.name}
        {this.props.error ? this.props.error : null}
      </div>
    );
  }
}
```
You can also use a function on your decorator:
```js
@Cerebral((props) => {
  return {
    item: ['items', props.itemRef]
  };
})
```

#### Higher Order Component
```js
import React from 'react';
import {HOC} from 'cerebral-view-react';

class App extends React.Component {
  componentDidMount() {
    this.props.signals.appMounted();
  }
  render() {
    return (
      <div>
        {this.props.isLoading ? 'Loading...' : 'hello ' + this.props.user.name}
        {this.props.error ? this.props.error : null}
      </div>
    );
  }
}

App = HOC(App, {
  isLoading: ['isLoading'],
  user: ['user'],
  error: ['error']  
});
```
You can also use a function on your HOC:
```js
App = HOC(App, (props) => {
  return {
    item: ['items', props.itemRef]
  };
});
```

#### Mixin
```js
import React from 'react';
import {Mixin} from 'cerebral-view-react';

const App = React.createClass({
  mixins: [Mixin],
  getStatePaths() {
    return {
      isLoading: ['isLoading'],
      user: ['user'],
      error: ['error']  
    };
  },
  componentDidMount() {
    this.props.signals.appMounted();
  },
  render() {
    return (
      <div>
        {this.state.isLoading ? 'Loading...' : 'hello ' + this.state.user.name}
        {this.state.error ? this.state.error : null}
      </div>
    );
  }
});
```

#### Component
```js
import {Component} from 'cerebral-view-react';

// Stateless
const MyStatelessComponent = Component({
  foo: ['foo']
}, (props) => (
  <h1>{props.foo}</h1>;
));

// Stateful
const MyStatefulComponent = Component({
  foo: ['foo']
}, {
  getInitialState() {
    return {
      bar: 'bar'
    }
  },
  render() {
    return <h1>{this.props.foo + this.state.bar}</h1>;
  }
});

// No Cerebral state. Same for stateful component
const MyStatelessComponent = Component((props) => (
  <h1>Hello world</h1>
));
```

You can also use a function to define state paths:

```js
const MyStatelessComponent = Component((props) => (
  {
    foo: ['foo', props.bar]
  }
), (props) => (
  <h1>{props.foo}</h1>;
));
```
