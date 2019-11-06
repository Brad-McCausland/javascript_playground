import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props)
{
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

function Button(props)
{
    return (
        <button
            className="reset_button"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component
{
    render()
    {
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
    
    renderSquare(i)
    {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
}

class Game extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    // Detect the difference between two game boards. Assumes only one difference, and will return the first one it sees
    boardDiff(board1, board2)
    {
        var i;
        for (i = 0; i < board1.length; i++)
        {
            if (board1[i] !== board2[i])
            {
                // Return first index where boards differentiate
                return i;
            }
        }
        // Boards are identical
        return null;
    }

    // Converts index into the linear board into a string representing it's coordinates into the grid
    // For example: index: 3 => (1, 2)
    boardCoords(index)
    {
        return "(" + ((index % 3) + 1) + ", " + ( 4 - Math.floor(index/3 + 1)) + ")";
    }

    render()
    {
        const history  = this.state.history;
        const current  = history[this.state.stepNumber];
        const winner   = calculateWinner(current.squares);

        const moves = history.map((step, moveNum) =>
        {
            var player;
            var position;

            if (moveNum > 0)
            {
                player = (moveNum % 2) === 0 ? 'O' : 'X';
                var boardIndex = this.boardDiff(history[moveNum].squares, history[moveNum - 1].squares);
                position = this.boardCoords(boardIndex);
            }

            const desc = moveNum ?
                'Go to move #' + moveNum + (", (player " + player + " at position " + position + ")"):
                'Go to game start';
            return (
                <li key={moveNum}>
                    <button onClick={() => this.jumpTo(moveNum)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner)
        {
            status = 'Winner: ' + winner;
        }
        else
        {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className="reset-button">
                    {this.renderButton()}
                </div>
            </div>
        );
    }

    jumpTo(step)
    {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i)
    {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i])
        {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    renderButton()
    {
        return (
            <Button
                value="Reset Game"
                onClick={() => this.resetGame()}
            />
        );
    }

    resetGame()
    {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        });
    }
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

// ================================================

ReactDOM.render (
    <Game />,
    document.getElementById('root')
);