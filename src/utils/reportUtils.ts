
import { Case } from "@/types/case";

export type ReportData = {
  [key: string]: {
    date: string;
    data: any;
  };
};

// Function to generate data for charts
export const generateChartData = (cases: Case[]) => {
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
  
  // Cases by priority data for bar chart
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

  return {
    caseTypeData,
    statusData,
    priorityData,
    monthlyData
  };
};

// Generate summary report
export const generateSummaryReport = (cases: Case[], chartData: ReturnType<typeof generateChartData>) => {
  const openCases = cases.filter(c => c.status !== "resolved").length;
  const resolvedCases = cases.filter(c => c.status === "resolved").length;
  const highPriorityCases = cases.filter(c => c.priority === "high").length;
  
  return {
    totalCases: cases.length,
    openCases,
    closedCases: resolvedCases,
    closureRate: cases.length > 0 ? (resolvedCases / cases.length * 100).toFixed(1) : 0,
    highPriorityCases,
    caseTypeDistribution: chartData.caseTypeData,
    statusDistribution: chartData.statusData,
    priorityDistribution: chartData.priorityData,
  };
};

// Generate detailed report
export const generateDetailedReport = (cases: Case[], chartData: ReturnType<typeof generateChartData>) => {
  // Return a more detailed version with full case data
  return {
    summary: generateSummaryReport(cases, chartData),
    caseDetails: cases.map(c => ({
      id: c.id,
      caseId: c.caseId,
      type: c.caseType,
      status: c.status,
      priority: c.priority,
      operator: c.operatorName,
      created: c.createdAt,
      updated: c.updatedAt,
    })),
  };
};

// Generate trend analysis
export const generateTrendAnalysis = (chartData: ReturnType<typeof generateChartData>) => {
  // Create a trend analysis over time
  return {
    monthlyTrends: chartData.monthlyData,
    priorityTrends: chartData.priorityData,
    recommendation: "Case volume has increased by 15% over the last quarter. Consider allocating additional resources to maintain service levels.",
  };
};

// Generate location map
export const generateLocationMap = () => {
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
