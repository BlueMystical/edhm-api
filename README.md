### edhm-api
-------------
ESTE ES UN BACKEND HECHO CON NODE.js v16.15 y Express.</br></br>
Autor:          Jhollman Chacon R. (**Blue Mystic**) 2022 (•̀ᴗ•́)و 

- Development:     http://localhost:3000/
- Produccion:      https://careful-rose-singlet.cyclic.app/
- Source Code:     https://github.com/BlueMystical/edhm-api

---------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------
//ESTABLECER EL PROXY:   (cambiar Usuario y contraseña)
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/
npm config set proxy http://user:password@192.168.10.1:8080
npm config set https-proxy http://user:password@192.168.10.1:8081
----------------------------------------------------------------------
https://app.cyclic.sh/#/app/bluemystical-edhm-api/data
https://docs.cyclic.sh/concepts/storage

//Pegar esto en la Consola:
 
$Env:AWS_REGION="sa-east-1"
$Env:AWS_ACCESS_KEY_ID="ASIA3N3CIN76MTNJD4OZ"
$Env:AWS_SECRET_ACCESS_KEY="rTC5AdprfVULr/Hw51x7a5uVQgs+C5ADNcUtb3tE"
$Env:AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEJ3//////////wEaCXNhLWVhc3QtMSJHMEUCIEVMAbVeWkqyFewGlponcb6QFN3gGnT1SaXQWMGCQKZYAiEA17Fz13ml7Y/KMmdKK2JUqDmb4sT2xxFfJANfCxOSF8QqtwII9v//////////ARAAGgw3ODU2NDgyMTgxMDgiDGsvVzTFsbWKXN2NoyqLAo+hNxqf5DbRjNFpIkjvlLla1XNeMQBBND0XBJzZ/t8VZ8hx1f9sRAWRnKHDpXR4t9pzZgA0XV++yHtMp611hH8M4VPGI3Ym183q5FPGFRpGYUc3y2ZTJh9S0tQcO8rmqT+6NfxmgevAmGY9JXosLJyWUIWhpjHgyhJdkSFdjm+TrGOENjk6foMAUtLsaSf01Mwo17GJKNiKbIQgbnb/E5SrhgUBpTbejEPf8h6JUmAjjxLgCO5/8BVIwL7clePSJDZre2tbv6psFtHRZLoMkIWERbAdwg/90WguZwZtMXGSW31SupFgmvLu0L366kZGQLs7Jgud3hOf4cvm6j1AU7i4zFNe8INLJ3JBaTDXgdikBjqdAaOdfNiXHCzNlzd6dhexBa0kLwR4oXltjP/wE54E4AS1KFDZ4uT/o76Z2MCMEz9Y2/hJ2HaW+Gy03Z/LXg88M2ci2OO5pieTkDMJGY9NgtGGFgLqYUkAsNf83BKS6boq2lywGPITGx1TBOEmmxhntTW8Ne7fYorampFhsOjAd1BVPzQXCHUdemQF8xrndtSQT4QReOikaJsA+tM+agM="

cls

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

