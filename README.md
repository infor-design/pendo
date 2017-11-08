# Styles and Documentation website for Pendo.io styling

To build the style guide and documentation website:

1. Clone the repo
1. `npm install`
1. Build/Serve
    - `gulp` = build
    - `gulp dev` = build & serve
    - `node scripts/prod-deploy.js` = serve on port 80 for production (requires files to be built separately)

Use tags to release for Bitbucket as the example shows for v0.2.1 below:
1. `git tag -a v0.2.1 -m "A message about this tag."`
1. `git push origin -v0.2.1`

The workflow to release is:
1. Make changes
1. Commit those changes
1. Bump version in package.json
1. Commit package.json and CHANGELOG.md files
1. Tag
1. Push
1. Deploy (For now, ask Artem)
