"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Send, Sparkles, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMyths } from "@/hooks/use-myths"
import { useUserData } from "@/hooks/use-user-data"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase/config"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"
import { MythData } from "@/types"

type Verdict = "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "INCONCLUSIVE"

interface MythResponse extends MythData {
  question: string
}

export default function MythsPage() {
  const [question, setQuestion] = React.useState("")
  const [responses, setResponses] = React.useState<MythResponse[]>([])
  const { user } = useAuth()
  const { incrementMythsDebunked } = useUserData()
  const { verifyMyth, loading } = useMyths()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    try {
      const result = await verifyMyth(question)
      const newResponse: MythResponse = {
        ...result,
        question: question,
      }
      setResponses([newResponse, ...responses])
      await incrementMythsDebunked()

      // Persist myth to Firestore for history / community browsing
      try {
        await addDoc(collection(db, "myths"), {
          question,
          verdict: result.verdict,
          explanation: result.explanation,
          keyPoints: result.keyPoints,
          sources: result.sources,
          recommendation: result.recommendation,
          askedBy: user?.uid ?? null,
          askedByEmail: user?.email ?? null,
          askedAt: serverTimestamp(),
          upvotes: 0,
          downvotes: 0,
          views: 0,
        })
      } catch (firestoreError) {
        console.error("Failed to save myth to Firestore:", firestoreError)
        // Don't block UX if history save fails
      }

      setQuestion("")
      toast.success("Myth verified successfully!")
    } catch (error) {
      toast.error("Failed to verify myth. Please try again.")
    }
  }

  const getVerdictConfig = (verdict: Verdict) => {
    switch (verdict) {
      case "TRUE":
        return {
          label: "TRUE",
          icon: CheckCircle2,
          className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        }
      case "FALSE":
        return {
          label: "FALSE",
          icon: XCircle,
          className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        }
      case "PARTIALLY_TRUE":
        return {
          label: "PARTIALLY TRUE",
          icon: CheckCircle2,
          className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
        }
      case "INCONCLUSIVE":
        return {
          label: "INCONCLUSIVE",
          icon: Clock,
          className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        }
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Header */}
        <div className="border-b border-border/40 bg-background/95 backdrop-blur pt-16 lg:pt-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Myth Busting</h1>
            <p className="text-muted-foreground mt-1">Ask any nutrition question and get science-backed answers</p>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-9rem)] lg:h-[calc(100vh-5rem)]">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            {responses.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-foreground">Ask a Nutrition Question</h2>
                <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                  Submit any diet myth or nutrition question, and our AI will analyze it against scientific research to
                  give you a verified answer with sources.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 max-w-2xl w-full">
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 bg-transparent"
                    onClick={() => setQuestion("Does eating late at night cause weight gain?")}
                  >
                    <div>
                      <div className="font-medium text-sm">Does eating late at night cause weight gain?</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 bg-transparent"
                    onClick={() => setQuestion("Is breakfast really the most important meal?")}
                  >
                    <div>
                      <div className="font-medium text-sm">Is breakfast really the most important meal?</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 bg-transparent"
                    onClick={() => setQuestion("Do carbs make you fat?")}
                  >
                    <div>
                      <div className="font-medium text-sm">Do carbs make you fat?</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 bg-transparent"
                    onClick={() => setQuestion("Should I take vitamin supplements?")}
                  >
                    <div>
                      <div className="font-medium text-sm">Should I take vitamin supplements?</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-6 pb-4">
              {loading && (
                <Card className="border-border/50 animate-pulse">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-muted rounded w-32"></div>
                      <div className="h-6 bg-muted rounded w-24"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </CardContent>
                </Card>
              )}

              {responses.map((response, index) => {
                const verdictConfig = getVerdictConfig(response.verdict)
                const VerdictIcon = verdictConfig.icon

                return (
                  <Card key={index} className="border-border/50">
                    <CardHeader>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <CardTitle className="text-lg leading-relaxed flex-1">{response.question}</CardTitle>
                        <Badge variant="outline" className={`${verdictConfig.className} font-semibold`}>
                          <VerdictIcon className="mr-1.5 h-3.5 w-3.5" />
                          {verdictConfig.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Explanation */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Explanation</h4>
                        <p className="text-muted-foreground leading-relaxed">{response.explanation}</p>
                      </div>

                      {/* Scientific Sources */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Scientific Sources</h4>
                        <div className="space-y-2">
                          {response.sources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted/50 hover:border-primary/30"
                            >
                              <ExternalLink className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-foreground leading-relaxed">
                                  {source.title}
                                </div>
                                {source.author && (
                                  <div className="text-xs text-muted-foreground mt-1">{source.author}</div>
                                )}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border/40 bg-background/95 backdrop-blur p-4">
            <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask any nutrition myth or question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by AI and verified against scientific research databases
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
