help:
	@echo ""
	@echo "	........................................."
	@echo "	|                                       |"
	@echo "	| make commands for martbabak v2        |"
	@echo "	|                                       |"
	@echo "	| studio:    | running prisma studio... |"
	@echo "	| help:      | all list for commands... |"
	@echo "	| ins:       | install all package..... |"
	@echo "	| run:       | running api serve....... |"
	@echo "	| dockcom:   | running docker-compose.. |"
	@echo "	| generate:  | generating prisma client |"
	@echo "	|                                       |"
	@echo "	........................................."
	@echo ""

run:
	@echo "Running npm run dev..."
	npm run dev

ins:
	@echo "Installing all packages..."
	npm install

dockcom:
	@echo "Building docker-compose..."
	docker-compose up -d

studio:
	@echo "Running prisma studio..."
	npx prisma studio

generate:
	@echo "Generating prisma client..."
	npx prisma generate dev --name init

.PHONY: help run ins dockcom studio generate