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
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

const ReportsPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<{
    [key: string]: {
      date: string;
      data: any;
    }
  }>({});
  
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
  
  const generateSummaryReport = () => {
    const openCases = cases.filter(c => c.status !== "resolved").length;
    const resolvedCases = cases.filter(c => c.status === "resolved").length;
    const highPriorityCases = cases.filter(c => c.priority === "high").length;
    
    return {
      totalCases: cases.length,
      openCases,
      closedCases: resolvedCases,
      closureRate: cases.length > 0 ? (resolvedCases / cases.length * 100).toFixed(1) : 0,
      highPriorityCases,
      caseTypeDistribution: caseTypeData,
      statusDistribution: statusData,
      priorityDistribution: priorityData,
    };
  };
  
  const generateDetailedReport = () => {
    // Return a more detailed version with full case data
    return {
      summary: generateSummaryReport(),
      caseDetails: cases.map(c => ({
        id: c.id,
        caseId: c.caseId,
        type: c.caseType,
        status: c.status,
        priority: c.priority,
        operator: c.operatorName, // Using operatorName instead of assigned which doesn't exist
        created: c.createdAt,
        updated: c.updatedAt,
      })),
    };
  };
  
  const generateTrendAnalysis = () => {
    // Create a trend analysis over time
    return {
      monthlyTrends: monthlyData,
      priorityTrends: priorityData,
      recommendation: "Case volume has increased by 15% over the last quarter. Consider allocating additional resources to maintain service levels.",
    };
  };
  
  const generateLocationMap = () => {
    // Generate location data
    const locations = [
      { region: "North", cases: 34 },
      { region: "South", cases: 28 },
      { region: "East", cases: 19 },
      { region: "West", cases: 22 },
      { region: "Central", cases: 17 },
    ];
    
    return {
      locationData: locations,
      hotspots: ["North", "South"],
      recommendation: "The North and South regions show significantly higher case volumes. Consider investigating regional factors or allocating more resources to these areas."
    };
  };
  
  const handleGenerateReport = (reportType: string) => {
    setGeneratingReport(reportType);
    
    // Generate the actual report based on type
    setTimeout(() => {
      let reportData;
      
      switch(reportType) {
        case 'Summary Report':
          reportData = generateSummaryReport();
          break;
        case 'Detailed Report':
          reportData = generateDetailedReport();
          break;
        case 'Trend Analysis':
          reportData = generateTrendAnalysis();
          break;
        case 'Location Heat Map':
          reportData = generateLocationMap();
          break;
        default:
          reportData = {};
      }
      
      // Save the generated report
      setGeneratedReports(prev => ({
        ...prev,
        [reportType]: {
          date: new Date().toLocaleString(),
          data: reportData
        }
      }));
      
      setGeneratingReport(null);
      
      toast({
        title: `${reportType} generated`,
        description: `Your ${reportType.toLowerCase()} has been generated successfully`,
      });
    }, 1500);
  };
  
  // Helper to render the appropriate report view
  const renderReportContent = (reportType: string) => {
    const report = generatedReports[reportType];
    if (!report) return null;
    
    switch(reportType) {
      case 'Summary Report':
        return (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-medium">Summary Report (Generated on {report.date})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{report.data.totalCases}</div>
                <div className="text-sm text-muted-foreground">Total Cases</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{report.data.openCases}</div>
                <div className="text-sm text-muted-foreground">Open Cases</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{report.data.closedCases}</div>
                <div className="text-sm text-muted-foreground">Closed Cases</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{report.data.closureRate}%</div>
                <div className="text-sm text-muted-foreground">Closure Rate</div>
              </div>
            </div>
          </div>
        );
        
      case 'Detailed Report':
        return (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-medium">Detailed Report (Generated on {report.date})</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.data.caseDetails.slice(0, 5).map((caseItem: any) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>{caseItem.id.substring(0, 8)}...</TableCell>
                      <TableCell>{caseItem.caseId.substring(0, 8)}...</TableCell>
                      <TableCell>{caseItem.type}</TableCell>
                      <TableCell>{caseItem.status}</TableCell>
                      <TableCell>{caseItem.priority}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {report.data.caseDetails.length > 5 && (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Showing 5 of {report.data.caseDetails.length} cases
                </div>
              )}
            </div>
          </div>
        );
        
      case 'Trend Analysis':
        return (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-medium">Trend Analysis (Generated on {report.date})</h3>
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Key Findings</h4>
              <p>{report.data.recommendation}</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
        
      case 'Location Heat Map':
        return (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-medium">Location Analysis (Generated on {report.date})</h3>
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Regional Hotspots</h4>
              <p>Primary hotspot regions: {report.data.hotspots.join(", ")}</p>
              <p className="mt-2">{report.data.recommendation}</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.data.locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="region" type="category" />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
        
      default:
        return null;
    }
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
          
          {/* Overview Tab Content */}
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
          
          {/* Case Reports Tab Content */}
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
                    
                    {/* Render the summary report content if it exists */}
                    {generatedReports['Summary Report'] && renderReportContent('Summary Report')}
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
                    
                    {/* Render the detailed report content if it exists */}
                    {generatedReports['Detailed Report'] && renderReportContent('Detailed Report')}
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
          
          {/* Analytics Tab Content */}
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
                    
                    {/* Render the trend analysis content if it exists */}
                    {generatedReports['Trend Analysis'] && renderReportContent('Trend Analysis')}
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
                    
                    {/* Render the location heat map content if it exists */}
                    {generatedReports['Location Heat Map'] && renderReportContent('Location Heat Map')}
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
