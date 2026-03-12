// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require("dotenv").config();

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "Waku Documentation",
  url: "https://docs.waku.org/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en-GB",
    locales: ["en-GB"],
  },
  presets: [
    [
      "@acid-info/logos-docusaurus-preset",
      {
        businessUnit: "Waku",
        customSiteConfig: true,
        docs: {
          routeBasePath: "/",
          path: "docs",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/waku-org/docs.waku.org/tree/develop/",
          showLastUpdateTime: true,
          breadcrumbs: false,
        },
        theme: {
          name: "default",
          options: {
            customCss: [require.resolve("./src/css/custom.scss")],
          },
        },
        og: {},
      },
    ],
  ],
  staticDirectories: ["static"],
  plugins: [
    [
      "@acid-info/docusaurus-fathom",
      {
        siteId: "FUTMI",
        scriptUrl: "https://fathom.status.im/tracker.js",
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: false,
      },
    },
    navbar: {
      hideOnScroll: true,
      items: [
        {
          type: "search",
        },
        {
          position: "left",
          label: "Build",
          to: "/build/javascript/",
          activeBaseRegex: "^/build/",
        },
        {
          position: "left",
          label: "Run Node",
          to: "/run-node/",
          activeBaseRegex: "^/run-node/",
        },
        {
          position: "left",
          label: "Learn",
          to: "/learn/",
          activeBaseRegex: "^/learn/",
        },
        {
          href: "https://discord.waku.org",
          position: "left",
          label: "Discord",
        },
        {
          href: "https://github.com/waku-org",
          position: "right",
          className: "header-github-link",
          title: "Waku GitHub repository",
        },
      ],
    },
    footer: {
      copyright: "Waku",
      links: [
        {
          title: "Community",
          items: [
            {
              href: "https://twitter.com/waku_org/",
              label: "X",
            },
            {
              href: "https://discord.waku.org/",
              label: "Discord",
            },
            {
              href: "https://github.com/waku-org/",
              label: "GitHub",
            },
            {
              href: "https://www.youtube.com/@wakuorg",
              label: "YouTube",
            },
            {
              href: "https://www.linkedin.com/company/waku-org",
              label: "LinkedIn",
            },
            {
              href: "https://warpcast.com/waku",
              label: "Farcaster",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              href: "https://blog.waku.org/",
              label: "Blog",
            },
            {
              href: "https://rfc.vac.dev/waku",
              label: "Waku RFCs",
            },
            {
              href: "https://github.com/waku-org/awesome-waku/",
              label: "Awesome Waku",
            },
          ],
        },
        {
          title: "Legal",
          items: [
            {
              href: "/terms",
              label: "Terms of Use",
            },
            {
              href: "/privacy-policy",
              label: "Privacy Policy",
            },
            {
              href: "/rules-of-engagement",
              label: "Rules of Engagement",
            },
            {
              href: "/security",
              label: "Security",
            },
          ],
        },
      ],
    },
  },
  markdown: {
    mermaid: true,
  },
};

module.exports = config;
