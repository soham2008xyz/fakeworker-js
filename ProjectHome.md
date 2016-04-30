Currently, every browsers don't provide the debug facility for HTML5 Web Worker. Additionally, logging for Worker is messy because Web Worker is separated from DOM.
So, the development using Web Worker is very difficult.

fakeworker.js is an implementation of Web Workers using setTimeout() for asynchronous messaging and eval() for executing worker's source code.
This will help you debugging for Web Workers, because you can debug with evaluated source text using Webkit's debugger or Firebug.