import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProjectRow } from './ProjectRow';
import { IPlanset, SortConfig } from '@shared/types';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface PlansetDataTableProps {
  projects: IPlanset[];
  loading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  onSort: (key: keyof IPlanset | 'customer') => void;
}

export function PlansetDataTable({ projects, loading, error, sortConfig, onSort }: PlansetDataTableProps) {

  const SortableHeader = ({ label, field }: { label: string; field: keyof IPlanset | 'customer' }) => {
    const isSorting = sortConfig.key === field;
    const Icon = isSorting ? (sortConfig.direction === 'asc' ? ChevronUp : ChevronDown) : ArrowUpDown;
    return (
      <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50" onClick={() => onSort(field)}>
        <div className="flex items-center gap-2">
          {label}
          <Icon className={`w-4 h-4 ${isSorting ? 'text-black dark:text-white' : 'text-gray-400'}`} />
        </div>
      </TableHead>
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading projects...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    // The main container now uses flexbox to structure the header and body
    <div className="border rounded-lg bg-white dark:bg-gray-800 shadow-md flex flex-col h-full">
      <Table>
        {/* The TableHeader is now sticky to the top of its container */}
        <TableHeader className="sticky  top-0 z-10 bg-gray-50 dark:bg-gray-700/50">
          <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <SortableHeader label="Customer Details" field="customer" />
            <SortableHeader label="Project Details" field="projectDetails" />
            <SortableHeader label="Key Dates" field="keyDates" />
            <SortableHeader label="Status" field="status" />
            <SortableHeader label="Assigned To" field="assignedTo" />
            <SortableHeader label="Countdown" field="countdown" />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      
      {/* This div is the scrollable container for the table body */}
      <div className="overflow-y-auto flex-1">
        <Table className="w-full">
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => <ProjectRow key={project.id} project={project} />)
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 h-24">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}