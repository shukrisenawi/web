import ftplib
import sys

# Try standard FTP first with different settings
try:
    # Try plain FTP first
    print("Trying plain FTP...")
    ftp = ftplib.FTP()
    ftp.set_debuglevel(2)
    ftp.connect('paskawasansik.com', 21)
    ftp.login('paskawas', 'eG59Q%wA34?a')
    ftp.cwd('sistem')
    
    # Download file
    with open('.env_server', 'wb') as f:
        ftp.retrbinary('RETR .env', f.write)
    
    print("File downloaded successfully!")
    ftp.quit()
except Exception as e:
    print(f"Error: {e}")
