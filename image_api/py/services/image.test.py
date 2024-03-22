from image import handler

event = {
    'body': {
        'description': 'A cat on a tree branch'
    }
}

response = handler(event, {})

print(response)