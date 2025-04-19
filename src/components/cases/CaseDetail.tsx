import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Case, CasePriority, CaseStatus } from "@/types/case";
import { getCaseById } from "@/services/dataService";
import { ArrowLeft, Calendar, Clock, Edit, MessageSquare, MapPin, User, Users, FileText, Tag, Car, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get case from dataService instead of mock data
  const caseData = id ? getCaseById(id) : null;
  
  const [status, setStatus] = useState<CaseStatus>(caseData?.status || 'new');
  const [priority, setPriority] = useState<CasePriority>(caseData?.priority || 'medium');
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Case Not Found</h2>
        <p className="text-muted-foreground mb-6">The case you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/cases')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cases
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const renderPriorityBadge = (priority: CasePriority) => {
    return <span className={`case-priority-${priority}`}>{priority}</span>;
  };

  const renderStatusBadge = (status: CaseStatus) => {
    const label = status === 'inprogress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`case-status-${status}`}>{label}</span>;
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as CaseStatus);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value as CasePriority);
  };

  const handleUpdateCase = async () => {
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the case in the database
      console.log("Updating case:", { id, status, priority, comment });
      
      toast({
        title: "Case updated successfully",
        description: `Case ${caseData.caseId} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error updating case",
        description: "An error occurred while updating the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderActivityLog = () => {
    // Mock activity log
    const activities = [
      { 
        id: 1, 
        action: "Case created", 
        timestamp: caseData.createdAt, 
        user: "John Smith" 
      },
      { 
        id: 2, 
        action: "Status changed to In Progress", 
        timestamp: caseData.updatedAt, 
        user: "Jane Doe" 
      },
      { 
        id: 3, 
        action: "Comment added: 'Following up with witnesses'", 
        timestamp: new Date().toISOString(), 
        user: "Alex Johnson" 
      }
    ];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date & Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.action}</TableCell>
              <TableCell>{activity.user}</TableCell>
              <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          size="sm"
          onClick={() => navigate('/cases')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            Case #{caseData.caseId}
          </h1>
          <p className="text-muted-foreground mt-1">
            Created on {formatDate(caseData.createdAt)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle>Case Details</CardTitle>
                <Button size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Full Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{caseData.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Case Type</h4>
                          <Badge variant="outline" className="capitalize">
                            {caseData.caseType}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <h4 className="text-sm font-semibold">Incident Date</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(caseData.incidentDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <h4 className="text-sm font-semibold">Incident Time</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(caseData.incidentTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <h4 className="text-sm font-semibold">Location</h4>
                            <p className="text-sm text-muted-foreground">
                              {caseData.location}
                              {caseData.unitNumber && `, Unit ${caseData.unitNumber}`}
                              {caseData.village && `, ${caseData.village}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <h4 className="text-sm font-semibold">Operator</h4>
                            <p className="text-sm text-muted-foreground">
                              {caseData.operatorName}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-1">CCTV Footage</h4>
                          <Badge variant={caseData.cctvFootage ? "default" : "secondary"}>
                            {caseData.cctvFootage ? "Available" : "Not Available"}
                          </Badge>
                        </div>
                        
                        {caseData.tags && caseData.tags.length > 0 && (
                          <div className="flex items-start">
                            <Tag className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                            <div>
                              <h4 className="text-sm font-semibold">Tags</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {caseData.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="capitalize">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {caseData.followUpActions && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Follow-Up Actions</h3>
                        <p className="text-muted-foreground">{caseData.followUpActions}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            People Involved
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {caseData.persons && caseData.persons.length > 0 ? (
                            <div className="space-y-4">
                              {caseData.persons.map((person) => (
                                <div key={person.id} className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {person.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{person.name}</p>
                                    {person.role && (
                                      <p className="text-xs text-muted-foreground">{person.role}</p>
                                    )}
                                    {person.contactInfo && (
                                      <p className="text-xs text-muted-foreground">{person.contactInfo}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No people records available</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Car className="h-4 w-4 mr-2" />
                            Vehicles Involved
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {caseData.vehicles && caseData.vehicles.length > 0 ? (
                            <div className="space-y-4">
                              {caseData.vehicles.map((vehicle) => (
                                <div key={vehicle.id} className="border rounded-md p-3">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    {vehicle.make && (
                                      <div>
                                        <p className="font-medium">Make</p>
                                        <p className="text-muted-foreground">{vehicle.make}</p>
                                      </div>
                                    )}
                                    {vehicle.model && (
                                      <div>
                                        <p className="font-medium">Model</p>
                                        <p className="text-muted-foreground">{vehicle.model}</p>
                                      </div>
                                    )}
                                    {vehicle.licensePlate && (
                                      <div>
                                        <p className="font-medium">License Plate</p>
                                        <p className="text-muted-foreground">{vehicle.licensePlate}</p>
                                      </div>
                                    )}
                                    {vehicle.color && (
                                      <div>
                                        <p className="font-medium">Color</p>
                                        <p className="text-muted-foreground">{vehicle.color}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No vehicle records available</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Related Evidence & Attachments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {caseData.attachments && caseData.attachments.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {caseData.attachments.map((attachment) => (
                              <div key={attachment.id} className="border rounded-md p-3 flex items-center space-x-3">
                                <FileText className="h-10 w-10 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{attachment.fileName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(attachment.fileSize / 1024).toFixed(2)} KB • {new Date(attachment.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">No attachments available</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Activity Log</h3>
                    {renderActivityLog()}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Comments & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">John Smith</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    I've reviewed the CCTV footage and identified a suspect. Will update the case with screenshots.
                  </p>
                </div>
                
                <Textarea 
                  placeholder="Add a comment or update..." 
                  className="min-h-[100px]"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                
                <Button className="w-full">
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Current Status</h3>
                <div className="mb-4">
                  {renderStatusBadge(caseData.status)}
                </div>
                
                <Select 
                  value={status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Current Priority</h3>
                <div className="mb-4">
                  {renderPriorityBadge(caseData.priority)}
                </div>
                
                <Select 
                  value={priority} 
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full mt-2" 
                onClick={handleUpdateCase}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Case"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Case Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">Assigned Operator</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Change Assignment
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start text-case-resolved">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Resolved
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CaseDetail;
