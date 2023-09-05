import { Box, Fade, Grow, Slide } from "@mui/material";
import React from "react";
import { matchPath, Route, Switch, useLocation } from "react-router-dom";
import { match } from 'react-router';
import { PathParams, TRoute } from "../types/global";
import { validateParams } from "../utils/router";

interface UseMatchedRouteOptions {
  notFoundComponent?: React.FC;
  matchOnSubPath?: boolean;
  transition?:
    | "none"
    | "fade"
    | "grow"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right";
}

interface routeMatch {
  route: TRoute;
  pathMatch: match | null;
}

const useMatchedRoute = (
  routes: ReadonlyArray<TRoute>,
  fallbackComponent?: React.FC,
  options?: UseMatchedRouteOptions
): {
  route: TRoute;
  params: PathParams | null;
  MatchedElement: JSX.Element;
} => {
  const { notFoundComponent, matchOnSubPath, transition = "fade" } =
    options || {};
  const location = useLocation();
  // `exact`, `sensitive` and `strict` options are set to true
  // to ensure type safety.
  const results = routes
    .map((route: TRoute): routeMatch => ({
      route,
      pathMatch: matchPath(location.pathname, {
        path: route.path,
        sensitive: !matchOnSubPath
      })
    }))
    .filter(({ pathMatch }) =>  !!pathMatch && (matchOnSubPath ? true : pathMatch.isExact));
  const [firstResult] = results;
  const { pathMatch, route } = firstResult || {};
  const Fallback = fallbackComponent;
  const NotFound = notFoundComponent || (() => <>not found</>);

  const Transition: React.FC<{ matched: boolean | undefined }> = React.useMemo(() => {
    if (transition === "fade") {
      const FadeTransition: React.FC<{ matched: boolean | undefined }> = ({
        children,
        matched
      }) => (
        <Fade in={matched ? true : false} timeout={300} unmountOnExit>
          <Box height={"100%"}>{children}</Box>
        </Fade>
      );

      return FadeTransition;
    }

    if (transition === "grow") {
      const GrowTransition: React.FC<{ matched: boolean | undefined }> = ({
        children,
        matched
      }) => (
        <Grow in={matched ? true : false} timeout={300} unmountOnExit>
          <Box height={"100%"}>{children}</Box>
        </Grow>
      );

      return GrowTransition;
    }

    if (transition.startsWith("slide")) {
      const [, direction] = transition.split("-");
      const SlideTransition: React.FC<{ matched: boolean | undefined }> = ({
        children,
        matched
      }) => (
        <Slide
          in={matched ? true : false}
          direction={direction as "left" | "right" | "up" | "down"}
          timeout={300}
          unmountOnExit
        >
          <Box height={"100%"}>{children}</Box>
        </Slide>
      );

      return SlideTransition;
    }
    return (({ children }) => children) as React.FC<{ matched: boolean | undefined }>;
  }, [transition]);

  return {
    route: route,
    params:
      pathMatch && validateParams(route.path, pathMatch.params) ? pathMatch.params : {},
    MatchedElement: (
      <Switch>
        {matchOnSubPath &&
          routes.map(({ path, Component: RouteComponent }) => (
            <Route
              key={path + "matchOnSubPath"}
              path={`/${path.split("/").slice(1, 2)}/*`}
            >
              {({ match }) => (
                <Transition matched={match?.isExact}>
                  <RouteComponent />
                </Transition>
              )}
            </Route>
          ))}
        {routes.map(({ path, Component: RouteComponent }) => (
          <Route key={path + "root"} sensitive strict exact path={path}>
            {({ match }) => (
              <Transition matched={match?.isExact}>
                <RouteComponent />
              </Transition>
            )}
          </Route>
        ))}
        {Fallback && (
          <Transition matched={true}>
            <Fallback />
          </Transition>
        )}
        {!Fallback && (
          <Transition matched={true}>
            <Route component={NotFound} />
          </Transition>
        )}
      </Switch>
    )
  };
};

export default useMatchedRoute;
