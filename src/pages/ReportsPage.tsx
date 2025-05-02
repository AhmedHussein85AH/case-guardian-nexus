
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { downloadCSV, exportCasesCSV, getAllCases } from "@/services/dataService";
import { Case } from "@/types/case";
import { useToast } from "@/hooks/use-toast";
import { ReportCards } from "@/components/reports/ReportCards";
import { CaseReportsTab, AnalyticsTab } from "@/components/reports/ReportGenerators";
import { ReportDisplay } from "@/components/reports/ReportDisplay";
import { 
  generateChartData, 
  generateSummaryReport, 
  generateDetailedReport,
  generateTrendAnalysis,
  generateLocationMap,
  ReportData
} from "@/utils/reportUtils";

const ReportsPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<ReportData>({});
  
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
  
  // Generate chart data from cases
  const chartData = generateChartData(cases);
  
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
    
    // Generate the actual report based on type
    setTimeout(() => {
      let reportData;
      
      switch(reportType) {
        case 'Summary Report':
          reportData = generateSummaryReport(cases, chartData);
          break;
        case 'Detailed Report':
          reportData = generateDetailedReport(cases, chartData);
          break;
        case 'Trend Analysis':
          reportData = generateTrendAnalysis(chartData);
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
    
    return <ReportDisplay reportType={reportType} report={report} />;
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
            <ReportCards
              caseTypeData={chartData.caseTypeData}
              monthlyData={chartData.monthlyData}
              priorityData={chartData.priorityData}
              statusData={chartData.statusData}
            />
          </TabsContent>
          
          {/* Case Reports Tab Content */}
          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Reports</CardTitle>
                <CardDescription>Generate detailed case reports</CardDescription>
              </CardHeader>
              <CardContent>
                <CaseReportsTab
                  cases={cases}
                  generatingReport={generatingReport}
                  generatedReports={generatedReports}
                  handleGenerateReport={handleGenerateReport}
                  renderReportContent={renderReportContent}
                  handleExportReports={handleExportReports}
                />
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
                <AnalyticsTab
                  generatingReport={generatingReport}
                  generatedReports={generatedReports}
                  handleGenerateReport={handleGenerateReport}
                  renderReportContent={renderReportContent}
                />
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
