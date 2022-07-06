import { render } from 'inferno'
import './index.css'
import App from './App'

console.info(' app', 'app renderer')

render(<App />, document.getElementById('app')!)
