# Exemplo de consulta aos dados através de uma placa na linguagem Python
import requests
import json

placa = "<placa>"
url = f"https://<endereco>/api/placa/{placa}"
loginURL = "https://<endereco>/api/login"

headersLogin = {
  'Content-Type': 'application/json'
}
payloadLogin = json.dumps({
  "usuario": "<usuario>",
  "senha": "<senha>"
})

login_res = requests.post(loginURL, headers=headersLogin, data=payloadLogin, verify=False)
if login_res.status_code == 200:
  token = login_res.json().get('token')

  headers = {
    'x-access-token': token
  }

  response = requests.get(url, headers=headers, verify=False)
  print(response.text)
else:
  print(login_res.text)