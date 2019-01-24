//import debug from "debug";

//const log = debug("analytics");

export function init(code) {
  console.log(`Analytics init triggered for ${code}`);
}

export function pageview() {
  console.log(`Pageview triggered for ${window.location.pathname}`);
}

export function event(category = "", action = "") {
  console.log(`Event for category ${category} and action ${action} triggered`);
}

export function exception(description = "", fatal = false) {
  console.log(
    `${fatal ? "Fatal exception" : "Exception"} with description ${description}`
  );
}
