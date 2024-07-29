chrome.runtime.onMessage.addListener(function (url, sender, senderResponse) {
    // All fetch requests to sites without a valid CORS policy allowing requests
    // from github.com which swiftpackageindex.com does not have, must be run from
    // a service worker as it separates the request from the extension environment.
    fetch(url, { method: 'HEAD' })
        .then((res) => {
            senderResponse(res.status >= 200 && res.status < 300)
        })
        .catch((error) => {
            console.error(`Error fetching ${url}`, error)
            senderResponse(false)
        })

    // Note: This line is very important.
    // Without it, the worker returns immediately before the fetch request returns.
    return true
})
