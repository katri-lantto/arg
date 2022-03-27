# This is the file you run to set up the chat.
#
# First, set up an account and project on 
# https://chatengine.io/ to get your PROJECT_ID
# and PRIVATE_KEY. Change these constants
# below.
#
# To change the users, chats and messages sent,
# go to the corresponding JSON-files listed
# below.
#
# JSON-files:
# users.json: Edit what users to crete.
# StartChats.json: Edit which chatroomsexist and
#                  which users has access.                   
# ChatPosts.json: Edit the posts for the chats.

import json
import requests
import hashlib

# Change these to your own project!
PROJECT_ID = "aa2bb056-425d-4756-bb63-ab5b02585256"
PRIVATE_KEY = "ede1ace3-6939-44bf-9df8-c818978fc030"

# Create and array to save the ID:s of the
# created chats.
# Uses the format of [[chatName, chatId], [chatName, chatId]]
# TODO Move this?
chatIds = []

# Find the corresponding chatId from 
# the name. It takes the array of arrays
# and the name of the chat as arguments
# and returns the ID.
def findChatId(chatArray, chatToFind):
  for chat in chatArray:
      if(chat[0] == chatToFind):
        return chat[1]

#--------------- Create users --------------

print("Creating users")
# Load values from file
f = open('users.json',)
users = json.load(f)
f.close()

# Go through all the users to be created
for user in users:

    # Fix the format of the JSON-date so that the password can be hashed.
    userString = str(user).replace("'", "\"")
    userString = str(userString).replace("None", "null")
    json_object = json.loads((userString))
    json_object["secret"] = hashlib.sha256(str(json_object["secret"]).encode('utf-8')).hexdigest()

    # Send the request to create a user with payload and header.
    r = requests.post(
        'https://api.chatengine.io/users/',
        data=json_object,
        headers={"Private-Key": PRIVATE_KEY}
    )
    # Print the result of the sent post request.
    print(r.status_code)

#--------------- Create chats ---------------

print("Creating chats")
# Load values from file.
f = open('StartChats.json',)
chats = json.load(f)
f.close()

# Go through all the chats to be created.
for chat in chats:
    
    # Create a JSON-object with the chatname.
    title = "{\"title\":" + "\"" + chat["chat_name"] + "\"" + "}"
    title2 = json.loads(title)
    
    # Send the request to create a chat with payload and header.
    r = requests.post(
        'https://api.chatengine.io/chats/',
        data=title2,
        headers={"Private-Key": PRIVATE_KEY, "User-Name": chat["admin"], "User-Secret": chat["admin_secret"]}
    )
    # Print the result of the sent post request.
    print(r.status_code)

    # Add the id for the chat to the list of chat ids.
    getChatId = json.loads(r.text)
    chatId = str(getChatId["id"])
    chatIds.append([chat["chat_name"], chatId])

    # Get the password for the admin for this chat from the file and hash it.
    password = chat["admin_secret"]
    password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    # Iterate the users that will be added to the newly created chat.
    for user in chat["users"]:
        
        # Create a JSON-object for the user to be added.
        user = json.loads("{\"username\":" +  "\"" + user  +"\""  + "}")

        # Send the request to add a user with payload and header.
        r = requests.post(
            'https://api.chatengine.io/chats/' + chatId + '/people/',
            data=user,
            headers={"Project-ID": PROJECT_ID, "User-Name": chat["admin"], "User-Secret": password}
        )
    # Print the result of the sent post request.
    print(r.status_code)

#--------------- Print messages in chats ---------------

print("Print messages in chats")
# Load values from file
f = open('ChatMessages.json',)
messages = json.load(f)
f.close()

# Iterate through all messages to send
for message in messages:

    # Find the ID of the chat to send the message in
    # to have the right address for the server request.
    chatID = findChatId(chatIds, message["chat_name"])
    print(chatID)
    print(message["chat_name"])

    password = hashlib.sha256(message["password"].encode('utf-8')).hexdigest()

    # Send the request to post a message with payload and header.
    r = requests.post(
        'https://api.chatengine.io/chats/' + chatID  +'/messages/',
        data=message,
        headers={"Project-ID": PROJECT_ID, "User-Name": message["user"], "User-Secret": password}
    )
    # Print the result of the post request.
    print(r.status_code)


    