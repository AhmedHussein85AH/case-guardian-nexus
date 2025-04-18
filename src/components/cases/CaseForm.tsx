
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { caseTypes, priorities, statuses } from "@/data/mockCases";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Case, CasePriority, CaseStatus, CaseType } from "@/types/case";

const CaseForm = () => {
  const [formData, setFormData] = useState({
    caseType: "theft" as CaseType,
    description: "",
    incidentDate: new Date().toISOString().split("T")[0],
    incidentTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
    location: "",
    unitNumber: "",
    village: "",
    priority: "medium" as CasePriority,
    cctvFootage: false,
    operatorName: "",
    status: "new" as CaseStatus,
    followUpActions: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new case ID
      const caseId = `CG-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // In a real app, we would send this to an API
      console.log("Submitting case:", { ...formData, caseId });
      
      toast({
        title: "Case created successfully",
        description: `Case ID: ${caseId}`,
      });
      
      navigate("/cases");
    } catch (error) {
      toast({
        title: "Error creating case",
        description: "An error occurred while creating the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create New Case</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="details">Case Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseType">Case Type</Label>
                  <Select 
                    name="caseType"
                    value={formData.caseType} 
                    onValueChange={(value) => handleSelectChange("caseType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    name="priority"
                    value={formData.priority} 
                    onValueChange={(value) => handleSelectChange("priority", value as CasePriority)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Incident Date</Label>
                  <Input
                    id="incidentDate"
                    name="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incidentTime">Incident Time</Label>
                  <Input
                    id="incidentTime"
                    name="incidentTime"
                    type="time"
                    value={formData.incidentTime}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter detailed description of the case"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter the location of the incident"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">Unit Number</Label>
                  <Input
                    id="unitNumber"
                    name="unitNumber"
                    placeholder="Unit number (if applicable)"
                    value={formData.unitNumber}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="village">Village</Label>
                  <Input
                    id="village"
                    name="village"
                    placeholder="Village name (if applicable)"
                    value={formData.village}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="additional" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operatorName">Operator Name</Label>
                  <Input
                    id="operatorName"
                    name="operatorName"
                    placeholder="Name of the operator receiving the case"
                    value={formData.operatorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    name="status"
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value as CaseStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === 'inprogress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <Label htmlFor="cctvFootage" className="font-medium">CCTV Footage Available</Label>
                    <p className="text-sm text-muted-foreground">Toggle if there is CCTV footage available for this case</p>
                  </div>
                  <Switch
                    id="cctvFootage"
                    checked={formData.cctvFootage}
                    onCheckedChange={(checked) => handleSwitchChange("cctvFootage", checked)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="followUpActions">Follow-Up Actions</Label>
                  <Textarea
                    id="followUpActions"
                    name="followUpActions"
                    placeholder="Enter any follow-up actions required"
                    rows={3}
                    value={formData.followUpActions}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate("/cases")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Case"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CaseForm;
