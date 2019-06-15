FROM node:10

# Create volume
RUN mkdir /data
VOLUME ["/data"]

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies.
WORKDIR /usr/src/app/packages/varasto-server
RUN npm install -g yarn
RUN yarn

EXPOSE 3000
CMD ["yarn", "start", "/data"]
