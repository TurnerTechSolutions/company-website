import PortalGuard from '../../../../components/PortalGuard';
import AdminClients from '../../../../views/portal/AdminClients';

export const metadata = {
  title: 'Clients',
};

export default function AdminClientsPage() {
  return (
    <PortalGuard allow={['staff']}>
      <AdminClients />
    </PortalGuard>
  );
}
