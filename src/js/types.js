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

/**
 * Discriminated union for inline edit UI.
 * After checking `type`, Flow narrows which fields exist.
 */
export type EditState = {| type: 'idle' |} | {| type: 'editing', id: TodoId, draft: string |};

export const idleEditState = (): EditState => ({ type: 'idle' });

export const startEditing = (id: TodoId, draft: string): EditState => ({
  type: 'editing',
  id,
  draft,
});

export const createTodoId = (): TodoId => uuidv4();

export const createTodo = (name: string): Todo => ({
  id: createTodoId(),
  name,
  checked: false,
});
