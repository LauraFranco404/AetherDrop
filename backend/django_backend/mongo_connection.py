from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

load_dotenv()
uri = os.getenv("DATABASE_URL") #full url is in .env file, it is not uploaded to the repository.
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["Test-stuff"]


# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)