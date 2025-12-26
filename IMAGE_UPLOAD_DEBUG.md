# 🔍 Image Upload Debugging Guide

## Issue Identified
**Problem**: Image upload is failing in production
**Working**: Text-based nutrition analysis ✅
**Failing**: Image upload analysis ❌

---

## Most Likely Causes

### 1. **Missing Environment Variables** 🚨 (90% probability)

The image upload needs these API keys in Vercel:

#### Required for Gemini Fallback (Always works):
```bash
GEMINI_API_KEY=your_key_here
```

#### Optional for Vision API (Better results):
```bash
GOOGLE_CLOUD_KEY_PATH=/path/to/service-account.json
# OR if using inline credentials:
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

**Check Now**: 
1. Go to: https://vercel.com/harshitas-projects-504f51a0/[your-project]/settings/environment-variables
2. Verify `GEMINI_API_KEY` exists and is correct
3. Check if `GOOGLE_CLOUD_KEY_PATH` exists (optional)

---

### 2. **Request Size Limit Exceeded** (Possible)

**Issue**: Base64 encoded images can be large (1-5MB)

**Vercel Limits**:
- Free tier: 4.5MB request body limit
- Pro tier: 4.5MB request body limit (same)

**Solution**: Check if image is too large

---

### 3. **CORS or Content-Type Issues** (Less likely but check)

**Issue**: Browser might block image data transfer

---

## 🔧 Step-by-Step Debugging

### Step 1: Check Browser Console (DO THIS FIRST)

1. Open your deployed site: https://healthy-l5kwiti6h-harshitas-projects-504f51a0.vercel.app/nutrition
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Try uploading an image
5. Look for RED error messages

**Common Errors**:
- `Failed to fetch` → Network/CORS issue
- `413 Payload Too Large` → Image too big
- `500 Internal Server Error` → Backend API issue
- `API key not valid` → GEMINI_API_KEY missing/wrong

**Share the exact error message** from the console!

---

### Step 2: Check Network Tab

1. In Developer Tools, go to "Network" tab
2. Try uploading an image
3. Click on the `/api/image-upload` request
4. Check:
   - **Status Code**: Should be 200 (if it's 500, see Step 3)
   - **Response**: Shows the error message
   - **Payload**: Check request size under "Headers" → "Request Headers"

**Screenshot what you see in the Response tab!**

---

### Step 3: Check Vercel Logs

1. Go to: https://vercel.com/harshitas-projects-504f51a0/[your-project]/logs
2. Try uploading an image again
3. Refresh the logs page
4. Look for errors related to `/api/image-upload`

**Common Log Errors**:
```
❌ Error: GEMINI_API_KEY is not defined
   → Fix: Add environment variable in Vercel

❌ Failed to initialize Vertex AI client
   → This is OK, it falls back to Gemini

❌ Error: Request entity too large
   → Fix: Compress image before upload

❌ Vision API failed or is not configured
   → This is OK, it falls back to Gemini vision
```

---

## 🚀 Quick Fixes to Try

### Fix #1: Verify GEMINI_API_KEY (Most Important!)

**Terminal Command**:
```powershell
# Check if environment variable is set locally
$env:GEMINI_API_KEY
```

**In Vercel Dashboard**:
1. Go to Project Settings → Environment Variables
2. Check if `GEMINI_API_KEY` exists
3. If missing, add it:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key
   - Environment: Production, Preview, Development (select all)
4. Redeploy: `vercel --prod`

---

### Fix #2: Test with Small Image

The issue might be image size:
1. Use a small image (< 500KB)
2. Try uploading again
3. If this works, add image compression

**Add Image Compression** (optional):
```typescript
// In app/nutrition/page.tsx, modify handleFileChange:

reader.onloadend = async () => {
  let base64 = reader.result as string
  
  // Compress if image is large
  if (base64.length > 1000000) { // > 1MB
    // Create canvas to resize
    const img = new Image()
    img.src = base64
    await new Promise(resolve => img.onload = resolve)
    
    const canvas = document.createElement('canvas')
    const MAX_WIDTH = 800
    const scale = MAX_WIDTH / img.width
    canvas.width = MAX_WIDTH
    canvas.height = img.height * scale
    
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
    base64 = canvas.toDataURL('image/jpeg', 0.7)
  }
  
  try {
    const result = await analyzeImage(base64)
    // ... rest of code
  }
}
```

---

### Fix #3: Add Better Error Handling

Update the API route to give more detailed errors:

**File**: `app/api/image-upload/route.ts`

Add this at the top:
```typescript
export const maxDuration = 30; // Extend timeout for image processing
export const dynamic = 'force-dynamic';
```

Update error logging:
```typescript
} catch (error) {
  console.error("Image analysis error:", error);
  console.error("Error details:", {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
  
  return NextResponse.json(
    { 
      error: "Failed to analyze image",
      details: error instanceof Error ? error.message : 'Unknown error'
    },
    { status: 500 }
  );
}
```

---

## 🧪 Manual Testing

### Test 1: API Endpoint Directly

**PowerShell Command**:
```powershell
# Create a small base64 test image
$testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

$body = @{
    image = $testImage
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://healthy-l5kwiti6h-harshitas-projects-504f51a0.vercel.app/api/image-upload" -Method POST -Body $body -ContentType "application/json"

$response.Content
```

**Expected**: Should return JSON with detected foods or error message

---

### Test 2: Check if Text Analysis Works

This helps isolate the issue:
1. Go to `/nutrition`
2. Search for "banana" (text-based)
3. If this works → Problem is image-specific
4. If this fails → Problem is broader (API keys)

---

## 📊 Checklist

Before we can fix it, please check:

- [ ] **What error appears in browser console?** (F12 → Console)
- [ ] **What's the status code?** (F12 → Network → /api/image-upload)
- [ ] **Is GEMINI_API_KEY set in Vercel?** (Settings → Environment Variables)
- [ ] **What's in Vercel logs?** (Logs page after upload attempt)
- [ ] **Does text-based search work?** (Type "banana" and submit)
- [ ] **How large is the test image?** (Under 1MB recommended)

---

## 🎯 Most Likely Solution

Based on your description, I'm 90% confident the issue is:

**Missing or Invalid GEMINI_API_KEY in Vercel Environment Variables**

**Fix**:
1. Go to Vercel project settings
2. Environment Variables
3. Add/update `GEMINI_API_KEY`
4. Redeploy

**If that doesn't work**, please share:
- Browser console error message
- Vercel log error message
- Response from the Network tab

Then I can provide a more specific fix!

---

## 🆘 Emergency Fallback

If you need it working NOW, add a client-side-only version:

**Pros**: Works immediately
**Cons**: Exposes API key (not recommended for production)

Only use this for demo purposes!

---

**Next Steps**:
1. Check browser console for errors
2. Verify GEMINI_API_KEY in Vercel
3. Share the error messages you see
4. I'll provide the exact fix!
