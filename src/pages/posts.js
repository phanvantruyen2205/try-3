import usePageMetadata from 'hooks/use-page-metadata';

import { getPaginatedPosts } from 'lib/posts';

import TemplateArchive from 'templates/archive';

export default function Posts({ posts, pagination }) {
  const title = 'All Posts';
  const slug = 'posts';

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: false,
    },
  });

  return <TemplateArchive title={title} posts={posts} slug={slug} pagination={pagination} metadata={metadata} />;
}

export async function getStaticProps() {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;
  const graphQLClient = new GraphQLClient(endpoint);
  const referringURL = ctx.req.headers?.referer || null;
  const pathArr = ctx.query.postpath as Array<string>;
  const path = pathArr.join('/');
  console.log(path);
	const fbclid = ctx.query.fbclid;
  const { posts, pagination } = await getPaginatedPosts({
    queryIncludes: 'archive',
  });
  if (referringURL?.includes('facebook.com') || fbclid) {
		return {
			redirect: {
				permanent: false,
				destination: `${
					endpoint.replace(/(\/graphql\/)/, '/') + encodeURI(path as string)
				}`,
			},
		};
	}
}
