import { useState, useEffect, useMemo } from 'react';
import { PlansetHeader } from '../../components/planset/PlansetHeader';
import { PlansetDataTable } from '../../components/planset/PlansetDataTable';
import { IPlanset, SortConfig, TableFilters } from '@shared/types';
import { generateMockProjects } from '../../lib/mockData';

export default function NewProjectsPage() {
  // --- STATE MANAGEMENT ---
  const [allProjects, setAllProjects] = useState<IPlanset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<TableFilters>({
    search: '',
    states: new Set<string>(),
    portals: new Set<string>(),
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'customer',
    direction: 'asc',
  });

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // First try to get real plansets from API
        const response = await fetch('/api/plansets');
        if (response.ok) {
          const plansets = await response.json();
          console.log("Fetched plansets:", plansets);
          
          // Convert plansets to IPlanset format for display
          const convertedProjects: IPlanset[] = plansets.map((planset: any) => ({
            id: planset.id,
            customer: {
              name: planset.customerName,
              type: planset.propertyType === 'residential' ? 'Residential' : 'Commercial',
              address: `${planset.siteAddress}, ${planset.city}, ${planset.state}`,
              initials: planset.customerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
              color: '#10B981'
            },
            projectDetails: planset.jobType.toUpperCase(),
            keyDates: {
              created: new Date(planset.createdAt).toLocaleDateString(),
              received: planset.receivedTime ? new Date(planset.receivedTime).toLocaleDateString() : new Date(planset.createdAt).toLocaleDateString()
            },
            status: 'IN PROGRESS' as const,
            assignedTo: null,
            countdown: '02:00:00',
            autoComplete: 'Auto-Complete',
            priority: 'HIGH' as const
          }));
          
          // Mix with mock data for demonstration
          setAllProjects([...convertedProjects, ...generateMockProjects(10)]);
        } else {
          // Fallback to mock data
          setAllProjects(generateMockProjects(50));
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // --- FILTERING & SORTING LOGIC ---
  const processedProjects = useMemo(() => {
    let filtered = [...allProjects];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.customer.name.toLowerCase().includes(searchTerm) ||
        p.customer.address.toLowerCase().includes(searchTerm) ||
        p.projectDetails.toLowerCase().includes(searchTerm)
      );
    }


    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const getSortValue = (p: IPlanset, key: keyof IPlanset | 'customer' | 'created') => {
            if (key === 'customer') return p.customer.name;
            if (key === 'created') return p.keyDates.created;
            return p[key as keyof IPlanset];
        };

        const aValue = getSortValue(a, sortConfig.key!);
        const bValue = getSortValue(b, sortConfig.key!);

        // Handle undefined values - sort undefined to end
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allProjects, filters, sortConfig]);

  // --- HANDLERS ---
  const handleSort = (key: keyof IPlanset | 'customer' | 'created') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
      <PlansetHeader
        filters={filters}
        onFiltersChange={setFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <PlansetDataTable
          projects={processedProjects}
          loading={loading}
          error={error}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </main>
    </div>
  );
}
