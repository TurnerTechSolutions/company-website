import { Helmet } from 'react-helmet-async';

const BASE = 'https://www.turnertechsolutions.com';

export default function PageHead({ title, description, path = '' }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE}${path}`} />
    </Helmet>
  );
}
