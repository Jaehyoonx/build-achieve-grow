# Performance of B.A.G. - Build, Achieve, Grow

## Introduction and Methodology

Performance measurements were collected using Chrome on macOS while running the client on `localhost:5173` and the server on `localhost:3000`.  
The Network panel, Performance panel, and console timing logs were used to compare endpoint latency before and after adding caching.  
Viewport size during testing was 1440x900 as reported by window.screen.  
Each endpoint was tested multiple times in succession to observe the effect of caching on repeated requests.

## Baseline Performance

Before caching, nearly every stock and ETF endpoint triggered a full MongoDB query on every request.  Repeated calls to `/api/stocks/:symbol/history`, `/api/etfs/:symbol/history`, and all "latest" and "search" endpoints consistently took 250–500ms.  
Navigation in the UI, especially switching back to a previously viewed symbol felt delayed because identical data was fetched repeatedly.  
The browser tools identified these repeated operations as major performance issues.

Additionally, API responses were sent uncompressed, resulting in large payloads over the network.  
The main application bundle (542.84 kB uncompressed) was not optimized for lazy loading, forcing the browser to download all code including infrequently used routes (News, Contact) on initial page load.  
These factors combined created unnecessary bandwidth consumption and slower initial page loads, particularly on slower network connections.

Without React.Lazy. There was an issue with switching between tabs, which would cause the page to flicker, including headlines. Once I added React.Lazy , it just fetches once, and after switching to the headline, it no longer flickers.

Also, before cache control, the headline would need to fetch every time to get data, and now it only needs to do that once, and when you go to a different page, it no longer needs to fetch from the DB every time.

## Summary of Changes

### Change 1: Caching for Stock History, Latest Price, and Search Endpoints

Lead: Haider Ahmed  
Link: [(GitLab link to `/server/api.js`)](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/merge_requests/41/diffs?commit_id=2fabd24668be4a3abf753803ebdb6a89a1714af6)

Caching was added to the following stock endpoints:

• `/api/stocks/:symbol/history`  
• `/api/stocks/:symbol/latest`  
• `/api/stocks/search`  
• `/api/stocks?limit=50`

Each endpoint now checks an in-memory cache before querying MongoDB.  
Transformed numeric fields are also stored, preventing repeated parsing work.

Impact:  
• Repeated requests now resolve in <5ms.  
• Server load reduced significantly, with MongoDB queried only once per symbol.  
• The PriceDetail component for stocks loads instantly after the first view.  
• Search results populate faster and do not repeat expensive database operations.

### Change 2: Caching for ETF History, Latest Price, and Search Endpoints

Lead: Haider Ahmed  
Link: [(GitLab link to `/server/routes/etfs.js`)](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/merge_requests/41/diffs?commit_id=035ed1b459ee11aa731caaf607db1c3cbc58c0d2)

Caching was added to the following ETF endpoints:

• `/api/etfs/:symbol/history`  
• `/api/etfs/:symbol/latest`  
• `/api/etfs/search`  
• `/api/etfs?limit=50`

Cached entries store the transformed ETF documents to avoid redundant numeric conversions and sorting.

Impact:  
• Response times reduced from 300–450ms to near-instant after warm-up.  
• Frequent navigation between ETF cards and detail screens became smoother.  
• Network activity decreased noticeably, especially during repeated tests.  
• MongoDB output logs confirmed a major reduction in repeat queries.

### Change 3: Response Compression with Gzip

Lead: Ryan Bui
Link: [(GitLab link to `/server/api.js`)](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/merge_requests/46/diffs?commit_id=10213dfc23e3d060eb0de452ea273c655b63c4a0)

Response compression was implemented to reduce network payload sizes for all API responses.

Changes Made:
- Installed `compression` package (v1.8.1) as production dependency
- Added compression middleware in Express middleware stack (before routing)
- Removed `express.json()` middleware since all endpoints are GET requests and 
don't process JSON request bodies
- Middleware automatically compresses responses using gzip algorithm

