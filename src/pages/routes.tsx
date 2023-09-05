import { mdiHome } from "@mdi/js";
import Icon from "@mdi/react";
import { CircularProgress, Grow } from "@mui/material";
import { Box } from "@mui/system";
import React, { Suspense } from "react";
import { ERoute, TRoute } from "../types/global";
import Home from "./Home";
import AccessDenied from "./AccessDenied";

const Loading = (
  <Grow in={true}>
    <Box
      position={"absolute"}
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      width="100%"
      bottom="0px"
      top="0px"
    >
      <CircularProgress />
    </Box>
  </Grow>
);
const lazyLoad = (Component: React.FC) => () => (
  <Suspense fallback={Loading}>
    <Component />
  </Suspense>
);

export const routes: TRoute[] = [
  {
    path: ERoute.HOME,
    Icon: <Icon path={mdiHome} size={1} />,
    Component: lazyLoad(Home)
  },
  {
    path: ERoute.ACCESS_DENIED,
    Icon: <Icon path={mdiHome} size={1} />,
    Component: lazyLoad(AccessDenied)
  },
];
