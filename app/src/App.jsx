import { router } from "./router/index";
import { RouterProvider } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import * as Sentry from "@sentry/react";

function App() {
  
  return (
    <Sentry.ErrorBoundary fallback={<p>Ocorreu um erro inesperado. Nossa equipe já foi notificada!</p>}>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        theme="light"
      />
      <RouterProvider router={router} />
    </Sentry.ErrorBoundary>
  )
}

export default App