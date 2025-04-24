import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CameraView from '@/components/CameraView';
import CameraSelector from '@/components/CameraSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Camera, Users, MessageSquare, Phone, Send, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import SMSAnalyzer from '@/components/SMSAnalyzer';
import { api } from '@/lib/api';

interface CameraAlert {
  id: string;
  crime_type: string;
  location: string;
  timestamp: string;
  confidence: number;
  coordinates: [number, number];
  image_url: string;
  image?: string; // Raw image data for preview
}

interface SMSDetectionResult {
  message: string;
  is_spam: boolean;
  spam_probability: number;
  classification: string;
  recommendation: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sent: boolean;
  is_spam?: boolean;
  spam_probability?: number;
}

const mockContacts = [
  { id: 'c1', name: 'Police Command Center', phone: '+255 744 121 212' },
  { id: 'c2', name: 'Emergency Response', phone: '+255 744 222 333' },
  { id: 'c3', name: 'Security Team', phone: '+255 744 444 555' },
];

const mockCameras = [
  { 
    id: 'cam-000001', 
    name: 'Front Entrance', 
    location: 'Main Building',
    streamUrl: "http://192.168.112.251:5000/video"
  },
  { 
    id: 'cam-udsm-library', 
    name: 'UDSM Library', 
    location: 'UDSM New Library',
    streamUrl: "http://192.168.112.252:5000/video"
  }
];

const mockMessages = [
  { id: 'm1', content: 'Alert: Suspicious activity detected at Front Entrance', timestamp: '10:23 AM', sent: true },
  { id: 'm2', content: 'Emergency personnel dispatched to Parking Lot', timestamp: '10:25 AM', sent: false },
  { id: 'm3', content: 'All clear signal for Hallway A', timestamp: '10:45 AM', sent: true },
];

