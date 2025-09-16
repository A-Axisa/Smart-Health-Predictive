# This is a test folder to show how routers work
from fastapi import APIRouter

router = APIRouter()

@router.get("/items/{item_id}")
async def read_item(item_id:int, name:str):
    return {"item_id": item_id, "Name": name}