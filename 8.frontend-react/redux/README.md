# Redux
State management for ReactJS applications 👉 by [Flux](https://facebook.github.io/flux/docs/in-depth-overview/) design pattern

## Getting Started
1. At your frontend project:
```
yarn add @reduxjs/toolkit react-redux
```

2. Copy and past this `redux/` folder into your frontend project, under `src/` folder

3. Wrap your `<App>` component with `<Provider store={store}>...</Provider>`.

### Example (Simple):

```jsx
// src/index.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import store from 'src/redux/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

### Recommendation: Use `<Root>` Component
Pack all of your important application global settings in `<Root>` component, that `index.jsx` will bootstrap to `<div id="root">` at the DOM.

#### Example with [ErrorBoundary] and [ReactRouter] with [ConnectedRouter]:

```jsx
// src/components/Root.jsx

import React from 'react'
import Home from '../pages/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { ConnectedRouter } from 'connected-react-router'
import history from '../redux/store/history'
import routes from '../routes'
import PageNotFound from '../pages/PageNotFound'
import App from './App'
import ErrorBoundary from './ErrorBoundary'


export default function Root() {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Router>
                        <App>
                            <Switch>
                                <Route exact path={routes.HOME} component={Home} />
                                <Route path="*" component={PageNotFound} />
                            </Switch>
                        </App>
                    </Router>
                </ConnectedRouter>
            </Provider>
        </ErrorBoundary>
    )
}
```

[ErrorBoundary]: https://reactjs.org/docs/error-boundaries.html
[ReactRouter]: https://reactrouter.com/
[ConnectedRouter]: https://github.com/supasate/connected-react-router

## Links
- https://redux.js.org/
- https://redux-toolkit.js.org/

## Articles
- https://madasamy.medium.com/flux-vs-mvc-design-pattern-de134dfaa12b
- https://www.clariontech.com/blog/mvc-vs-flux-vs-redux-the-real-differences
- https://www.freecodecamp.org/news/an-introduction-to-the-flux-architectural-pattern-674ea74775c9/
