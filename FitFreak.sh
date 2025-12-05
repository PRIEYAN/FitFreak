#!/bin/bash

# FitFreak - Advanced Development Server Manager
# A comprehensive UI-based shell script for managing FitFreak development environment

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
BACKEND_DIR="frontend"
FLASK_DIR="backend/flask"
FRONTEND_DIR="frontend"
BACKEND_PORT=3001
FLASK_PORT=5000
FRONTEND_PORT=5173

# Environment variables
export RPC_URL=https://rpc.testnet.citrea.xyz
export ADMIN_PRIVATE_KEY=a75a5b53418ed8cca181fb838f37e807466322879891d9e201b2b45fdfbdc231
export CONTRACT_ADDRESS=0xd43dc5f84320B34149Be4D0602F862DdD61A45CF
export PORT=$BACKEND_PORT
export FLASK_PORT=$FLASK_PORT

export VITE_API_BASE_URL=http://localhost:$BACKEND_PORT/api
export VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
export VITE_CHAIN_ID=0x1a1
export VITE_RPC_URL=$RPC_URL
export VITE_DEBUG=true

# Process IDs
BACKEND_PID=""
FLASK_PID=""
FRONTEND_PID=""

# Status flags
BACKEND_RUNNING=false
FLASK_RUNNING=false
FRONTEND_RUNNING=false

# Function to print header
print_header() {
    clear
    echo -e "${CYAN}${BOLD}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo "║              💪  FITFREAK  SERVER  MANAGER  💪             ║"
    echo "║                                                            ║"
    echo "║              Where Every Rep Counts                        ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Function to print status indicator
print_status() {
    local service=$1
    local status=$2
    local port=$3
    
    if [ "$status" = true ]; then
        echo -e "  ${GREEN}●${NC} ${BOLD}$service${NC} ${GREEN}RUNNING${NC} on port ${CYAN}$port${NC}"
    else
        echo -e "  ${RED}●${NC} ${BOLD}$service${NC} ${RED}STOPPED${NC}"
    fi
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to check service status
check_services() {
    BACKEND_RUNNING=false
    FLASK_RUNNING=false
    FRONTEND_RUNNING=false
    
    if check_port $BACKEND_PORT; then
        BACKEND_RUNNING=true
    fi
    
    if check_port $FLASK_PORT; then
        FLASK_RUNNING=true
    fi
    
    if check_port $FRONTEND_PORT; then
        FRONTEND_RUNNING=true
    fi
}

# Function to display status dashboard
show_status() {
    print_header
    echo -e "${BOLD}${WHITE}Service Status:${NC}\n"
    
    check_services
    
    print_status "Backend API" $BACKEND_RUNNING $BACKEND_PORT
    print_status "Flask Server" $FLASK_RUNNING $FLASK_PORT
    print_status "Frontend" $FRONTEND_RUNNING $FRONTEND_PORT
    
    echo ""
    echo -e "${BOLD}${WHITE}Service URLs:${NC}"
    echo -e "  ${CYAN}Frontend:${NC}    http://localhost:$FRONTEND_PORT"
    echo -e "  ${CYAN}Backend API:${NC} http://localhost:$BACKEND_PORT/api"
    echo -e "  ${CYAN}Video Feed:${NC}  http://localhost:$FLASK_PORT/video_feed"
    echo ""
    echo -e "${BOLD}${WHITE}Blockchain:${NC}"
    echo -e "  ${CYAN}Network:${NC}     Citrea Testnet"
    echo -e "  ${CYAN}Contract:${NC}    $CONTRACT_ADDRESS"
    echo ""
}

# Function to start backend server
start_backend() {
    if [ "$BACKEND_RUNNING" = true ]; then
        echo -e "${YELLOW}Backend server is already running!${NC}"
        return
    fi
    
    echo -e "${BLUE}Starting Backend API server...${NC}"
    cd $BACKEND_DIR
    
    if [ ! -f "server.js" ]; then
        echo -e "${RED}Error: server.js not found in $BACKEND_DIR${NC}"
        return
    fi
    
    node server.js > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    
    sleep 2
    
    if check_port $BACKEND_PORT; then
        echo -e "${GREEN}✓ Backend server started successfully (PID: $BACKEND_PID)${NC}"
        BACKEND_RUNNING=true
    else
        echo -e "${RED}✗ Failed to start backend server${NC}"
    fi
    
    cd ..
}

# Function to start Flask server
start_flask() {
    if [ "$FLASK_RUNNING" = true ]; then
        echo -e "${YELLOW}Flask server is already running!${NC}"
        return
    fi
    
    echo -e "${BLUE}Starting Flask server...${NC}"
    cd $FLASK_DIR
    
    if [ ! -f "app.py" ]; then
        echo -e "${RED}Error: app.py not found in $FLASK_DIR${NC}"
        return
    fi
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}Creating virtual environment...${NC}"
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    # Install dependencies if needed
    if [ ! -f "venv/.deps_installed" ]; then
        echo -e "${BLUE}Installing Python dependencies...${NC}"
        pip install -q -r requirements.txt
        touch venv/.deps_installed
    fi
    
    python app.py > ../../logs/flask.log 2>&1 &
    FLASK_PID=$!
    echo $FLASK_PID > ../../logs/flask.pid
    
    sleep 2
    
    if check_port $FLASK_PORT; then
        echo -e "${GREEN}✓ Flask server started successfully (PID: $FLASK_PID)${NC}"
        FLASK_RUNNING=true
    else
        echo -e "${RED}✗ Failed to start Flask server${NC}"
    fi
    
    cd ../..
}

# Function to start frontend server
start_frontend() {
    if [ "$FRONTEND_RUNNING" = true ]; then
        echo -e "${YELLOW}Frontend server is already running!${NC}"
        return
    fi
    
    echo -e "${BLUE}Starting Frontend development server...${NC}"
    cd $FRONTEND_DIR
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}Error: package.json not found in $FRONTEND_DIR${NC}"
        return
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}Installing npm dependencies...${NC}"
        npm install
    fi
    
    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../logs/frontend.pid
    
    sleep 3
    
    if check_port $FRONTEND_PORT; then
        echo -e "${GREEN}✓ Frontend server started successfully (PID: $FRONTEND_PID)${NC}"
        FRONTEND_RUNNING=true
    else
        echo -e "${RED}✗ Failed to start frontend server${NC}"
    fi
    
    cd ..
}

