import { BrowserRouter } from 'react-router-dom';
import { Wizard } from './components/Wizard';

export default function App() {
  return (
    <BrowserRouter>
      <Wizard />
    </BrowserRouter>
  );
}
