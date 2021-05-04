# Yet Another Sudoku Solver

A 9x9 Sudoku solver and random puzzle generator app in ReactJS. Visit the deployed [website](https://yet-another-sudoku-solver.herokuapp.com/).

![sudokugif](https://user-images.githubusercontent.com/59311154/117050608-2a53bb80-ad33-11eb-8829-e8a44752e8bc.gif)

## Steps for installation
1. Clone the repository 
```
$ git clone https://github.com/Arjun-Siva/Sudoku-solver
```
2. Change directory to the sudoku-solver folder
```
$ cd sudoku-solver
```
3. Install required dependencies
```
$ npm install
```
4. Run the React project
```
$ npm start
```

## Algorithm
The sudoku is essentially a constraint satisfaction problem. Each empty cell has a set of potential numbers that can be filled in while maintaining the consistency with respect to the Sudoku rules i.e., each cell can be filled with 1 to 9 and no numbers should repeat in a row or column or same block/sector.

1. Pick an empty cell
2. Fill with one of the potential numbers that doesn't break the consistency
3. Find another empty cell and repeat step 2. If there are no potential numbers, backtrack to the previous cell that was filled and choose another potential number
4. Repeat steps 1 to 3 until all the cells are filled

Finding the next cell to fill requires a heuristic. The cell with the least number of potential numbers is chosen everytime. This reduces the number of backtracks significantly.

## Reference
[A Sudoku Solver](https://www.cs.rochester.edu/u/brown/242/assts/termprojs/Sudoku09.pdf) by Mike Schermerhorn.
