/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Head from "next/head";
import { useState } from "react";

type fieldType = "empty" | "black" | "white" | "fire";

const getInitialBoard6x6 = (): fieldType[][] => {
  return [
    ["empty", "empty", "black", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "white"],
    ["white", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "black", "empty", "empty"],
  ];
};

const getDotsBoard6x6 = () => {
  return [
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
  ];
};

type turnStates = "move" | "shoot" | "end";

export default function Home() {
  const [turnState, setTurnState] = useState<turnStates>("move");
  const [board, setBoard] = useState<fieldType[][]>(getInitialBoard6x6());
  const [dots, setDots] = useState<boolean[][]>(getDotsBoard6x6());
  const [arrowdots, setArrowdots] = useState<boolean[][]>(getDotsBoard6x6());
  const [turnCount, setTurnCount] = useState(0);
  const [activePiece, setActivePiece] = useState<{
    x: number;
    y: number;
    colour: "black" | "white" | "empty";
  }>({
    x: -1,
    y: -1,
    colour: "empty",
  });

  const calcMoves = (row: number, col: number, colour: "white" | "black") => {
    if (turnState != "move") return;

    const tempDots = getDotsBoard6x6();
    setActivePiece({ x: row, y: col, colour });

    // check top
    let i = row - 1;
    while (board[i]?.[col] == "empty") {
      tempDots[i]![col] = true;
      i--;
    }

    // check bottom
    i = row + 1;
    while (board[i]?.[col] == "empty") {
      tempDots[i]![col] = true;
      i++;
    }

    // check left
    i = col - 1;
    while (board[row]?.[i] == "empty") {
      tempDots[row]![i] = true;
      i--;
    }

    // check right
    i = col + 1;
    while (board[row]?.[i] == "empty") {
      tempDots[row]![i] = true;
      i++;
    }

    // check diagnoals

    // top left
    i = 1;
    while (board[row - i]?.[col - i] == "empty") {
      tempDots[row - i]![col - i] = true;
      i++;
    }

    // top right
    i = 1;
    while (board[row - i]?.[col + i] == "empty") {
      tempDots[row - i]![col + i] = true;
      i++;
    }

    // bottom left
    i = 1;
    while (board[row + i]?.[col - i] == "empty") {
      tempDots[row + i]![col - i] = true;
      i++;
    }

    // bottom right
    i = 1;
    while (board[row + i]?.[col + i] == "empty") {
      tempDots[row + i]![col + i] = true;
      i++;
    }

    setDots([...tempDots]);
  };

  const checkLooseCondition = () => {
    const isBlocked = (i: number, j: number) => {
      return (
        board[i - 1]?.[j - 1] != "empty" &&
        board[i - 1]?.[j] != "empty" &&
        board[i - 1]?.[(j = 1)] != "empty" &&
        board[i]?.[j - 1] != "empty" &&
        board[i]?.[j + 1] != "empty" &&
        board[i + 1]?.[j - 1] != "empty" &&
        board[i + 1]?.[j] != "empty" &&
        board[i + 1]?.[j + 1] != "empty"
      );
    };
    const blockedPieces = {
      black: 0,
      blacktotal: 0,
      white: 0,
      whitetotal: 0,
    };

    board.forEach((row, rowindex) =>
      row.forEach((field, colindex) => {
        if (field == "black") {
          blockedPieces.blacktotal++;
          if (isBlocked(rowindex, colindex)) {
            blockedPieces.black++;
          }
        }
        if (field == "white") {
          blockedPieces.whitetotal++;
          if (isBlocked(rowindex, colindex)) {
            blockedPieces.white++;
          }
        }
      })
    );

    console.log(blockedPieces);
    if (
      blockedPieces.black == blockedPieces.blacktotal ||
      blockedPieces.white == blockedPieces.whitetotal
    ) {
      setTurnState("end");
    }
  };

  const movePiece = (toRow: number, toCol: number) => {
    if (turnState != "move") return;

    const boardCopy = [...board];
    if (boardCopy[activePiece.x]?.[activePiece.y]) {
      boardCopy[activePiece.x]![activePiece.y] = "empty";
    }

    if (boardCopy[toRow]?.[toCol]) {
      boardCopy[toRow]![toCol] = activePiece.colour;
    }

    setBoard([...boardCopy]);
    setDots(getDotsBoard6x6());

    setTurnState("shoot");
    calcArrows(toRow, toCol);
  };

  const calcArrows = (row: number, col: number) => {
    const tempDots = getDotsBoard6x6();
    setActivePiece({ x: row, y: col, colour: activePiece.colour });

    // check top
    let i = row - 1;
    while (board[i]?.[col] == "empty") {
      tempDots[i]![col] = true;
      console.log(tempDots[i]![col]);
      i--;
    }

    // check bottom
    i = row + 1;
    while (board[i]?.[col] == "empty") {
      tempDots[i]![col] = true;
      i++;
    }

    // check left
    i = col - 1;
    while (board[row]?.[i] == "empty") {
      tempDots[row]![i] = true;
      i--;
    }

    // check right
    i = col + 1;
    while (board[row]?.[i] == "empty") {
      tempDots[row]![i] = true;
      i++;
    }

    // check diagnoals

    // top left
    i = 1;
    while (board[row - i]?.[col - i] == "empty") {
      tempDots[row - i]![col - i] = true;
      i++;
    }

    // top right
    i = 1;
    while (board[row - i]?.[col + i] == "empty") {
      tempDots[row - i]![col + i] = true;
      i++;
    }

    // bottom left
    i = 1;
    while (board[row + i]?.[col - i] == "empty") {
      tempDots[row + i]![col - i] = true;
      i++;
    }

    // bottom right
    i = 1;
    while (board[row + i]?.[col + i] == "empty") {
      tempDots[row + i]![col + i] = true;
      i++;
    }

    // diese figur kann immer pfeile schiessen, weil die muss ja irgendwo herkommen, ne

    setArrowdots([...tempDots]);
  };

  const shootArrow = (x: number, y: number) => {
    if (turnState != "shoot") return;

    const boardCopy = [...board];
    if (boardCopy[x]?.[y]) {
      boardCopy[x]![y] = "fire";
    }

    setArrowdots(getDotsBoard6x6());
    setBoard([...boardCopy]);

    setTurnState("move");
    setTurnCount(turnCount + 1);

    checkLooseCondition();
  };

  return (
    <>
      <Head>
        <title>game of the amazons</title>
      </Head>
      <main>
        <div>it&apos;s {turnCount % 2 == 0 ? `white's` : `black's`} turn</div>

        {/* board */}
        <div className="relative mx-auto grid aspect-square max-h-[90vh] max-w-[90vw] grid-cols-6 text-6xl shadow-lg">
          {board.map((row, rowindex) => {
            return row.map((field, colindex) => {
              if (field == "empty")
                return (
                  <div
                    key={`${rowindex}-${colindex}`}
                    className={`p-4 ${
                      (rowindex + colindex) % 2 == 0
                        ? "bg-white"
                        : "rounded-lg bg-orange-100"
                    }`}
                  >
                    &nbsp;
                  </div>
                );
              if (field == "black")
                return (
                  <div
                    key={`${rowindex}-${colindex}`}
                    className={`flex items-center justify-center p-4 ${
                      (rowindex + colindex) % 2 == 0
                        ? "bg-white"
                        : "bg-orange-100"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (turnCount % 2 == 1)
                        calcMoves(rowindex, colindex, "black");
                      else console.warn(`not black's turn`);
                    }}
                  >
                    ⚫
                  </div>
                );
              if (field == "white")
                return (
                  <div
                    key={`${rowindex}-${colindex}`}
                    className={`flex items-center justify-center p-4 ${
                      (rowindex + colindex) % 2 == 0
                        ? "bg-white"
                        : "bg-orange-100"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (turnCount % 2 == 0)
                        calcMoves(rowindex, colindex, "white");
                      else console.warn(`not white's turn`);
                    }}
                  >
                    ⚪
                  </div>
                );
              if (field == "fire")
                return (
                  <div
                    key={`${rowindex}-${colindex}`}
                    className={`flex items-center justify-center bg-red-50 p-4 ${
                      (rowindex + colindex) % 2 == 0
                        ? "bg-red-50"
                        : "rounded-lg bg-red-100"
                    }`}
                  >
                    🔥
                  </div>
                );
              return <>error</>;
            });
          })}

          {/* where to move */}
          <div className="pointer-events-none absolute grid h-full w-full grid-cols-6">
            {dots.map((row, rowindex) =>
              row.map((field, colindex) => {
                if (field)
                  return (
                    <div
                      className="pointer-events-auto flex items-center justify-center"
                      key={`${rowindex}-${colindex}`}
                      onClick={(e) => {
                        e.preventDefault();
                        movePiece(rowindex, colindex);
                      }}
                    >
                      <div className="h-12 w-12 rounded-full bg-black/20"></div>
                    </div>
                  );
                return (
                  <div key={`${rowindex}-${colindex}`} className="invisible">
                    &nbsp;
                  </div>
                );
              })
            )}
          </div>

          {/* arrows */}
          <div className="pointer-events-none absolute grid h-full w-full grid-cols-6 text-5xl">
            {arrowdots.map((row, rowindex) =>
              row.map((field, colindex) => {
                if (field)
                  return (
                    <div
                      className="pointer-events-auto relative flex items-center justify-center"
                      key={`${rowindex}-${colindex}`}
                      onClick={(e) => {
                        e.preventDefault();
                        shootArrow(rowindex, colindex);
                      }}
                    >
                      <div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-blue-100/80">
                        🏹
                      </div>
                    </div>
                  );
                return (
                  <div key={`${rowindex}-${colindex}`} className="invisible">
                    &nbsp;
                  </div>
                );
              })
            )}
          </div>
        </div>
        {turnState == "end" && (
          <div className="absolute left-0 top-0 flex h-full w-full justify-center bg-black/50 p-12 align-middle text-8xl font-bold text-white backdrop-blur-sm">
            <span>
              endeee. {turnCount % 2 == 0 ? "black" : "white"} hat gewonnen
            </span>
          </div>
        )}
      </main>
    </>
  );
}
