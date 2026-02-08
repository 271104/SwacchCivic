export const getPriorityColor = (level) => {
    const colors = {
        critical: 'bg-red-100 text-red-800 border-red-200',
        high: 'bg-orange-100 text-orange-800 border-orange-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        low: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPriorityIcon = (level) => {
    const icons = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢',
    };
    return icons[level] || '⚪';
};

export const getStatusColor = (status) => {
    const colors = {
        analyzing: 'bg-blue-100 text-blue-800 border-blue-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        in_progress: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        resolved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const complaintTypes = [
    'Garbage',
    'Road Damage',
    'Water Leakage',
    'Street Light',
    'Drainage',
];
