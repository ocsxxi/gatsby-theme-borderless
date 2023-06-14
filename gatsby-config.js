const configuration = require('./_config.js');

const { title, description, siteUrl, language } = configuration;
const googleAnalytics = configuration.googleAnalytics;

const gatsbyConfig = {
    siteMetadata: {
        ...configuration,
    },
    flags: {
        DEV_SSR: true,
    },
    plugins: [
        `gatsby-plugin-typescript`,

        `gatsby-plugin-react-helmet`,

        `gatsby-plugin-theme-ui`,

        `gatsby-plugin-sass`,

        `gatsby-transformer-sharp`,

        `gatsby-plugin-sharp`,

        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown-pages`,
                path: `${__dirname}/_posts`,
            },
        },

        {
            resolve: `gatsby-transformer-remark`,
            options: {
                tableOfContents: {
                    maxDepth: 3,
                },
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                            loading: 'lazy',
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            classPrefix: 'language-',
                            inlineCodeMarker: null,
                            showLineNumbers: false,
                            noInlineHighlight: false,
                            escapeEntities: {},
                            aliases: {
                                react: 'jsx',
                                javascriptreact: 'jsx',
                                'javascript react': 'jsx',
                                typescriptreact: 'tsx',
                                'typescript react': 'tsx',
                            },
                        },
                    },
                    {
                        resolve: 'gatsby-remark-emojis',
                        options: {
                            active: true,
                            class: 'emoji-icon',
                            size: 64,
                            styles: {
                                display: 'inline',
                                margin: '0',
                                'margin-top': '1px',
                                position: 'relative',
                                top: '5px',
                                width: '25px',
                            },
                        },
                    },
                    `gatsby-remark-autolink-headers`,
                    {
                        resolve: `gatsby-remark-katex`,
                        options: {
                            strict: `ignore`,
                        },
                    },
                    {
                        resolve: 'gatsby-remark-external-links',
                        options: {
                            target: '_blank',
                        },
                    },
                    `gatsby-remark-copy-linked-files`,
                ],
            },
        },

        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },

        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: title,
                short_name: title,
                description: description,
                start_url: `/`,
                background_color: `#fff`,
                theme_color: `#6a737d`,
                theme_color_in_head: false,
                lang: language,
                display: `standalone`,
                icon: 'src/images/icon.png',
                legacy: false,
                include_favicon: false,
                crossOrigin: `use-credentials`,
            },
        },

        {
            resolve: `gatsby-plugin-typography`,
            options: {
                pathToConfigModule: `src/utils/typography.ts`,
            },
        },

        {
            resolve: `gatsby-plugin-sitemap`,
            options: {
                output: `/sitemap.xml`,
                query: `
                {
                    site {
                        siteMetadata {
                            siteUrl
                        }
                    }
                    allSitePage {
                        edges {
                            node {
                                path
                                pageContext
                            }
                        }
                    }
                }`,
                resolvePages: ({ allSitePage: { edges: allPages } }) => {
                    return allPages.map((page) => page.node);
                },
                serialize: ({ path, pageContext: { lastmod } }) => {
                    return {
                        url: path,
                        changefreq: `daily`,
                        lastmod: lastmod,
                        priority: 0.7,
                    };
                },
            },
        },

        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                {
                    site {
                        siteMetadata {
                            title
                            description
                            siteUrl
                            site_url: siteUrl
                        }
                    }
                }
                `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => {
                            return allMarkdownRemark.edges.map((edge) => {
                                return Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.excerpt,
                                    date: edge.node.frontmatter.date,
                                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    custom_elements: [{ 'content:encoded': edge.node.html }],
                                });
                            });
                        },
                        query: `
                        {
                            allMarkdownRemark( sort: { order: DESC, fields: [frontmatter___date] }, limit: 10) {
                                edges {
                                    node {
                                        excerpt(truncate: true, format: PLAIN)
                                        html
                                        fields { slug }
                                        frontmatter {
                                            title
                                            date
                                        }
                                    }
                                }
                            }
                        }`,
                        output: '/rss.xml',
                        title: `${title} | Feed`,
                    },
                ],
            },
        },

        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                host: siteUrl,
                sitemap: `${siteUrl}${siteUrl[siteUrl.length - 1] !== '/' ? '/' : ''}sitemap.xml`,
                policy: [{ userAgent: '*', allow: '/' }],
            },
        },
    ],
};

if (googleAnalytics) {
    gatsbyConfig.plugins.push({
        resolve: `gatsby-plugin-google-analytics`,
        options: {
            trackingId: googleAnalytics,
        },
    });
}

if (process.env.NODE_ENV === 'development') {
    gatsbyConfig.plugins.push({
        resolve: `gatsby-source-filesystem`,
        options: {
            path: `${__dirname}/_drafts`,
            name: 'markdown-pages',
        },
    });
}

/**
 *  We need to wait for preact to update, the present preact can't resolve some function in the present react
 *  Temporarily save the preact plugin code.
 *  check it out at
 *  https://vaihe.com/blog/fixing-rendertopipeablestream-error-gatsby/#:~:text=WebpackError%3A%20TypeError%3A%20renderToPipeableStream%20is%20not%20a%20function%20The,that%20you%20must%20uninstall%20Preact%20from%20your%20project.
 *  https://github.com/gatsbyjs/gatsby/issues/35500
 */

// if (process.env.NODE_ENV === 'production') {
//     gatsbyConfig.plugins.push(`gatsby-plugin-preact`);
// }

module.exports = gatsbyConfig;
