(() => {
  const socket = io();

  let newUser;

  // SIGN IN
  const signBtn = document.getElementById("join-user");
  const signInView = document.querySelector(".join-screen");
  const chatView = document.querySelector(".chat-screen");
  const username = document.getElementById("username");

  signBtn.addEventListener("click", () => {
    const user = username.value;

    if (user.length === 0) {
      return;
    }
    socket.emit("newUser", user);
    newUser = user;
    signInView.classList.remove("active");
    chatView.classList.add("active");
  });

  // CHAT
  const sendMessage = document.getElementById("sendMessage");
  const chatContainer = document.querySelector(".body");
  const exitButton = document.getElementById("exit");

  const renderMessage = (type, message) => {
    const atBottom = chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;

    if (type === "me") {
      chatContainer.innerHTML += `
        <div class="message-container you">
          <div class="message-item">
            <strong>You</strong>
            <span>${message.text}</span>
          </div>
        </div>
      `;
    } else if (type === "other") {
      chatContainer.innerHTML += `
        <div class="message-container">
          <div class="message-item">
            <strong>${message.username}</strong>
            <span>${message.text}</span>
          </div>
        </div>
      `;
    } else {
      chatContainer.innerHTML += `
        <div class="message-container update">
          <span>${message}</span>
        </div>
      `;
    }

    if (atBottom) {
      chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
    }
  };

  sendMessage.addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");

    if (messageInput.value.length === 0) {
      return;
    }

    renderMessage("me", {
      username: newUser,
      text: messageInput.value,
    });

    socket.emit("chat", {
      username: newUser,
      text: messageInput.value,
    });

    messageInput.value = "";
  });

  socket.on("chat", (message) => {
    renderMessage("other", message);
  });

  socket.on("update", (update) => {
    renderMessage("update", update);
  });

  exitButton.addEventListener("click", () => {
    socket.emit("exitUser", newUser);
    window.location.href = "/";
  });
})();
