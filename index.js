import React from 'react';
import ReactDOM from 'react-dom';
import KeepSimpleSandBox from './src/KeepSimpleSandBox.jsx';
import reactToWebComponent from 'react-to-webcomponent';

// Wrap the React component into a Web Component
const KeepSimpleElement = reactToWebComponent(KeepSimpleSandBox, React, ReactDOM);

// Register the custom element (web component) globally
customElements.define('keep-simple-sandbox', KeepSimpleElement);

// Export the regular React component as well
export { KeepSimpleSandBox };