## How To Setup :

##### After getting this code either by cloning this repo or downloading it, open your terminal and :

- run `npm install`.
- You will find the folder `node_modules` created for you.
- now, you are ready for running the api.

### How to prepare your database :
- open your postgres shell command
- create the user with `CREATE USER full_stack_user WITH PASSWORD 'password123' `
- create databse with this code `CREATE DATABASE full_stack_dev`
- connect to the database `\c full_stack_dev`
- give the user the privileges : `GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user`
- #### if you want to customize your database information go to ```database.json``` and ```.env``` files.
- #### please note that the database is running on port ```5432``` unless you changed it, and if you did please provide that in the refrenced files.



## How To Run this api :

##### After you finally setup the packages, you need to run the server file in the dist folder :

- Type `node dist/server.js`
- You should find `app listening on port 3000` which is the port that is used for the backend application 
- After that you can acess the endpoints on `localhost:3000/`
