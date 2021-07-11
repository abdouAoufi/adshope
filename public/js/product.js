const detailBtn = document.getElementById("add-to-cart");
detailBtn.addEventListener('click' , makeHttpRequest)

function makeHttpRequest() {
   var req = new XMLHttpRequest();
   req.onreadystatechange = processResponse;
   req.open("POST", "/cart");
   req.send();

   function processResponse() {
     if (req.readyState != 4) return; // State 4 is DONE
   //   document.getElementById("results").innerText = req.responseText;
     console.log("response from AJAX " , req.responseText);
   }
 }