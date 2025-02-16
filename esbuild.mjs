import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['src/app.mjs','src/solid-api.mjs'],
    bundle: true,
    sourcemap: true,
    outdir: 'www/assets/js/'
})

await esbuild.build({
    entryPoints: ['src/app.mjs'],
    bundle: true,
    sourcemap: true,
    minify: true,
    outfile: 'www/assets/js/app.min.js'
})
