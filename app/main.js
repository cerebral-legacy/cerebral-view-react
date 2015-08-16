import React from 'react';
import {Decorator, Container} from './../index.js';
import Controller from 'cerebral';
import Model from 'cerebral-immutable-store';


const controller = Controller(Model({
  list: ['foo'],
  foo: 'bar'
}));

controller.signal('test', function AddBar (args, state) {
  state.push('list', 'bar');
});

@Decorator({
  foo: ['foo']
})
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        <button onClick={() => this.props.signals.test()}>Add to list</button>
        <List/>
      </div>
    );
  }
}

@Decorator({
  list: ['list']
})
class List extends React.Component {
  render() {
    return <ul>{this.props.list.map((item, i) => <li key={i}>{item}</li>)}</ul>;
  }
}

React.render(<Container controller={controller} app={App}/>, document.body);
