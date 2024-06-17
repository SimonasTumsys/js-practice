const gameContainer = document.getElementById("game_container");

let isZero = false;
let isPlayable = true;
const movesMade = new Map();
const gameRectangleLength = 3;


function makeGrid(gameRectangleLength) {
    let idIncrement = 0;

    gameContainer.style.gridTemplateColumns = `repeat(${gameRectangleLength}, 1fr)`;
    gameContainer.style.gridTemplateRows = `repeat(${gameRectangleLength}, 1fr)`;

    for (i = 0; i < gameRectangleLength; i++) {
        for (j = 0; j < gameRectangleLength; j++) {
            const div = createDiv(idIncrement, i, j);
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
    div.innerText = `${x}, ${y}`;
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
    evaluateGameState(moveObject, gameRectangleLength);
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
        if (lastMoveXArray.length === gameRectangleLength
                || lastMoveYArray.length === gameRectangleLength) {
            console.log(`Player '${lastMoveObject.moveValue}' wins`);
            isPlayable = false;
        }
    }
    // TODO: diagonal logic
}


function stringifyCoordinate(coord, moveObject) {
    if (coord === "x") {
        return coord + moveObject.x;
    }
    return coord + moveObject.y;
}


makeGrid(gameRectangleLength);
