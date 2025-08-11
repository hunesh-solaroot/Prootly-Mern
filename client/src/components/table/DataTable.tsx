function renderCell(key: string, value: any, row: any) {
  switch (key) {
    case 'customer':
      return (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full text-white grid place-content-center text-xs font-bold"
            style={{ backgroundColor: row.customer?.color || '#4b5563' }}
          >
            {row.customer?.initials ?? 'NA'}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white truncate">
              {row.customer?.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {row.customer?.address}
            </div>
          </div>
        </div>
      );
    case 'keyDates':
      return (
        <div className="text-sm text-gray-700 dark:text-gray-200">
          <div><span className="font-medium">Created:</span> {formatDate(row.keyDates?.created)}</div>
          <div><span className="font-medium">Received:</span> {formatDate(row.keyDates?.received)}</div>
        </div>
      );
    case 'status':
      return (
        <div className="flex flex-col gap-1">
          <span className={`px-2 py-1 rounded text-xs font-medium w-fit text-white ${getStatusColor(row.status)}`}>
            {row.status}
          </span>
          {row.priority && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium w-fit">
              {row.priority}
            </span>
          )}
        </div>
      );
    case 'assignedTo':
      return <span className="italic text-gray-500 dark:text-gray-400">{row.assignedTo || 'Not assigned'}</span>;
    case 'countdown':
      return (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-gray-100 font-medium">{row.countdown}</div>
          <div className="text-gray-500 dark:text-gray-400">{row.autoComplete}</div>
        </div>
      );
    default:
      return <span title={String(value ?? '')} className="block overflow-hidden text-ellipsis">{String(value ?? '')}</span>;
  }
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'new': return 'bg-green-500';
    case 'in progress': return 'bg-blue-500';
    case 'ready for design': return 'bg-cyan-500';
    case 'hold': return 'bg-yellow-500';
    case 'revision': return 'bg-orange-500';
    case 'delivered': return 'bg-purple-500';
    case 'cancelled': return 'bg-red-500';
    case 'completed': return 'bg-emerald-500';
    default: return 'bg-gray-500';
  }
}

function formatDate(dateString: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
