import * as React from 'react';
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faUserCircle, faAt, faMapMarkerAlt, faLink, faAddressCard, faRss } from '@fortawesome/free-solid-svg-icons';

import './bio.scss';


const Bio = () => {
    const data = useStaticQuery(graphql`
        query BioQuery {
            site {
                siteMetadata {
                    siteUrl
                    bio {
                        comment
                        name
                        company
                        location
                        email
                        website
                        social
                    }
                }
            }
        }
    `)

    const { comment, name, company, location, email, website, social } = data.site.siteMetadata.bio;
    const { siteUrl } = data.site.siteMetadata

    return (
        <div className="bio">
            {!comment ? null : <span className="comment">{comment}</span>}

            {!name ? null : (
                <div className="bio-item name">
                    <div className="icon-wrap">
                        <Fa icon={faUserCircle} />
                    </div>
                    <span>{name}</span>
                </div>
            )}

            {!company ? null : (
                <div className="bio-item company">
                    <div className="icon-wrap">
                        <Fa icon={faAddressCard} />
                    </div>
                    <span>{company}</span>
                </div>
            )}

            {!location ? null : (
                <div className="bio-item location">
                    <div className="icon-wrap">
                        <Fa icon={faMapMarkerAlt} />
                    </div>
                    <span>{location}</span>
                </div>
            )}

            {!email ? null : (
                <div className="bio-item email">
                    <div className="icon-wrap">
                        <Fa icon={faAt} />
                    </div>
                    <a href={`mailto:${email}`}>{email}</a>
                </div>
            )}

            {!website ? null : (
                <div className="bio-item website">
                    <div className="icon-wrap">
                        <Fa icon={faLink} />
                    </div>

                    <a href={website} target="_blank" rel="noopener noreferrer">
                        {website}
                    </a>
                </div>
            )}

            <div className="social">
                <a href={`${siteUrl}/rss`} target="_blank" rel="noopener noreferrer">
                    <Fa icon={faRss} className="rss" />
                </a>
                {
                    social && social !== '' && Object.entries(JSON.parse(social))
                        .map(([key, val]) => (
                            <a href={val} target="_blank" rel="noopener noreferrer" key={key}>
                                <Fa icon={`fa-brands fa-${key}`} className={key} />
                            </a>
                        ))
                }
            </div>
        </div>
    );
};

export default Bio;
