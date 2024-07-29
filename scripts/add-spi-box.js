function run() {
    // No point in doing anything if these initial page checks fail.
    if (!document.getElementById('repository-container-header')) {
        console.log('Not a GitHub repository')
        return
    }

    const publicPrivateLabel = document.querySelector('#repo-title-component > .Label')
    if (!publicPrivateLabel || publicPrivateLabel.innerText !== 'Public') {
        console.log('Not a public repository')
        return
    }

    const hasPackageManifest = Array.from(
        document.querySelectorAll('*[aria-labelledby="folders-and-files"] .Link--primary')
    ).reduce((acc, item) => acc || item.innerText === 'Package.swift', false)
    if (hasPackageManifest === false) {
        console.log('No package manifest found')
        return
    }

    // Get the owner and repo name from the page header.
    const headerList = document.querySelector('.AppHeader-context-full ul')
    const repoOwner = headerList.querySelector('li:first-child .AppHeader-context-item-label').innerText
    const repoName = headerList.querySelector('li:last-child .AppHeader-context-item-label').innerText

    // Check via a background task whether the page exists SPI.
    const spiUrl = `https://swiftpackageindex.com/${repoOwner}/${repoName}`
    chrome.runtime.sendMessage(spiUrl, (response) => {
        const sidebar = document.querySelector('.Layout-sidebar .BorderGrid')
        const utm = 'utm_source=github&utm_medium=chrome-extension'

        // Either add a "View Package" button or an "Add Package" button, but they both go to the same place!
        if (response === true) {
            const shieldsSwiftBadgeUrl = `https://img.shields.io/endpoint?url=https%3A%2F%2Fswiftpackageindex.com%2Fapi%2Fpackages%2F${repoOwner}%2F${repoName}%2Fbadge%3Ftype%3Dswift-versions`
            const shieldsPlatformsBadgeUrl = `https://img.shields.io/endpoint?url=https%3A%2F%2Fswiftpackageindex.com%2Fapi%2Fpackages%2F${repoOwner}%2F${repoName}%2Fbadge%3Ftype%3Dplatforms`
            sidebar.insertAdjacentHTML(
                'beforeend',
                `<div class="BorderGrid-row">
                    <div class="BorderGrid-cell">
                        <h2 class="h4 mb-3">Swift Package Index</h2>
                        <img src="${shieldsSwiftBadgeUrl}" alt="Swift version compatibility information from Swift Package Index" />
                        <img src="${shieldsPlatformsBadgeUrl}" alt="Platform compatibility information from Swift Package Index" />
                        <a aria-label="View ${repoOwner}/${repoName} on the Swift Package Index" href="${spiUrl}?${utm}" class="btn btn-block mt-2" target="_blank">
                            <span class="v-align-middle">View Package</span>
                        </a>
                    </div>
                </div>`
            )
        } else {
            sidebar.insertAdjacentHTML(
                'beforeend',
                `<div class="BorderGrid-row">
                    <div class="BorderGrid-cell">
                        <h2 class="h4 mb-3">Swift Package Index</h2>
                        <p>This package has not yet been added to the Swift Package Index.</p>
                        <a aria-label="Add ${repoOwner}/${repoName} to the Swift Package Index" href="${spiUrl}?${utm}" class="btn btn-block" target="_blank">
                            <span class="v-align-middle">Add Package</span>
                        </a>
                    </div>
                </div>`
            )
        }
    })
}

run()
