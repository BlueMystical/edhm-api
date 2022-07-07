### edhm-api
-------------
ESTE ES UN BACKEND HECHO CON NODE.js v16.15 y Express.</br></br>
Autor:          Jhollman Chacon R. (**Blue Mystic**) 2022 (•̀ᴗ•́)و 

- Development:     http://localhost:3000/
- Produccion:      https://edhm-ui.herokuapp.com/
- Source Code:     https://github.com/BlueMystical/edhm-api

Requeriments and Installation:
-------------

- NODE.js v16.14+ https://nodejs.org/en/download/
- Install NODE dependencies:
  - npm install
- Install Express:
  - npm install express --save
  - npm install body-parser --save

Routes
-------------
- /users/file
  - Method:        GET
  - Params:        None
  - Description:   Download the whole DataSet in a JSON file.
- /users/list
  - Method:        GET
  - Params:        None
  - Description:   Returns the List of all registered users.
- /users/add
  - Method:        POST
  - Params:        JSON Data in the Request's Body.
  - Description:   Adds a new Register for an User, Existing User will be Updated.
- /users/find
  - Method:        GET
  - Params:        URL Parameters, The name of the Fields and the Value to search for, partial text search enabled. Can compare Dates: 'Date >= 2022-01-01' (yyyy-mm-dd).
  - Description:  Returns an Array with all Results found for the specified criteria.
- /users/get-statistics
  - Method:        GET
  - Params:         None
  - Description:  Returns an array with Totals for most of the Fields.
- /users/show-statistics
  - Method:        GET
  - Params:        
    - [type]: bar, line, pie, doughnut, radar, polarArea, bubble, scatter | Default: doughnut
    - [height]: Height of the Charts, Default: 200px
    - [width]: Width of the Charts, Default: 400px    
  - Description:  Returns the Statistics showing them in Charts.
