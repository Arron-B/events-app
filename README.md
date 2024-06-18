# Events App

# Events App API

HOSTED PROJECT

The hosted version of this project can be found at: https://events-app-u5vr.onrender.com

Please add any endpoint from the endpoints.json file to see the results. Alternatively paste the example below into your browser to fetch the available endpoints from the API:
E.g. https://events-app-u5vr.onrender.com/api

SUMMARY

This project is an API for my first freelance project, an events application. It utilises express with postgresql and is set up as an MVC environment, built using TDD (Test Driven Development) with the help of NodeJS and Jest.

LOCAL SET UP

To clone the repo: git clone https://github.com/Arron-B/events-app.git

Minimum versions:

- Node.js v20.12.2
- PSQL v16.3

Install dependencies:

(From the root directory)

- cd ./events-app-API
- npm install

To access developoment and test databases, please create two files in the events-app-API directory with the following details:

File 1 name: .env.development
File 1 content: PGDATABASE=events_db

File 2 name: .env.test
File 2 content:
PGDATABASE=events_db_test
STAFF_PASS=1234
PGUSER={Your postgres user here} (Omit if your system does not require)
PGPASSWORD={Your postgres user password here} (Omit if your system does not require)

Alternative test set up:

//// Alternative. Skip if completed previous steps. /////////

If your shell is bash run these commands:
export PGUSER={Your username}
export PGPASSWORD={Your password}
export STAFF_PASS=1234
export PGDATABASE=events_db_test

If your shell is (t)csh:
setenv PGUSER {Your username}
setenv PGPASSWORD {Your password}
setenv STAFF_PASS 1234
setenv PGDATABASE events_db_test

** IMPORTANT **

After you are finished, run the appropriate command to unset your password:

bash users: unset PGPASSWORD

(t)csh users: unsetenv PGPASSWORD

You may unset the other env variables the same way if you wish.

/////////// Alternative ends here //////////

Running the seed or running tests should now access the correct data for each.

- npm run seed
- npm test

# Events React App

HOSTED PROJECT

The hosted version of this project can be found at: https://arron-events-app.netlify.app/

After logging in on the live app, if you'd like to staff access to create events the password is "pass". This can be changed in the API through the STAFF_PASS environment variable.

SUMMARY

This is the front-end to my full stack events app. It utilises React and TailwindCSS + UI.

LOCAL SET UP

To clone the repo: git clone https://github.com/Arron-B/events-app.git (Note: This is the same repo as the API)

Minimum versions:

React v18.2.0

Install dependencies:

(From the root directory)

- cd ./events-app-FE
- npm install

To be able to run the app locally create the following file in the events-app-FE directory:

File name: .env
File content: VITE_LOCAL_HOST={your local host url} (E.g. http://localhost:5171/)

The following command should now run the app locally in your browser on the local host url above:

- npm run dev
