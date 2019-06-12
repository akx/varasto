FROM node:10

# Create volume
VOLUME ["/data"]

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN npm install -g yarn
RUN yarn

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["yarn", "start", "/data"]
