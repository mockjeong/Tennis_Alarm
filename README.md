# Tennis_Alarm


# Iptables
sudo iptables -A PREROUTING -t nat -i eth0 	-p tcp --dport 80 -j REDIRECT --to-port 8000;
sudo iptables -t nat -L; (안함)
sudo apt install iptables-persistent; # yes
sudo bash -c "iptables-save > /etc/iptables/rules.v4";
sudo bash -c "iptables-restore < /etc/iptables.conf"; startup script에 등록 (안함)
