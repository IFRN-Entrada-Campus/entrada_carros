# Exemplo de consulta aos dados através de uma placa na linguagem Python
import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def consultarPlaca(placa, usuario, senha, endereco):
  url = f"https://{endereco}/api/placa/{placa}"
  loginURL = f"https://{endereco}/api/login"

  headersLogin = {
    'Content-Type': 'application/json'
  }
  payloadLogin = json.dumps({
    "usuario": usuario,
    "senha": senha
  })

  login_res = requests.post(loginURL, headers=headersLogin, data=payloadLogin, verify=False)
  if login_res.status_code == 200:
    token = login_res.json().get('token')

    headers = {
      'x-access-token': token
    }

    response = requests.get(url, headers=headers, verify=False)
    print(response.text)
    return response
  else:
    print(login_res.text)
    return login_res.text