# Function to stop a service
stop_service() {
    local service=$1
    local pid_file="logs/${service}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat $pid_file)
        if kill -0 $pid 2>/dev/null; then
            kill $pid 2>/dev/null
            echo -e "${GREEN}✓ Stopped $service (PID: $pid)${NC}"
        else
            echo -e "${YELLOW}Process $pid not found${NC}"
        fi
        rm -f $pid_file
    else
        echo -e "${YELLOW}No PID file found for $service${NC}"
    fi
}

# Function to stop all services
stop_all() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    stop_service "backend"
    stop_service "flask"
    stop_service "frontend"
    
    # Also kill by port if PID file doesn't exist
    lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null
    lsof -ti:$FLASK_PORT | xargs kill -9 2>/dev/null
    lsof -ti:$FRONTEND_PORT | xargs kill -9 2>/dev/null
    
    BACKEND_RUNNING=false
    FLASK_RUNNING=false
    FRONTEND_RUNNING=false
    
    echo -e "${GREEN}All services stopped${NC}"
}

# Function to start all services
start_all() {
    echo -e "${BLUE}${BOLD}Starting all FitFreak services...${NC}\n"
    
    # Create logs directory
    mkdir -p logs
    
    start_backend
    echo ""
    start_flask
    echo ""
    start_frontend
    echo ""
    
    sleep 2
    show_status
}

# Function to show logs
show_logs() {
    local service=$1
    local log_file="logs/${service}.log"
    
    if [ -f "$log_file" ]; then
        echo -e "${CYAN}${BOLD}=== $service Logs ===${NC}"
        tail -n 50 "$log_file"
    else
        echo -e "${RED}Log file not found: $log_file${NC}"
    fi
}

