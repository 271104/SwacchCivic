# Official SMC Images - Placement Instructions

## Required Images

You need to place 2 official SMC images in the `citizen-frontend-react/public/` folder:

### 1. Header Logo (smc-header-logo.png)
- **Filename:** `smc-header-logo.png`
- **Description:** The official header with SMC logo and text "Solapur Municipal Corporation" and "सोलापूर महानगरपालिका सोलापूर"
- **Recommended Size:** 1000x150 pixels (or similar aspect ratio)
- **Format:** PNG with transparent background preferred

### 2. Smart City Banner (smc-banner.png)
- **Filename:** `smc-banner.png`
- **Description:** The colorful "Solapur Smart City" banner with landmarks and icons
- **Recommended Size:** 1920x300 pixels (or similar wide aspect ratio)
- **Format:** PNG or JPG

## How to Add Images

### Step 1: Save the Images
1. Save the header logo image as `smc-header-logo.png`
2. Save the banner image as `smc-banner.png`

### Step 2: Place in Public Folder
Copy both images to:
```
citizen-frontend-react/public/
```

Final structure should be:
```
citizen-frontend-react/
├── public/
│   ├── smc-header-logo.png     ← Place here
│   ├── smc-banner.png           ← Place here
│   └── smc-logo-official.svg    (already exists)
```

### Step 3: Verify
1. The frontend will automatically detect and use these images
2. If images are not found, fallback designs will be shown
3. Refresh your browser to see the official images

## Where Images Will Appear

### Citizen Portal
- ✅ Login page
- ✅ Registration page  
- ✅ Dashboard (via SMCHeader)
- ✅ All pages with SMCHeader component

### Officer Portal
- ✅ Officer login page
- ✅ Officer dashboard
- ✅ All officer pages

## Image Specifications

### Header Logo
- **Purpose:** Main branding element
- **Contains:** SMC circular logo + "Solapur Municipal Corporation" text
- **Background:** White or transparent
- **Usage:** Displayed at top of every page

### Smart City Banner
- **Purpose:** Showcase Solapur Smart City initiative
- **Contains:** Colorful design with landmarks, icons, and "Smart City" branding
- **Background:** Colorful gradient with illustrations
- **Usage:** Displayed below header on all pages

## Fallback Behavior

If images are not found, the system will automatically show:
- **Header:** SVG logo with text fallback
- **Banner:** Gradient banner with "SOLAPUR SMART CITY" text

This ensures the application works even without the images, but official images are recommended for professional appearance.

## Testing

After placing images:
1. Open http://localhost:5173
2. Check if header logo displays correctly
3. Check if Smart City banner displays below header
4. Test on both citizen and officer portals
5. Test on mobile and desktop views

## Support

If you need help with image placement:
- Check that filenames match exactly (case-sensitive)
- Verify images are in `public/` folder, not `src/`
- Clear browser cache if images don't update
- Check browser console for any errors

---

**Note:** After successfully placing the images, you can delete this instruction file.
