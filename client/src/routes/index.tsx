import { useRoutes } from "react-router-dom";

import Dashboard from "../pages/Dashboard";

const Router = () => {
  const routes = [
    {
      path: "/",
      element: <Dashboard />,
    },
  ];

  return useRoutes(routes);
};

export default Router;
