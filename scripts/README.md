# Helper scripts

## Setup

- Get Docker for Mac, <https://docs.docker.com/docker-for-mac/install/>.
- Read through this <http://wiki.infor.com:8080/confluence/display/HaL/Using+docker.infor.com> to add docker.infor.com to local Docker as an unsecure registry.
- You must have a properly named and versioned `package.json` in the root of `src`.
- Your application must run on port `4000`.

## Deploy to pool server

- From the root of your project run `. ./scripts/soho_pool_deploy.sh`
- The application should be live on <http://usalvlhlpool1.infor.com/APPLICATION_PATH/>, APPLICATION_PATH is `name`-`version` taken from the `package.json` file, with `.`s replaced with `-`s.
