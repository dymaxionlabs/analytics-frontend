import React from "react";
import App, { Container } from "next/app";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import getPageContext from "../utils/getPageContext";
import withGA from "../utils/ga";
import { appWithTranslation, Router } from "../i18n";
import i18next from "i18next";
import NProgress from "next-nprogress/component";

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    const {
      query: { lang }
    } = this.props.router;

    // Change language if query string contains "lang" parameter
    if (lang) {
      console.log(`Setting language to '${lang}'`);
      i18next.changeLanguage(lang);
    }

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, analytics } = this.props;

    return (
      <Container>
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            {/* Progress indicator for page transitioning */}
            <NProgress />

            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
            <Component
              pageContext={this.pageContext}
              {...pageProps}
              analytics={analytics}
            />
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

MyApp = appWithTranslation(MyApp);
MyApp = withGA("UA-105156301-5", Router)(MyApp);

export default MyApp;
