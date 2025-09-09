# Craftation Labs Website

Originally forked from [EssentialsX/Website](https://github.com/EssentialsX/Website)
<br/>
Credit to EssentialsX and their team.

The Craftation Labs website hosted at https://ci.craftationgaming.com.

This website is a static site generated using [Saber](https://github.com/saberland/saber). The site uses the [Bulma](https://bulma.io) and [Buefy](https://buefy.org) frameworks.

## Building

### Set up your environment

1. Ensure you have Git, Node.js and Yarn installed and on your path
2. Clone the repository
3. Run `git pull origin master`
4. Run `git submodule update --init --recursive`
5. Run `yarn install`

### Commands

- To start a development server with live reload: `yarn dev`
- To update wiki content: `git submodule update --recursive --remote`
- To update the site overall: `git pull origin master`

### Deployment

- To build a site for deployment: `yarn build`
- To launch/start the site: `yarn start`
