let playersArr = [];
$(async function () {
  $(".results-container").empty();
  const playersData = await loadFromFirebase();
  for (const playerId in playersData) {
    playersArr.push(playersData[playerId]);
    const tr = $("<tr/>", {
      id: playerId,
    }).html(`
    <td>${playersData[playerId].name}</td>
    <td>${playersData[playerId].email}</td>
    <td>${playersData[playerId].score}</td>
    <td class="text-center">
      <button class="btn btn-danger" onclick="deletePlayer('${playerId}')">delete</button>
    </td>
    `);
    $(".results-container").append(tr);
  }
});

function download() {
  filename = "Game_Servier_LDL v2_report.xlsx";
  const ws = XLSX.utils.json_to_sheet(playersArr);
  var wb = XLSX.utils.book_new();

  /* Export to file (start a download) */
  XLSX.utils.book_append_sheet(wb, ws, "players");
  XLSX.writeFile(wb, filename);
}
