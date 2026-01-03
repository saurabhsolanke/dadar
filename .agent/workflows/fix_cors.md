---
description: Fix Firebase Storage CORS issues
---
To fix the CORS error preventing image uploads, you need to apply the `cors.json` configuration to your Firebase Storage bucket.

Run the following command in your terminal (ensure you have `gsutil` installed via Google Cloud SDK):

```bash
gsutil cors set cors.json gs://dadar-c2456.firebasestorage.app
```

If you don't have `gsutil`, you can install it or use the Google Cloud Console:
1. Go to https://console.cloud.google.com/
2. Open the Cloud Shell (terminal icon in top right).
3. Upload `cors.json`.
4. Run `gsutil cors set cors.json gs://dadar-c2456.firebasestorage.app`