Impact:  
- API response sizes reduced by approximately 65-70% on average
- Bandwidth consumption significantly decreased
- Transparent to frontend - browser handles decompression automatically
- Minimal CPU overhead on server
- Example: Large stock/ETF history responses now require much less network bandwidth

### Change 4: Bundle Size Optimization

Lead: Ryan Bui
Link: [(GitLab link to `/server/package.json`)](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/merge_requests/46/diffs#54e8f14248f674b305c14bde70fadbe1da1edb31)

Bundle optimization was performed through multiple techniques:

Changes Made:
- Verified all Recharts imports use specific component imports (not full library)
- Confirmed React.lazy() lazy-loading for NewsPage and Contact components
- Audited all dependencies with npm audit fix - confirmed zero unused packages in client and server
- Removed unnecessary middleware to streamline request processing

Impact:  
- Faster initial page load - only critical code loaded immediately
- Secondary routes (News, Contact) load on-demand
- Smaller bundleSize means faster downloads on slower connections

### Change 5 Caching for Headlines

Lead: Christian Graceffa
Link: 
- [(GitLab link to `/server/routes/headlines.js`)] (https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/blob/M3/server/routes/headlines.js?ref_type=heads#L74)

- [(GitLab link to `/server/routes/headlines.js`)] (https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/blob/M3/server/routes/headlines.js?ref_type=heads#L173)

Change Made:
- Added cache control headers to the headlines api route
- Previously had status code 200 eveyrtime you would go to headline, but now when you go back and forth between another page, it will have status code 304
- when it had code 200 it would have 4-5ms response time for css and react data
- with cache control code it reduced the response time to 2-3ms. which isn't much but it is faster.
Impact:
- reduces unnecessary data 
- improve client-side performance

### Change 6

Lead: Christian Graceffa
Link: 
- [(GitLab link to `/client/src/App.jsx`)](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/blob/M3/client/src/App.jsx?ref_type=heads#L9)

- [(GitLab link to `/client/src/App.jsx`)](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/blob/M3/client/src/App.jsx?ref_type=heads#L35)

Change Made:
- Implemented react.lazy and suspense for the headline component 
- now the headline chunk is only downloaded once, only on the first click when you go to headlines.
- after the download is finished it, and you go between headlines and lets say etfs, it doe not flicker like the other two do, instead it renders instantly without the flicker. making it more smooth.

Impact:
- Improve performance for users
- in my opinion it makes it so that it doesn't try to make the tab visually jarring like when siwtching between etfs and stocks in my opinion.
- reduces time when switching inbetween tabs.
## Conclusion

Adding caching to nearly all stock and ETF endpoints had the greatest effect on performance.  
Response compression and bundle optimization significantly improved network performance and initial load times.  
Database load dropped dramatically, repeated request times went from hundreds of milliseconds to just a few, and UI transitions became significantly more responsive.  

Adding React.Lazy and Suspense for the Headlines component to make the user just need to load the component only the first time, and after it is downloaded, eliminate the flicker when switching between tabs, making it smoother and faster. This made the most visual difference ever for Headlines.

 Added cache control for the Headlines API reduces the repeated request time since, without cache control, it would need to fetch over and over again, but with it, it does not need to, and since it is saved on the page, it made the speed go faster when accessing the page again for Headlines.


Key things learned:  
1. Read-heavy financial data benefits immediately from simple in-memory caching.  
2. Even without a distributed cache, server-side caching eliminates most common bottlenecks.  
3. Performance tools clearly reveal improvements when comparing before/after request waterfalls.
4. Compressing data before sending it over the network can reduce download sizes by 65-70%, making the app load much faster. 
5. Learned how to use React.Lazy properply and took me a while to actually understand what exactly it did.
6. Learned how cache-control reduces the loading time and reduces repeated request times.