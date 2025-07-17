// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Twilight",
  tagline: "",
  favicon: "/img/twilight.svg",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://user-guide.docs.twilight.rest",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "shanu516516", // GitHub username for deployment repository.
  projectName: "user-guide", // Usually your repo name.

  // Do not fail the build on broken links—show warnings instead
  onBrokenLinks: "throw",
  // onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/shanu516516/edit/user-guide/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  // Additional docs plugin instance for the Market Maker section
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */ ({
        id: "marketMaker",
        path: "market-maker", // Folder containing Market Maker docs
        routeBasePath: "market-maker", // URL route: /market-maker/*
        sidebarPath: "./sidebarsMarketMaker.js", // Use dedicated sidebar file
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "/img/twilight.svg",
      navbar: {
        title: "Twilight",
        logo: {
          alt: "Logo",
          src: "/img/twilight.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          {
            type: "docSidebar",
            sidebarId: "marketMakerSidebar",
            docsPluginId: "marketMaker",
            position: "left",
            label: "Market Maker",
          },
          // Removed blog link to avoid broken link warnings (re-enable if a blog is added)
          // { to: "/blog/", label: "Blog", position: "left" },
          {
            href: "https://frontend.twilight.rest",
            label: "Twilight App",
            position: "right",
          },
          {
            href: "https://github.com/twilight-project",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          // {
          //   title: "Docs",
          //   items: [
          //     {
          //       label: "DEX Operations",
          //       to: "/docs/dex-operations",
          //     },
          //   ],
          // },
          // {
          //   title: "Community",
          //   items: [
          //     // {
          //     //   label: "Stack Overflow",
          //     //   href: "https://stackoverflow.com/questions/tagged/docusaurus",
          //     // },
          //     // {
          //     //   label: "Discord",
          //     //   href: "https://discordapp.com/invite/docusaurus",
          //     // },
          //     // {
          //     //   label: "X",
          //     //   href: "https://x.com/docusaurus",
          //     // },
          //   ],
          // },
          // {
          //   title: "More",
          //   items: [
          //     // Blog section is currently disabled
          //     // {
          //     //   label: "Blog",
          //     //   to: "/blog/",
          //     // },
          //     {
          //       label: "GitHub",
          //       href: "https://github.com/twilight-project",
          //     },
          //   ],
          // },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Twilight`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
