import { IPlanset, SortConfig, TableFilters } from '@shared/types';


export function generateMockProjects(count = 50): IPlanset[] {
  const firstNames = ["Adam", "Sandra", "Richard", "Peter", "Bruce", "Tony", "Natasha"];
  const lastNames = ["Golightly", "Clark", "Prager", "Wayne", "Kent", "Stark", "Romanoff"];
  const statuses: IPlanset['status'][] = ["IN PROGRESS", "READY FOR DESIGN", "COMPLETED", "ON HOLD"];
  const priorities: IPlanset['priority'][] = ["HIGH", "MEDIUM", "LOW"];
  const colors = ["#4CAF50", "#3B82F6", "#F59E0B", "#607D8B", "#E53935", "#8E24AA"];

  const projects: IPlanset[] = [];
  for (let i = 1; i <= count; i++) {
    const customerName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const initials = customerName.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2);
    const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    const receivedDate = new Date(createdDate);
    receivedDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 5) + 1);

    projects.push({
      id: `proj_${i}`,
      customer: {
        name: customerName,
        type: Math.random() > 0.5 ? 'Residential' : 'Commercial',
        address: `${1000 + i} Main St, Phoenix, AZ 85033, USA`,
        initials,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      projectDetails: `PV${Math.random() > 0.5 ? '+Battery' : ''}`,
      keyDates: {
        created: createdDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
        received: receivedDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignedTo: Math.random() > 0.4 ? undefined : 'Not assigned',
      countdown: '02:00:00',
      autoComplete: 'Auto-Complete',
      priority: Math.random() > 0.3 ? priorities[Math.floor(Math.random() * priorities.length)] : undefined,
    });
  }
  return projects;
}