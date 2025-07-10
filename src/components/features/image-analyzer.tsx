'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Camera, 
  X, 
  Loader2, 
  ImageIcon, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { ImageAnalysisResult, NutritionAnalysisResult } from '@/lib/gemini';

interface ImageAnalyzerProps {
  onAnalysisComplete?: (result: ImageAnalysisResponse) => void;
  includeNutrition?: boolean;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
}

interface ImageAnalysisResponse {
  imageAnalysis: ImageAnalysisResult;
  nutritionAnalysis?: NutritionAnalysisResult;
  timestamp: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageAnalyzer({ 
  onAnalysisComplete, 
  includeNutrition = true,
  maxFileSize = MAX_FILE_SIZE,
  acceptedTypes = ACCEPTED_TYPES
}: ImageAnalyzerProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImageAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use JPEG, PNG, or WebP.`;
    }
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`;
    }
    return null;
  }, [acceptedTypes, maxFileSize]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix to get just the base64 string
        const base64String = base64.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!selectedFile || !user) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Convert to base64
      setProgress(20);
      const imageBase64 = await convertToBase64(selectedFile);
      
      setProgress(40);
      
      // Get auth token
      const token = await user.getIdToken();
      
      setProgress(60);
      
      // Call API
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageBase64,
          includeNutrition,
        }),
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      setProgress(100);
      
      if (data.success) {
        setResult(data.data);
        onAnalysisComplete?.(data.data);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [selectedFile, user, includeNutrition, onAnalysisComplete, convertToBase64]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  const renderAnalysisResults = () => {
    if (!result) return null;

    const { imageAnalysis, nutritionAnalysis } = result;

    return (
      <div className="space-y-4">
        <Tabs defaultValue="foods" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="foods">Identified Foods</TabsTrigger>
            <TabsTrigger value="nutrition" disabled={!nutritionAnalysis}>
              Nutrition Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Analysis Results
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {Math.round(imageAnalysis.overallConfidence * 100)}% confidence
                  </Badge>
                  <Badge variant="outline">
                    {imageAnalysis.identifiedFoods.length} foods found
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {imageAnalysis.identifiedFoods.map((food, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{food.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {food.description}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {Math.round(food.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>

                {imageAnalysis.suggestions.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Suggestions
                    </h4>
                    <ul className="text-sm space-y-1">
                      {imageAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            {nutritionAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Information</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    For: {nutritionAnalysis.foodName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Calories</h4>
                      <p className="text-2xl font-bold text-primary">
                        {nutritionAnalysis.calories}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        per {nutritionAnalysis.servingSize}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Macros</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span>{nutritionAnalysis.macros.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span>{nutritionAnalysis.macros.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat:</span>
                          <span>{nutritionAnalysis.macros.fat}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Food Image Analyzer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload or capture an image to identify foods and get nutrition information
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-48 mx-auto rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearSelection}
              >
                <X className="w-4 h-4" />
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedFile?.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports JPEG, PNG, WebP up to {Math.round(maxFileSize / (1024 * 1024))}MB
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing image...</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            onClick={analyzeImage}
            disabled={!selectedFile || loading || !user}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Analyze Image
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {renderAnalysisResults()}
      </CardContent>
    </Card>
  );
}