from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from composio_auth import create_connection, check_connection, get_connection_params

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CheckConnectionData(BaseModel):
    user_id: str
    app_name: str


class NewConnectionData(BaseModel):
    user_id: str
    app_name: str
    redirect_url: str | None = None
    integration_id: str | None = None
    expected_params_body: dict | None = None
    
class GetConnectionParamsData(BaseModel):
    integration_id: str

@app.post("/newconnection")
async def handle_request(user_data: NewConnectionData):
    res = create_connection(
        user_id=user_data.user_id,
        app_name=user_data.app_name,
        redirect_url=user_data.redirect_url,
        integration_id=user_data.integration_id,
        expected_params_body=user_data.expected_params_body
    )
    return res

@app.post("/checkconnection")
async def handle_request(user_data: CheckConnectionData):
    user_id = user_data.user_id
    app_name = user_data.app_name
    res = check_connection(user_id, app_name)
    return res

@app.post("/getconnectionparams")
async def handle_request(user_data: GetConnectionParamsData):
    integration_id = user_data.integration_id
    res = get_connection_params(integration_id)
    return res

@app.get("/")
async def handle_request():
    return "ok"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)