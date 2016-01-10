import React from 'react';
import ReactDOM from 'react-dom';
import {Decorator as Cerebral, Container, Link} from './../index.js';
import Controller from 'cerebral';
import Router from 'cerebral-router';
import Model from 'cerebral-model-baobab';

const controller = Controller(Model({
  items: []
}));

controller.signals({
  'test': [function AddBar ({state}) {
    state.push(['items'], 'foo');
  }]
});

Router(controller, {
  '/': 'test'
});

const computeSuper = function (get) {
  return get(['items']).map(function (item) {
    return item.toUpperCase();
  })
}

@Cerebral()
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

@Cerebral({
  items: ['items'],
  test: ['test'],
  super: computeSuper
})
class List extends React.Component {
  constructor() {
    super();
    this.state = {
      doRender: true
    };
  }
  toggleRender() {
    this.setState({
      doRender: !this.state.doRender
    });
  }
  render() {
    console.log(this.props);
    return (
      <div>
        <Link signal={this.props.signals.test}>hey</Link>
        <button onClick={() => this.toggleRender()}>Toggle render</button>
        {
          this.state.doRender ?
            <ul>{this.props.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
          :
            null
        }
        <ul>{this.props.super.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
    );
  }
}

List.defaultProps = {
  test: 'foo'
};

const root = document.body.appendChild(document.createElement('div'));

ReactDOM.render(
  <Container controller={controller}>
    <App/>
  </Container>, root);
