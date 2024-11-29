# Composio Auth Flow

Checkout the demo video [here](https://youtu.be/2X-INVmI3Go)

Tech Stack: 
- Frontend: React Native (Expo)
- Backend: FastAPI

## Local Setup Guide:

### Prerequisites:
- Create Gmail (OAUTH2) & Shopify (API_KEY) integration on [Composio](https://app.composio.dev)
- Add the integration ids to assets/appData.json file
- Install dependeincies & Expo CLI 

1. Clone the repo
```
git clone https://github.com/composiohq/composio-auth-flow.git
```
2. Install backend dependencies (If you're going to use Expo Go app then you need host the backend on a server in order to make API calls)
```
cd auth-flow/mobile-app/backend
pip install -r requirements.txt
```
3. Run the backend server
```
uvicorn main:app --reload
```
4. Install React Native dependencies
```
cd auth-flow
pnpm i 
```
5. Run the frontend server
```
pnpm start
```
