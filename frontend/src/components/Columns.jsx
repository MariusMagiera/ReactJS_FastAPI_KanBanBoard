import React from "react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Task from "./Task";
import AddTask from "./AddTask";
import { Col, Container } from "react-bootstrap";

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div`
  padding: 8px;
`;

function Columns(props) {
  function deleteColumn(columnId, index) {
    const columnTasks = props.board.columns[columnId].taskIds;

    const finalTasks = columnTasks.reduce((previousValue, currentValue) => {
      const { [currentValue]: oldTask, ...newTasks } = previousValue;
      return newTasks;
    }, props.board.tasks);

    const columns = props.board.columns;
    const { [columnId]: oldColumn, ...newColumns } = columns;

    const newColumnOrder = Array.from(props.board.columnOrder);
    newColumnOrder.splice(index, 1);

    props.setBoard({
      tasks: {
        ...finalTasks,
      },
      columns: {
        ...newColumns,
      },
      columnOrder: newColumnOrder,
    });
  }

  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {(provided) => (
        <Col style={{ float: "left" }} xs={12} md={4}>
          <Container
            className="column-card"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Title className="card-title" {...provided.dragHandleProps}>
              {props.column.title}
              <span
                className="delete-column"
                onClick={() => deleteColumn(props.column.id, props.index)}
              >
                {" "}
                x{" "}
              </span>
            </Title>
            <Droppable droppableId={props.column.id} type="task">
              {(provided) => (
                <TaskList {...provided.droppableProps} ref={provided.innerRef}>
                  {props.tasks.map((task, index) => (
                    <Task
                      key={task.id}
                      task={task}
                      index={index}
                      columnId={props.column.id}
                      board={props.board}
                      setBoard={props.setBoard}
                    />
                  ))}
                  {provided.placeholder}
                  <AddTask
                    columnId={props.column.id}
                    board={props.board}
                    setBoard={props.setBoard}
                  />
                </TaskList>
              )}
            </Droppable>
          </Container>
        </Col>
      )}
    </Draggable>
  );
}

export default Columns;
