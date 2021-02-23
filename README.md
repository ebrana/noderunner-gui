# Noderunner GUI
Frontend application for noderunner - [více zde](https://github.com/ebrana/noderunner-gui)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run-script serve
```

### Compiles and minifies for production
```
npm run-script build
```

### Lints and fixes files
```
npm run lint
```

### Build and run server
```
npm start
```

### Customize configuration
Create custom.json into config folder.
Example configuration:
```javascript
{
    "servers": [
        {"name": "localhost", "url": "localhost:8001"},
        {"name": "devel", "url": "devel.tld"},
    ],
    "jwt": {
        "enable": true
    }
}
```

## Docker support

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