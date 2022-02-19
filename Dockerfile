FROM node:slim

WORKDIR /app

COPY . .

#install node dependencies
RUN npm install --production-only

# install ffmpeg
RUN apt-get update -y
RUN apt-get install ffmpeg -y

# create /temp/downloads directory
RUN mkdir ./temp
RUN mkdir ./temp/downloads

CMD ["npm", "start"]