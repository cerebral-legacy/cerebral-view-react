import React from 'react';
import ReactDOM from 'react-dom';
import {Decorator, Container, Component} from './../index.js';
import Controller from 'cerebral';
import Model from 'cerebral-baobab';

const controller = Controller(Model({
  items: []
}));

controller.signal('test', function AddBar (input, state) {
  state.push('items', 'foo');
});

const App = Component((props) => (
  <div>
    <h1>Hello world!</h1>
    <button onClick={() => props.signals.test()}>Add to list</button>
    <List/>
  </div>
));

const List = Component({
  items: ['items']
}, {
  getInitialState() {
    return {
      doRender: true
    }
  },
  toggleRender() {
    this.setState({
      doRender: !this.state.doRender
    });
  },
  render() {
    console.log(this.props);
    return (
      <div>
        <button onClick={() => this.toggleRender()}>Toggle render</button>
        {
          this.state.doRender ?
            <ul>{this.props.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
          :
            null
        }
      </div>
    );
  }
});

const root = document.body.appendChild(document.createElement('div'));

ReactDOM.render(<Container controller={controller} app={App}/>, root);
