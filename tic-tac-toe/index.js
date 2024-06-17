const gameContainer = document.getElementById("game_container");

let isZero = false;
let isPlayable = true;
const movesMade = new Map();
let gameRectangleLength = 3;

let leftToRightDiagonal = getDiagonal(0);
let rightToLeftDiagonal = getDiagonal(gameRectangleLength - 1);


function makeGrid() {
    let idIncrement = 0;

    gameContainer.style.gridTemplateColumns = `repeat(${gameRectangleLength}, 1fr)`;
    gameContainer.style.gridTemplateRows = `repeat(${gameRectangleLength}, 1fr)`;

    for (i = 0; i < gameRectangleLength; i++) {
        for (j = 0; j < gameRectangleLength; j++) {
            const div = createDiv(idIncrement, j, i);
            gameContainer.appendChild(div);
            idIncrement++;
        }
    }
}


function createDiv(idIncrement, x, y) {
    const div = document.createElement("div");

    div.className = "game_box";
    div.id = createElementId(idIncrement);
    div.dataset.x = x;
    div.dataset.y = y;
    div.dataset.moveValue = "";
    div.onclick = () => makeMove(div);

    return div;
}


function createElementId(increment) {
    return "game_box" + increment;
}


const makeMove = (div) => {
    if (!isPlayable) {
        return;
    }
    if (div.dataset.moveValue !== "") {
        return;
    }
    let moveValue = isZero ? "0" : "X";
    isZero = !isZero;

    div.dataset.moveValue = moveValue;
    div.innerText = moveValue;

    const moveObject = divToMoveObject(div);
    mapMove(moveObject);
    evaluateGameState(moveObject);
}


function divToMoveObject(div) {
    return {
        "id": div.id,
        "moveValue": div.dataset.moveValue,
        "x": div.dataset.x,
        "y": div.dataset.y
    };
}


function mapMove(moveObject) {
    const moveValue = moveObject.moveValue;
    if (!movesMade.has(moveValue)) {
        movesMade.set(moveValue, new Map());
    }
    const xKey = stringifyCoordinate("x", moveObject);
    const yKey = stringifyCoordinate("y", moveObject);

    const moveMade = movesMade.get(moveValue);
    mapByCoord(moveObject, moveMade, xKey);
    mapByCoord(moveObject, moveMade, yKey);
}


function mapByCoord(moveObject, moveMade, coordKey) {
    if (!moveMade.has(coordKey)) {
        moveMade.set(coordKey, []);
    }
    const coordMoveArr = moveMade.get(coordKey);
    coordMoveArr.push(moveObject.id);
}


function evaluateGameState(lastMoveObject) {
    const playersMoves = movesMade.get(lastMoveObject.moveValue);
    if (playersMoves) {
        const lastMoveXArray = playersMoves.get(
            stringifyCoordinate("x", lastMoveObject)
        );
        const lastMoveYArray = playersMoves.get(
            stringifyCoordinate("y", lastMoveObject)
        );
        if (isFinishedOnXorY(lastMoveXArray)) {
            return;
        }
        if (isFinishedOnXorY(lastMoveYArray)) {
            return;
        }

   }
    // TODO: diagonal logic without looping
}


function isFinishedDiagonally(lastMoveObject) {
}




function getDiagonal(upperCornerCoordX) {
    const diagonalSquares = [];

    if (upperCornerCoordX === 0) {
        // Return left to right diagonal
        for (let i = 0; i < gameRectangleLength; i++) {
            diagonalSquares.push({"x": i, "y": i});
        }
        return diagonalSquares;
    }

    // Return right to left getDiagonal
    for (let i = 0; i < gameRectangleLength; i++) {
        diagonalSquares.push({"x": upperCornerCoordX - i, "y": i});
    }
    return diagonalSquares;
}



function isFinishedOnXorY(moveArray) {
    if (moveArray.length === gameRectangleLength) {
        isPlayable = false;
        for (let gameBoxId of moveArray) {
            changeStyle(gameBoxId);
        }
        return true;
    }
    return false;
}


function changeStyle(gameBoxId) {
    const div = document.getElementById(gameBoxId);
    div.style.backgroundColor = "lightgreen";
}


function stringifyCoordinate(coord, moveObject) {
    if (coord === "x") {
        return coord + moveObject.x;
    }
    return coord + moveObject.y;
}


makeGrid();


