import React from 'react'
import { ACTIONS } from '../App'

function Operations({dispatch, operation}) {
  return (
    <div>
        <button onClick={()=>dispatch({type:ACTIONS.CHOOSE_OPERATION, payload: {operation}})}>{operation}</button>
    </div>
  )
}

export default Operations