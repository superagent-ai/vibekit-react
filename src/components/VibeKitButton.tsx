"use client";
import { Zap, ArrowRight, Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconBrandGithub } from "@tabler/icons-react";

import { useGitHubAuth } from "../hooks/use-github-auth";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  generateVibeKitPrompt,
  generateVibeKitPromptForStripe,
} from "../lib/prompts";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";

const formSchema = z.object({
  repository: z.string().min(1, "Please select a repository"),
  instructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export interface VibeKitButtonProps {
  children: React.ReactNode;
  app?: "default" | "stripe";
  className?: string;
}

export function VibeKitButton({
  children,
  app = "default",
  className,
}: VibeKitButtonProps) {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("integration");
  const [copied, setCopied] = useState(false);

  const { isAuthenticated, repositories, login, fetchRepositories, isLoading } =
    useGitHubAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repository: "",
      instructions: "",
    },
  });

  // Fetch repositories when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchRepositories();
    }
  }, [isAuthenticated, fetchRepositories]);

  const handleGitHubAuth = async () => {
    await login();
  };

  const onSubmit = async (values: FormValues) => {
    // Mock API call - in real implementation this would call your integration API
    try {
      const response = await fetch("/api/vibekit/integrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repository: values.repository,
          instructions: values.instructions,
          app,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        console.error("Integration request failed");
      }
    } catch (error) {
      console.error("Error submitting integration request:", error);
      // For demo purposes, still show success
      setSuccess(true);
    }
  };

  const resetDialog = () => {
    setStep(1);
    setSuccess(false);
    setActiveTab("integration");
    setCopied(false);
    form.reset();
  };

  const cursorPrompt =
    app === "stripe"
      ? generateVibeKitPromptForStripe()
      : generateVibeKitPrompt();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cursorPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Simple icon placeholder component
  const AppIcon = ({ app: appType }: { app: "default" | "stripe" }) => {
    if (appType === "stripe") {
      return (
        <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center my-4">
          <span className="text-white font-bold text-lg">S</span>
        </div>
      );
    }
    return (
      <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center my-4">
        <span className="text-white font-bold text-lg">VK</span>
      </div>
    );
  };

  // Simple branded icon component for tools
  const ToolIcon = ({
    tool,
    className: iconClassName,
  }: {
    tool: string;
    className?: string;
  }) => (
    <div
      className={cn(
        "bg-white flex items-center border justify-center rounded-sm overflow-hidden",
        iconClassName
      )}
    >
      <span className="text-xs font-bold text-gray-700">
        {tool.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <div className={className}>{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-4">
          <div className="flex flex-col items-center gap-y-2">
            <AppIcon app={app} />
            <DialogTitle className="text-2xl font-bold">
              {app === "stripe"
                ? "Add Stripe Portal to your app"
                : "Add VibeKit to your app"}
            </DialogTitle>
            {step !== 2 && !success && (
              <DialogDescription className="mt-4 text-md text-left">
                Select between receiving a PR in your repository or copying a
                prompt to Cursor, Windsurt etc.
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-4">
              <Check className="w-10 h-10 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-center text-muted-foreground max-w-md">
                Your integration request has been submitted.
              </p>
              <p className="text-center text-muted-foreground max-w-md">
                A pull request will be created in your repository soon.
              </p>
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {step !== 2 && (
              <TabsList className="w-full">
                <TabsTrigger value="integration" className="text-md w-full">
                  <IconBrandGithub className="size-4 mr-2" />
                  Make a PR
                </TabsTrigger>

                <TabsTrigger value="cursor" className="text-md w-full">
                  <ToolIcon tool="devin" className="w-5.5 h-5.5" />
                  <ToolIcon tool="cursor" className="w-5.5 h-5.5 -ml-2" />
                  <ToolIcon
                    tool="windsurf"
                    className="w-5.5 h-5.5 -ml-2 mr-2"
                  />
                  Copy prompt
                </TabsTrigger>
              </TabsList>
            )}
            <TabsContent value="integration" className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-y-6"
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-y-6">
                        <div>
                          <div className="text-left">
                            <h3 className="text-md font-semibold">
                              Select Repository
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Connect your GitHub account to select a repository
                            </p>
                          </div>
                          {!isAuthenticated ? (
                            <div className="flex flex-col items-center space-y-4">
                              <Button
                                type="button"
                                onClick={handleGitHubAuth}
                                className="w-full"
                                disabled={isLoading}
                              >
                                <IconBrandGithub className="w-4 h-4 mr-2" />
                                {isLoading
                                  ? "Authenticating..."
                                  : "Authenticate with GitHub"}
                              </Button>
                              {isLoading && (
                                <p className="text-sm text-muted-foreground">
                                  Please complete authentication in the popup
                                  window
                                </p>
                              )}
                            </div>
                          ) : (
                            <FormField
                              control={form.control}
                              name="repository"
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose a repository" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {repositories.map((repo) => (
                                        <SelectItem
                                          key={repo.id}
                                          value={repo.full_name}
                                        >
                                          <div className="flex">
                                            <span>{repo.full_name}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-left">
                            <h3 className="text-md font-semibold">
                              Add Instructions
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Provide specific instructions for integrating{" "}
                              {app === "stripe" ? "Stripe Portal" : "VibeKit"}
                            </p>
                          </div>
                          <FormField
                            control={form.control}
                            name="instructions"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder={`Describe how you want ${
                                      app === "stripe"
                                        ? "Stripe Portal"
                                        : "VibeKit"
                                    } integrated into your app. For example: 'Add a button that ${
                                      app === "stripe"
                                        ? "opens the Stripe Portal"
                                        : "runs VibeKit"
                                    } on the home page'`}
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={() => {
                              // Validate before going to confirmation
                              const repo = form.getValues("repository");
                              const instructions =
                                form.getValues("instructions");
                              if (!isAuthenticated) return;
                              if (!repo) {
                                form.setError("repository", {
                                  message: "Please select a repository",
                                });
                                return;
                              }
                              if (!instructions || instructions.length < 10) {
                                form.setError("instructions", {
                                  message:
                                    "Instructions must be at least 10 characters",
                                });
                                return;
                              }
                              setStep(2);
                            }}
                            disabled={!isAuthenticated}
                            className={cn(
                              "w-full",
                              app === "stripe" &&
                                "bg-gradient-to-r from-purple-700 to-blue-700 text-white hover:from-purple-600 hover:to-pink-600"
                            )}
                          >
                            Add To My App
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Confirmation
                      </h3>
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex flex-col">
                          <span className="font-medium">Repository:</span>{" "}
                          <span className="text-muted-foreground text-sm">
                            {form.getValues("repository")}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Instructions:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.getValues("instructions")}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <IconBrandGithub className="w-5 h-5 text-blue-600 mt-1" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">
                              Pull Request will be created
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                              A pull request will be automatically created in
                              your repository with the VibeKit integration based
                              on your instructions.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 pt-6">
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="flex-1"
                          >
                            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className={cn(
                              "flex-1",
                              app === "stripe" &&
                                "bg-gradient-to-r from-purple-700 to-blue-700 text-white hover:from-purple-600 hover:to-pink-600"
                            )}
                          >
                            <IconBrandGithub className="w-4 h-4 mr-2" />
                            Create Pull Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="cursor" className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-4">
                <ScrollArea className="text-sm whitespace-pre-wrap font-mono">
                  <div className="max-h-[300px]">{cursorPrompt}</div>
                </ScrollArea>
                <Button
                  onClick={copyToClipboard}
                  className="w-full"
                  variant="outline"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-600 mt-1" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      How to use this prompt
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                      Copy the prompt above and paste it into Cursor&apos;s,
                      Windsurf, Devin, VSCode etc.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-auto text-center pt-4">
          <p className="text-muted-foreground text-sm">
            Built using <span className="font-bold">VibeKit</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
