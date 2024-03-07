export const changeTextMessage = (text, message) => {
  message.classList.remove("hidden");
  message.textContent = text;
};

export const isObjectEmpty = (objectName) => {
  return (
    Object.keys(objectName).length === 0 ||
    Object.keys(objectName.items).length === 0
  );
};

export const storeLink = async (value) => {
  await chrome.storage.sync.set({
    items: value,
  });
};

export const copyLink = (linkInput) => {
  linkInput.select();
  linkInput.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to the clipboard
  navigator.clipboard.writeText(linkInput.value);

  // Deselect the input field
  linkInput.blur();
};

export const openLink = (url) => window.open(url, "_blank").focus();

export const ToggleMessageVisibility = (hide, list, message) => {
  if (hide) {
    list.style.display = "flex";
    message.style.display = "none";
  } else {
    message.style.display = "inline";
    list.style.display = "none";
  }
};

export const buttonData = [
  {
    name: "copy",
    src: "../images/clipboard-outline.svg",
  },
  {
    name: "remove",
    src: "../images/trash-outline.svg",
  },
  {
    name: "open",
    src: "../images/eye-outline.svg",
  },
];

export const options = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Europe/Helsinki", // Finnish timezone
};
