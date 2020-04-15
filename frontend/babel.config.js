module.exports = {
    plugins: ["react-hot-loader/babel", "emotion"],
    presets: [
        [
            "@babel/env",
            {
                useBuiltIns: "usage",
                corejs: 3,
                targets: { browsers: "last 2 versions" }
            }
        ],
        "@babel/preset-typescript",
        "@babel/preset-react"
    ]
};
