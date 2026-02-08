import { getStatusColor } from '../../utils/helpers';

export default function StatusBadge({ status }) {
    if (!status) return null;

    const statusLabels = {
        analyzing: 'Analyzing',
        pending: 'Pending',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        rejected: 'Rejected',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
            {statusLabels[status] || status}
        </span>
    );
}
