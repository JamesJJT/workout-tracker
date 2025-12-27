import React from 'react';

export const NavigationContext = React.createContext({ route: 'Home', navigate: () => {} });

export default function Router({ initialRoute = 'Home', routes = {} }) {
  const [route, setRoute] = React.useState(initialRoute);
  const navigate = (name) => setRoute(name);
  const RouteComponent = routes[route];

  if (!RouteComponent) return null;

  return (
    <NavigationContext.Provider value={{ route, navigate }}>
      <RouteComponent navigation={{ navigate, route }} />
    </NavigationContext.Provider>
  );
}
