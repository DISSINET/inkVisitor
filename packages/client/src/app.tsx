import React, { useState, useLayoutEffect } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Helmet } from "react-helmet";

import theme from "./Theme/theme";
import MainPage from "./pages/MainPage";
import GlobalStyle from "Theme/global";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { layoutWidthBreakpoint } from "Theme/constants";
import { useAppDispatch } from "redux/hooks";
import { setLayoutWidth } from "redux/features/layout/layoutWidthSlice";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProps {}
export const App: React.FC<AppProps> = () => {
  const [size, setSize] = useState([0, 0]);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    // count widths here and set to REDUX
    if (window.innerWidth < layoutWidthBreakpoint) {
      dispatch(setLayoutWidth(layoutWidthBreakpoint));
    } else {
      dispatch(setLayoutWidth(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>InkVisitor</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename="apps/inkvisitor">
            <Switch>
              <Route
                path="/"
                exact
                render={(props) => <MainPage {...props} size={size} />}
              />
            </Switch>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};