const Detection = () => {
  const [activeTab, setActiveTab] = useState('cameras');
  const [selectedCameras, setSelectedCameras] = useState<string[]>(['cam-000001']);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [contacts, setContacts] = useState(mockContacts);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [showAddContact, setShowAddContact] = useState(false);
  const [cameraAlerts, setCameraAlerts] = useState<CameraAlert[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  
  const { toast } = useToast();

  const [selectedAlert, setSelectedAlert] = useState<CameraAlert | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch alerts from backend
  const fetchCameraAlerts = async () => {
    setIsLoadingAlerts(true);
    try {
      const response = await api.get('/api/get-camera-alerts/');
      // Filter for UDSM Library fighting alerts
      const fightingAlerts = response.data.filter((alert: CameraAlert) => 
        alert.location.toLowerCase().includes('udsm new library') && 
        alert.crime_type.toLowerCase().includes('fighting')
      );
      setCameraAlerts(fightingAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  // Enhanced fetchCameraAlerts with image handling
  // const fetchCameraAlerts = async () => {
  //   setIsLoadingAlerts(true);
  //   try {
  //     const response = await api.get('/api/get-camera-alerts/');
  //     const alerts = response.data.map((alert: any) => ({
  //       ...alert,
  //       image_url: alert.image ? `${api.defaults.baseURL}${alert.image}` : '',
  //       // For local testing with mock data:
  //       image: alert.image_url || '' 
  //     }));
      
  //     setCameraAlerts(alerts.filter((alert: CameraAlert) => 
  //       alert.location.toLowerCase().includes('udsm new library') && 
  //       alert.crime_type.toLowerCase().includes('fighting')
  //     ));
  //   } catch (error) {
  //     console.error('Error fetching alerts:', error);
  //   } finally {
  //     setIsLoadingAlerts(false);
  //   }
  // };

  // // Image preview handler
  // const handleImagePreview = (alert: CameraAlert) => {
  //   setSelectedAlert(alert);
  //   setImagePreview(alert.image_url || alert.image || '');
  // };


  // Check for new alerts every 10 seconds
  useEffect(() => {
    fetchCameraAlerts();
    const interval = setInterval(fetchCameraAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Show notification when new alert comes in
  useEffect(() => {
    if (cameraAlerts.length > 0) {
      const latestAlert = cameraAlerts[0];
      if (new Date(latestAlert.timestamp).getTime() > Date.now() - 10000) {
        toast({
          title: "🚨 Fighting Detected!",
          description: `${latestAlert.crime_type} at ${latestAlert.location}`,
          variant: "destructive",
        });
      }
    }
  }, [cameraAlerts]);

  // Mark alert as acknowledged
  const acknowledgeAlert = async (alertId: string) => {
    try {
      await api.post(`/api/acknowledge-alert/${alertId}/`);
      setCameraAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast({
        title: "Alert Acknowledged",
        description: "The alert has been marked as resolved",
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      });
    }
  };

  // Your existing functions - unchanged
  const handleDetection = (detection: any) => {
    toast({
      title: "Detection Alert",
      description: `Suspicious activity detected on camera ${detection.cameraId}`,
      variant: "destructive",
    });

    const newMsg = {
      id: `m${messages.length + 1}`,
      content: `Alert: Suspicious activity detected on camera ${detection.cameraId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true
    };
    
    setMessages([...messages, newMsg]);
  };

  const handleCameraSelect = (camera: any) => {
    if (!selectedCameras.includes(camera.id)) {
      setSelectedCameras([...selectedCameras, camera.id]);
    }
  };

  const removeCamera = (cameraId: string) => {
    setSelectedCameras(selectedCameras.filter(id => id !== cameraId));
  };

  const detectSMS = async (message: string) => {
    try {
      return await api.detectSMS(message);
    } catch (error) {
      console.error("Error detecting SMS:", error);
      return {
        is_spam: false,
        spam_probability: 0,
        classification: 'Unknown',
        recommendation: 'Could not analyze this message.'
      };
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    const detectionResult = await detectSMS(newMessage);
    
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      is_spam: detectionResult.is_spam,
      spam_probability: detectionResult.spam_probability
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to all contacts",
    });
    
    if (detectionResult.is_spam) {
      toast({
        title: "Spam Warning",
        description: detectionResult.recommendation,
        variant: "destructive",
      });
    }
  };

  const addContact = () => {
    if (newContact.name.trim() === '' || newContact.phone.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and phone number",
        variant: "destructive",
      });
      return;
    }
    
    const contact = {
      id: `c${contacts.length + 1}`,
      name: newContact.name,
      phone: newContact.phone
    };
    
    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '' });
    setShowAddContact(false);
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added to your contacts`,
    });
  };

  const deleteContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedPhone = '';
    
    if (value.length > 0) {
      formattedPhone = '+' + value.substring(0, 3);
      if (value.length > 3) {
        formattedPhone += ' ' + value.substring(3, 6);
      }
      if (value.length > 6) {
        formattedPhone += ' ' + value.substring(6, 9);
      }
      if (value.length > 9) {
        formattedPhone += ' ' + value.substring(9, 12);
      }
    }
    
    setNewContact({ ...newContact, phone: formattedPhone });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Crime Detection</h1>
          <p className="text-muted-foreground">Monitor and detect suspicious activities</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              {/* Tabs list - unchanged */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cameras" className="flex items-center">
                    <Camera className="mr-2 h-4 w-4" />
                    Kamera za Usalama
                  </TabsTrigger>
                  {/* <TabsTrigger value="messages" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ujumbe
                  </TabsTrigger>
                  <TabsTrigger value="sms-analysis" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Uchambuzi wa SMS
                  </TabsTrigger> */}
                  <TabsTrigger value="notifications" className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Arifa
                  </TabsTrigger>
                </TabsList>

                {activeTab === 'cameras' && (
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === 'grid' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      Grid View
                    </Button>
                    <Button 
                      variant={viewMode === 'single' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode('single')}
                    >
                      Single View
                    </Button>
                  </div>
                )}
              </div>

              {/* Cameras tab - unchanged */}
              <TabsContent value="cameras" className="space-y-4">
                {selectedCameras.length === 0 ? (
                  <div className="bg-muted/50 rounded-lg p-10 text-center">
                    <Camera className="mx-auto h-10 w-10 text-muted-foreground opacity-30 mb-2" />
                    <h3 className="font-medium mb-1">No cameras selected</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select cameras from the sidebar to begin monitoring
                    </p>
                  </div>
                ) : (
                  <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    {selectedCameras.map((cameraId, index) => {
                      const camera = mockCameras.find(c => c.id === cameraId);
                      return (
                        <div key={cameraId} className="relative">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 left-2 h-8 w-8 z-10 opacity-50 hover:opacity-100"
                            onClick={() => removeCamera(cameraId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <CameraView
                            cameraId={cameraId}
                            name={camera?.name || `Camera ${index + 1}`}
                            onDetection={handleDetection}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Messages tab - unchanged */}
              <TabsContent value="messages" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Message Center</CardTitle>
                    <CardDescription>
                      Send alerts and notifications to your contacts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col h-[calc(100vh-350px)] min-h-[300px]">
                      <ScrollArea className="flex-1 pr-4 mb-4">
                        <div className="space-y-4">
                          {messages.map(msg => (
                            <div 
                              key={msg.id} 
                              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.sent 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-sm">{msg.content}</p>
                                  {msg.is_spam !== undefined && (
                                    <Badge 
                                      variant={msg.is_spam ? "destructive" : "outline"} 
                                      className="ml-2 shrink-0"
                                    >
                                      {msg.is_spam ? (
                                        <div className="flex items-center">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          Spam
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Safe
                                        </div>
                                      )}
                                    </Badge>
                                  )}
                                </div>
                                <p className={`text-xs mt-1 ${msg.sent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {msg.timestamp}
                                </p>
                                {msg.is_spam && (
                                  <p className="text-xs mt-1 text-destructive-foreground bg-destructive/20 p-1 rounded">
                                    This message may be fraudulent. Be cautious.
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Andika ujumbe wako kwa Kiswahili..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={sendMessage} 
                          disabled={!newMessage.trim()}
                          size="icon"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-amber-600 mt-1">
                        Andika ujumbe wako kwa Kiswahili ili kupata matokeo sahihi
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SMS Analysis tab - unchanged */}
              <TabsContent value="sms-analysis" className="space-y-4">
                <SMSAnalyzer />
              </TabsContent>

              {/* Enhanced Notifications Tab */}
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Crime Alerts</CardTitle>
                    <CardDescription>
                      Real-time fighting alerts with visual evidence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAlerts ? (
                      <p className="text-muted-foreground text-sm">Loading alerts...</p>
                    ) : cameraAlerts.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No alerts detected</p>
                    ) : (
                      <div className="space-y-4">
                        {cameraAlerts.map(alert => (
                          <div
                            key={alert.id}
                            className="bg-destructive/10 border border-destructive rounded p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-destructive" />
                                  <span className="text-sm font-medium">{alert.crime_type}</span>
                                </div>
                                <div className="text-sm mt-1">{alert.location}</div>
                                <div className="text-xs mt-1">
                                  Confidence: {Math.round(alert.confidence * 100)}%
                                </div>
                                
                                {/* Enhanced Image Display */}
                                {(alert.image_url || alert.image) && (
                                  <div className="mt-3 relative group">
                                    <div className="relative w-full max-w-xs h-40 bg-gray-100 rounded-md overflow-hidden">
                                      <img
                                        src={alert.image_url || alert.image}
                                        alt="Incident snapshot"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                      <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div className="text-center p-2">
                                          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                                          <p className="text-xs text-gray-500 mt-1">Image not available</p>
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleImagePreview(alert)}
                                    >
                                      <span className="text-xs">View Full</span>
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button 
                                variant="destructive"
                                size="sm"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                Acknowledge
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Image Preview Modal */}
          {selectedAlert && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">
                    {selectedAlert.crime_type} at {selectedAlert.location}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAlert(null)}
                  >
                    &times;
                  </Button>
                </div>
                <div className="p-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Full size alert snapshot"
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <ImageIcon className="h-12 w-12" />
                      <p>No image available</p>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t text-sm">
                  <p>Detected: {new Date(selectedAlert.timestamp).toLocaleString()}</p>
                  <p>Confidence: {Math.round(selectedAlert.confidence * 100)}%</p>
                  <p>Coordinates: {selectedAlert.coordinates.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
           

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Updated System Notifications Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>
                  Recent alerts from security cameras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cameraAlerts.slice(0, 3).map(alert => (
                  <div
                    key={`sidebar-${alert.id}`}
                    className="bg-destructive/10 border border-destructive rounded p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        🚨 {alert.crime_type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-xs mt-1">{alert.location}</div>
                  </div>
                ))}

                {cameraAlerts.length === 0 && (
                  <p className="text-muted-foreground text-sm">No alerts at the moment</p>
                )}
              </CardContent>
            </Card>

            {/* Camera Selection - unchanged */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Camera Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <CameraSelector
                  onSelectCamera={(camera) => handleCameraSelect(camera)}
                  selectedCameras={selectedCameras}
                />
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Selected Cameras ({selectedCameras.length})</h4>
                  {selectedCameras.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCameras.map(cameraId => {
                        const camera = mockCameras.find(c => c.id === cameraId);
                        return (
                          <div key={cameraId} className="flex items-center justify-between py-1 px-2 bg-accent rounded-md text-sm">
                            <span>{camera?.name || cameraId}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeCamera(cameraId)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No cameras selected</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Contacts - unchanged */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <Users className="mr-2 h-4 w-4" /> Contacts
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowAddContact(!showAddContact)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddContact && (
                  <div className="mb-4 p-3 border rounded-md">
                    <h4 className="text-sm font-medium mb-2">Add New Contact</h4>
                    <div className="space-y-2">
                      <Input
                        placeholder="Contact Name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Phone Number"
                        value={newContact.phone}
                        onChange={handlePhoneChange}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={addContact}
                          size="sm"
                          className="w-full text-xs"
                        >
                          Add Contact
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setShowAddContact(false);
                            setNewContact({ name: '', phone: '' });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  {contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <div className="text-sm font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {contact.phone}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => deleteContact(contact.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detection;