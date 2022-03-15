# ⚡ Quickstart

Running Salve in a production enviroment is very simple and only takes about two steps.

## 📦 Installing Dependencies

The first step is to download and install [docker](https://docs.docker.com/get-docker/). This enables Salve to run in a sandboxed and predictable envrioment.

## 👟 Finally Running It

To get Salve started, just run the command below in any terminal.

```bash
docker run -it -p 8000:8000 --pull always --init --rm huskydog9988/salve
```

Then access [http://localhost:8000](http://localhost:8000) (or [http://127.0.0.1:8000](http://127.0.0.1:8000)) on the same device and your done. You can use Salve to your hearts content.

## ❓ FAQ

### 🛑 How do I stop it?

Simply press on your keyboard the `ctrl` and `c` keys at the same time while in the same terminal as Salve is running.

### 🐋 **HELP!** Docker says an error occurred while connecting!

Example error:

```log
docker: error during connect: This error may indicate that the docker daemon is not running.: Post "http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/containers/create": open //./pipe/docker_engine: The system cannot find the file specified.
See 'docker run --help'.
```

The solution here is simple, you just need to ensure that docker is running. To do this, simply open up search and type "Docker Desktop", then upon seeing the application with the same name, **run it**. Give it a minute or too to get going and then you should be fine to run the cmd up above.

### 🆘 I still have an issue!!

If thats the case, we're sorry to hear that. We can help diagnose and solve any issues you might be experiencing if you [open up a new issue](https://github.com/Huskydog9988/Salve/issues/new).
