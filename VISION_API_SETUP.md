# 🔑 Enable Google Cloud Vision API

## Current Status
Your Vision API credentials are configured, but you need to enable the API in Google Cloud Console.

## Steps to Enable Vision API

### 1. Go to Google Cloud Console
https://console.cloud.google.com/apis/library/vision.googleapis.com?project=healthyme-34443

### 2. Click "ENABLE" Button
This enables Vision API for your project

### 3. Verify Service Account Has Access
Your service account: `firebase-adminsdk-fbsvc@healthyme-34443.iam.gserviceaccount.com`

Go to: https://console.cloud.google.com/iam-admin/iam?project=healthyme-34443

Check if your service account has one of these roles:
- ✅ Cloud Vision API User
- ✅ Editor
- ✅ Owner

If not, add the role:
1. Click pencil icon next to service account
2. Add Role → "Cloud Vision API User"
3. Save

### 4. Test Vision API

After enabling, test with curl:

```powershell
$body = @{
    requests = @(
        @{
            image = @{
                content = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            }
            features = @(
                @{
                    type = "LABEL_DETECTION"
                    maxResults = 10
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod `
    -Uri "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC0JFPD6vx_yqneUdIpejz2foEeRGTebmw" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response | ConvertTo-Json -Depth 10
```

**Expected**: Should return label annotations

**If Error**: Vision API not enabled yet

---

## Alternative: Use Gemini Vision Only (Simpler)

If you don't want to setup Vision API, you can disable it and use only Gemini's built-in vision:

### Option A: Disable Vision API (Keep Gemini Vision)

Update `app/api/image-upload/route.ts`:

```typescript
// Skip Vision API entirely, go straight to Gemini
export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    
    const base64 = image.split(",")[1] || image;
    const model = getGeminiModel("gemini-2.0-flash-exp");
    
    // Use Gemini vision directly
    const prompt = `
      Analyze this food image and identify all food items visible.
      Return ONLY a valid JSON object with this structure:
      {
        "detectedFoods": ["food1", "food2"],
        "confidence": "high" or "medium" or "low",
        "description": "Brief description"
      }
    `;
    
    const imagePart = {
      inlineData: { data: base64, mimeType: "image/jpeg" }
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const text = (await result.response).text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    
    const imageData = JSON.parse(cleanedText);
    const enriched = await enrichWithNutrition(
      model, 
      imageData.detectedFoods || [], 
      imageData
    );
    
    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
```

**Pros**:
- ✅ Simpler setup
- ✅ No additional API to enable
- ✅ Still works great

**Cons**:
- ❌ Slightly less accurate than Vision API
- ❌ No confidence scores

---

## Recommendation

1. **Try enabling Vision API first** (5 minutes)
2. **If it doesn't work**, use Gemini vision only (already setup as fallback)
3. **Test both** and see which gives better results

Your current code already has the fallback, so it will work either way! ✅

---

**Note**: The Vision API fallback is AUTOMATIC. If Vision fails, it uses Gemini vision. So your app will work regardless! 🎉
