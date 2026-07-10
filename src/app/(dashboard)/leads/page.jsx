import PortalShell from '../../../views/portal/PortalShell';
import Leads from '../../../views/Leads';

export const metadata = {
  title: 'Lead Dashboard',
  robots: { index: false },
};

export default function LeadsPage() {
  return (
    <PortalShell allow={['staff']}>
      <Leads />
    </PortalShell>
  );
}
