
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPriorityCount, getStatusCount, getRecentCases } from "@/data/mockCases";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import CasesList from "@/components/cases/CasesList";
import { AlertCircle, Bell, CheckCircle, ClockIcon, FileCheck } from "lucide-react";

const DashboardOverview = () => {
  const statusCounts = getStatusCount();
  const priorityCounts = getPriorityCount();
  const recentCases = getRecentCases(5);
  
  // Format data for status pie chart
  const statusData = [
    { name: 'New', value: statusCounts.new, color: '#3B82F6' },
    { name: 'In Progress', value: statusCounts.inprogress, color: '#8B5CF6' },
    { name: 'Resolved', value: statusCounts.resolved, color: '#10B981' },
  ];
  
  // Format data for priority pie chart
  const priorityData = [
    { name: 'Low', value: priorityCounts.low, color: '#10B981' },
    { name: 'Medium', value: priorityCounts.medium, color: '#F59E0B' },
    { name: 'High', value: priorityCounts.high, color: '#EF4444' },
  ];
  
  // Sample data for time chart
  const timeData = [
    { name: 'Mon', newCases: 4, resolvedCases: 2 },
    { name: 'Tue', newCases: 3, resolvedCases: 4 },
    { name: 'Wed', newCases: 5, resolvedCases: 3 },
    { name: 'Thu', newCases: 2, resolvedCases: 5 },
    { name: 'Fri', newCases: 3, resolvedCases: 2 },
    { name: 'Sat', newCases: 1, resolvedCases: 1 },
    { name: 'Sun', newCases: 0, resolvedCases: 1 },
  ];
  
  // Sample data for monthly chart
  const monthlyData = [
    { name: 'Jan', cases: 18 },
    { name: 'Feb', cases: 25 },
    { name: 'Mar', cases: 30 },
    { name: 'Apr', cases: 20 },
    { name: 'May', cases: 15 },
    { name: 'Jun', cases: 22 },
  ];

  const totalCases = statusCounts.new + statusCounts.inprogress + statusCounts.resolved;
  const completionRate = Math.round((statusCounts.resolved / totalCases) * 100);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
            <p className="text-xs text-muted-foreground">
              +{statusCounts.new} new cases this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.new + statusCounts.inprogress}</div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.inprogress} cases in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.resolved} cases resolved
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priorityCounts.high}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-2 grid grid-cols-3 gap-4 text-center">
              {statusData.map((status) => (
                <div key={status.name} className="flex flex-col">
                  <div className="text-sm font-medium">{status.name}</div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: status.color }}
                  >
                    {status.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Case Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-2 grid grid-cols-3 gap-4 text-center">
              {priorityData.map((priority) => (
                <div key={priority.name} className="flex flex-col">
                  <div className="text-sm font-medium">{priority.name}</div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: priority.color }}
                  >
                    {priority.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Case Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newCases" name="New Cases" fill="#3B82F6" />
                  <Bar dataKey="resolvedCases" name="Resolved Cases" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="monthly">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    name="Total Cases" 
                    stroke="#8B5CF6" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <CasesList 
        cases={recentCases}
        showCreateButton={false}
        showFilters={false}
        showPagination={false}
        title="Recent Cases"
        description="The 5 most recently submitted cases"
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Notifications</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <span className="flex h-10 w-10 shrink-0 rounded-full items-center justify-center bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">New high priority case assigned</p>
                <p className="text-xs text-muted-foreground">Case #CG-12345 has been assigned to John Smith</p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <span className="flex h-10 w-10 shrink-0 rounded-full items-center justify-center bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">Case resolved</p>
                <p className="text-xs text-muted-foreground">Case #CG-12340 has been marked as resolved</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <span className="flex h-10 w-10 shrink-0 rounded-full items-center justify-center bg-blue-100">
                <Bell className="h-5 w-5 text-blue-600" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">Comment added to case</p>
                <p className="text-xs text-muted-foreground">Jane Doe added a comment to Case #CG-12342</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
