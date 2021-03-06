import { Component } from "react";
import { routerPush } from "./router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";

export const login = async ({ token, expires, redirectTo = "/home" }) => {
  cookie.set("token", token, { expires: expires });
  routerPush(redirectTo);
};

export const logout = () => {
  cookie.remove("token");
  cookie.remove("project");
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  routerPush("/login");
};

// Gets the display name of a JSX component for dev tools
const getDisplayName = Component =>
  Component.displayName || Component.name || "Component";

export const withAuthSync = (WrappedComponent, options) =>
  class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const { redirect } = options || {};
      const token = auth(ctx, redirect);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, token };
    }

    constructor(props) {
      super(props);

      this.syncLogout = this.syncLogout.bind(this);
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    syncLogout(event) {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        this.onLogout();
      }
    }

    onLogout() {
      routerPush("/login");
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export const auth = (ctx, redirect) => {
  const { token } = nextCookie(ctx);

  if (typeof redirect === "undefined") {
    redirect = true;
  }

  if (redirect) {
    if (ctx.req && !token) {
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
      return;
    }

    if (!token) {
      routerPush("/login");
    }
  }

  return token;
};
