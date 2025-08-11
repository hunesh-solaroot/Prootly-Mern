import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Activity, MoreHorizontal } from 'lucide-react';
import { IPlanset, SortConfig, TableFilters } from '@shared/types';


interface ProjectRowProps {
  project: IPlanset;
}

export function ProjectRow({ project }: ProjectRowProps) {
  const getStatusVariant = (status: IPlanset['status']): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'IN PROGRESS') return 'default';
    if (status === 'COMPLETED') return 'secondary';
    if (status === 'ON HOLD') return 'destructive';
    return 'outline';
  };

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <TableCell>
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: project.customer.color }}
          >
            {project.customer.initials}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{project.customer.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{project.customer.type}</div>
            <div className="text-xs text-gray-400">{project.customer.address}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-medium">{project.projectDetails}</TableCell>
      <TableCell>
        <div className="text-sm">
          <div><span className="font-semibold text-gray-500 dark:text-gray-400">Created:</span> {project.keyDates.created}</div>
          <div><span className="font-semibold text-gray-500 dark:text-gray-400">Received:</span> {project.keyDates.received}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col space-y-1 items-start">
          <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
          {project.priority && <Badge variant="destructive">{project.priority}</Badge>}
        </div>
      </TableCell>
      <TableCell className="text-gray-500 dark:text-gray-400 italic">{project.assignedTo || 'Not assigned'}</TableCell>
      <TableCell>
        <div className="font-semibold">{project.countdown}</div>
        <div className="text-xs text-gray-400">{project.autoComplete}</div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-1 justify-end">
          <Button size="sm" className="bg-green-600 hover:bg-green-700">Edit</Button>
          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">Activity</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Hold</DropdownMenuItem>
              <DropdownMenuItem>Cancel</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}