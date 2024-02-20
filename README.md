# Swift Package Index - GitHub Extension

A simple extension for Chromium-based browsers which adds a small widget to the side panel of GitHub repositories.

When loading a GitHub repository, the extension looks for a Package.swift file. If one exists, it checks the Swift Package Index package list to see if it's added.

If added, the Swift version and platform compatibility badges are added with a simple action button.

If not added, a button will appear making it easy to add the project to the index.