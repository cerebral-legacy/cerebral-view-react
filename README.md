# cerebral-react
React View layer package for Cerebral

## The Cerebral Webpage is now launched
You can access the webpage at [http://christianalfoni.com/cerebral/](http://christianalfoni.com/cerebral/)

## Debugger
You can download the Chrome debugger [here](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb?hl=no).

## Install
`npm install cerebral-react`

## API
All examples are shown with ES6 syntax.

### Render the app
```js
// Your controller instance
import controller from './controller.js';
import React from 'react';
import {Container} from 'cerebral-react';

// Your main application component
import App from './components/App.js';

// With React 0.14 you can also write:
// <Container controller={controller}><App/></Container>
var appContainer = React.render(<Container controller={controller} app={App}/>, document.body);
```

`appContainer.refs.App` will contain reference to `App` component instance.

### Get state in components

#### Decorator
```js
import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';

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
import {HOC} from 'cerebral-react';

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
import {Mixin} from 'cerebral-react';

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

### Get components references

Using `Decorator` or `HOC` will wrap your component with `ComponentNameContainer`.
Container will have reference to component instance in `ComponentNameContainer.refs.Component`.

### Recording
```js
import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react-immutable-store';

@Cerebral()
class App extends React.Component {
  record() {
    this.props.recorder.record();
  }
  record() {
    this.props.recorder.stop();
  }
  play() {
    this.props.recorder.seek(0, true);
  }
  render() {
    return (
      <div>
        <button onClick={() => this.record()}>Record</button>
        <button onClick={() => this.stop()}>Stop</button>
        <button onClick={() => this.play()}>Play</button>
      </div>
    );
  }
}
```
