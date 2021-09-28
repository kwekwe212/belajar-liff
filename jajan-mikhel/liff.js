window.onload = function () {
  const useNodeJS = false; // if you are not using a node server, set this value to false
  const defaultLiffId = "1655320382-gjrXdDbV"; // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch("/send-id")
      .then(function (reqResponse) {
        return reqResponse.json();
      })
      .then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function (error) {
        document.getElementById("liffAppContent").classList.add("hidden");
        document
          .getElementById("nodeLiffIdErrorMessage")
          .classList.remove("hidden");
      });
  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    document.getElementById("liffAppContent").classList.add("hidden");
    document.getElementById("liffIdErrorMessage").classList.remove("hidden");
  } else {
    initializeLiff(myLiffId);
  }
}

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
  liff
    .init({
      liffId: myLiffId,
    })
    .then(() => {
      // start to use LIFF's api
      initializeApp();
    })
    .catch((err) => {
      alert("Sepertinya ada masalah hehe :v ");
    });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  liff
    .getProfile()
    .then((profile) => {
      const name = profile.displayName;
      $(".name").html(name);
    })
    .catch((err) => {
      console.log("error", err);
    });
  displayIsInClientInfo();
  registerButtonHandlers();

  // check if the user is logged in/out, and disable inappropriate button
  if (liff.isLoggedIn()) {
    $("#user").css("display", "none");
    $("#liffLoginButton").css("display", "none");
    $("#liffLogoutButton").css("display", "block");
  } else {
    $("#liffLoginButton").css("display", "block");
    $("#liffLogoutButton").css("display", "none");
    // document.getElementById("liffLogoutButton").disabled = true;
  }
}

/**
 * Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
 */
function displayIsInClientInfo() {
  if (liff.isInClient()) {
    console.log("liff di aplikasi line");
  } else {
    $("#openWindowButton").css("display", "none");
    $("#user").css("display", "block");
  }
}

function registerButtonHandlers() {
  document
    .getElementById("openWindowButton")
    .addEventListener("click", function () {
      liff.openWindow({
        url: "https://jajan-mikhel.herokuapp.com/", // Isi dengan Endpoint URL aplikasi web Anda
        external: true,
      });
    });

  document
    .getElementById("liffLoginButton")
    .addEventListener("click", function () {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });

  document
    .getElementById("liffLogoutButton")
    .addEventListener("click", function () {
      if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
      }
    });

  document
    .getElementById("pesan-makanan")
    .addEventListener("click", function () {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        let name = $(".name").html();
        let makanan = $(".list").find(".makan").html();
        let minuman = $(".list").find(".minum").html();
        let harga = $(".price").find(".harga").html();
        liff
          .sendMessages([
            {
              type: "text",
              text: `
Hai ${name}, 
Terima kasih sudah memesan jajanan, berikut adalah review pesanannya:

${makanan} Makanan
${minuman} Minuman
Total harganya Rp. ${harga} ,-

Pesanan akan segera diproses dan akan diberitahu jika sudah bisa diambil

Mohon ditunggu ya!
`,
            },
          ])
          .then(function () {
            window.alert("Pesan dikirim");
          })
          .catch(function (error) {
            window.alert("Error sending message: " + error);
          });
      }
    });
}

function sendAlertIfNotInClient() {
  alert("Tombol ini tidak bisa dibuka jika menggunakan browser eksternal.");
}
