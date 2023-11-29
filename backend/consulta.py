# Exemplo de consulta aos dados através de uma placa na linguagem Python
import requests
import json

url = "localhost:3000/placa"

payload = json.dumps({
  "placa": "RNT7U76"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)