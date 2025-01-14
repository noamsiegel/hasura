introspect-travelport:
	ddn connector introspect travelport
	ddn model add travelport "*"
	ddn command add travelport "*"
	ddn relationship add travelport "*"
	ddn supergraph build local
	ddn run docker-start

make start:
	ddn run docker-start

make build:
	ddn supergraph build local

make travelport-venv:
	source travelport-v12/bin/activate
