import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./style.css";

function AddColumn(props) {
  const [showNewColumnButton, setShowNewColumnButton] = useState(true);
  const [value, setValue] = useState("");

  function handleInputComplete(e) {
    setShowNewColumnButton(true);
    addNewColumn(value);
    setValue("");
  }

  function addNewColumn(title) {
    const newColumnOrder = Array.from(props.board.columnOrder);
    const newColumnId = "column-" + Math.floor(Math.random() * 1000000);
    newColumnOrder.push(newColumnId);
    console.log(props.board);
    const newColumn = {
      id: newColumnId,
      title: title,
      taskIds: [],
    };

    props.setBoard({
      ...props.board,
      columns: {
        ...props.board.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: newColumnOrder,
    });
  }
  return (
    <div>
      {showNewColumnButton ? (
        <Button
          className="new-column-button"
          onClick={() => setShowNewColumnButton(false)}
        >
          {" "}
          New Column
        </Button>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleInputComplete}
        />
      )}
    </div>
  );
}

export default AddColumn;
