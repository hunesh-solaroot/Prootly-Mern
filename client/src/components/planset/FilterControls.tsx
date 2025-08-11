import { Calendar, MapPin, Building, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TableFilters } from '@shared/types'; // Adjust path if needed

interface FilterControlsProps {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
}

// Mock data for dropdowns - replace with data from your API
const states = [
    { code: 'AZ', name: 'Arizona', count: 1 },
    { code: 'CJ', name: 'Colorado', count: 1 },
    { code: 'DR', name: 'Delaware', count: 11 },
    { code: 'KS', name: 'Kansas', count: 1 },
    { code: 'CA', name: 'California', count: 15 }
];

const portals = [
    { id: 'portal', name: 'Portal', count: 13 },
    { id: 'portal-gamma', name: 'Portal Gamma', count: 10 },
    { id: 'portal-delta', name: 'Portal Delta', count: 16 },
    { id: 'portal-beta', name: 'Portal Beta', count: 2 }
];


export function FilterControls({ filters, onFiltersChange }: FilterControlsProps) {

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      states: new Set(),
      portals: new Set(),
    });
  };

  return (
    <div className="flex items-center gap-4 pl-5 ml-5">
      {/* Date Range Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full font-normal text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            Select Date Range
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[15rem] p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button variant="outline" size="sm" className="font-normal">Today</Button>
            <Button variant="outline" size="sm" className="font-normal">This Week</Button>
            <Button variant="outline" size="sm" className="font-normal">This Month</Button>
            <Button variant="outline" size="sm" className="font-normal">This Quarter</Button>
            <Button variant="outline" size="sm" className="font-normal">This Year</Button>
            <Button variant="outline" size="sm" className="font-normal">Custom Range</Button>
          </div>
          <div className="flex justify-end gap-2 border-t pt-2">
            <Button variant="ghost" size="sm">Clear</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* States Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full font-normal text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            Select States
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[11rem] p-0">
            <div className="p-3 border-b">
                <p className="font-semibold">Filter by State</p>
            </div>
            <div className="p-3 max-h-60 overflow-y-auto">
                {states.map(state => (
                    <div key={state.code} className="flex items-center justify-between py-1">
                        <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                            <Checkbox 
                                id={`state-${state.code}`}
                                checked={filters.states.has(state.code)}
                                onCheckedChange={(checked) => {
                                    const newStates = new Set(filters.states);
                                    if (checked) {
                                        newStates.add(state.code);
                                    } else {
                                        newStates.delete(state.code);
                                    }
                                    onFiltersChange({ ...filters, states: newStates });
                                }}
                            />
                            {state.name}
                        </label>
                        <Badge variant="secondary" className="rounded-full">{state.count}</Badge>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 p-3 border-t">
                <Button variant="ghost" size="sm">Clear</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Apply</Button>
            </div>
        </PopoverContent>
      </Popover>
      
      {/* Portals & Clients Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full font-normal text-gray-600 dark:text-gray-300">
            <Building className="w-4 h-4 mr-2" />
            Select Portals & Clients
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[15rem] p-0">
            <div className="p-3 border-b">
                <p className="font-semibold">Filter by Portal</p>
            </div>
            <div className="p-3 max-h-60 overflow-y-auto">
                {portals.map(portal => (
                    <div key={portal.id} className="flex items-center justify-between py-1">
                        <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                            <Checkbox 
                                id={`portal-${portal.id}`}
                                checked={filters.portals.has(portal.id)}
                                onCheckedChange={(checked) => {
                                    const newPortals = new Set(filters.portals);
                                    if (checked) {
                                        newPortals.add(portal.id);
                                    } else {
                                        newPortals.delete(portal.id);
                                    }
                                    onFiltersChange({ ...filters, portals: newPortals });
                                }}
                            />
                            {portal.name}
                        </label>
                        <Badge variant="secondary" className="rounded-full">{portal.count}</Badge>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 p-3 border-t">
                <Button variant="ghost" size="sm">Clear</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Apply</Button>
            </div>
        </PopoverContent>
      </Popover>

      <Button variant="ghost" onClick={clearAllFilters} className="text-gray-600 dark:text-gray-300">Clear All</Button>
    </div>
  );
}