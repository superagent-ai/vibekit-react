import { useContext, useState, useEffect } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Check,
  LucideGithub,
  Zap,
  Copy,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { VibeKitContext } from "./VibeKitProvider";
import { widgetConfig } from "./lib/config";
import { getContrastTextColor } from "./lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { cn } from "./lib/utils";
import { useGitHubAuth } from "./hooks/use-github";
import { ScrollArea } from "./components/ui/scroll-area";

export const VibeKitButton = () => {
  const vibeKit = useContext(VibeKitContext);
  const [open, setOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("integration");
  const [success, setSuccess] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const {
    isAuthenticated,
    isLoading,
    repositories,
    githubToken,
    login,
    githubError,
  } = vibeKit!;

  const formSchema = z.object({
    repository: z.string().min(1, "Please select a repository"),
    instructions: z
      .string()
      .min(10, "Instructions must be at least 10 characters"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repository: "",
      instructions: "",
    },
  });
  const resetDialog = () => {
    setStep(1);
    setSuccess(false);
    setActiveTab("integration");
    setCopied(false);
    form.reset();
  };

  if (!vibeKit) {
    throw new Error("VibeKitButton must be used within a VibeKitProvider");
  }

  if (vibeKit.loading || !vibeKit.agent || !vibeKit.project) {
    return null;
  }

  const logo = vibeKit.agent?.logo || vibeKit.project?.logo;

  const onSubmit = async (values: FormValues) => {
    fetch(`${widgetConfig.apiUrl}/api/vibekit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repository: values.repository,
        instructions: values.instructions,
        prompt: vibeKit.agent?.systemPrompt,
        githubToken: githubToken,
      }),
    });

    setSuccess(true);
  };

  const handleGitHubAuth = async () => await login(vibeKit.agent?._id!);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(vibeKit.agent?.systemPrompt || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) resetDialog();

          setOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2.5"
            style={{
              backgroundColor:
                vibeKit.agent.primaryColor || vibeKit.project.primaryColor,
              color: getContrastTextColor(
                vibeKit.agent.primaryColor ||
                  vibeKit.project.primaryColor ||
                  "#000000"
              ),
            }}
          >
            {logo &&
              (vibeKit?.agent?.showButtonLogo ??
                widgetConfig.showButtonLogo) && (
                <img
                  src={logo}
                  alt={`${vibeKit?.project?.name} | ${vibeKit?.agent?.name}`}
                  className="size-5"
                />
              )}
            {vibeKit?.agent?.buttonText || widgetConfig.buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4 flex-shrink-0">
            <div className="flex flex-col items-center gap-y-2">
              <img
                src={logo}
                alt={`${vibeKit?.project?.name} | ${vibeKit?.agent?.name}`}
                width={54}
                height={54}
                className="my-4"
              />
              <DialogTitle className="text-2xl font-bold">
                {vibeKit?.agent?.headlineText || widgetConfig.headlineText}
              </DialogTitle>
              {!success && (
                <DialogDescription className="mt-4 !text-md text-left">
                  {vibeKit?.agent?.descriptionText ||
                    widgetConfig.descriptionText}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="bg-green-100 dark:bg-green-500 rounded-full p-4">
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
              className="w-full flex flex-col h-full"
            >
              {step !== 2 && (
                <TabsList className="w-full">
                  <TabsTrigger value="integration" className="text-md w-full">
                    <LucideGithub className="size-4 mr-2" />
                    Make a PR
                  </TabsTrigger>

                  <TabsTrigger value="cursor" className="text-md w-full">
                    <Copy className="size-4 mr-2" />
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
                      <div className="space-y-6 flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-6">
                          <div>
                            <div className="text-left">
                              <h3 className="text-md font-semibold">
                                Select Repository
                              </h3>
                              <p className="text-md text-muted-foreground mb-2">
                                Connect your GitHub account to select a
                                repository
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
                                  {isLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2" />
                                  ) : (
                                    <LucideGithub className="w-4 h-4 mr-2" />
                                  )}
                                  {isLoading
                                    ? "Authenticating..."
                                    : "Authenticate with GitHub"}
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {githubError && (
                                  <p className="text-md text-red-500">
                                    {githubError}
                                  </p>
                                )}
                                <FormField
                                  control={form.control}
                                  name="repository"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="w-full">
                                            <SelectValue
                                              placeholder={
                                                isLoading
                                                  ? "Loading repositories..."
                                                  : "Choose a repository"
                                              }
                                            />
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
                                {repositories.length === 0 &&
                                  !isLoading &&
                                  !githubError && (
                                    <p className="text-md text-muted-foreground">
                                      No repositories found. Make sure you have
                                      access to repositories on GitHub.
                                    </p>
                                  )}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-left">
                              <h3 className="text-md font-semibold">
                                Add Instructions
                              </h3>
                              <p className="text-md text-muted-foreground mb-2">
                                Provide specific instructions for integrating{" "}
                                {vibeKit?.agent?.name}
                              </p>
                            </div>
                            <FormField
                              control={form.control}
                              name="instructions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder={`Describe how you want ${vibeKit?.agent?.name} integrated into your app...`}
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
                            {/* No back button on first step */}
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
                              disabled={
                                !isAuthenticated || !form.formState.isValid
                              }
                              className={cn("w-full")}
                              style={{
                                backgroundColor:
                                  vibeKit.agent.primaryColor ||
                                  vibeKit.project.primaryColor,
                                color: getContrastTextColor(
                                  vibeKit.agent.primaryColor ||
                                    vibeKit.project.primaryColor ||
                                    "#000000"
                                ),
                              }}
                            >
                              {vibeKit.agent.buttonText ||
                                widgetConfig.buttonText}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground text-center mt-4">
                            Built using{" "}
                            <span className="font-bold">VibeKit</span>
                          </p>
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-md font-semibold mb-4">
                          Confirmation
                        </h3>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-md">
                              Repository:
                            </span>{" "}
                            <span className="text-mdtext-muted-foreground">
                              {form.getValues("repository")}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-md">
                              Instructions:
                            </span>
                            <p className="text-md text-muted-foreground mt-1">
                              {form.getValues("instructions")}
                            </p>
                          </div>
                        </div>

                        <div className="bg-background border border-border p-4 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <LucideGithub className="w-5 h-5 text-blue-600 mt-1" />
                            </div>
                            <div>
                              <h4 className="font-medium text-md">
                                Pull Request will be created
                              </h4>
                              <p className="text-md text-muted-foreground mt-1">
                                A pull request will be automatically created in
                                your repository with the VibeKit integration
                                based on your instructions.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 pt-6">
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setStep(1)}
                              className="flex-1"
                            >
                              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className={cn("flex-1")}
                              style={{
                                backgroundColor:
                                  vibeKit.agent.primaryColor ||
                                  vibeKit.project.primaryColor,
                                color: getContrastTextColor(
                                  vibeKit.agent.primaryColor ||
                                    vibeKit.project.primaryColor ||
                                    "#000000"
                                ),
                              }}
                            >
                              <LucideGithub className="w-4 h-4 mr-2" />
                              Create Pull Request
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="cursor" className="space-y-4 flex-1">
                <div className="flex flex-col gap-4">
                  <div className="bg-muted p-4 rounded-lg space-y-4 h-full flex flex-col">
                    <ScrollArea className="flex-1 w-full text-[13px] whitespace-pre-wrap font-mono">
                      <div className="h-[200px] md:w-[430px] w-[316px]">
                        {vibeKit?.agent?.systemPrompt}
                      </div>
                    </ScrollArea>
                    <Button onClick={copyToClipboard} className="w-full">
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
                  <div className="border border-border p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Zap
                          className="w-5 h-5  mt-1"
                          style={{
                            color:
                              vibeKit.agent.primaryColor ||
                              vibeKit.project.primaryColor,
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-md font-medium">
                          How to use this prompt
                        </h4>
                        <p className="text-md mt-1">
                          Copy the prompt above and paste it into Cursor&apos;s,
                          Windsurf, Devin, VSCode etc.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
