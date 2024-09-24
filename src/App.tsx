import { RouterProvider } from 'react-router-dom';
import './App.css'
import router from './routers';


function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default App

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}