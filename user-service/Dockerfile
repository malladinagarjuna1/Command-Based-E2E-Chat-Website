FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --production


COPY . .

EXPOSE 4002

CMD ["npm", "start"]
 