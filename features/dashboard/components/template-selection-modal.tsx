"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
  Braces,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Templates } from "@prisma/client";
import { templates } from "@/features/templates/data";

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: Templates;
    description?: string;
  }) => void;
};

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");

  // ✅ FIXED TYPE
  const [selectedTemplate, setSelectedTemplate] = useState<Templates | null>(
    null,
  );

  const [searchQuery, setSearchQuery] = useState("");

  // ✅ FIXED TYPO
  const [category, setCategory] = useState<
    "All" | "Frontend" | "Backend" | "FullStack" | "Language"
  >("All");

  const [projectName, setProjectName] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      category === "All" || template.category === category;

    return matchesCategory && matchesSearch;
  });

  // ✅ FIXED TYPE
  const handleSelectedTemplate = (templateId: Templates) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      setStep("configure");
    }
  };

  const handleBack = () => {
    setStep("select");
  };

  const handleCreateProject = () => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate);

      onSubmit({
        title: projectName || `New ${template?.name} Project`,
        template: selectedTemplate, // ✅ direct enum (no mapping)
        description: template?.description,
      });

      console.log(
        `Creating ${projectName || "new project"} with template: ${
          template?.name
        }`,
      );

      // Reset state
      onClose();
      setStep("select");
      setSelectedTemplate(null);
      setProjectName("");
    }
  };

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();

          setStep("select");
          setSelectedTemplate(null);
          setProjectName("");
        }
      }}
    >
      <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                <Plus size={24} className="text-indigo-500" />
                Select a Template
              </DialogTitle>
              <DialogDescription>
                Choose a template to create your new playground
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 outline-none"
                    size={10}
                  />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Tabs
                  defaultValue="all"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => setCategory(value as any)}
                >
                  <TabsList className="grid grid-cols-5 gap-2 w-full sm:w-100">
                    {[
                      "All",
                      "Frontend",
                      "Backend",
                      "FullStack",
                      "Language",
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="cursor-pointer data-[state=active]:bg-linear-to-r data-[state=active]:from-violet-500 data-[state=active]:via-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={handleSelectedTemplate}
              > */}

              <RadioGroup
                value={selectedTemplate ?? ""}
                onValueChange={(value) =>
                  handleSelectedTemplate(value as Templates)
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative flex p-6 border rounded-lg cursor-pointer
                        transition-all duration-300 hover:scale-[1.02]
                        ${
                          selectedTemplate === template.id
                            ? "border-indigo-500 ring-2 ring-indigo-400/40 shadow-[0_8px_20px_rgba(99,102,241,0.25)]"
                            : "hover:border-indigo-400 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                        }`}
                        onClick={() => handleSelectedTemplate(template.id)}
                      >
                        <div className="absolute top-4 right-4 flex gap-1">
                          {renderStars(template.popularity)}
                        </div>

                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 left-2 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 text-white rounded-full p-1">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="flex gap-4">
                          <div
                            className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: `${template.color}15` }}
                          >
                            <Image
                              src={template.icon || "/placeholder.svg"}
                              alt={`${template.name} icon`}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">
                                {template.name}
                              </h3>
                              <div className="flex gap-1">
                                {template.category === "Frontend" && (
                                  <Code size={14} className="text-indigo-500" />
                                )}
                                {template.category === "Backend" && (
                                  <Server
                                    size={14}
                                    className="text-violet-500"
                                  />
                                )}
                                {template.category === "FullStack" && (
                                  <Globe size={14} className="text-blue-500" />
                                )}
                                {template.category === "Language" && (
                                  <Braces size={14} className="text-blue-500" />
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">
                              {template.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 border rounded-2xl"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="sr-only"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                      <Search size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium">
                        No templates found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
              <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={14} className="mr-1" />
                  <span>
                    Estimated setup time:{" "}
                    {selectedTemplate ? "2-5 minutes" : "select a template"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant={"outline"}
                    onClick={onClose}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>

                  <Button
                    className="text-white cursor-pointer bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 hover:brightness-75"
                    onClick={handleContinue}
                  >
                    Continue <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Configure Your Project
              </DialogTitle>
              <DialogDescription>
                {templates.find((t) => t.id === selectedTemplate)?.name} Project
                Configuration
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="My Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateProject();
                    }
                  }}
                />
              </div>

              <div className="p-4 rounded-lg border bg-linear-to-br from-violet-500/5 via-indigo-500/5 to-blue-500/5 shadow-[0_4px_20px_rgba(79,70,229,0.15)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(79,70,229,0.25)]">
                <h3 className="font-medium mb-3 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  Selected Template Feature
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 group"
                      >
                        <Zap
                          size={14}
                          className="text-indigo-500 group-hover:text-violet-500 transition-colors"
                        />

                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>

                <Button
                  className="text-white cursor-pointer bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 hover:brightness-75"
                  onClick={handleCreateProject}
                >
                  Create Project
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
