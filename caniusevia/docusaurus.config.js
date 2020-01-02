module.exports = {
  title: 'VIA',
  tagline: 'Complete customization made trivial',
  url: 'https://caniusevia.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'the-via', // Usually your GitHub org/user name.
  projectName: 'keyboards', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'VIA',
      logo: {
        alt: 'VIA',
        src: 'img/icon.png'
      },
      links: [
        {to: 'docs/simple', label: 'Simple', position: 'left'},
        {to: 'docs/advanced', label: 'Advanced', position: 'left'}
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: 'docs/simple'
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus'
            }
          ]
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog'
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus'
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
