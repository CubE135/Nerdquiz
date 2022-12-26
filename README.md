# Nerdquiz

Frontend for a basic trivia game

## Usage

```bash
docker run --name nerdquiz -p 3000:3000 -d -e WS_URL="http://localhost:3001" cube135/nerdquiz
```

*Replace `WS_URL` variable with hostname/ip & port of your [Nerdquiz Server](https://hub.docker.com/r/cube135/nerdquiz-server).*


## Development

In order to run the app in development mode, execute the following command in a terminal:

```bash
yarn dev
```

If you want to deploy with docker, run the following commands:

```bash
yarn build

docker build . -t something/nerdquiz
```

Then, run the command from the "Usage" Section above with the corresponding image name.

## License
[MIT](https://choosealicense.com/licenses/mit/)