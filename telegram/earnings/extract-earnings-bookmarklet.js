/**
 * Unity Nodes Earnings Extractor
 *
 * Run this script in the browser console while on https://manage.unitynodes.io/network-incentives
 * It intercepts the page's API calls, fetches ALL earnings (not just the default 20),
 * and downloads a JSON file compatible with the ROI Calculator's Earnings Tracker import.
 *
 * Usage:
 * 1. Go to https://manage.unitynodes.io/network-incentives
 * 2. Open browser console (F12 → Console)
 * 3. Paste this entire script and press Enter
 * 4. Wait for the download to complete
 * 5. Import the downloaded JSON file in the Earnings Tracker
 *
 * How it works:
 * - Intercepts the page's fetch() calls to the Supabase API
 * - Modifies the pagination to request all records (5000 instead of 20)
 * - Converts amountMicros to UP amounts
 * - Creates short license IDs for display
 * - Downloads the result as a JSON file
 */

(async () => {
    console.log('🔄 Unity Nodes Earnings Extractor starting...');

    // Store original fetch
    const originalFetch = window.fetch;
    let captured = null;

    // Override fetch to intercept and modify the API call
    window.fetch = async function (...args) {
        const [url, options] = args;
        const urlStr = typeof url === 'string' ? url : url?.url || '';

        if (urlStr.includes('rewards_get_allocations') && options?.body) {
            try {
                const body = JSON.parse(options.body);
                // Modify pagination to get all records
                if (body.take) {
                    body.take = 5000;
                    body.skip = 0;
                    options.body = JSON.stringify(body);
                    console.log('📦 Modified request to fetch all records (take: 5000)');
                }

                const response = await originalFetch.call(this, url, options);
                const clone = response.clone();
                const data = await clone.json();
                captured = data;
                console.log(`✅ Captured ${Array.isArray(data) ? data.length : '?'} records`);
                return response;
            } catch (e) {
                console.error('Error intercepting:', e);
                return originalFetch.apply(this, args);
            }
        }

        return originalFetch.apply(this, args);
    };

    // Trigger a page navigation to the incentives page (SPA navigation)
    const navLink = document.querySelector('a[href="/network-incentives"]');
    if (navLink) {
        // Navigate away and back to trigger the API call
        const homeLink = document.querySelector('a[href="/"]') || document.querySelector('nav a');
        if (homeLink) {
            homeLink.click();
            await new Promise(r => setTimeout(r, 1500));
            navLink.click();
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    // Wait for data
    let attempts = 0;
    while (!captured && attempts < 20) {
        await new Promise(r => setTimeout(r, 500));
        attempts++;
    }

    // Restore original fetch
    window.fetch = originalFetch;

    if (!captured || !Array.isArray(captured)) {
        console.error('❌ Failed to capture earnings data. Try reloading the page and running again.');
        return;
    }

    // Convert to tracker format
    const trackerData = captured.map((r, i) => {
        const date = (r.completedAt || r.createdAt || '').split('T')[0];
        const lid = r.licenseId || '';
        const shortId = lid.length > 12
            ? lid.substring(0, 6) + '...' + lid.substring(lid.length - 4)
            : lid;

        return {
            id: `api-${i}-${(r.id || '').substring(0, 8)}`,
            nodeId: shortId,
            licenseType: 'ULO',
            amount: (r.amountMicros || 0) / 1000000,
            date: date,
            status: 'completed',
            timestamp: new Date(date).getTime()
        };
    });

    // Generate filename with date
    const today = new Date().toISOString().split('T')[0];
    const filename = `unity-earnings-${today}.json`;

    // Download as JSON file
    const blob = new Blob([JSON.stringify(trackerData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ Downloaded ${trackerData.length} earnings records as ${filename}`);
    console.log(`📊 Total UP: ${trackerData.reduce((s, r) => s + r.amount, 0).toFixed(6)}`);
    console.log(`📅 Date range: ${trackerData[trackerData.length - 1]?.date} to ${trackerData[0]?.date}`);
    console.log('💡 Import this file in the Earnings Tracker using the JSON import option.');
})();
