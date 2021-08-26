
# nodeJs Application

![Node application](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-download.com%2Fwp-content%2Fuploads%2F2016%2F09%2FNode_logo_NodeJS.png&f=1&nofb=1)

## Shop website using node js (express). 

This project shows us an old way of creating web app which is **Server Side rendering**  by using **Template engine**  in this case we used **ejs** there are also some populare template engine like *pug* and *handlebars* in this website we have used ejs because it's **simple** and similaire to html.

___

### Why did i use template engine ? instead of Rest API

  * The answer is when meaningless because there is no such difference between Rest API and server side rendering using template engine or at least for express applicaiton.
  
  * For example handling  incoming request will bes the same as if we are in Rest API jsut we accept JSON data.
  
* In general the logic still the same if we talk about the **controller** 
  
* connecting to data base stay the same.

* the difference is when we send response to the client tipacally we send **HTML** file. but in Rest application we send **JSON** data instead.

* It worth mentioning that authentification changes a little bit because in Rest we can't create a session between Client and User , hence we use another method which call **JWT** json web token.
  
___

I hope i did answer your question :) 

### Features 
* User can signup and login with their email and password.
* Users can reset password by sending them email.
* You can explore products.
* Add a product you like to your cart.
* Order Products and have a pdf file genreated.
  
___
### Libraries  used :
This is a server side javascript application built with node js and have database engine MongoDB, I used **MVC** design pattern to build this web app.

I used : 
  * Express : which is node js lightweight framework
  * MongoDb : noSql data base, It use document and store them into collection
  * Mongoose : Document object model which makes the interaction with database much easier.
  * express-session : used to etablish a session.
  * Csurf : which is a sicurity mechanism against the SCRF attacks ( stealing session).
  * bycrypt : used for encrypting passwords before store them into database
  * Node Mailer : used to send email from the server.
  * And there are more i encourage you to deep dive in the project and explore the **code**

___

### Runing app on your machine

It's quite easy to get it done.

 * Simply go and clone this projecy, copy link then.
 * After installing it run this command
 * After installing all dependacies you're good to go just type this command
  