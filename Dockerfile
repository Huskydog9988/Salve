# installs deps, used for caching
FROM node:16-alpine as dependencies

# install for deps that need it
RUN apk add --no-cache libc6-compat

# create working directory
WORKDIR /usr/src/salve

# copy files needed for dependencies
COPY package.json yarn.lock ./

# install dependencies
RUN yarn install --immutable --inline-builds

# image that builds the project
FROM node:16-alpine as build

# create working directory
WORKDIR /usr/src/salve

# copy over dependencies from dependencies
COPY --from=dependencies /usr/src/salve/node_modules node_modules

# Bundle app source
COPY . .

# build app
RUN yarn build

# clear cache & prune unnecessary dependencies for production
RUN yarn pruneDeps && \
    yarn cache clean --mirror 

# main image
FROM node:16-alpine as distribution

ENV PORT 8000
ENV NODE_ENV production

# user
# USER node

# create working directory
WORKDIR /usr/src/salve

COPY --from=build /usr/src/salve/next.config.js next.config.js
COPY --from=build /usr/src/salve/public public

COPY --from=build /usr/src/salve/node_modules node_modules
COPY --from=build /usr/src/salve/dist dist
COPY --from=build /usr/src/salve/.next .next

EXPOSE ${PORT}
CMD ["node", "dist/index.js"]
