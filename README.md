Antes de baixar:

1 - Seguir o Step 1 do Google: https://developers.google.com/gmail/api/quickstart/nodejs

Esse STEP irá te explicar como gerar client_secret.json

PS. Quando você baixa o json do google, ele não vem com o nome de client_secret, será necessário renomear.

Sem isso, não será possível utilizar a aplicação de teste.

Após baixar:

1 - Executar npm install.
2 - Executar npm start.

Ao executar o npm start:

1 - Caso você não esteja autenticando e muito provavelmente não estará, aparecerá uma mensagem "Authorize this app by visiting this url:", seguido de um link.
2 - Copie o link e cole no browser, de preferencia Google Chrome. 
3 - Logar com a conta google na qual você realizou o STEP 1 do tutorial que eu mencionei no inicio do README.
4 - Irá executar um método simples que irá listar os rótulos na conta do usuário.



Obs: No método testeMethod poderá fazer chamadas a outros métodos. É só trocar o método que é chamado dentro deste método.