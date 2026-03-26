# 1) Use a small official Node image
FROM node:22-alpine

# 2) Create app directory
WORKDIR /app

# 3) Copy package files first (better caching)
COPY package.json package-lock.json* ./

# 4) Install production dependencies
RUN npm ci --omit=dev 2>/dev/null || npm i --omit=dev

# 5) Copy the rest of the app
COPY . .

# 6) Expose port (documentation for humans/tools)
EXPOSE 3000

# 7) Start the app
CMD ["npm", "start"]