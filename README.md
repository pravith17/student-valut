# Student Photo Vault — Vercel Open Graph setup

## Files
- `index.html` — existing Student Photo Vault UI, with default Open Graph metadata.
- `api/student.js` — Vercel serverless function that returns student-specific Open Graph metadata.
- `vercel.json` — rewrites `/<USN>` to the serverless function.
- `open-graph.png` — add your chosen main-site preview image here.

## Deploy
1. Put these files in the root of your Vercel project.
2. Add your existing student image files (including `NNM24CS340.PNG` and `NNM24CS341.PNG`) if those local files are used.
3. Add your `open-graph.png` to the project root.
4. Commit and deploy to Vercel.
5. Ensure `sp.renenture.com` is assigned to this Vercel project.

## URLs
- `https://sp.renenture.com/` uses `/open-graph.png`.
- `https://sp.renenture.com/nnm24cs340` uses that student's image in its OG/Twitter metadata and opens the vault with the USN prefilled.

## Important
- The existing 2024/2023 S3 URL convention and the 2025 branch/section templates are used by the API resolver.
- The two special local photos must be deployed at the root if you want those exact URLs to work.
- Social platforms cache link previews. After deploying, use the platform's link-preview debugger or wait for its cache to expire when testing updates.
- Student photo URLs must be publicly fetchable by the social platform's crawler for previews to appear.
