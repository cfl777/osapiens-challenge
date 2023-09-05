import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme, Toolbar, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import AvatarMenu from "../AvatarMenu";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height,
  width: "100vw",
  position: "fixed",
}));

const dropdownKeyToLanguage = [
  {
    key: "0",
    languageCode: "en",
  },
  {
    key: "1",
    languageCode: "de",
  },
];

const AppHeader = React.forwardRef((props: AppHeaderProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { user, pageTitle } = props;
  const { t, i18n } = useTranslation("app");
  const theme = useTheme();

  const [language, setLanguage] = useState(dropdownKeyToLanguage[0]);
  const [count, setCount] = useState(0);
  const hours = 1;
  const minutes = hours * 60;
  const seconds = minutes * 60;
  const countdown = seconds - count;
  const countdownMinutes = `${~~(countdown / 60)}`.padStart(2, "0");
  const countdownSeconds = (countdown % 60).toFixed(0).padStart(2, "0");
  const countdownTimerCompleted = countdown <= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdownTimerCompleted) {
        clearInterval(interval);
        return;
      }

      setCount((c) => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    if(!event.target.value) return;

    const index = Number(event.target.value);
    setLanguage(dropdownKeyToLanguage[index]);
    i18n.changeLanguage(dropdownKeyToLanguage[index].languageCode);
  };

  return (
    <AppBar ref={ref}>
      <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
        <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
          <Box sx={{ margin: "auto" }}>
            {!countdownTimerCompleted && (
              <Typography variant="h6" component="div" color="primary">
                {countdownMinutes}:{countdownSeconds}
              </Typography>
            )}
            {countdownTimerCompleted && (
              <Typography variant="h6" component="div" color="red">
                {t("home.timedOut").toLocaleUpperCase()}
              </Typography>
            )}
          </Box>
          <Box sx={{ width: 20, height: 20, flex: 1 }} />
          <Box sx={{ flex: 2 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5)
              }}
              variant="h6"
              component="div"
            >
              {t("appTitle").toLocaleUpperCase()}
            </Typography>
            <Typography
              sx={{ ...typoStyle }}
              variant="overline"
              component="div"
              textAlign="center"
              noWrap
            >
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, justifyContent: "flex-end", display: "flex", margin: "auto" }}>
             <FormControl sx={{ width: { xs: "48px", md: "120px" }, marginRight: { xs: "8px", md: "32px" } }}>
                <InputLabel sx={{ color: theme.palette.primary.main }}>Language</InputLabel>
                <Select
                  label="Language"
                  onChange={handleLanguageChange}
                  value= {language.key}
                  sx={{ //Enhancement: Move this out, reduce overload of styles. Left here to just showcase context. 
                    color: `${theme.palette.primary.main} !important`,
                    selectedTextColor: theme.palette.primary.main,
                    height: "36px",
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor:  theme.palette.primary.main,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor:  theme.palette.primary.main,
                    },
                    '.MuiSvgIcon-root ': {
                      fill: `${theme.palette.primary.main} !important`,
                    }
                  }}
                >
                  <MenuItem value={dropdownKeyToLanguage[0].key}>{t("home.english")}</MenuItem>
                  <MenuItem value={dropdownKeyToLanguage[1].key}>{t("home.german")}</MenuItem>
                </Select>
              </FormControl>
            {user && user.eMail && (
              <AvatarMenu user={user} />
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default AppHeader;
