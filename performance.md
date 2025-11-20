# Performance of B.A.G. - Build, Achieve, Grow

## Introduction and Methodology

Performance measurements were collected using Chrome on macOS while running the client on `localhost:5173` and the server on `localhost:3000`.  
The Network panel, Performance panel, and console timing logs were used to compare endpoint latency before and after adding caching.  
Viewport size during testing was 1440x900 as reported by window.screen.  
Each endpoint was tested multiple times in succession to observe the effect of caching on repeated requests.

## Baseline Performance

Before caching, nearly every stock and ETF endpoint triggered a full MongoDB query on every request.  
Repeated calls to `/api/stocks/:symbol/history`, `/api/etfs/:symbol/history`, and all “latest” and “search” endpoints consistently took 250–500ms.  
Navigation in the UI, especially switching back to a previously viewed symbol felt delayed because identical data was fetched repeatedly.  
The browser tools identified these repeated operations as major performance issues.

## Summary of Changes

### Change 1: Caching for Stock History, Latest Price, and Search Endpoints

Lead: Haider Ahmed  
Link: [(GitLab link to `/server/routes/stocks.js`)](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/merge_requests/41/diffs?commit_id=2fabd24668be4a3abf753803ebdb6a89a1714af6)

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

## Conclusion

Adding caching to nearly all stock and ETF endpoints had the greatest effect on performance.  
Database load dropped dramatically, repeated request times went from hundreds of milliseconds to just a few, and UI transitions became significantly more responsive.  
Key things learned:  
1. Read-heavy financial data benefits immediately from simple in-memory caching.  
2. Even without a distributed cache, server-side caching eliminates most common bottlenecks.  
3. Performance tools clearly reveal improvements when comparing before/after request waterfalls.