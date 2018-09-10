# React Minesweeper

A game I developed to practise using the React JavaScript framework.

## How to compile and run

1. Install Node.js if you don't have it already
1. In this project, run `npm install`
1. Compile the project by running `npm run build`
1. Load up your preferred web server to serve files from the `dist` folder. For Node.js, this will do:
    ```
    npx http-server dist/ -a 127.0.0.1
    ```
1. Open your page in your browser (127.0.0.1:8080 if using the server above)

## Development

The game is written entirely in TypeScript with React components. The HTML page is automatically generated using the html-webpack-plugin.

### Webpack

`npm start` will start the Webpack Dev Server with Hot Module Reloading (HMR) configured.

Alternatively, `npm run watch` will run Webpack in watch mode without HMR.