import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ColorSetup } from './config/colors';
import { SetupCore } from './core/setup';
import { Auth0Provider } from '@auth0/auth0-react';

Array.prototype.unique = function () {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
};

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export function hideKeyboard(element) {
  try {
    element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
    element.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
    setTimeout(function () {
      try {
        element.blur();  //actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        element.removeAttribute('readonly');
        element.removeAttribute('disabled');
      } catch (ex) { }
    }, 100);
  } catch (ex) {
    console.error(ex);
  }
}

class ErrorCatcher extends Component {
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ColorSetup />
    <SetupCore />
    <div style={{ width: '100%', height: '100vh' }}>
      <Auth0Provider
        domain={'cosmopole.eu.auth0.com'}
        audience={'https://cosmopole.eu.auth0.com/api/v2/'}
        clientId={'oiviSz6f5TL6PjUCwHYJW000LoNBJxsW'}
        redirectUri={'http://localhost:3000'}
        onRedirectCallback={(appState) => {}}>
        <App />
      </Auth0Provider>
    </div>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
