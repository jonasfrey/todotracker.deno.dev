pid_websersocket=$(pgrep -f "websersocket_b5ddf4af-b818-4b11-96a3-9389d5696641.js")
watch -n 1 ps -p $pid_websersocket -o pid,etime,%cpu,%mem,cmd