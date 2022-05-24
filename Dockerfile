# installs deps, used for caching
FROM node:16-alpine as dependencies

# install for deps that need it
RUN apk add --no-cache libc6-compat

# create working directory
WORKDIR /usr/src/salve

# copy files needed for dependencies
COPY package.json yarn.lock ./

# copy over prisma folder
COPY prisma prisma

# install dependencies
# also generates prisma client after install
RUN yarn install --immutable --inline-builds

# image that builds the project
FROM node:16-alpine as build

# create working directory
WORKDIR /usr/src/salve

# set db file location for prisma
ENV DATABASE_URL file:database/prod.db

# copy over dependencies from dependencies
COPY --from=dependencies /usr/src/salve/node_modules node_modules

# Bundle app source
COPY . .

# build app
RUN yarn build

# Setup db for prisma
RUN mkdir prisma/database
RUN yarn prisma migrate deploy

# clear cache & prune unnecessary dependencies for production
RUN yarn pruneDeps && \
    yarn cache clean --mirror 

# main image
FROM node:16-alpine as distribution

# define a bunch of metadata for the image
LABEL org.opencontainers.image.url="https://github.com/Huskydog9988/Salve"
LABEL org.opencontainers.image.documentation="https://github.com/Huskydog9988/Salve"
LABEL org.opencontainers.image.source="https://github.com/Huskydog9988/Salve"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.title="Salve"
LABEL org.opencontainers.image.description="An opensource and automated sign-in sheet"

# create working directory
WORKDIR /usr/src/salve

ENV PORT 8000
ENV NODE_ENV production
ENV DATABASE_URL file:database/prod.db

# user
# USER node

COPY --from=build /usr/src/salve/next.config.js next.config.js
COPY --from=build /usr/src/salve/public public

COPY --from=build /usr/src/salve/node_modules node_modules
COPY --from=build /usr/src/salve/dist dist
COPY --from=build /usr/src/salve/.next .next
COPY --from=build /usr/src/salve/prisma prisma

VOLUME [ "/usr/src/salve" ]

EXPOSE ${PORT}
CMD ["node", "dist/server/index.js"]
