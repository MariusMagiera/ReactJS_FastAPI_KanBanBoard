import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
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

  function onDragEnd() {
    alert("dropped!");
  }
  return (
    // set the area to allow to drag and drop things
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="all-collumns"
        direction="horizontal"
        type="column"
      >
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {board.columnOrder.map((columnId, index) => {
              const column = board.columns[columnId];
              const tasks = column.taskIds.map(
                (taskIds) => board.tasks[taskIds]
              );
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
