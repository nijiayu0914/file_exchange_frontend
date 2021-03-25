import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'mobx-react';
import store from './store/store';
import { HashRouter, Route, Switch } from "react-router-dom";
import { Login } from "./pages/Login/Login"
import { Repository } from "./pages/Repository/Repository"

ReactDOM.render(
  <React.StrictMode>
      <Provider {...store}>
          <HashRouter>
              <Switch>
                  <Route exact path="/" component={Repository} />
                  <Route path="/login" component={Login} />
                  <Route path="/repository" component={Repository} />
                  <Route render={() => <h1>404 not found 页面去火星了 ！</h1>} />
              </Switch>
          </HashRouter>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
