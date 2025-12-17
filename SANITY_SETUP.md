## Sanity setup for alstudio

1) Create a Sanity project/dataset  
   - `npm create sanity@latest -- --template clean` (or use the Sanity UI).  
   - Choose project name, dataset (e.g. `production`), and allow public read or create a read token.

2) Define schemas to match the frontend queries  
   - `tag`: fields `name` (string), `slug` (slug from name).  
   - `project`: fields `name` (string), `slug` (slug), `description` (text/portable text optional), `order` (number optional).  
   - `imageAsset`: fields `image` (image asset) or `url` (string), `alt` (string), `tags` (array of references to `tag`), `collections` (array of strings for project slugs), `order` (number optional).  
   - Name the document types exactly `tag`, `project`, `imageAsset` to align with the GROQ queries in `src/sanity/queries.js`.

3) Environment variables (Vite)  
   - `VITE_SANITY_PROJECT_ID=xxxx`  
   - `VITE_SANITY_DATASET=production` (or your dataset)  
   - `VITE_SANITY_API_VERSION=2024-01-01` (default used if unset)  
   - `VITE_SANITY_READ_TOKEN=...` only if the dataset is not public-read.  

4) Frontend data flow  
   - `src/sanity/client.js` creates the Sanity client from the env vars.  
   - `src/sanity/queries.js` defines the GROQ queries the app uses.  
   - `src/App.jsx` fetches projects/images/tags on load and renders the site from Sanity data.

5) Install dependencies  
   - Added: `@sanity/client`, `groq`.  
   - Removed: `decap-cms`, `vite-plugin-decap-cms`.  
   - Run `npm install` to sync `package-lock.json`.

6) Deploy notes  
   - Provide the Vite env vars to your hosting platform.  
   - If you keep the old Decap admin files, they are no longer used by the app.
