import PortalGuard from '../../../components/PortalGuard';
import Leads from '../../../views/Leads';

export const metadata = {
  title: 'Lead Dashboard',
  robots: { index: false },
};

export default function LeadsPage() {
  return (
    <PortalGuard allow={['staff']}>
      <Leads />
    </PortalGuard>
  );
}
