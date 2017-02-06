HOW TO MIGRATE

roll back latest batch:
NODE_ENV=development knex migrate:rollback

migrate to latest:
NODE_ENV=development knex migrate:latest

initial data:
http post localhost:8080/api/v1/users/registration username=TheLegend27 plainTextPassword=password

http post localhost:8080/api/v1/tags/createNewTag tagName='Westworld'         'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM'
http post localhost:8080/api/v1/tags/createNewTag tagName='A Game of Thrones' 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM'
http post localhost:8080/api/v1/tags/createNewTag tagName='Military'          'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM'
http post localhost:8080/api/v1/tags/createNewTag tagName='Donald Trump'      'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM'
echo '{"languageId": 1, "colorId": 1, "cardText": "yolo", "pick": 1, "userId": 1 }' | http get localhost:8080/api/v1/cards/new 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM'
