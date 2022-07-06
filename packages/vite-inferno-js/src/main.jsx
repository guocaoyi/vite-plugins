import { render } from 'inferno'
import './index.css'
import App from './App'

render(<App />, document.getElementById('app') ?? document.body)
