/* @flow */

import { v4 as uuidv4 } from 'uuid';

/**
 * Branded UUID. Outside this file you cannot assign a raw string to TodoId.
 * Inside this file it is still a string, so uuidv4() can create it.
 */
export opaque type TodoId: string = string;

export type Todo = {|
  id: TodoId,
  name: string,
  checked: boolean,
|};

export const createTodoId = (): TodoId => uuidv4();

export const createTodo = (name: string): Todo => ({
  id: createTodoId(),
  name,
  checked: false,
});
