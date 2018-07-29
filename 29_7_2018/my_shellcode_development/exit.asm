global _start

section .text

_start:
	mov al,0x01
	xor ebx,ebx
	int 0x80
