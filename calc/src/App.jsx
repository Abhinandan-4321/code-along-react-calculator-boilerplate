import { useReducer, useState } from "react";
import "./App.css";
import Button from "./Components/Button";
import Operations from "./Components/Operations";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = " ";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overWrite: false,
        };
      }
      if (payload.digit == 0 && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit == "." && (state.currentOperand || "").includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.DELETE_DIGIT:
      if(state.overWrite){
        return {...state,
        overWrite:false,
        currentOperand: null,
      }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1){
        return { ...state, currentOperand:null}
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,1),
      }

    case ACTIONS.EVALUATE:
      if(
        state.operation == null ||
        state.currentOperand == null || 
        state.previousOperand == null
      ){
        return state
      }
      
      return{
        ...state,
        overWrite:true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

    case ACTIONS.CLEAR:
      return {}
  }
}

function App() {
  const [{ currentOperand, previousOperand ,operation}, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div>
      <div className="text-box">
        <div>{formatOperand(previousOperand)} {operation}</div>
        <div>{formatOperand(currentOperand)}</div>
      </div>

      <div id="container">
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <Button digit="9" dispatch={dispatch} />
      <Button digit="8" dispatch={dispatch} />
      <Button digit="7" dispatch={dispatch} />
      <Operations operation="/" dispatch={dispatch} />
      <Button digit="6" dispatch={dispatch} />
      <Button digit="5" dispatch={dispatch} />
      <Button digit="4" dispatch={dispatch} />
      <Operations operation="*" dispatch={dispatch} />
      <Button digit="3" dispatch={dispatch} />
      <Button digit="2" dispatch={dispatch} />
      <Button digit="1" dispatch={dispatch} />
      <Operations operation="+" dispatch={dispatch} />
      <Operations operation="-" dispatch={dispatch} />
      <Button digit="0" dispatch={dispatch} />
      <Button digit="." dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
      </div>
    </div>
  );
}

export default App;
