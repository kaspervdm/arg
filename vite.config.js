import ViteRestart from "vite-plugin-restart";

export default ({ command }) => ({
    base: command === "serve" ? "" : "/dist/",
    build: {
        manifest: true,
        outDir: "../cms/web/dist/",
        rollupOptions: {
            input: {
                app: "src/js/app.js",
            },
        },
    },
    server: {
        // Allow cross-origin requests -- https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6
        allowedHosts: true,
        cors: {
            origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(localhost|\.local|\.test|\.site)(?::\d+)?$/,
        },
        fs: {
            strict: false,
        },
        headers: {
            "Access-Control-Allow-Private-Network": "true",
        },
        host: "0.0.0.0",
        origin: `${process.env.DDEV_PRIMARY_URL}:3000`,
        port: 3000,
        strictPort: true,
    },
    plugins: [
        ViteRestart({
            reload: ["templates/**/*"],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
            },
        },
        devSourcemap: true,
    },
});
