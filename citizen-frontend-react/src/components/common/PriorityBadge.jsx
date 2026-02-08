import { getPriorityColor, getPriorityIcon } from '../../utils/helpers';

export default function PriorityBadge({ level, score }) {
    if (!level) return null;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(level)}`}>
            <span>{getPriorityIcon(level)}</span>
            <span className="uppercase">{level}</span>
            {score && <span className="ml-1 opacity-75">({score})</span>}
        </span>
    );
}
