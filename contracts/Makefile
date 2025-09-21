# Crypto Cribs Smart Contracts Makefile

# Load environment variables
-include .env

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help install build test test-gas clean deploy-coston2 deploy-flare verify format lint

help: ## Display this help message
	@echo "$(BLUE)Crypto Cribs Smart Contracts$(NC)"
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	@echo "$(BLUE)Installing Foundry dependencies...$(NC)"
	forge install OpenZeppelin/openzeppelin-contracts --no-commit
	forge install flare-foundation/flare-smart-contracts --no-commit
	@echo "$(GREEN)Dependencies installed!$(NC)"

build: ## Compile contracts
	@echo "$(BLUE)Building contracts...$(NC)"
	forge build
	@echo "$(GREEN)Contracts compiled!$(NC)"

test: ## Run tests
	@echo "$(BLUE)Running tests...$(NC)"
	forge test -vv
	@echo "$(GREEN)Tests completed!$(NC)"

test-gas: ## Run tests with gas report
	@echo "$(BLUE)Running tests with gas report...$(NC)"
	forge test --gas-report
	@echo "$(GREEN)Gas report completed!$(NC)"

test-coverage: ## Run tests with coverage
	@echo "$(BLUE)Running test coverage...$(NC)"
	forge coverage
	@echo "$(GREEN)Coverage report completed!$(NC)"

clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	forge clean
	@echo "$(GREEN)Clean completed!$(NC)"

format: ## Format code
	@echo "$(BLUE)Formatting code...$(NC)"
	forge fmt
	@echo "$(GREEN)Code formatted!$(NC)"

lint: ## Lint code
	@echo "$(BLUE)Linting code...$(NC)"
	forge fmt --check
	@echo "$(GREEN)Linting completed!$(NC)"

# Deployment commands
deploy-coston2: ## Deploy to Coston2 testnet
	@echo "$(BLUE)Deploying to Coston2 testnet...$(NC)"
	@if [ -z "$(PRIVATE_KEY)" ]; then \
		echo "$(RED)Error: PRIVATE_KEY not set. Please copy env.example to .env and set your private key.$(NC)"; \
		exit 1; \
	fi
	forge script script/Deploy.s.sol:DeployScript --rpc-url $(RPC_URL_COSTON2) --broadcast --verify --private-key $(PRIVATE_KEY)
	@echo "$(GREEN)Deployment to Coston2 completed!$(NC)"

deploy-flare: ## Deploy to Flare mainnet
	@echo "$(BLUE)Deploying to Flare mainnet...$(NC)"
	@if [ -z "$(PRIVATE_KEY)" ]; then \
		echo "$(RED)Error: PRIVATE_KEY not set. Please copy env.example to .env and set your private key.$(NC)"; \
		exit 1; \
	fi
	@read -p "Are you sure you want to deploy to mainnet? (y/N): " confirm && [ "$$confirm" = "y" ]
	forge script script/Deploy.s.sol:DeployScript --rpc-url $(RPC_URL_FLARE) --broadcast --verify --private-key $(PRIVATE_KEY)
	@echo "$(GREEN)Deployment to Flare mainnet completed!$(NC)"

# Verification
verify-coston2: ## Verify contract on Coston2
	@echo "$(BLUE)Verifying contract on Coston2...$(NC)"
	@if [ -z "$(BOOKING_CONTRACT_ADDRESS)" ]; then \
		echo "$(RED)Error: BOOKING_CONTRACT_ADDRESS not set$(NC)"; \
		exit 1; \
	fi
	forge verify-contract $(BOOKING_CONTRACT_ADDRESS) src/CryptoCribsBooking.sol:CryptoCribsBooking --chain-id 114 --etherscan-api-key $(FLARESCAN_API_KEY)
	@echo "$(GREEN)Contract verified!$(NC)"

# Local development
node: ## Run local Anvil node for testing
	@echo "$(BLUE)Starting local Anvil node...$(NC)"
	anvil --host 0.0.0.0 --port 8545 --chain-id 31337

deploy-local: ## Deploy to local node
	@echo "$(BLUE)Deploying to local node...$(NC)"
	forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Generate ABIs for frontend
generate-abi: ## Generate ABI files for frontend
	@echo "$(BLUE)Generating ABI files...$(NC)"
	@mkdir -p ../lib/contracts/generated
	forge inspect CryptoCribsBooking abi > ../lib/contracts/generated/CryptoCribsBooking.json
	@echo "$(GREEN)ABI files generated!$(NC)"

# Security analysis
slither: ## Run Slither security analysis
	@echo "$(BLUE)Running Slither analysis...$(NC)"
	slither src/

# Environment setup
setup-env: ## Setup environment file
	@if [ ! -f .env ]; then \
		echo "$(BLUE)Creating .env file from template...$(NC)"; \
		cp env.example .env; \
		echo "$(YELLOW)Please edit .env file with your configuration$(NC)"; \
	else \
		echo "$(GREEN).env file already exists$(NC)"; \
	fi

# Full setup for new developers
setup: setup-env install build test ## Complete setup for new developers
	@echo "$(GREEN)Setup completed! Next steps:$(NC)"
	@echo "1. Edit .env file with your private key"
	@echo "2. Get testnet FLR from: https://faucet.flare.network/coston2"
	@echo "3. Deploy with: make deploy-coston2"
	@echo "4. Update contract address in .env and frontend"

# Help with network setup
network-help: ## Display network configuration help
	@echo "$(BLUE)Network Configuration:$(NC)"
	@echo "$(YELLOW)Coston2 Testnet:$(NC)"
	@echo "  Chain ID: 114"
	@echo "  RPC URL: https://coston2-api.flare.network/ext/C/rpc"
	@echo "  Faucet: https://faucet.flare.network/coston2"
	@echo "  Explorer: https://coston2.testnet.flarescan.com"
	@echo ""
	@echo "$(YELLOW)Flare Mainnet:$(NC)"
	@echo "  Chain ID: 14"
	@echo "  RPC URL: https://flare-api.flare.network/ext/C/rpc"
	@echo "  Explorer: https://flarescan.com"
