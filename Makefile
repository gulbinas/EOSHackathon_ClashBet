
serve:
	PYTHONPATH=$$PYTHONPATH:./lib/ FE_URL=http://locahost:3000 LOG_LEVEL=DEBUG DEBUG=TRUE AWS_REGION=localhost AWS_ACCESS_KEY_ID=A AWS_SECRET_ACCESS_KEY=B DYNAMODB_HOST=http://localhost:8000 sls wsgi serve  -p 5000  --host 127.0.0.1  -s dev
	# PYTHONPATH=$$PYTHONPATH:./lib/ LOG_LEVEL=DEBUG DEBUG=TRUE PAYSERA_PROJECT_ID=1 PAYSERA_CALLBACK_URL=1 PAYSERA_SIGN_PSWD=1 PAYSERA_TEST=1 AWS_REGION=localhost AWS_ACCESS_KEY_ID=A AWS_SECRET_ACCESS_KEY=B DYNAMODB_HOST=http://localhost:8000 sls wsgi serve  -p 5000  --host 127.0.0.1  -s dev

setup:
	npm i

deploy_contract:
	yarn contract:deploy clashbet clashbet

unlock_wallet:
	cleos wallet unlock --password PW5KNVxkwLuN9cwzYfv5DyWLXJj6xepdkGNZs6ySdQ8P8FxuXUNSx

create_player_users:
	cleos create account eosio clashbet EOS7jGCT5c2i9cY8LWQ6Q7SJrm76pBf74hBsGvMYNwNKkg4fFWGw4 EOS7jGCT5c2i9cY8LWQ6Q7SJrm76pBf74hBsGvMYNwNKkg4fFWGw4
	cleos create account eosio playerone EOS7jGCT5c2i9cY8LWQ6Q7SJrm76pBf74hBsGvMYNwNKkg4fFWGw4 EOS7jGCT5c2i9cY8LWQ6Q7SJrm76pBf74hBsGvMYNwNKkg4fFWGw4
	cleos create account eosio playertwo EOS7jGCT5c2i9cY8LWQ6Q7SJrm76pBf74hBsGvMYNwNKkg4fFWGw4 EOS7jGCT5c2i9cY8LWQ6Q7SJrm76pBf74hBsGvMYNwNKkg4fFWGw4

show_table_content:
	cleos get table clashbet clashbet challange

do_createchall:
	cleos push action clashbet createchall '["playerone",1,0x0]' -p clashbet
