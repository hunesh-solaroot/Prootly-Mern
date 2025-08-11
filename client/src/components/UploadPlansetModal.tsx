import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MapPin, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPlansetSchema, type InsertPlanset } from "@shared/schema";

// Create a simplified form schema that matches the database requirements
const plansetFormSchema = z.object({
  projectId: z.string().optional(),
  timezone: z.string().optional(),
  receivedTime: z.string().min(1, "Received time is required"),
  portalName: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  siteAddress: z.string().min(1, "Site address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  coordinates: z.string().optional(),
  apnNumber: z.string().optional(),
  authorityHavingJurisdiction: z.string().optional(),
  utilityName: z.string().optional(),
  mountType: z.string().min(1, "Mount type is required"),
  addOnEquipments: z.string().optional(),
  governingCodes: z.string().optional(),
  propertyType: z.string().min(1, "Property type is required"),
  jobType: z.string().min(1, "Job type is required"),
  newConstruction: z.boolean().default(false),
  moduleManufacturer: z.string().optional(),
  moduleModelNo: z.string().optional(),
  moduleQuantity: z.number().min(1, "Module quantity must be at least 1").optional(),
  inverterManufacturer: z.string().optional(),
  inverterModelNo: z.string().optional(),
  inverterQuantity: z.number().min(1, "Inverter quantity must be at least 1").optional(),
  existingSolarSystem: z.boolean().default(false),
  proposalDesignFiles: z.array(z.string()).optional(),
  sitesurveyAttachments: z.array(z.string()).optional(),
  additionalComments: z.string().optional(),
});

type PlansetFormData = z.infer<typeof plansetFormSchema> & {
  receivedTime: string;
};

interface UploadPlansetModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export function UploadPlansetModal({ isOpen, onClose, projectId }: UploadPlansetModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [mapCoordinates, setMapCoordinates] = useState<string>("");
  const [proposalFiles, setProposalFiles] = useState<string[]>([]);
  const [sitesurveyFiles, setSitesurveyFiles] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PlansetFormData>({
    resolver: zodResolver(plansetFormSchema),
    defaultValues: {
      projectId: projectId || "auto-generated",
      timezone: "PST",
      receivedTime: new Date().toISOString().slice(0, 16),
      portalName: "Main Portal",
      companyName: "Solar Company",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      siteAddress: "",
      city: "",
      state: "CA",
      coordinates: "",
      apnNumber: "",
      authorityHavingJurisdiction: "",
      utilityName: "",
      mountType: "House Roof",
      addOnEquipments: "None",
      governingCodes: "",
      propertyType: "residential",
      jobType: "pv",
      newConstruction: false,
      moduleManufacturer: "",
      moduleModelNo: "",
      moduleQuantity: 1,
      inverterManufacturer: "",
      inverterModelNo: "",
      inverterQuantity: 1,
      existingSolarSystem: false,
      proposalDesignFiles: [],
      sitesurveyAttachments: [],
      additionalComments: "",
    },
  });

  const createPlansetMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending data to API:", data);
      const response = await fetch('/api/plansets', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log("API response:", result);
      
      if (!response.ok) {
        console.error("API error:", result);
        throw new Error(result.message || 'Failed to create planset');
      }
      return result;
    },
    onSuccess: (data) => {
      console.log("Planset created successfully:", data);
      toast({ title: "Success", description: "Planset uploaded successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/plansets"] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/plansets`] });
      }
      onClose();
      form.reset();
      setProposalFiles([]);
      setSitesurveyFiles([]);
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to upload planset",
        variant: "destructive",
      });
    },
  });

  const handleMapClick = (coordinates: string) => {
    setMapCoordinates(coordinates);
    form.setValue("coordinates", coordinates);
  };

  const handleFileUpload = (type: 'proposal' | 'sitesurvey', files: FileList | null) => {
    if (!files) return;
    
    // For development, simulate file upload with file names
    const fileNames = Array.from(files).map(file => `uploads/${Date.now()}-${file.name}`);
    
    if (type === 'proposal') {
      const updatedFiles = [...proposalFiles, ...fileNames];
      setProposalFiles(updatedFiles);
      form.setValue("proposalDesignFiles", updatedFiles);
    } else {
      const updatedFiles = [...sitesurveyFiles, ...fileNames];
      setSitesurveyFiles(updatedFiles);
      form.setValue("sitesurveyAttachments", updatedFiles);
    }
    
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) added successfully`,
    });
  };

  const onSubmit = (data: PlansetFormData) => {
    console.log("Form data:", data);
    console.log("Proposal files:", proposalFiles);
    console.log("Sitesurvey files:", sitesurveyFiles);
    
    // Convert receivedTime string to Date and prepare data
    const submitData: any = {
      ...data,
      receivedTime: new Date(data.receivedTime),
      proposalDesignFiles: proposalFiles,
      sitesurveyAttachments: sitesurveyFiles,
      projectId: data.projectId || `planset-${Date.now()}`,
    };
    
    // Remove undefined values to avoid validation issues
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === undefined) {
        delete submitData[key];
      }
    });
    
    console.log("Submit data:", submitData);
    createPlansetMutation.mutate(submitData);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Planset
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${
                  step < 3 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Select Timezone</Label>
                    <Select onValueChange={(value) => form.setValue("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PST">PST - Pacific Standard Time</SelectItem>
                        <SelectItem value="MST">MST - Mountain Standard Time</SelectItem>
                        <SelectItem value="CST">CST - Central Standard Time</SelectItem>
                        <SelectItem value="EST">EST - Eastern Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="receivedTime">Set Received Time *</Label>
                    <Input
                      type="datetime-local"
                      {...form.register("receivedTime")}
                      className="w-full"
                    />
                    {form.formState.errors.receivedTime && (
                      <span className="text-sm text-red-500">
                        {form.formState.errors.receivedTime.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="portalName">Portal Name</Label>
                    <Select onValueChange={(value) => form.setValue("portalName", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Portal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aurora Portal">Aurora Portal</SelectItem>
                        <SelectItem value="Helioscope Portal">Helioscope Portal</SelectItem>
                        <SelectItem value="PVDesign Portal">PVDesign Portal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      {...form.register("companyName")}
                      placeholder="Choose..."
                    />
                    {form.formState.errors.companyName && (
                      <span className="text-sm text-red-500">
                        {form.formState.errors.companyName.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Homeowner Information */}
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                    Homeowner Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        {...form.register("customerName")}
                        placeholder="Customer Name"
                      />
                      {form.formState.errors.customerName && (
                        <span className="text-sm text-red-500">
                          {form.formState.errors.customerName.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Customer Email *</Label>
                      <Input
                        type="email"
                        {...form.register("customerEmail")}
                        placeholder="example@gmail.com"
                      />
                      {form.formState.errors.customerEmail && (
                        <span className="text-sm text-red-500">
                          {form.formState.errors.customerEmail.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Customer Phone Number *</Label>
                      <div className="flex">
                        <Select defaultValue="+1">
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+91">+91</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          {...form.register("customerPhone")}
                          placeholder="Phone Number"
                          className="flex-1 ml-2"
                        />
                      </div>
                      {form.formState.errors.customerPhone && (
                        <span className="text-sm text-red-500">
                          {form.formState.errors.customerPhone.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="siteAddress">Site Address as per utility bill *</Label>
                      <Input
                        {...form.register("siteAddress")}
                        placeholder="Address"
                      />
                      {form.formState.errors.siteAddress && (
                        <span className="text-sm text-red-500">
                          {form.formState.errors.siteAddress.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        {...form.register("city")}
                        placeholder="City"
                      />
                      {form.formState.errors.city && (
                        <span className="text-sm text-red-500">
                          {form.formState.errors.city.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        {...form.register("state")}
                        placeholder="State"
                      />
                      {form.formState.errors.state && (
                        <span className="text-sm text-red-500">
                          {form.formState.errors.state.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    type="button"
                    variant={mapCoordinates ? "default" : "outline"}
                    size="sm"
                  >
                    Map
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    Satellite
                  </Button>
                </div>
                <div 
                  className="w-full h-64 bg-green-100 dark:bg-green-900/20 rounded-lg cursor-pointer flex items-center justify-center"
                  onClick={() => handleMapClick("37.7749,-122.4194")}
                >
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click on the map to set coordinates
                    </p>
                    {mapCoordinates && (
                      <p className="text-xs text-green-600 mt-1">
                        Coordinates: {mapCoordinates}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apnNumber">APN Number</Label>
                  <Input
                    {...form.register("apnNumber")}
                    placeholder="Enter APN Number"
                  />
                </div>

                <div>
                  <Label htmlFor="coordinates">Coordinates</Label>
                  <Input
                    {...form.register("coordinates")}
                    placeholder="Click on the map to set coordinates"
                    value={mapCoordinates}
                    readOnly
                  />
                </div>
              </div>

              {/* Project Information */}
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                  Project Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="authorityHavingJurisdiction">Authority Having Jurisdiction</Label>
                    <Input
                      {...form.register("authorityHavingJurisdiction")}
                      placeholder="Enter AHJ"
                    />
                  </div>

                  <div>
                    <Label htmlFor="utilityName">Utility Name</Label>
                    <Input
                      {...form.register("utilityName")}
                      placeholder="Enter Utility"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mountType">Mount Type *</Label>
                    <Select onValueChange={(value) => form.setValue("mountType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="House Roof" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="House Roof">House Roof</SelectItem>
                        <SelectItem value="Ground Mount">Ground Mount</SelectItem>
                        <SelectItem value="Carport">Carport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="addOnEquipments">Add-on Equipments</Label>
                    <Input
                      {...form.register("addOnEquipments")}
                      placeholder="None"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="governingCodes">Governing Codes</Label>
                    <Textarea
                      {...form.register("governingCodes")}
                      placeholder="Enter any Governing comments here"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Property and Job Types */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-base font-medium">Property Type *</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={form.watch("propertyType") === "residential" ? "default" : "outline"}
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => form.setValue("propertyType", "residential")}
                    >
                      Residential
                    </Button>
                    <Button
                      type="button"
                      variant={form.watch("propertyType") === "commercial" ? "default" : "outline"}
                      onClick={() => form.setValue("propertyType", "commercial")}
                    >
                      Commercial
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Job Type *</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={form.watch("jobType") === "pv" ? "default" : "outline"}
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => form.setValue("jobType", "pv")}
                    >
                      PV
                    </Button>
                    <Button
                      type="button"
                      variant={form.watch("jobType") === "pv+battery" ? "default" : "outline"}
                      onClick={() => form.setValue("jobType", "pv+battery")}
                    >
                      PV+Battery
                    </Button>
                    <Button
                      type="button"
                      variant={form.watch("jobType") === "battery" ? "default" : "outline"}
                      onClick={() => form.setValue("jobType", "battery")}
                    >
                      Battery
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">New Construction *</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={form.watch("newConstruction") === false ? "default" : "outline"}
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => form.setValue("newConstruction", false)}
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={form.watch("newConstruction") === true ? "default" : "outline"}
                      onClick={() => form.setValue("newConstruction", true)}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </div>

              {/* Module and Inverter Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="moduleManufacturer">Module Manufacturer *</Label>
                    <Select onValueChange={(value) => form.setValue("moduleManufacturer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tesla">Tesla</SelectItem>
                        <SelectItem value="SunPower">SunPower</SelectItem>
                        <SelectItem value="LG">LG</SelectItem>
                        <SelectItem value="Panasonic">Panasonic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="moduleModelNo">Module Model No. *</Label>
                    <Select onValueChange={(value) => form.setValue("moduleModelNo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Model No." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Model-A">Model-A</SelectItem>
                        <SelectItem value="Model-B">Model-B</SelectItem>
                        <SelectItem value="Model-C">Model-C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="moduleQuantity">Quantity *</Label>
                    <Input
                      type="number"
                      {...form.register("moduleQuantity", { valueAsNumber: true })}
                      placeholder="Enter Quantity"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="inverterManufacturer">Inverter Manufacturer *</Label>
                    <Select onValueChange={(value) => form.setValue("inverterManufacturer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Enphase">Enphase</SelectItem>
                        <SelectItem value="SolarEdge">SolarEdge</SelectItem>
                        <SelectItem value="Tesla">Tesla</SelectItem>
                        <SelectItem value="SMA">SMA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="inverterModelNo">Inverter Model No. *</Label>
                    <Select onValueChange={(value) => form.setValue("inverterModelNo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Model No." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IQ7+">IQ7+</SelectItem>
                        <SelectItem value="IQ8+">IQ8+</SelectItem>
                        <SelectItem value="P300">P300</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="inverterQuantity">Quantity *</Label>
                    <Input
                      type="number"
                      {...form.register("inverterQuantity", { valueAsNumber: true })}
                      placeholder="Enter Quantity"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Add Inverter</Label>
                    <Button type="button" variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      + Inverter
                    </Button>
                  </div>
                </div>
              </div>

              {/* Solar System Question */}
              <div>
                <Label className="text-base font-medium">Do you have Existing Solar System?</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={form.watch("existingSolarSystem") === false ? "default" : "outline"}
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => form.setValue("existingSolarSystem", false)}
                  >
                    No
                  </Button>
                  <Button
                    type="button"
                    variant={form.watch("existingSolarSystem") === true ? "default" : "outline"}
                    onClick={() => form.setValue("existingSolarSystem", true)}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: File Uploads */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Proposal Design File */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Proposal Design File</Label>
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500"
                    onClick={() => document.getElementById('proposal-files')?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      + click to add or<br />drop here
                    </p>
                  </div>
                  <input
                    id="proposal-files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileUpload('proposal', e.target.files)}
                  />
                  <p className="text-xs text-gray-500">{proposalFiles.length} files</p>
                </div>

                {/* Sitesurvey Attachments */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Sitesurvey Attachments</Label>
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500"
                    onClick={() => document.getElementById('sitesurvey-files')?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      + click to add or<br />drop here
                    </p>
                  </div>
                  <input
                    id="sitesurvey-files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileUpload('sitesurvey', e.target.files)}
                  />
                  <p className="text-xs text-gray-500">{sitesurveyFiles.length} files</p>
                </div>

                {/* Additional Comments */}
                <div className="space-y-4">
                  <Label htmlFor="additionalComments">Additional Comments</Label>
                  <Textarea
                    {...form.register("additionalComments")}
                    placeholder="Enter any additional comments here"
                    rows={8}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
              
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="bg-green-500 hover:bg-green-600">
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={createPlansetMutation.isPending}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {createPlansetMutation.isPending ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}