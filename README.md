# SurplusServe

backend/
├── models/
├── node_modules/
├── routes/
├── .env   
|__server.js

frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── donor.js
│   └── receiver.js
├── .gitignore
--------------------------------------------------------------------------------------------------------------------------
.env code:----

JWT_SECRET=mySecureSecretKey123!
EMAIL_USER=surplusserve@gmail.com
EMAIL_PASS=whce vrbv pbiv prsx
-----------------------------------------------------------------------------------------------------------------------------
.gitignore code:

# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
--------------------------------------------------------------------------------------------------------------------------
frontend:

eedhi frontend folder:
npx create-react-app frontend
cd frontend
npm install react-router-dom axios

Backend:

new terminal lo
backend  folder  create chey
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv


