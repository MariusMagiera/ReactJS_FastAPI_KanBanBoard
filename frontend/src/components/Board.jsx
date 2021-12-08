import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import AddColumn from "./AddColumn";
import Columns from "./Columns";
import Logout from "./Logout";
import { Row, Container, Col } from "react-bootstrap";

// const Container = styled.div`
//   display: flex;
// `;

function Board(props) {
  const initialData = { tasks: {}, columns: {}, columnOrder: [] };
  const [board, setBoard] = useState(initialData);

  // loading the data initially
  useEffect(() => {
    fetchBoard().then((data) => setBoard(data));
  }, [props.token]);

  // everytime the board changes, the saveBoard() function will execute and update the data
  useEffect(() => {
    if (board !== initialData) {
      saveBoard();
    }
  }, [board]);

  async function saveBoard() {
    const response = await fetch("/board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // prettier-ignore
        'Authorization': "Bearer " + props.token,
      },
      body: JSON.stringify(board),
    });
    const data = await response.json();
  }

  async function fetchBoard() {
    const response = await fetch("/board", {
      headers: {
        // prettier-ignore
        'Authorization': "Bearer " + props.token,
      },
    });
    const data = await response.json();
    return data.board;
  }

  function onDragEnd(result) {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(board.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setBoard({
        ...board,
        columnOrder: newColumnOrder,
      });

      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setBoard({
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      });

      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinishColumn = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setBoard({
      ...board,
      columns: {
        ...board.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    });
  }
  return (
    <Container fluid className="main-container">
      <h1 className="headline">Keep yourself organized!</h1>
      {/* set the area to allow to drag and drop things */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          <Row>
            <Col>
              <AddColumn board={board} setBoard={setBoard} />
            </Col>
            <Col>
              <Logout />
            </Col>
          </Row>
          <Row>
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
                      <Columns
                        key={column.id}
                        column={column}
                        tasks={tasks}
                        index={index}
                        board={board}
                        setBoard={setBoard}
                      />
                    );
                  })}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </Row>
        </Container>
      </DragDropContext>
    </Container>
  );
}
export default Board;
