import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
    App,
    NotFound,
    Home,
    OrderGoods
  } from 'containers';

export default () => {
  return (
    <Route path="_react_" component={App}>
      <IndexRoute component={Home}/>
      <Route path="order_goods/mobile">
        <Route path="order" component={OrderGoods} />
      </Route>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
