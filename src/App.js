import React from 'react';
import logo from './logo.svg';
import Signup from './routes/signup'
import Signin from './routes/signin'
import {Route,BrowserRouter as Router,Switch,Link} from 'react-router-dom' 
function App() {
  return (
    <div>
      <Router>
      <Switch>
      
        <Route path="/signup">
             <Signup></Signup>
        </Route>
        <Route path="/signin">
          <Signin></Signin>
        </Route>
      <Route path="/">
          <div>
            <p>Main screen</p>
          </div>
        </Route>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
