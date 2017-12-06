# Styles and Documentation website for Pendo.io styling

To build the style guide and documentation website:

1. Clone the repo
1. `npm install`
1. Build/Serve
    - `gulp` = compile
    - `gulp dev` = compile & serve
    - `gulp publish` = build, zip, and deploy to documentation website
    - `node scripts/prod-deploy.js` = serve on port 80 for production (requires files to be built separately)

Where to find stuff:
- `src/`
- - `packages` Where the components are with the raw code (css) and readme's
- `site/`
- - `templates` They shared handlebar templates for the content
- - `www/` The served files
- - - `css` Commited styles for site function
- - - `images` Commited asssets
- - - `dist` compiled styles
- `gulp/`
- - `tasks` Where we keep the gulp tasks
