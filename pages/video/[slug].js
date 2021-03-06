import { gql, GraphQLClient } from "graphql-request";
import { useState } from "react";
import Link from 'next/link';

export const getServerSideProps = async (pageContext) => {
    const url = process.env.ENDPOINT;
    const pageSlug = pageContext.query.slug;

    const graphQLClient = new GraphQLClient(url, {
        headers: {
          "Authorization": process.env.GRAPH_CMS_TOKEN
        }
      });
      
      const query = gql`
        query ($pageSlug: String!){
            video(where: {
                slug: $pageSlug,
            }) {
                createdAt,
                id, 
                title, 
                description, 
                seen,
                slug,
                tags,
                thumbnail {
                    url
                },
                mp4 {
                  url
                }
            }
        }
    `;

    // console.log(pageSlug);
    const variables = {
        pageSlug
    };

    const data = await graphQLClient.request(query, variables);
    const video = data.video;

    return {
        props: {
            video
        }
    };
};

const changeToSeen = async (slug) => {
    await fetch('/api/changeToSeen', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ slug })
    });
};

const Video = ({ video }) => {
    const [watching, setWatching] = useState(false);
    console.log("All about video", video);
    return (
        <>
            {!watching && <img 
                className="video-image"
                src={video.thumbnail.url} 
                alt={video.title}
            />}
            {!watching && <div className="info">
                <p>{video.tags.join(', ')}</p>
                <p>{video.description}</p>
                <Link href="/"><p>Go Back</p></Link>
                <button
                    className={"video-overlay"}
                    onClick={() => {
                        changeToSeen(video.slug)
                        watching ? setWatching(false) : setWatching(true)
                    }}
                >PLAY</button>
            </div>}
            {watching && (
                <video width="100%" controls>
                    <source src={video.mp4.url} type="video/mp4" />
                </video>
            )}
            <div 
                className={"info-footer"}
                onClick={() => watching ? setWatching(false) : null}
            >

            </div>
        </>
    );
};

export default Video;