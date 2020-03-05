import React from 'react'
import ReactDOM from 'react-dom'
import singleSpaReact from 'single-spa-react'
// import root from './root.component.js'
import { property } from 'lodash'
import setPublicPath from './set-public-path.js'

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  // rootComponent: root,
  loadRootComponent: () => import(/* webpackChunkName: "chat-app" */'./root.component.js').then(property('default')),
  domElementGetter,
})

// export const bootstrap = [
//   reactLifecycles.bootstrap,
// ]
export const bootstrap = [
  () => {
    return setPublicPath()
  },
  reactLifecycles.bootstrap,
]

export const mount = [
  reactLifecycles.mount,
]

export const unmount = [
  reactLifecycles.unmount,
]

export const unload = [
  reactLifecycles.unload,
]

function domElementGetter() {
  let el = document.getElementById("chat");
  if (!el) {
    el = document.createElement('div');
    el.id = 'chat';
    document.body.appendChild(el);
  }
  // el.style.height = '100%';

  return el;
}
