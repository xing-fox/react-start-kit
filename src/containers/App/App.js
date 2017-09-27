import React from 'react';
import { asyncConnect } from 'redux-async-connect';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

@asyncConnect([{
  promise: () => {
    const promises = [];
    return Promise.all(promises);
  }
}])
export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    userAgent: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
