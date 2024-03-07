(async () => {
  const src = chrome.runtime.getURL("./popup/utils.js");
  const {
    changeTextMessage,
    isObjectEmpty,
    storeLink,
    options,
    buttonData,
    copyLink,
    openLink,
  } = await import(src);

  const url = document.querySelector(".url");
  const linkName = document.querySelector(".name");
  const addButton = document.querySelector(".add");
  const message = document.querySelector(".message");
  const list = document.querySelector(".url_list");
  let data = await chrome.storage.sync.get(["items"]);

  const ToggleMessageVisibility = (hide) => {
    if (hide) {
      list.style.display = "flex";
      message.style.display = "none";
    } else {
      message.style.display = "inline";
      list.style.display = "none";
    }
  };

  const removeLink = async (date, Linkitem) => {
    const newListItems = data.items.filter((item) => item.date !== date);
    storeLink(newListItems, data);
    data = await chrome.storage.sync.get(["items"]);
    list.removeChild(Linkitem);
    if (newListItems.length === 0) {
      ToggleMessageVisibility(false);
    }
  };

  const addListItem = async (date, name, url) => {
    const item = document.createElement("div");
    item.classList.add("url_item");
    const itemText = document.createElement("span");
    itemText.textContent = name;
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    buttonData.forEach(({ name, src }) => {
      const button = document.createElement("button");
      const img = document.createElement("img");
      button.classList.add("itemButton", name);
      img.alt = name;
      img.src = src;

      if (name === "copy") {
        const input = document.createElement("input");
        input.type = "text";
        input.readOnly = true;
        input.value = url;
        input.style.position = "absolute";
        input.style.zIndex = "9";
        input.style.visibility = "hidden";
        button.onclick = () => copyLink(input);
        button.appendChild(input);
      } else if (name === "remove") {
        button.onclick = () => removeLink(date, item);
      } else {
        button.onclick = () => openLink(url);
      }

      button.appendChild(img);
      buttons.appendChild(button);
    });
    item.appendChild(itemText);
    item.appendChild(buttons);
    list.appendChild(item);
    data = await chrome.storage.sync.get(["items"]);
    if (data.items.length === 1) {
      ToggleMessageVisibility(true);
    }
  };

  if (!isObjectEmpty(data)) {
    ToggleMessageVisibility(true);
    data.items.forEach(({ date, name, url }) => {
      addListItem(date, name, url);
    });
  } else {
    ToggleMessageVisibility(false);
  }

  url.addEventListener("input", () => {
    if (isObjectEmpty(data)) {
      changeTextMessage("No links have been added", message);
    }
  });

  linkName.addEventListener("input", () => {
    if (isObjectEmpty(data)) {
      changeTextMessage("No links have been added", message);
    }
  });

  addButton.addEventListener("click", async () => {
    if (!linkName?.value || !url?.value) {
      if (data.items.length > 0) return;
      return changeTextMessage("input fields must not be empty", message);
    }

    const timestamp = Date.now();
    const date = new Date(timestamp);
    const newUrl = {
      name: linkName.value,
      url: url.value,
      date: new Intl.DateTimeFormat("fi-FI", options).format(date),
    };
    if (isObjectEmpty(data)) {
      storeLink([newUrl]);
    } else {
      storeLink([...data.items, newUrl]);
    }
    addListItem(newUrl.date, newUrl.name, newUrl.url);
    linkName.value = "";
    url.value = "";
  });
})();
