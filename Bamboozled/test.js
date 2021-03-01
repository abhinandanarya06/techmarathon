const url = "https://script.google.com/macros/s/AKfycbzZjXP4huhmi7PnrRM3nzhl9ytZYL8kE5calPmB0lDPO3lyygQUCgg1/exec/allow-cors";

const data = {
    "id": "users",
    "tries": 10,
    "hintsUsed": 5,
    "answer": "wrong",
    "user_id": 114877081763912013907
  };

$.post(url,data);