import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";
import Design from "./pages/Design";
import Teams from "./pages/Teams";
import Garage from "./pages/Garage";
import Members from "./pages/Members";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "@/pages/not-found";

// Design Pages
import NewProjects from "./pages/design/NewProjects";
import DesignReview from "./pages/design/DesignReview";
import InRevision from "./pages/design/InRevision";
import HoldProjects from "./pages/design/HoldProjects";
import InDesigning from "./pages/design/InDesigning";
import Completed from "./pages/design/Completed";
import Canceled from "./pages/design/Canceled";

// Garage Pages
import Electrical from "./pages/garage/Electrical";
import Structural from "./pages/garage/Structural";
import Requirements from "./pages/garage/Requirements";

// Organisation/HRM Pages
import OrganisationDashboard from "./pages/organisation/OrganisationDashboard";
import AttendanceManagement from "./pages/organisation/AttendanceManagement";
import EmployeeManagement from "./pages/organisation/EmployeeManagement";
import LeaveManagement from "./pages/organisation/LeaveManagement";
import PayrollManagement from "./pages/organisation/PayrollManagement";
import DepartmentManagement from "./pages/organisation/DepartmentManagement";
import ReportsAnalytics from "./pages/organisation/ReportsAnalytics";
import OrganisationSettings from "./pages/organisation/OrganisationSettings";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/employees" component={Employees} />
        <Route path="/clients" component={Clients} />
        <Route path="/design" component={Design} />
        <Route path="/teams" component={Teams} />
        <Route path="/garage" component={Garage} />
        <Route path="/members" component={Members} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />

        {/* Design Routes */}
        <Route path="/design/new-projects" component={NewProjects} />
        <Route path="/design/design-review" component={DesignReview} />
        <Route path="/design/in-revision" component={InRevision} />
        <Route path="/design/hold-projects" component={HoldProjects} />
        <Route path="/design/in-designing" component={InDesigning} />
        <Route path="/design/completed" component={Completed} />
        <Route path="/design/canceled" component={Canceled} />
        
        {/* Garage Routes */}
        <Route path="/garage/electrical" component={Electrical} />
        <Route path="/garage/structural" component={Structural} />
        <Route path="/garage/requirements" component={Requirements} />

        {/* Organisation/HRM Routes */}
        <Route path="/organisation/dashboard" component={OrganisationDashboard} />
        <Route path="/organisation/employee-management" component={EmployeeManagement} />
        <Route path="/organisation/attendance" component={AttendanceManagement} />
        <Route path="/organisation/leave-management" component={LeaveManagement} />
        <Route path="/organisation/payroll" component={PayrollManagement} />
        <Route path="/organisation/departments" component={DepartmentManagement} />
        <Route path="/organisation/reports" component={ReportsAnalytics} />
        <Route path="/organisation/settings" component={OrganisationSettings} />

        {/* NotFound Route should be last */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeContextProvider>
  );
}

export default App;