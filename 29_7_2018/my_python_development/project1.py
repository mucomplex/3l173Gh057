#read the names and mark of at least 3 students
#rank the top three students with highest marks
#give cash rewards, $500 for first rank, $300 for second rank, $100 for third rank, value cannot be modified
#appreciate students who secured 95 marks and above

#{('john', 60), ('david', 95), ('ben', 70), ('mark', 98)}

def readStudentDetails():
    print("Enter the number of students: ")
    #create empty dictionary of student record
    studentRecord = {}
    noOfStudents = int(input())
    for student in range(0, noOfStudents):
        print("Enter Student's name: ")
        name = input()
        print("Enter the marks of student: ")
        marks = int(input())
        #name as key, marks as value
        studentRecord[name] = marks
    print()
    return studentRecord

import operator
def rankStudents(studentRecord):
    print()
    sortedStudentRecord = sorted(studentRecord.items(), key = operator.itemgetter(1), reverse = True)
    print(sortedStudentRecord)
    print("{} has secured first rank, scoring for {} marks".format(sortedStudentRecord[0][0], sortedStudentRecord[0][1]))
    print("{} has secured second rank, scoring for {} marks".format(sortedStudentRecord[1][0], sortedStudentRecord[1][1]))
    print("{} has secured third rank, scoring for {} marks".format(sortedStudentRecord[2][0], sortedStudentRecord[2][1]))
    print()
    return sortedStudentRecord

def rewardsStudents(sortedStudentRecord, rewards):
    print()
    print("{} has received a cash rewards of ${}".format(sortedStudentRecord[0][0], rewards[0]))
    print("{} has received a cash rewards of ${}".format(sortedStudentRecord[1][0], rewards[1]))
    print("{} has received a cash rewards of ${}".format(sortedStudentRecord[2][0], rewards[2]))
    print()


def appreciateStudents(sortedStudentRecord):
    print()
    for record in sortedStudentRecord:
        if record[1]>= 95:
            print("Congratulation on scoring {} marks, {}".format(record[1], record[0]))
        else:
            break
    print()


studentRecord = readStudentDetails()
sortedStudentRecord = rankStudents(studentRecord)
rewards = (500, 300, 100)
rewardsStudents(sortedStudentRecord, rewards)
appreciateStudents(sortedStudentRecord)
