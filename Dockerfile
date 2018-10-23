FROM node:carbon

CMD yarn global add webpack

WORKDIR /tmp
COPY package.json /tmp/
RUN yarn install

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/

EXPOSE 3000
CMD [ "yarn", "run", "server" ]