# Function to show main menu
show_menu() {
    print_header
    echo -e "${BOLD}${WHITE}Main Menu:${NC}\n"
    echo -e "  ${GREEN}1)${NC} Start All Services"
    echo -e "  ${GREEN}2)${NC} Stop All Services"
    echo -e "  ${GREEN}3)${NC} Restart All Services"
    echo -e "  ${GREEN}4)${NC} Service Status"
    echo -e "  ${GREEN}5)${NC} View Logs"
    echo -e "  ${GREEN}6)${NC} Install Dependencies"
    echo -e "  ${GREEN}7)${NC} Check System Requirements"
    echo -e "  ${GREEN}8)${NC} Open in Browser"
    echo -e "  ${RED}9)${NC} Exit"
    echo ""
    echo -e "${BOLD}Select an option:${NC} "
}

# Function to check system requirements
check_requirements() {
    print_header
    echo -e "${BOLD}${WHITE}System Requirements Check:${NC}\n"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node -v)
        echo -e "  ${GREEN}✓${NC} Node.js: $node_version"
    else
        echo -e "  ${RED}✗${NC} Node.js: Not installed"
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        local npm_version=$(npm -v)
        echo -e "  ${GREEN}✓${NC} npm: $npm_version"
    else
        echo -e "  ${RED}✗${NC} npm: Not installed"
    fi
    
    # Check Python
    if command -v python3 &> /dev/null; then
        local python_version=$(python3 --version)
        echo -e "  ${GREEN}✓${NC} Python: $python_version"
    else
        echo -e "  ${RED}✗${NC} Python: Not installed"
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        local git_version=$(git --version)
        echo -e "  ${GREEN}✓${NC} Git: $git_version"
    else
        echo -e "  ${RED}✗${NC} Git: Not installed"
    fi
    
    echo ""
    read -p "Press Enter to continue..."
}

# Function to install dependencies
install_dependencies() {
    print_header
    echo -e "${BOLD}${WHITE}Installing Dependencies:${NC}\n"
    
    # Frontend dependencies
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd $FRONTEND_DIR
    npm install
    cd ..
    
    # Backend dependencies
    echo -e "${BLUE}Installing Flask dependencies...${NC}"
    cd $FLASK_DIR
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt
    cd ../..
    
    echo -e "${GREEN}✓ All dependencies installed${NC}"
    echo ""
    read -p "Press Enter to continue..."
}

# Function to open in browser
open_browser() {
    if [ "$FRONTEND_RUNNING" = true ]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:$FRONTEND_PORT"
        elif command -v open &> /dev/null; then
            open "http://localhost:$FRONTEND_PORT"
        else
            echo -e "${YELLOW}Please open http://localhost:$FRONTEND_PORT in your browser${NC}"
        fi
    else
        echo -e "${RED}Frontend server is not running!${NC}"
    fi
}

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    stop_all
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Main loop
main() {
    # Create logs directory
    mkdir -p logs
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1)
                start_all
                echo ""
                read -p "Press Enter to continue..."
                ;;
            2)
                stop_all
                echo ""
                read -p "Press Enter to continue..."
                ;;
            3)
                stop_all
                sleep 2
                start_all
                echo ""
                read -p "Press Enter to continue..."
                ;;
            4)
                show_status
                echo ""
                read -p "Press Enter to continue..."
                ;;
            5)
                print_header
                echo -e "${BOLD}${WHITE}Select log to view:${NC}\n"
                echo -e "  1) Backend"
                echo -e "  2) Flask"
                echo -e "  3) Frontend"
                echo ""
                read -p "Choice: " log_choice
                case $log_choice in
                    1) show_logs "backend" ;;
                    2) show_logs "flask" ;;
                    3) show_logs "frontend" ;;
                esac
                echo ""
                read -p "Press Enter to continue..."
                ;;
            6)
                install_dependencies
                ;;
            7)
                check_requirements
                ;;
            8)
                open_browser
                echo ""
                read -p "Press Enter to continue..."
                ;;
            9)
                cleanup
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                sleep 1
                ;;
        esac
    done
}

# Run main function
main
