import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Column from "./Columns";

const Container = styled.div`
  display: flex;
`;

function Board(props) {
  const initialData = { tasks: {}, columns: {}, columnOrder: [] };
  const [board, setBoard] = useState(initialData);
  // loading the data initially: becaus of the [] it will only fire once in the beginning
  useEffect(() => {
    fetchBoard().then((data) => setBoard(data));
  }, []);

  async function fetchBoard() {
    const response = await fetch("/board");
    const data = await response.json();
    return data.board;
  }
  return (
    <Container>
      {board.columnOrder.map((columnId, index) => {
        const column = board.columns[columnId];
        const tasks = column.taskIds.map((taskIds) => board.tasks[taskIds]);
        return (
          <Column key={column.id} column={column} tasks={tasks} index={index} />
        );
      })}
    </Container>
  );
}

export default Board;
