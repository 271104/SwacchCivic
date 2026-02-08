# How to Add Official SMC Images

## Current Status
The application is showing a professional fallback design because the official images haven't been placed yet.

## Quick Steps to Add Images

### Step 1: Prepare Your Images
You have 2 images to add:
1. **Header Logo** - The image with SMC logo and "Solapur Municipal Corporation" text
2. **Smart City Banner** - The colorful banner with landmarks

### Step 2: Rename Images
Rename your images to exactly these names:
- `smc-header-logo.png`
- `smc-banner.png`

### Step 3: Place in Public Folder
1. Open File Explorer
2. Navigate to: `citizen-frontend-react/public/`
3. Copy both images into this folder

### Step 4: Verify
After placing images:
1. Refresh browser (Press F5)
2. Images should appear automatically
3. If not, press Ctrl + Shift + R (hard refresh)

## Folder Location
```
Your Project/
└── citizen-frontend-react/
    └── public/              ← Place images HERE
        ├── smc-header-logo.png    ← Your header image
        ├── smc-banner.png          ← Your banner image
        └── smc-logo-official.svg   (already exists)
```

## What You'll See

### Before (Current - Fallback Design):
- Blue/purple gradient banner with "SOLAPUR SMART CITY" text
- SMC logo with text header

### After (With Official Images):
- Your exact official header logo image
- Your exact official Smart City banner image

## Troubleshooting

### Images Still Not Showing?
1. **Check filenames** - Must be exactly:
   - `smc-header-logo.png` (not .jpg, not .PNG)
   - `smc-banner.png`

2. **Check location** - Must be in:
   - `citizen-frontend-react/public/` folder
   - NOT in `src/` folder

3. **Hard refresh browser**:
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

4. **Check browser console**:
   - Press F12
   - Look for any red errors
   - Check if images are loading

## Image Specifications

### Header Logo (smc-header-logo.png)
- **Recommended:** 1000 x 150 pixels
- **Format:** PNG (transparent background preferred)
- **Max size:** 500 KB

### Banner (smc-banner.png)
- **Recommended:** 1920 x 300 pixels
- **Format:** PNG or JPG
- **Max size:** 1 MB

## Need Help?

If you're having trouble:
1. Make sure both servers are running
2. Check the exact folder path
3. Verify image file extensions
4. Try restarting the frontend server

---

**Note:** The application works perfectly with the fallback design, but official images will make it look exactly like the SMC website!
