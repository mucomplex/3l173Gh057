import sys  ##system module
flag = "flag{reverse_engineers_see_everything}"

if len(sys.argv)<2:
    print("Error: ./login.py <password>")
    
elif (sys.argv[1] == flag):
    print("[ACCESS GRANTED]")
    
else:
    print("[ACCESS DENIED]")


