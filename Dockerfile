FROM node:18-alpine 

WORKDIR /App 

COPY package.json . 

RUN npm install 

COPY . .   


EXPOSE 3000

RUN tsc

CMD [ "npm" ,"run","start" ]