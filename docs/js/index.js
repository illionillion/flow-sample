var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// docs/js-tmp/confirm.js
var confirm;
var init_confirm = __esm({
  "docs/js-tmp/confirm.js"() {
    confirm = (dialog, messageEl, message) => new Promise((resolve) => {
      messageEl.textContent = message;
      dialog.addEventListener("close", () => {
        resolve(dialog.returnValue === "confirm");
      }, {
        once: true
      });
      dialog.showModal();
    });
  }
});

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/rng.js
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
var getRandomValues, rnds8;
var init_rng = __esm({
  "node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/rng.js"() {
    rnds8 = new Uint8Array(16);
  }
});

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/regex.js
var regex_default;
var init_regex = __esm({
  "node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/regex.js"() {
    regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  }
});

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default;
var init_validate = __esm({
  "node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/validate.js"() {
    init_regex();
    validate_default = validate;
  }
});

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/stringify.js
function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
var byteToHex, i, stringify_default;
var init_stringify = __esm({
  "node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/stringify.js"() {
    init_validate();
    byteToHex = [];
    for (i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).substr(1));
    }
    stringify_default = stringify;
  }
});

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default;
var init_v4 = __esm({
  "node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/v4.js"() {
    init_rng();
    init_stringify();
    v4_default = v4;
  }
});

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/index.js
var init_esm_browser = __esm({
  "node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/index.js"() {
    init_v4();
  }
});

// docs/js-tmp/types.js
var createTodoId, createTodo;
var init_types = __esm({
  "docs/js-tmp/types.js"() {
    init_esm_browser();
    createTodoId = () => v4_default();
    createTodo = (name) => ({
      id: createTodoId(),
      name,
      checked: false
    });
  }
});

// docs/js-tmp/index.js
var require_index = __commonJS({
  "docs/js-tmp/index.js"() {
    init_confirm();
    init_types();
    var todos = [];
    var appendTodoItem = (list, template, todo, onToggle) => {
      const fragment = template.content.cloneNode(true);
      if (!(fragment instanceof DocumentFragment)) return;
      const item = fragment.querySelector("[data-todo-item]");
      const textEl = fragment.querySelector("[data-todo-text]");
      const checkEl = fragment.querySelector("[data-todo-check]");
      if (!(item instanceof HTMLLIElement)) return;
      if (!(textEl instanceof HTMLSpanElement)) return;
      if (!(checkEl instanceof HTMLInputElement)) return;
      item.dataset.todoId = todo.id;
      textEl.textContent = todo.name;
      checkEl.checked = todo.checked;
      if (todo.checked) {
        textEl.classList.add("line-through", "text-slate-400");
        item.classList.add("opacity-70");
      }
      checkEl.addEventListener("change", () => {
        onToggle(todo.id, checkEl.checked);
      });
      list.appendChild(fragment);
    };
    var renderList = (list, count, template, onToggle) => {
      const done = todos.filter((todo) => todo.checked).length;
      count.textContent = `${todos.length} \u4EF6\uFF08\u5B8C\u4E86 ${done}\uFF09`;
      list.replaceChildren();
      todos.forEach((todo) => appendTodoItem(list, template, todo, onToggle));
    };
    window.addEventListener("load", () => {
      const app = document.getElementById("app");
      const input = document.getElementById("input");
      const list = document.getElementById("list");
      const clear = document.getElementById("clear");
      const count = document.getElementById("count");
      const template = document.getElementById("todo-item-template");
      const confirmDialog = document.getElementById("confirm-dialog");
      const confirmMessage = document.getElementById("confirm-message");
      if (!(app instanceof HTMLFormElement)) return;
      if (!(input instanceof HTMLInputElement)) return;
      if (!(list instanceof HTMLUListElement)) return;
      if (!(clear instanceof HTMLButtonElement)) return;
      if (!(count instanceof HTMLParagraphElement)) return;
      if (!(template instanceof HTMLTemplateElement)) return;
      if (!(confirmDialog instanceof HTMLDialogElement)) return;
      if (!(confirmMessage instanceof HTMLParagraphElement)) return;
      const handleToggle = (id, checked) => {
        todos = todos.map((todo) => todo.id === id ? {
          ...todo,
          checked
        } : todo);
        renderList(list, count, template, handleToggle);
      };
      const handleAdd = (e) => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        const todo = createTodo(name);
        todos.push(todo);
        renderList(list, count, template, handleToggle);
        input.value = "";
        input.focus();
      };
      const handleClear = async () => {
        if (!todos.length) return;
        const ok = await confirm(confirmDialog, confirmMessage, "\u3059\u3079\u3066\u306E todo \u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F");
        if (!ok) return;
        todos = [];
        renderList(list, count, template, handleToggle);
        input.value = "";
        input.focus();
      };
      app.addEventListener("submit", handleAdd);
      clear.addEventListener("click", handleClear);
      renderList(list, count, template, handleToggle);
    });
  }
});
export default require_index();
