import { router } from "./router/index";
import { RouterProvider } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  )
}

export default App