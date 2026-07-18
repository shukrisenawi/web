import socket
import ssl

# Try with different SSL versions
context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE
context.set_ciphers('DEFAULT:@SECLEVEL=1')

try:
    with socket.create_connection(('paskawasansik.com', 21)) as sock:
        print("Connected to port 21")
        data = sock.recv(1024)
        print(f"Server: {data.decode()}")
        
        # Try sending AUTH TLS manually
        sock.send(b'AUTH TLS\r\n')
        data = sock.recv(1024)
        print(f"AUTH TLS response: {data.decode()}")
        
        # If 234, wrap socket with SSL
        if b'234' in data:
            with context.wrap_socket(sock, server_hostname='paskawasansik.com') as ssock:
                print("TLS established")
                # Send USER
                ssock.send(b'USER paskawas\r\n')
                data = ssock.recv(1024)
                print(f"USER response: {data.decode()}")
        else:
            print("AUTH TLS not accepted")
except Exception as e:
    print(f"Error: {e}")
