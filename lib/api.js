const KNOWN_HOST_PAIRS = [
  ['localhost', 'localhost:8000'],
  ['staging.terra.dymaxionlabs.com', 'staging.api.dymaxionlabs.com'],
  ['terra.dymaxionlabs.com', 'api.dymaxionlabs.com'],
]

export function buildApiUrl(path) {
  let apiHostname = location.host;
  for (const [webHost, apiHost] of KNOWN_HOST_PAIRS) {
    if (location.hostname === webHost) {
      apiHostname = apiHost;
      break;
    }
  }
  return `${location.protocol}//${apiHostname}${path}`;
}
