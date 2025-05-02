
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

type ReportContentProps = {
  reportType: string;
  report: {
    date: string;
    data: any;
  };
};

export function ReportDisplay({ reportType, report }: ReportContentProps) {
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
}
