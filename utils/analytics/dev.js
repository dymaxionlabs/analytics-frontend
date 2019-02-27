export function init(code) {
  console.log(`[GA] Analytics init triggered for ${code}`);
}

export function pageview() {
  console.log(`[GA] Pageview triggered for ${window.location.pathname}`);
}

export function event(category = "", action = "", value = "") {
  console.log(
    `[GA] Event (category: '${category}', action: '${action}', value: '${value}') triggered`
  );
}

export function exception(description = "", fatal = false) {
  console.log(
    `[GA] ${
      fatal ? "Fatal exception" : "Exception"
    } with description ${description}`
  );
}
