import ProtectedRoute from '../../../components/ProtectedRoute';
import Leads from '../../../views/Leads';

export const metadata = {
  title: 'Lead Dashboard',
  robots: { index: false },
};

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <Leads />
    </ProtectedRoute>
  );
}
