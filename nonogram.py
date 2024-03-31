import random as rd

nonogram = []
n = 5

for i in range(n):
    row = []
    for j in range(n):
        row.append(0)
    nonogram.append(row)

for row in nonogram:
    print(row)

