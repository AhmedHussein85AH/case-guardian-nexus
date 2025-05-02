
import { Button } from "@/components/ui/button";
import { Case } from "@/types/case";

type ReportGeneratorProps = {
  title: string;
  description: string;
  reportType: string;
  isGenerating: boolean;
  onGenerate: (reportType: string) => void;
  reportContent: React.ReactNode;
};

export function ReportGenerator({
  title,
  description,
  reportType,
  isGenerating,
  onGenerate,
  reportContent
}: ReportGeneratorProps) {
  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button 
        onClick={() => onGenerate(reportType)}
        disabled={isGenerating === true}
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
      
      {reportContent}
    </div>
  );
}

type CaseReportsTabProps = {
  cases: Case[];
  generatingReport: string | null;
  generatedReports: {
    [key: string]: {
      date: string;
      data: any;
    }
  };
  handleGenerateReport: (reportType: string) => void;
  renderReportContent: (reportType: string) => React.ReactNode;
  handleExportReports: () => void;
};

export function CaseReportsTab({
  generatingReport,
  generatedReports, 
  handleGenerateReport,
  renderReportContent,
  handleExportReports
}: CaseReportsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <ReportGenerator
        title="Summary Report"
        description="A high-level overview of all cases"
        reportType="Summary Report"
        isGenerating={generatingReport === 'Summary Report'}
        onGenerate={handleGenerateReport}
        reportContent={generatedReports['Summary Report'] && renderReportContent('Summary Report')}
      />
      <ReportGenerator
        title="Detailed Report"
        description="In-depth analysis of case data"
        reportType="Detailed Report"
        isGenerating={generatingReport === 'Detailed Report'}
        onGenerate={handleGenerateReport}
        reportContent={generatedReports['Detailed Report'] && renderReportContent('Detailed Report')}
      />
    </div>
  );
}

export function AnalyticsTab({
  generatingReport,
  generatedReports, 
  handleGenerateReport,
  renderReportContent
}: Omit<CaseReportsTabProps, 'cases' | 'handleExportReports'>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <ReportGenerator
        title="Trend Analysis"
        description="Analyze case trends over time"
        reportType="Trend Analysis"
        isGenerating={generatingReport === 'Trend Analysis'}
        onGenerate={handleGenerateReport}
        reportContent={generatedReports['Trend Analysis'] && renderReportContent('Trend Analysis')}
      />
      <ReportGenerator
        title="Location Heat Map"
        description="Geographic distribution of cases"
        reportType="Location Heat Map"
        isGenerating={generatingReport === 'Location Heat Map'}
        onGenerate={handleGenerateReport}
        reportContent={generatedReports['Location Heat Map'] && renderReportContent('Location Heat Map')}
      />
    </div>
  );
}
