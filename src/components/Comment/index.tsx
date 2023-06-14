import * as React from 'react';
// import { DiscussionEmbed } from 'disqus-react';
import { graphql, useStaticQuery } from 'gatsby';

interface CommentProps {
    slug: string;
    title: string;
}

const Comment = ({ slug, title }: CommentProps) => {
    const data = useStaticQuery(graphql`
        query CommentQuery {
            site {
                siteMetadata {
                    siteUrl
                    post {
                        disqusShortname
                    }
                }
            }
        }
    `)
    const config = data.site.siteMetadata


    const disqusConfig = {
        shortname: config.post.disqusShortname,
        config: {
            url: `${config.siteUrl + slug}`,
            identifier: slug,
            title,
        },
    };

    return (
        <div className="comments">
            {/* <DiscussionEmbed {...disqusConfig} /> */}
        </div>
    );
};

export default Comment;
