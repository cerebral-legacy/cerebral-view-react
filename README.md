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

### Connect your components

```js
import React from 'react';
import {connect} from 'cerebral-view-react';

export default connect(/* state map */{
  isLoading: 'isLoading',
  user: 'user',
  error: 'error'
},/* signals map */{
  appMounted: 'appMounted'
}, class App extends React.Component {
  componentDidMount() {
    this.props.appMounted();
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

If signals map is omitted, all signals will be exposed at `signals` prop.

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
}, {
  appMounted: 'appMounted'
})
class App extends React.Component {
  componentDidMount() {
    this.props.appMounted();
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

## Testing

If `process.env.NODE_ENV` set to "test" `connect` will not wrap your component and will return it as is, making it easy to test.
Be sure to use `webpack` (or similar) configured to eliminate unreachable code when making your production build.

Example mocha test

```js
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Application from '../components/application';
import HomePage from '../components/homepage';

describe('<Application />', () => {
  it('renders the <HomePage />', () => {
    const wrapper = shallow(<Application page="home" />);
    expect(wrapper.find(HomePage)).to.have.length.of(1);
  });
});
```
