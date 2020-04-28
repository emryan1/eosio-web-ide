# Hokie Tickets Blockchain Solution Webapp
# Setup
1. Point your browser to the following URL https://gitpod.io/#https://github.com/emryan1/eosio-web-ide to start the IDE. 

# Instructions

The following instructions assume that the Web IDE was started successfully (see [Setup](#setup)).

## Opening a terminal

To open a terminal, use the Terminal drop-down menu in the IDE user interface.

## Change the http endpoint in myapp/src/app/\_services/eos-api.service.ts
Run this in a terminal:
```
gp url 3030
```
Copy the output then navigate to myapp/src/app/\_services/eos-api.service.ts and replace the url variable with what you copied,
then save the file.

## Setup the smart contracts
Run this in a terminal:

```
sh setup_hokietoken.sh
```


## Viewing the front-end decentralized web app (EOSJS):
To preview the WebApp run this in a terminal:

```
gp preview $(gp url 8000)

```

