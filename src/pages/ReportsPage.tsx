import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { downloadCSV, exportCasesCSV, getAllCases } from "@/services/dataService";
import { Case } from "@/types/case";
import { useToast } from "@/hooks/use-toast";

const ReportsPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  
  useEffect(() => {
    setCases(getAllCases());
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "case-guardian-cases") {
        setCases(getAllCases());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Case type distribution data
  const caseTypeData = cases.reduce((acc, caseItem) => {
    const existingType = acc.find(item => item.name === caseItem.caseType);
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ name: caseItem.caseType, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);
  
  // Cases by status data
  const statusData = cases.reduce((acc, caseItem) => {
    const existingStatus = acc.find(item => item.name === caseItem.status);
    if (existingStatus) {
      existingStatus.value += 1;
    } else {
      acc.push({ name: caseItem.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);
  
  // Cases by priority data for bar chart - fixing the case to match CasePriority type
  const priorityData = [
    { name: "Low", value: cases.filter(c => c.priority === "low").length },
    { name: "Medium", value: cases.filter(c => c.priority === "medium").length },
    { name: "High", value: cases.filter(c => c.priority === "high").length },
  ];
  
  // Cases by month data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    return {
      name: monthName,
      value: Math.floor(Math.random() * 20) + 5,  // Random value between 5-25
    };
  }).reverse();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const handleExportReports = () => {
    const csvContent = exportCasesCSV();
    const filename = `case-guardian-report-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(filename, csvContent);
    
    toast({
      title: "Report exported",
      description: `File "${filename}" has been downloaded`,
    });
  };
  
  const handleGenerateReport = (reportType: string) => {
    setGeneratingReport(reportType);
    
    // Simulate report generation with a delay
    setTimeout(() => {
      setGeneratingReport(null);
      toast({
        title: `${reportType} generated`,
        description: `Your ${reportType.toLowerCase()} has been generated successfully`,
      });
    }, 1500);
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-2">
              Analyze case data and generate insights
            </p>
          </div>
          
          <Button variant="outline" className="self-start flex items-center gap-2" onClick={handleExportReports}>
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="py-2">
              <BarChart3 className="h-4 w-4 mr-2 md:inline hidden" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="cases" className="py-2">
              <FileText className="h-4 w-4 mr-2 md:inline hidden" />
              Case Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="py-2">
              <PieChart className="h-4 w-4 mr-2 md:inline hidden" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Case Types Distribution</CardTitle>
                  <CardDescription>Breakdown of cases by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPieChart>
                        <Pie
                          data={caseTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {caseTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Case Volume</CardTitle>
                  <CardDescription>Number of cases over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Case Priority Distribution</CardTitle>
                  <CardDescription>Breakdown of cases by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priorityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Breakdown of cases by current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Reports</CardTitle>
                <CardDescription>Generate detailed case reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Summary Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">A high-level overview of all cases</p>
                    <Button 
                      onClick={() => handleGenerateReport('Summary Report')}
                      disabled={generatingReport === 'Summary Report'}
                    >
                      {generatingReport === 'Summary Report' ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Detailed Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">In-depth analysis of case data</p>
                    <Button 
                      onClick={() => handleGenerateReport('Detailed Report')}
                      disabled={generatingReport === 'Detailed Report'}
                    >
                      {generatingReport === 'Detailed Report' ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={handleExportReports}>
                  <Download className="mr-2 h-4 w-4" />
                  Export All Reports
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed analytics insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Trend Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">Analyze case trends over time</p>
                    <Button 
                      onClick={() => handleGenerateReport('Trend Analysis')}
                      disabled={generatingReport === 'Trend Analysis'}
                    >
                      {generatingReport === 'Trend Analysis' ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Location Heat Map</h3>
                    <p className="text-sm text-muted-foreground mb-4">Geographic distribution of cases</p>
                    <Button 
                      onClick={() => handleGenerateReport('Location Heat Map')}
                      disabled={generatingReport === 'Location Heat Map'}
                    >
                      {generatingReport === 'Location Heat Map' ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={handleExportReports}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Analytics
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default ReportsPage;
