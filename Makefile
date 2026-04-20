.PHONY: build test clean dev

build:
	@echo "A compilar os contratos Soroban..."
	cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/hero_journey/Cargo.toml

test:
	@echo "A executar testes locais..."
	cargo test

clean:
	cargo clean
	rm -rf target/

dev:
	@echo "A iniciar frontend Next.js..."
	npm run dev
