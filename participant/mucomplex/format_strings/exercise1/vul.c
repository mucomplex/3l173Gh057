#include <stdio.h>

void fmtstr(){
	char input[100];
	int var = 0x11223344;
	printf("target address: %x\n",(unsigned) &var);
	printf("Data at target address: 0x%x\n",var);
	printf("Please enter string: ");
	fgets(input,sizeof(input)-1,stdin);
	printf(input);
	printf("Data at target address: 0x%x\n",var);
}

void main(){ fmtstr(); }
