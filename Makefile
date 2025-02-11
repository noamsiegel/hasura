travelport:
	ddn connector introspect travelport_js
	ddn command add travelport_js "*"
	ddn supergraph build local
	ddn run docker-start

make start:
	HASURA_DDN_PAT=$(ddn auth print-pat) PROMPTQL_SECRET_KEY=$(ddn auth print-promptql-secret-key) docker compose -f compose.yaml --env-file .env up --build --pull always

make build:
	ddn supergraph build local