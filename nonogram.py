import random as rd
from itertools import chain

def create_board(n,board):
    board = []

    for i in range(n):
        row = []
        for j in range(n):
            row.append(0)
        board.append(row)

    return board

def is_empty(arr):
    aux = list(chain(*[x if isinstance(x, (list, tuple)) else [x] for x in arr]))
    
    if max(aux) == 0:
        return True
    else:
        return False

def fill_row(row, board,pos):

    row_aux = list(chain(*[x if isinstance(x, (list, tuple)) else [x] for x in row]))
    aux = 0

    for x in range(0,len(row_aux)):   
        print("here here", row[pos], board[pos][x])   
        if board[pos][x] == 1:
            row[pos] -= 1
            aux += 1
    
    while row[pos] != 0:
        if board[pos][aux] == 0 and aux <= len(row_aux):
            board[pos][aux] = 1
            aux += 1 
            row[pos] -= 1
        
        elif board[pos][aux] == 1:
            aux += 1 
            row[pos] -= 1
        
        else:
            row[pos] -= 1

    if row[pos] <= 0 and aux >= len(row_aux):
        aux == -1
        return row,board


    while aux != -1:
        if board[pos][aux] == 0:
            board[pos][aux] = 2
            aux -= 1
                
        else:
            aux -= 1

    return row,board

def fill_column(column, board,pos):

    column_aux = list(chain(*[x if isinstance(x, (list, tuple)) else [x] for x in column]))
    aux = 0

    for x in range(0,len(column_aux)):
        print(board[x][pos])
        if board[x][pos] == 1:
            column[pos] -= 1
            aux += 1
    
    while column[pos] > 0:
        if aux < len(column_aux):
            if board[aux][pos] == 0:  
                board[aux][pos] = 1
                aux += 1 
                column[pos] -= 1
                
            elif board[aux][pos] == 1:
                aux += 1
                column[pos] -= 1 

            else:
                aux += 1
        else:
            column[pos] -= 1
        
    if column[pos] <= 0 and aux >= len(column_aux):
        aux == -1
        return column,board

    while aux != -1:
        if board[aux][pos] == 0:
            board[aux][pos] = 2
            aux -= 1
                
        else:
            aux -= 1


    return column,board

def is_game(board, ori_row,ori_column):
    aux = list(chain(*[x if isinstance(x, (list, tuple)) else [x] for x in board]))

    for i in range(0,len(ori_row)):
        for j in range(0,len(ori_column)):
            ori_row[i] -= board[i][j]
            ori_column[i] -= board[j][i]
    
    if is_empty(ori_row) is True and is_empty(ori_column) is True:
        print("Valid Game generated")
        for ori_row in board:
            print(ori_row)

    else:
        print("No valid game generated")
        for ori_row in board:
            print(ori_row)

def generate_game(n,board,row,column):

    if is_empty(row) is True and is_empty(column) is True:
        return board

    ori_row = row[:]
    ori_column = column[:]
    
    exclude = []
    Flag = False

    while len(exclude) != n:
        while Flag is False:
            aux = rd.randint(0, n-1)

            if aux not in exclude:
                exclude.append(aux)
                Flag = True
        
        print("exclude: ", exclude)
        row , board = fill_row(row,board,aux)
        column , board = fill_column(column,board,aux)
        Flag = False
    
    for i in range(0,n):
        for j in range(0,n):
            if board[i][j] == 2:
                board[i][j] = 0
    

    is_game(board, ori_row,ori_column)




def main(): 
    n = 2
    nonogram = create_board(n,[])
    row = [1,2]
    column = [1,2]

    generate_game(n,nonogram,row,column)


if __name__=="__main__": 
    main() 