import React from 'react';

export const NavigationContext = React.createContext({ route: 'Home', params: {}, navigate: () => {} });

export default function Router({ initialRoute = 'Home', routes = {} }) {
  const [route, setRoute] = React.useState(initialRoute);
  const [params, setParams] = React.useState({});
  
  const navigate = (name, routeParams = {}) => {
    setRoute(name);
    setParams(routeParams);
  };
  
  const RouteComponent = routes[route];

  if (!RouteComponent) return null;

  return (
    <NavigationContext.Provider value={{ route, params, navigate }}>
      <RouteComponent navigation={{ navigate, route, params }} />
    </NavigationContext.Provider>
  );
}
