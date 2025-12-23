"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase/config"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface UserSettings {
  displayName: string
  email: string
  nutritionGoals: {
    calories: number
    protein: number
    carbs: number
  }
  preferences: {
    emailNotifications: boolean
    darkMode: boolean
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    displayName: "",
    email: "",
    nutritionGoals: {
      calories: 2000,
      protein: 150,
      carbs: 200,
    },
    preferences: {
      emailNotifications: true,
      darkMode: false,
    },
  })

  useEffect(() => {
    loadSettings()
  }, [user])

  const loadSettings = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const userDocRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        setSettings({
          displayName: data.displayName || user.displayName || "",
          email: user.email || "",
          nutritionGoals: data.nutritionGoals || {
            calories: 2000,
            protein: 150,
            carbs: 200,
          },
          preferences: data.preferences || {
            emailNotifications: true,
            darkMode: false,
          },
        })
      } else {
        // Initialize default settings and persist them for this user
        const initialSettings: UserSettings = {
          displayName: user.displayName || "",
          email: user.email || "",
          nutritionGoals: {
            calories: 2000,
            protein: 150,
            carbs: 200,
          },
          preferences: {
            emailNotifications: true,
            darkMode: false,
          },
        }

        await setDoc(userDocRef, {
          ...initialSettings,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        setSettings(initialSettings)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!user) {
      toast.error("Please sign in to save changes")
      return
    }

    setSaving(true)
    try {
      const userDocRef = doc(db, "users", user.uid)
      // Use setDoc with merge to work even if document doesn't exist yet
      await setDoc(
        userDocRef,
        {
        displayName: settings.displayName,
        updatedAt: new Date(),
        },
        { merge: true },
      )
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const saveNutritionGoals = async () => {
    if (!user) {
      toast.error("Please sign in to save changes")
      return
    }

    setSaving(true)
    try {
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(
        userDocRef,
        {
          nutritionGoals: settings.nutritionGoals,
          updatedAt: new Date(),
        },
        { merge: true },
      )
      toast.success("Nutrition goals updated successfully!")
    } catch (error) {
      console.error("Error saving nutrition goals:", error)
      toast.error("Failed to save nutrition goals")
    } finally {
      setSaving(false)
    }
  }

  const updatePreferences = async (key: string, value: boolean) => {
    if (!user) {
      toast.error("Please sign in to save changes")
      return
    }

    try {
      const userDocRef = doc(db, "users", user.uid)
      const newPreferences = {
        ...settings.preferences,
        [key]: value,
      }

      await setDoc(
        userDocRef,
        {
          preferences: newPreferences,
          updatedAt: new Date(),
        },
        { merge: true },
      )

      setSettings({
        ...settings,
        preferences: newPreferences,
      })
      
      toast.success(`${key === "emailNotifications" ? "Email notifications" : "Dark mode"} ${value ? "enabled" : "disabled"}`)
      
      if (key === "darkMode") {
        document.documentElement.classList.toggle("dark", value)
      }
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast.error("Failed to update preferences")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="border-b border-border/40 bg-background/95 backdrop-blur pt-16 lg:pt-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.displayName}
                    onChange={(e) =>
                      setSettings({ ...settings, displayName: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="bg-primary hover:bg-primary/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Nutrition Goals</CardTitle>
              <CardDescription>Set your daily nutritional targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="calories">Daily Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={settings.nutritionGoals.calories}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        nutritionGoals: {
                          ...settings.nutritionGoals,
                          calories: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={settings.nutritionGoals.protein}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        nutritionGoals: {
                          ...settings.nutritionGoals,
                          protein: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={settings.nutritionGoals.carbs}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        nutritionGoals: {
                          ...settings.nutritionGoals,
                          carbs: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    min="0"
                  />
                </div>
              </div>
              <Button
                onClick={saveNutritionGoals}
                disabled={saving}
                className="bg-primary hover:bg-primary/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Goals"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily nutrition summaries
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    updatePreferences("emailNotifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark theme</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.preferences.darkMode}
                  onCheckedChange={(checked) =>
                    updatePreferences("darkMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
