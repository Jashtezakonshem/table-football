
# TABLE FOOTBALL MANAGER


The server has been written in Deno and I used MongoDB as DB. The application is serverless (I'm calling the db using atlas api). As I pointed out to Andrew, I'm self taught backend-er and I took this test as chance to learn something new.

The main entities are: 
- Players
- Teams
- Games

A Player can be in multiple teams.
A Team can have only 2 players.
A Game can be played by either 2 teams or 2 players.

Once I added all the players, I can create teams. The game is played to 10 points.
In Italy once you insert the coin, you get 10 balls. The games end when the sum of the scores of the two teams is equal to 10.
There is no time limit for the game.

I can't have a game played by 1 player and 1 team.
It's either 2 players or 2 teams.
Once the game started it will be open until I close it.
If I go the player detail page I can see all the games and if there are any open games I can join them.
If a player is already in a game, he can't join another one.
I also add a lot of validation to each endpoint.

All the endpoints are restful and self explanatory.
I also created the method ```computeStatistics``` which I used for 3 user stories: 
- Initial dashboard
- Player/Team detail page
- Comparison Page

I also add some comments in the code to explain my choices and tried to use clean code principles when naming variables

### Disclaimer: Please keep that the choices I made are based on the fact that I'm learning Deno and MongoDB. I'm aware that I could have done some things differently, but I wanted to show you that I'm not afraid to learn new things and that I'm not afraid to take on new challenges

### Also the frontend has been developed in hurry as you can see and probably 50% of the choice would have been different. Also you will see different choices made for the same kind of components. This is not because I'm not schizophrenic (maybe xD) but because I wanted to show you different approaches.

Based on the boilerplate created by Andrew, I took inspiration and used Wouter (never used before).

In a real scenario I would have used redux-toolkit or if the api was made in graphQL, I would have used apollo/client with codegen-cli to generate the types.

## Installation
Install Deno following the documenation on the official website: https://deno.land/
(for my development I used denon which is nodemon for deno)
Install `yarn` following the documenation on the official website: https://yarnpkg.com/
(ofc you can use npm but it will generate a package-lock.json file as you already know)

## Before running the project
create `.env` under /server and add the following variables:
```
API_KEY=ox2kaXKCBUQPL1WJJdkOgReOoQFzO25pISKACorXHICZsMwF0cWj2GGM3KynP2ll
APP_ID=data-yywju
```
## Run the project
`yarn start:server` in a console
`yarn bootstrap:client` in another console (or `yarn start:client` if you have already installed the dependencies)

I also have a postman collection that I can share with you.
this is my personal phone number: +39 3474972061 feel free to contact me if you have any questions.

and if you are not convinced yet, we can have a pair programming session together.
