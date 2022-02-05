function Modal(className, props) {
  const div = document.createElement("div");
  className && div.classList.add(className);
  div.dataset.type = "hidden";

  const mapClick = {
    hidden: closeModal,
  };

  function startCounter(time, item) {
    if (!time) return;

    setTimeout(() => {
      const newTime = time - 1000;
      let timetext = newTime.toString();
      timetext = timetext.slice(0, timetext.length - 3);
      item.innerHTML = timetext;
      if (newTime <= 0) return;
      startCounter(newTime, item);
    }, 1000);
  }

  function createCounter(parent, time) {
    const item = document.createElement("span");
    item.classList.add("counter");
    parent.appendChild(item);

    startCounter(time, item);
  }

  function timeout(time, Action) {
    setTimeout(() => {
      new Action();
    }, time);
  }

  function drawItems(parent, children, arrClassName) {
    children.forEach((x) => {
      arrClassName && arrClassName.forEach((cls) => x.classList.add(cls));
      parent.appendChild(x);
    });
  }

  function setItemContent(item, text, dataattr) {
    item.innerHTML = text;
    item.dataset.type = dataattr;
    return item;
  }

  function closeModal() {
    div.classList.add("hidden");
    setTimeout(() => {
      div.remove();
    }, 350);
  }
  function setHeigthWidth(item) {
    item.style.height = `${props.height}px`;
    item.style.width = `${props.width}px`;
    return item;
  }

  function render(parent) {
    const div = document.createElement("div");
    const span = document.createElement("span");

    drawItems(parent, [div], ["modal-area"]);
    drawItems(
      div,
      [setItemContent(span, "x", "hidden")],
      ["close"]
    );
    drawItems(
      div,
      [setHeigthWidth(document.createElement("div"))],
      ["modal-content"]
    );

    return parent;
  }

  function handleClick(e) {
    if (typeof mapClick[e.target.dataset.type] === "function") {
      mapClick[e.target.dataset.type]();
    }
  }

  div.addEventListener("click", handleClick);
  props.counter && createCounter(div, props.autoClose);
  props.autoClose && timeout(props.autoClose, closeModal);

  return render(div);
}

function Form() {
  const formEl = document.createElement("form");
  const opition = ["text", "number", "date", "color", 'range'];
  const submitButton = document.createElement("button");
  const select = makeSelect(opition);

  submitButton.innerHTML = "Create";
  formEl.dataset.create = "input";

  function makeSelect(arr) {
    const select = document.createElement("select");
    select.name = "choose-type";
    arr.forEach((x, i) => {
      const option = document.createElement("option");
      option.innerHTML = x;
      option.value = x;
      select.appendChild(option);
    });
    return select;
  }

  const appendList = [select, submitButton];

  appendList.forEach((x) => formEl.appendChild(x));

  return formEl;
}

function DynamicForm() {
  const dForm = document.createElement("form");
  const submitButton = document.createElement("button");
  const legend = document.createElement("legend");
  const appendList = [legend, submitButton];

  appendList.forEach((x) => dForm.appendChild(x));
  submitButton.innerHTML = "Create";
  legend.innerHTML = "Dynamic Form";
  dForm.dataset.create = "json";
  dForm.classList.add("dynamic-form");
  return dForm;
}

function main() {
  const app = document.getElementById("app");
  const modal = new Modal("modal", {
    height: 500,
    width: 500,
    autoClose: 20000,
    counter: true,
  });
  const appendList = [modal];
  const dForm = new DynamicForm();
  const form = new Form(appendList, dForm);
  const dInputs = [];


  const map = {
    input: makeInput,
    json: makeJson,
  };

  function makeInput(e) {
    e.preventDefault();
    const input = document.createElement("input");
    const formItems = Object.values(e.target.children);

    formItems.forEach((x, i) => {
      if (x.name === "choose-type") {
        input.type = x.value;
        input.name = `num${i}${e.timeStamp}`;
      }
    });
    dInputs.push(input);
    dInputs.forEach((x) => dForm.appendChild(x));
  }

  function submitForm(e) {
    if (typeof map[e.target.dataset.create] === "function") {
      map[e.target.dataset.create](e);
    }
  }

  function makeJson(e) {
    e.preventDefault();
    const json = [];
    Object.values(e.target.children).filter(x => {
        if(x.tagName.toLowerCase() === 'input'){
            const obj = {
                name: x.name,
                value: x.value,
            }
            json.push(obj);
        }
    })
    console.log(JSON.stringify(json));
  }

  appendList.unshift(form);
  appendList.push(dForm);

  app.addEventListener("submit", submitForm);

  appendList.forEach((x) => app.append(x));
}
window.addEventListener("load", main);
