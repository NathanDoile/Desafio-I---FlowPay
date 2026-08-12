import { Home, DetalheFila } from "../ui/screen/index";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/detalhes-fila",
    element: <DetalheFila />
  }
]);