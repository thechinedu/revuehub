// TODO: This currently only works for public pages and it uses public storage.
// Add support for authenticated pages and custom storage
//  Relevant Links:
//    https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/complex-setup.md
//    https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md
//    https://github.com/GoogleChrome/lighthouse/blob/main/docs/authenticated-pages.md

const base = "http://localhost:3000";
const urls = ["/sign-in", "/sign-up"];

const generateAuditableUrls = () => {
  return [`${base}`].concat(urls.map((url) => `${base}${url}`));
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: "yarn lhci:serve",
      url: generateAuditableUrls(),
    },
    assert: {
      preset: "lighthouse:no-pwa",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
