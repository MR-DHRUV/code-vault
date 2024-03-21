# CodeVault 
## Backend
- Backend API is based on Express and Node.js that utilizes MongoDB backed with Azure Cache for Redis to reduce database read operations. 
- The API is hosted on Azure App Service and is accessible at [https://code-vault.azurewebsites.net](https://code-vault.azurewebsites.net/).
- For the given source code and input, the backend API uses Judge0 API to obtain the output of the code.
- It provides two routes:
  - `/` - Returns the list of all entries in the database.
  - `/record` - Used to create a new submission

## Frontend
- Frontend is based on Next.js and is accessible at [https://code-vault-mr-dhruv.vercel.app/](https://code-vault-mr-dhruv.vercel.app/).
- It provides an interactive code editor where users can write their code and submit it to the backend API.