// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorHybridVnptid",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapacitorHybridVnptid",
            targets: ["AuthSSOPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "AuthSSOPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/AuthSSOPlugin"),
        .testTarget(
            name: "AuthSSOPluginTests",
            dependencies: ["AuthSSOPlugin"],
            path: "ios/Tests/AuthSSOPluginTests")
    ]
)