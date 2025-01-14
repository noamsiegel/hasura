"""
functions.py

This is an example of how you can use the Python SDK's built-in Function connector to easily write Python code.
When you add a Python Lambda connector to your Hasura project, this file is generated for you!

In this file you'll find code examples that will help you get up to speed with the usage of the Hasura lambda connector.
If you are an old pro and already know what is going on you can get rid of these example functions and start writing your own code.
"""
from hasura_ndc import start
from hasura_ndc.instrumentation import with_active_span # If you aren't planning on adding additional tracing spans, you don't need this!
from opentelemetry.trace import get_tracer # If you aren't planning on adding additional tracing spans, you don't need this either!
from hasura_ndc.function_connector import FunctionConnector
from pydantic import BaseModel, Field # You only need this import if you plan to have complex inputs/outputs, which function similar to how frameworks like FastAPI do
import asyncio # You might not need this import if you aren't doing asynchronous work
from hasura_ndc.errors import UnprocessableContent
from typing import Annotated
import os
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import LegacyApplicationClient
import requests
from dotenv import load_dotenv
from dotenv import load_dotenv
import logging
from models.hotels.search.requests import CityIataCodeHotelSearchRequest
from models.hotels.search.response import SearchHotelsResponse

load_dotenv()

connector = FunctionConnector()

@connector.register_query
def hello(name: str) -> str:
    return f"Hello {name}"


class TravelPortClient:
    # TODO make this connection always exists
    # TODO make this separate into multiple processes
    # TODO implement a queue
    @staticmethod
    def create_connection():
        load_dotenv()
        client_id = os.getenv("TRAVELPORT_CLIENT_ID")
        client_secret = os.getenv("TRAVELPORT_CLIENT_SECRET")
        oauth_url = os.getenv("TRAVELPORT_OAUTH_URL")
        username = os.getenv("TRAVELPORT_USERNAME")
        password = os.getenv("TRAVELPORT_PASSWORD")
        access_group = os.getenv("TRAVELPORT_ACCESS_GROUP")

        client = LegacyApplicationClient(client_id=client_id)
        oauth = OAuth2Session(client=client)
        token = oauth.fetch_token(
            token_url=oauth_url,
            username=username,
            password=password,
            client_id=client_id,
            client_secret=client_secret,
        )

        headers = {
            "Content-Type": "application/json",
            "XAUTH_TRAVELPORT_ACCESSGROUP": access_group,
            "Authorization": f"Bearer {token['access_token']}",
        }

        session = requests.Session()
        session.headers.update(headers)
        return session

@connector.register_query
async def tp_search_hotels(search_params: CityIataCodeHotelSearchRequest) -> SearchHotelsResponse:
    """Search for hotels using the TravelPort API"""
    try:
        client = TravelPortClient.create_connection()
        response = client.post(
            "https://api.travelport.com/12/hotel/search/searchcomplete",
            json=search_params.model_dump()
        ).json()
        
        # The response is already in the correct format, no need to wrap it
        return SearchHotelsResponse(**response)
    except Exception as e:
        raise UnprocessableContent(
            message=f"Hotel search failed: {str(e)}",
            details={"error": "Failed to search hotels"}
        )

if __name__ == "__main__":
    start(connector)
