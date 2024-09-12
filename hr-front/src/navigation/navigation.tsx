import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export const Navigation = () => {
  return <RouterProvider router={router} />;
};
