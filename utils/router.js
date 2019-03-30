import Router from "next/router";

// Some pages are still using SemanticUI. For some reason everything breaks when
// transitioning from a MUI page to a SemanticUI. so for now, we force-reload
// when going to those pages.
function isSemanticUIPath(path) {
  return path === "/quote";
}

// UGLY FIX FOR IE11
export const routerPush = path => {
  const isIE = !!document.documentMode;
  if (isIE || isSemanticUIPath(path)) {
    window.location.href = path;
  } else {
    Router.push(path);
  }
};

// UGLY FIX FOR IE11
export const routerReplace = path => {
  const isIE = !!document.documentMode;
  if (isIE || isSemanticUIPath(path)) {
    window.location.replace(path);
  } else {
    Router.replace(path);
  }
};
