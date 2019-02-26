import Router from "next/router";

// UGLY FIX FOR IE11
export const routerPush = path => {
  const isIE = !!document.documentMode;
  if (isIE) {
    window.location.href = path;
  } else {
    Router.push(path);
  }
};

// UGLY FIX FOR IE11
export const routerReplace = path => {
  const isIE = !!document.documentMode;
  if (isIE) {
    window.location.replace(path);
  } else {
    Router.replace(path);
  }
};
