from composio import ComposioToolSet, App
from composio.client.exceptions import NoItemsFound
from dotenv import load_dotenv
import os

load_dotenv()


def check_connection(user_id: str, app_name: str):
    entity = ComposioToolSet(
        api_key=os.getenv("COMPOSIO_API_KEY"), entity_id=user_id
    ).get_entity()
    try:
        app = getattr(App, app_name)
        entity.get_connection(app=app)
        return {
            "authenticated": True,
            "message": f"User {user_id} is authenticated with {app_name}",
        }
    except NoItemsFound:
        return {
            "authenticated": False,
            "message": f"User {user_id} is not authenticated with {app_name}",
        }


def get_connection_params(integration_id: str):
    toolset = ComposioToolSet(api_key=os.getenv("COMPOSIO_API_KEY"))
    expected_params = toolset.get_expected_params_for_user(
        integration_id=integration_id
    )
    return expected_params


# For integration with auth mode: OAUTH2
def create_connection(
    user_id: str,
    app_name: str,
    redirect_url: str | None = None,
    integration_id: str | None = None,
    expected_params_body: dict | None = None,
):
    toolset = ComposioToolSet(api_key=os.getenv("COMPOSIO_API_KEY"), entity_id=user_id)
    entity = toolset.get_entity()

    expected_params = get_connection_params(integration_id)

    integration = entity.client.integrations.get(id=integration_id)

    # if auth_scheme is OAUTH2, we need to add the redirect_url, this is where user will be redirected to after authentication
    if expected_params["auth_scheme"] == "OAUTH2":
        request = entity.initiate_connection(
            app_name=app_name,
            auth_mode="OAUTH2",
            use_composio_auth=True,
            redirect_url=redirect_url,
            integration=integration,
        )
        return {
            "authenticated": False,
            "message": f"User {user_id} needs to authenticate with {app_name}",
            "url": request.redirectUrl,
        }
    # if auth_scheme is API_KEY, we need to pass params while initiating connection
    elif expected_params["auth_scheme"] == "API_KEY":
        request = entity.initiate_connection(
            app_name=app_name,
            auth_mode="API_KEY",
            integration=integration,
            connected_account_params=expected_params_body,
        )
        return {
            "authenticated": True,
            "message": f"User {user_id} is authenticated with {app_name}",
        }
