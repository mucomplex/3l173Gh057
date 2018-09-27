word ="S\AG\j]T[QFZX"
enc=""
for i in word:
    r=ord(i)^53
    enc += chr(r)

print(enc)
