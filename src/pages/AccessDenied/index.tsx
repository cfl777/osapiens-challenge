import { mdiAlert } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import { observer } from "mobx-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ERoute } from "../../types/global";
import { useHistory } from "react-router-dom";

const Container = styled("div")(() => ({
  display: "flex",
  flex: 4,
  justifyContent: "space-evenly",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "scroll",
  background: `url(${""}) repeat content-box`
}));
const AccessDenied: React.FC = () => {
  const { t } = useTranslation("app");
  const theme = useTheme();
  const history = useHistory();

  const color = theme.palette.error.main;

  React.useEffect(() => {
    // on screen leave
    return () => {
      // TODO: Further enhancement is too add real user account management, requiring a need to clear cache. 
      // clearCache()
    };
  }, []);

  const handleLogout = () => {    
    history.push(ERoute.HOME);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Container>
        <Icon size={2} color={color} path={mdiAlert} />
        <Typography variant="h5" sx={{ color }}>
          {t("accessDenied.denied")}
        </Typography>
        <Typography>{t("accessDenied.speakToYourAdmin")}</Typography>
        <Button sx={{ color }} onClick={handleLogout}>
          {t("accessDenied.logout")}
        </Button>
      </Container>
      <Box sx={{ flex: 3 }}></Box>
    </Box>
  );
};

export default observer(AccessDenied);
