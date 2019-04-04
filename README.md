# mini-musify-api

#Running the app

In order to run the app you will need to install NodeJS and MongoDB

in order to install NodeJs on Debian 9 you will need to follow this steps:

curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt install nodejs

reference:https://linuxize.com/post/how-to-install-node-js-on-debian-9/

to install MongoDB on Debian you need to follow the steps listed here:https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/

after installing MongoDB you will have to start the server, run the following command con the linux shell:
- sudo service mongod start
- mongo
- use curso_mean;
- db.artists.save({name:'first insert',description:'first insert',image:'null'});

use the 'command show dbs;' to see if your curso_mean db has been created. 

once you have finished this easy steps and te enviroment is running, you just have to navigate to the root folder of the project and run 
- 'npm install' 
once all the dependencies are installed you will need to run  
- 'npm start 

this will set up the API server.
