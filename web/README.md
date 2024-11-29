# Composio Auth Flow

Checkout the demo video [here](https://youtu.be/2X-INVmI3Go)

Tech Stack: 
- Frontend: React (Vite)
- Backend: FastAPI

## Local Setup Guide:

### Prerequisites:
- Create Gmail (OAUTH2) & Shopify (API_KEY) integration on [Composio](https://app.composio.dev)
- Add the integration ids to src/assets/appData.json file

1. Clone the repo
```
git clone https://github.com/composiohq/composio-auth-flow.git
```
2. Install backend dependencies
```
cd composio-auth-flow/backend
pip install -r requirements.txt
```
3. Run the backend server
```
uvicorn main:app --reload
```
4. Install frontend dependencies
```
cd composio-auth-flow
npm install
```
5. Run the frontend server
```
npm run dev
```
