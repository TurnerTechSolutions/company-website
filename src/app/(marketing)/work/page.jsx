import Gallery from '../../../views/Gallery';

export const metadata = {
  title: 'Our Work',
  description:
    'Browse live client sites and example projects — local service businesses, restaurants, and more, built and managed by Turner Tech Solutions.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/work' },
};

export default function WorkPage() {
  return <Gallery />;
}
