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

// With React 0.14+
React.render(
  <Container controller={controller}>
    <App/>
  </Container>
, document.querySelector('#app'));
```

### Get state in components

```js
import React from 'react';
import {connect} from 'cerebral-view-react';

export default connect({
  isLoading: 'isLoading',
  user: 'user',
  error: 'error'
}, class App extends React.Component {
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
})
```

You can use passed props in path definition by passing a function:
```js
connect((props) => ({
  item: `items.${props.itemRef}`
}), Component)
```

Decorator syntax is supported as well:
```js
@connect({
  isLoading: 'isLoading',
  user: 'user',
  error: 'error'
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
