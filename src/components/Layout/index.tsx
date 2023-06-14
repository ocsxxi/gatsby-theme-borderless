import * as React from 'react';
import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import MobileDetect from 'mobile-detect';
import { config as FaConfig, dom as FaDom } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { useColorMode } from 'theme-ui';
import { Context } from '../../state/contextprovider';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab)

import './layout.scss';
import '../../utils/google-fonts.scss';
import Header from '../Header';
import { actionCreators } from '../../state/actions';
import { throttle } from 'lodash';

FaConfig.autoAddCss = false;


const Layout = (props: { children: React.ReactNode }) => {
    const { children } = props;
    const [isTop, setIsTop] = useState(true);
    const { value: { dispatch } } = useContext(Context);
    const [colorMode] = useColorMode();
    const isDark = useMemo(() => colorMode === 'dark', [colorMode]);

    const data = useStaticQuery(graphql`
    query SiteTitleQuery {
        site {
            siteMetadata {
                author
                title
                googleAD_on
                googleAD {
                    googleSearchConsole
                }
            }
        }
    }
  `);
    const { googleAD_on } = data.site.siteMetadata
    const { googleSearchConsole } = data.site.siteMetadata.googleAD

    const setTop = useCallback(
        throttle(() => setIsTop(window.scrollY < window.innerHeight / 2), 250),
        []
    );

    useEffect(() => {
        const md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile()) {
            dispatch(actionCreators.setIsMobile(true));
        }

        document.addEventListener('scroll', setTop);
        return () => document.removeEventListener('scroll', setTop);
    }, []);

    return (
        <>
            <Helmet>
                {/* <link rel="icon" href="data:;base64,iVBORw0KGgo=" /> */}
                <link rel="icon" href="/favicon.svg" type="image/x-icon" />
                {
                    googleAD_on &&
                    <meta name="google-site-verification" content={googleSearchConsole ?? ''} />
                }
                <style>{FaDom.css()}</style>
            </Helmet>

            <div id="layout" className={isDark ? 'dark' : 'light'}>
                <Header siteTitle={data.site.siteMetadata.title} />
                <div id="content">
                    <main>{children}</main>
                    <footer>
                        <span>{`© ${new Date().getFullYear()} ${data.site.siteMetadata.author} | Theme by `}</span>
                        <a href="https://github.com/junhobaik">JunhoBaik</a>
                        <span>{` | Built with `}</span>
                        <a href="https://www.gatsbyjs.org">Gatsby</a>
                    </footer>
                </div>

                <div
                    id="top"
                    style={{
                        opacity: isTop ? '0' : '1',
                        pointerEvents: isTop ? 'none' : 'all',
                    }}
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <Fa icon={faAngleDoubleUp} />
                </div>
            </div>
        </>
    );
};

export default Layout;

