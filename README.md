# test3

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## docker support

### instal npm packages 
```
docker-compose run --rm u_npm install
```

### start server 
```
docker-compose up server
```

remove image, netvork and volumes (delete mongo db data) 
```
docker-compose down -v
```

### npm run 
```
docker-compose run --rm u_npm run <scriptsName>
docker-compose run --rm u_npm run lint
```