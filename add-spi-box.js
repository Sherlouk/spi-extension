function run() {
    const header = document.getElementById('repository-container-header');

    if (!header) {
        console.log("Not a Repository");
        return;
    }

    const labels = Array.prototype.map.call(header.getElementsByClassName('Label'), i => i.innerHTML);

    if (!labels.includes('Public')) {
        console.log("Not a Public Repository");
        return;
    }

    if (!Array.prototype.map.call(document.getElementsByClassName('Link--primary'), i => i.innerText).includes('Package.swift')) {
        console.log("Not a Swift Package");
        return;
    }

    const sidebar = document.getElementsByClassName('Layout-sidebar')[0].getElementsByClassName('BorderGrid')[0];

    const repoWithOwner = window.location.pathname;
    const repoName = repoWithOwner.split('/')[2];

    const newTemplate = `
    <div class="BorderGrid-row">
        <div class="BorderGrid-cell">
            <h2 class="h4 mb-3">Swift Package Index</h2>
            <p>This package does not currently exist on the Swift Package Index.</p>

            <a aria-label="Add {name} to the Swift Package Index"
                href="https://github.com/SwiftPackageIndex/PackageList/issues/new?labels=Add+Package&template=add_package.yml&title=Add+{name}&list=https%3A%2F%2Fgithub.com%2F{repoWithOwner}.git" class="btn btn-block" target="_blank">
                <span class="v-align-middle">Add Package</span>
            </a>

        </div>
    </div>
    `

    const existingTemplate = `
    <div class="BorderGrid-row">
        <div class="BorderGrid-cell">
            <h2 class="h4 mb-3">Swift Package Index</h2>
            
            {svg1}
            {svg2}

            <a aria-label="Open {name} on Swift Package Index"
                href="https://swiftpackageindex.com/{repoWithOwner}?{utm}" class="btn btn-block mt-2" target="_blank">
                <span class="v-align-middle">View Package</span>
            </a>

        </div>
    </div>
    `

    fetch('https://raw.githubusercontent.com/SwiftPackageIndex/PackageList/main/packages.json').then(r => r.text()).then(packages => {
        if (packages.includes(repoWithOwner)) {
            fetch('https://img.shields.io/endpoint?url=https%3A%2F%2Fswiftpackageindex.com%2Fapi%2Fpackages%2F{repoWithOwner}%2Fbadge%3Ftype%3Dswift-versions'.replaceAll('{repoWithOwner}', repoWithOwner.replace(/^\//, ''))).then(r => r.text()).then(svgOne => {
                fetch('https://img.shields.io/endpoint?url=https%3A%2F%2Fswiftpackageindex.com%2Fapi%2Fpackages%2F{repoWithOwner}%2Fbadge%3Ftype%3Dplatforms'.replaceAll('{repoWithOwner}', repoWithOwner.replace(/^\//, ''))).then(r => r.text()).then(svgTwo => {
                    sidebar.insertAdjacentHTML(
                        'beforeend', 
                        existingTemplate
                            .replaceAll('{name}', repoName)
                            .replaceAll('{repoWithOwner}', repoWithOwner.replace(/^\//, ''))
                            .replaceAll('{utm}', 'utm_source=spi-ext&utm_medium=github&utm_campaign=chrome_ext')
                            .replace('{svg1}', svgOne)
                            .replace('{svg2}', svgTwo.replaceAll('id="r"', 'id="r2"').replaceAll('url(#r)', 'url(#r2)'))
                    );
                });
            });
        } else {
            sidebar.insertAdjacentHTML(
                'beforeend', 
                newTemplate
                    .replaceAll('{name}', repoName)
                    .replaceAll('{repoWithOwner}', repoWithOwner.replace(/^\//, ''))
                    .replaceAll('{utm}', 'utm_source=spi-ext&utm_medium=github&utm_campaign=chrome_ext')
            );
        }
        
        
    });
}

run();