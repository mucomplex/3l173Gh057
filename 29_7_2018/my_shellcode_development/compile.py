#!/usr/bin/python3
import os
import sys
import time
import subprocess

class general():
    def help(self):
        print('[*] Usage : '+ sys.argv[0] +' argv[1] argv[2]')
        print('\n list argv[1]')
        print('[*] install missing program : '+sys.argv[0]+' install')
        print('[*] to compile shellcode : '+sys.argv[0]+' program.asm')
        print('\n list argv[2]')
        print('[*] to view shellcode :'+sys.argv[0]+' program.asm shell')
        exit()

    def install(self):
        os.system('sudo apt-get install nasm')
        os.system('sudo apt-get install gcc-multilib')

class compile():
    # initialize program
    def __init__(self,program):
        self.program = program
        self.program_name = self.program.split('.')[0]
        self.shellcode=''
    # compile program
    def nasm_compile(self):
        nasm_input = 'nasm -f elf ' + self.program
        os.system(nasm_input)
        program_name = self.program_name
        nasm_compile = 'ld -o '+ program_name +' '+ program_name +'.o -m elf_i386'
        os.system(nasm_compile)
        os.system('rm -rf %s.o' % program_name)
    # disassemble program
    def disassemble(self):
        os.system('objdump -d %s -M intel' % self.program_name)
    # check for extension
    def trace_extension(self):
        if self.program.find('.asm') == False:
            print('please include the extension.')
            exit()
        else:
            return True
    # extract shellcode 
    def extract(self):
        print('Shellcode:')
        shellcode_extract = '''
        objdump -d ./'''+self.program_name+'''|grep '[0-9a-f]:'|grep -v 'file'|cut -f2 -d:|cut -f1-6 -d' '|tr -s ' '|tr '\t' ' '|sed 's/ $//g'|sed 's/ /\\x/g'|paste -d '' -s |sed 's/^/"/'|sed 's/$/"/g'
        '''
        result = subprocess.check_output(shellcode_extract,shell=True)
        self.shellcode = str(result).replace('x','\\x').split('"')[1]
        print(self.shellcode)
    # generate shellcode
    def generate(self):
        if self.trace_extension() == True and self.check_file() == True:
            self.nasm_compile()
            self.extract()
            generate_c = '''
                #include <stdio.h>
                char shellcode[]= "'''+self.shellcode+'''";
                int main(){
                int *ret;
                ret = (int *)&ret + 2;
                (*ret) = (int)shellcode;
                }
            \n'''
            with open(self.program_name+'.c','w') as file:
                file.write(generate_c)
                file.close()
            os.system('gcc -fno-stack-protector -z execstack '+self.program_name+'.c -o '+self.program_name+'_new -m32')
            os.system('sudo chown root:root '+self.program_name+'_new && sudo chmod 4755 '+self.program_name+'_new')
            print('\n[*] Complete generate')

    # check file is exist
    def check_file(self):
        if os.path.isfile(self.program) == False:
            print('file does not exists')
        else:
            return True

# general argument
general_function = general()
for _help in sys.argv :
    if _help == '-h':
        general_function.help()

# first argument settings
if len(sys.argv) < 2 or len(sys.argv) >3:
    general_function.help()
compile_program = compile(sys.argv[1])
if len(sys.argv) == 2:
    if sys.argv[1] == 'install':
        general_function.install()
    else:
        compile_program.generate()
# 2nd argument settings
elif len(sys.argv) == 3:
    if sys.argv[2] == 'shell':
        compile_program.disassemble()
    else:
        general_function.help()
