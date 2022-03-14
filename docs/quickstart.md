# ⚡ Quickstart

Running Salve in a production enviroment is very simple and only takes about two steps.

## 📦 Installing Dependencies

The first step is to download and install [docker](https://docs.docker.com/get-docker/). This enables Salve to run in a sandboxed and predictable envrioment.

## 👟 Finally Running It

Yep, thats it! Run the command below and your off to the races.

```bash
docker run -it -p 8000:8000 --init huskydog9988/salve
```

## ❓ FAQ

### 🛑 How do I stop it?

Simply press on your keyboard the `ctrl` and `c` keys at the same time while in the same terminal as Salve is running.

### 🆘 **HELP!** Docker says an error occurred while connecting!

Example error:

```log
docker: error during connect: This error may indicate that the docker daemon is not running.: Post "http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/containers/create": open //./pipe/docker_engine: The system cannot find the file specified.
See 'docker run --help'.
```

The solution here is simple, you just need to ensure that docker is running. To do this, simply open up search and type "Docker Desktop", then upon seeing the application with the same name, **run it**. Give it a minute or too to get going and then you should be fine to run the cmd up above.
