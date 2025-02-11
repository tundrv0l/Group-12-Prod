# Discrete Math Solver

## Overview
This project is a Discrete Math Solver application that provides various tools to solve discrete math problems, including well-formed formulas (WFF) to truth tables, propositional logic validation, and recursive definitions solver. The application is built using React for the frontend and Flask for the backend.

## Project Structure
.
├── app.py
├── backend/
│   ├── __init__.py
│   ├── controller.py
│   ├── solvers/
│   │   ├── util/
├── frontend/
│   ├── package.json
│   ├── public/
│   ├── README.md
│   ├── src/
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── components/
│   │   ├── pages/
├── README.md
├── requirements.txt

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1. **Install Node.js**:
    - Download and install Node.js from the [official website](https://nodejs.org/).
    - Verify the installation by running the following commands in your terminal:
     ```sh
     node -v
     npm -v
     ```
    - Note: You may have to restart your machine so that npx can be added to PATH

2. **Navigate to the frontend directory**:
   ```sh
   cd frontend
   ```

3. **Install Dependencies**
    - Dependencies can be found in package.json, found in the root of /frontend/
    - To automatically source and install them, from the frontend directory run:
     ```sh
     npm install
     ```
    - This should install all the packages in our project.

### Running the Development Server

1. **Start the React Development Server**
    - React comes packaged with its own development server, and per the package.json, specifies what exact react-script command gets ran as apart of the alias. 
    - The dev server creates itself on port 3000 on localhost by default, or at http://localhost:3000. This can be changed by configuration, and should open automatically in the browswer window.
    - To start the dev server run the following from the frontend directory:
    ```sh
    npm start
    ```
    - Any changes will automatically be recompiled and hosted to the 'live' view, if runtime errors are hit, they will be displayed there as well.

2. **Start the Flask Server**
    - The Flask server is our backend component, and needs to be started as well if you want the react to 'talk' to the solver code.
    - This can be done by running the following command from the root of the directory, *not from /frontend/*
    ```sh
    python app.py
    ```
    - This will automatically start the flask server on port 5000 under localhost, or at http://localhost:5000 
    - 2/10 - Be careful about changing this configuration, since the call path to this point is hardcoded in the frontend api as of right now.

## API Endpoints & Architecture
So, we have a defined frontend and backend as two different spheres (or folders) of code that does different things. To bridge this gap and allow them to communicate we have something called *API Endpoints*, which are single points (or ports) defined that the software can use them. I am going to break down a bit on our endpoints:

### Backend - app.py/controller.py
Flask is our main driver for the backend. Each Flask application must be defined in the format (or adjacent) of app.py. This is where all traffic enters as inputted from the frontend to the backend for processing. In this case, I am keeping the app.py as light as possible (for many different reasons) and letting another component: *controller.py* handle most of the routing. controller.py is a 'blueprint', which is a Flask mechanism for defining other files/functions outside of app.py to route traffic to different spots. The biggest thing controller does, is that it reads this traffic and decides where the traffic needs to be going. For example, if the call was to the API path: /solver/wff; controller will check for the 'wff' bit and call the corresponding solver.

### Frontend - api.js
The main component that defines interactive functions for the frontend api endpoint is in api.js. This file has two 'main' api functions: *solve* and *report*, which do different things. *Solve* will only ever get called when a solver page has submitted particular input. Each solver page will get its own special function inside api.js that essentially wraps *solve* so it can properly request the backend. Each time a new solver page is created, it will need a corresponding function in this file. *Report* does something similiar, but specifically for the user interface to report issues. 

### Backend - /solvers/
As previously mentioned, the traffic from the frontend is routed through app.py, and then controller.py. controller.py makes the final call on where that input should go for the particular solver. Those algoritihims and solvers that drive the actual solving exist in this folder. Since traffic is routed monotonically (that is, one request at a time), controller.py will make a ***single driver or function call*** for each solver. That isn't exactly feasible, so to work around this, each solver can of course, just setup a driver function (akin to a main() or equivalent) and leverage other functions in the file to accomplish what it needs to. Additionally, we have designated /solvers/util as a folder that can hold utility functions or classes that can be imported straight into the solver. This way, traffic is handled in a decent fashion without completely exposing our API endpoints to the backend. 