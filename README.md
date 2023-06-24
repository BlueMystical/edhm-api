### edhm-api
-------------
ESTE ES UN BACKEND HECHO CON NODE.js v16.15 y Express.</br></br>
Autor:          Jhollman Chacon R. (**Blue Mystic**) 2022 (•̀ᴗ•́)و 

- Development:     http://localhost:3000/
- Produccion:      https://careful-rose-singlet.cyclic.app/
- Source Code:     https://github.com/BlueMystical/edhm-api

---------------------------------------------------------------------------------------------------------------------
Requeriments and Installation:
-------------

- NODE.js v16.14+ https://nodejs.org/en/download/
- Install NODE dependencies:
  - npm install
  
- Install Express:
  - npm install express --save
  - npm install body-parser --save

- Run the Server on VSCode:
  - npm start

Routes
-------------
- http://localhost:3000/users/file
  - Description:   Download the whole DataSet in a JSON file.
  - Method:        GET
  - Params:        None

- http://localhost:3000/users/list
  - Description:   Returns the List of all registered users.
  - Method:        GET
  - Params:        None

- http://localhost:3000/users/add
  - Description:   Adds a new Register for an User, Existing User will be Updated.
  - Method:        POST
  - Params:        JSON Data in the Request's Body.

- http://localhost:3000/users/find
  - Description:  Returns an Array with all Results found for the specified criteria.
  - Method:        GET
  - Params:        URL Parameters, The name of the Fields and the Value to search for, partial text search enabled. Can   compare Dates: 'Date >= 2022-01-01' (yyyy-mm-dd).

- http://localhost:3000/users/get-statistics
  - Description:  Returns an array with Totals for most of the Fields.
  - Method:       GET
  - Params:       None

- http://localhost:3000/users/show-statistics
- https://careful-rose-singlet.cyclic.app/users/show-statistics?type=pie&width=800
  - Description:  Returns the Statistics showing them in Charts.
  - Method:       GET
  - Params:        
    - [type]: bar, line, pie, doughnut, radar, polarArea, bubble, scatter | Default: doughnut
    - [height]: Height of the Charts, Default: 200px
    - [width]: Width of the Charts, Default: 400px    

